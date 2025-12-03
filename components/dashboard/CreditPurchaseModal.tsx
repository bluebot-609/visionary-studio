'use client';

import { useState, useEffect } from 'react';
import { Check, Loader2, X } from 'lucide-react';
import Modal from '../Modal';
import { useRazorpayCheckout } from '../../hooks/use-razorpay-checkout';
import { useCredits } from '../../hooks/use-credits';
import { useAuth } from '../../hooks/use-auth';
import { detectLocationFromBrowser, getLocation, type Currency } from '@/lib/location';

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  currency: Currency;
  popular?: boolean;
}

type CreditPackageConfig = Omit<CreditPackage, 'pricePerCredit'>;

const createPackage = (pkg: CreditPackageConfig): CreditPackage => ({
  ...pkg,
  pricePerCredit: parseFloat(
    (pkg.price / pkg.credits).toFixed(pkg.currency === 'INR' ? 2 : 3)
  ),
});

// India pricing (INR)
const INDIA_PACKAGES: CreditPackage[] = [
  createPackage({
    id: 'starter',
    name: 'Starter',
    credits: 120,
    price: 199,
    currency: 'INR',
  }),
  createPackage({
    id: 'popular',
    name: 'Popular',
    credits: 240,
    price: 299,
    currency: 'INR',
    popular: true,
  }),
  createPackage({
    id: 'pro',
    name: 'Pro',
    credits: 480,
    price: 549,
    currency: 'INR',
  }),
];

// International pricing (USD)
const INTERNATIONAL_PACKAGES: CreditPackage[] = [
  createPackage({
    id: 'starter',
    name: 'Starter',
    credits: 120,
    price: 3.99,
    currency: 'USD',
  }),
  createPackage({
    id: 'popular',
    name: 'Popular',
    credits: 240,
    price: 6.99,
    currency: 'USD',
    popular: true,
  }),
  createPackage({
    id: 'pro',
    name: 'Pro',
    credits: 480,
    price: 9.99,
    currency: 'USD',
  }),
];

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreditPurchaseModal: React.FC<CreditPurchaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const { refresh } = useCredits();
  const { initiateCheckout, loading: paymentLoading, error: paymentError } = useRazorpayCheckout();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [processing, setProcessing] = useState(false);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [packages, setPackages] = useState<CreditPackage[]>(INTERNATIONAL_PACKAGES);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    // Detect location on mount
    const detect = async () => {
      setDetecting(true);
      
      // First, try browser detection immediately (more reliable for local dev)
      const browserLocation = detectLocationFromBrowser();
      
      // If browser detection suggests India, use it immediately
      if (browserLocation.isIndia) {
        console.log('📍 Location detected (browser): India - Using INR pricing');
        setCurrency(browserLocation.currency);
        setPackages(INDIA_PACKAGES);
        setDetecting(false);
        return;
      }
      
      // Otherwise, try IP-based detection
      try {
        const location = await getLocation();

        // Check if API suggests using browser detection (for localhost/private IPs)
        if (location.useBrowserDetection) {
          // Use browser-based detection result we already got
          console.log('📍 Location detected (browser fallback):', browserLocation.isIndia ? 'India (INR)' : 'International (USD)');
          setCurrency(browserLocation.currency);
          setPackages(browserLocation.isIndia ? INDIA_PACKAGES : INTERNATIONAL_PACKAGES);
        } else {
          console.log('📍 Location detected (IP):', location.isIndia ? 'India (INR)' : 'International (USD)');
          setCurrency(location.currency);
          setPackages(location.isIndia ? INDIA_PACKAGES : INTERNATIONAL_PACKAGES);
        }
      } catch (error) {
        console.error('Error detecting location:', error);
        // Fallback to browser detection
        console.log('📍 Location detected (browser fallback after error):', browserLocation.isIndia ? 'India (INR)' : 'International (USD)');
        setCurrency(browserLocation.currency);
        setPackages(browserLocation.isIndia ? INDIA_PACKAGES : INTERNATIONAL_PACKAGES);
      } finally {
        setDetecting(false);
      }
    };

    detect();
  }, []);

  useEffect(() => {
    // Listen for payment success from Razorpay handler
    const handlePaymentSuccess = async (event: MessageEvent) => {
      if (event.data?.type === 'RAZORPAY_PAYMENT_SUCCESS') {
        setProcessing(true);
        try {
          // Verify payment and add credits
          const response = await fetch('/api/payment/verify-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: event.data.orderId,
              paymentId: event.data.paymentId,
              signature: event.data.signature,
              packageId: event.data.packageId,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            await refresh();
            // Show success message (could add toast notification here)
            onClose();
            setSelectedPackage(null);
          } else {
            const errorData = await response.json();
            console.error('Payment verification failed:', errorData);
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
        } finally {
          setProcessing(false);
        }
      }
    };

    window.addEventListener('message', handlePaymentSuccess);
    return () => window.removeEventListener('message', handlePaymentSuccess);
  }, [refresh, onClose]);

  const formatPrice = (price: number, curr: Currency) => {
    if (curr === 'INR') {
      return `₹${price.toLocaleString('en-IN')}`;
    }
    return `$${price.toFixed(2)}`;
  };

  const handlePurchase = async (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
    setProcessing(true);

    try {
      // For USD, ensure amount is in dollars (not cents)
      // Razorpay handles conversion to smallest currency unit (paise for INR, cents for USD)
      await initiateCheckout({
        amount: pkg.price,
        currency: pkg.currency,
        planId: `credits_${pkg.id}_${pkg.credits}`,
        customer: {
          name: user?.user_metadata?.full_name || user?.user_metadata?.name || undefined,
          email: user?.email || undefined,
        },
      });
    } catch (error) {
      console.error('Error initiating checkout:', error);
      setProcessing(false);
    }
    // Note: Don't set processing to false here - it will be handled by payment success/failure
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Purchase Credits" size="2xl">
      <div className="space-y-6">
        {paymentError && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {paymentError}
          </div>
        )}

        {detecting && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60 text-center">
            Detecting your location...
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl border p-6 transition ${
                pkg.popular
                  ? 'border-accent/30 bg-accent/5'
                  : 'border-white/10 bg-white/[0.03] hover:border-white/20'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-white">{formatPrice(pkg.price, pkg.currency)}</span>
                  <span className="ml-2 text-sm text-white/60">for {pkg.credits} credits</span>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  Up to {Math.floor(pkg.credits / 10)} professional image generations
                </p>
              </div>
              <button
                onClick={() => handlePurchase(pkg)}
                disabled={processing || paymentLoading || detecting}
                className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  pkg.popular
                    ? 'border-accent/30 bg-accent/10 text-accent hover:bg-accent/20'
                    : 'border-white/10 bg-white/[0.03] text-white hover:border-white/20 hover:bg-white/[0.05]'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing && selectedPackage?.id === pkg.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  'Purchase'
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white/60">
          <p className="mb-2 font-semibold text-white/80">Need more credits?</p>
          <p>
            For Enterprise packages and custom pricing, please{' '}
            <a href="mailto:sales@visionarystudio.com" className="text-accent hover:underline">
              contact sales
            </a>
            .
          </p>
        </div>
      </div>
    </Modal>
  );
};

