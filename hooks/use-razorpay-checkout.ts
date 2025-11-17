import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from './use-auth';

const RAZORPAY_SCRIPT_ID = 'razorpay-checkout-js';
const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

const loadScript = () =>
  new Promise<void>((resolve, reject) => {
    if (document.getElementById(RAZORPAY_SCRIPT_ID)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = RAZORPAY_SCRIPT_ID;
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });

interface CheckoutPayload {
  amount: number;
  currency?: string;
  planId?: string;
  customer?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export const useRazorpayCheckout = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadScript().catch((err) => {
      console.error(err);
      setError('Unable to load payment SDK. Please refresh the page.');
    });
  }, []);

  const initiateCheckout = useCallback(
    async (payload: CheckoutPayload) => {
      setLoading(true);
      setError(null);

      try {
        await loadScript();
        if (!window.Razorpay) {
          throw new Error('Razorpay SDK unavailable');
        }

        const response = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: payload.amount,
            currency: payload.currency,
            planId: payload.planId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create order');
        }

        const order = await response.json();

        const razorpay = new window.Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'Visionary Studio',
          description: payload.planId ?? 'Studio Subscription',
          order_id: order.orderId,
          prefill: {
            name: payload.customer?.name ?? user?.displayName ?? undefined,
            email: payload.customer?.email ?? user?.email ?? undefined,
            contact: payload.customer?.contact ?? undefined,
          },
          notes: {
            planId: payload.planId,
          },
          theme: {
            color: '#ff8d7a',
          },
        });

        razorpay.open();
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : 'Failed to initiate payment.',
        );
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  return useMemo(
    () => ({
      initiateCheckout,
      loading,
      error,
      clearError: () => setError(null),
    }),
    [initiateCheckout, loading, error],
  );
};





