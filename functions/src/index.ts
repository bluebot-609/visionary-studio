import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret, defineString } from 'firebase-functions/params';
import * as logger from 'firebase-functions/logger';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import Razorpay from 'razorpay';

if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

export const healthcheck = onCall(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
});

export const createStudioSession = onCall(async ({ data, auth }) => {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'You must be signed in.');
  }

  logger.info('createStudioSession invoked', {
    uid: auth.uid,
    payload: data,
  });

  return {
    message: 'Session scaffolding ready',
  };
});

export const generateCreativeBrief = onCall(async ({ data, auth }) => {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'You must be signed in.');
  }

  logger.info('generateCreativeBrief invoked', { uid: auth.uid });

  throw new HttpsError('unimplemented', 'Creative brief generation not yet implemented.');
});

export const generateCampaignImages = onCall(async ({ data, auth }) => {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'You must be signed in.');
  }

  logger.info('generateCampaignImages invoked', { uid: auth.uid });

  throw new HttpsError('unimplemented', 'Campaign image generation not yet implemented.');
});

export const generateImageCaptions = onCall(async ({ data, auth }) => {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'You must be signed in.');
  }

  logger.info('generateImageCaptions invoked', { uid: auth.uid });

  throw new HttpsError('unimplemented', 'Caption generation not yet implemented.');
});

export const analyzeWebsiteForConcepts = onCall(async ({ data, auth }) => {
  if (!auth) {
    throw new HttpsError('unauthenticated', 'You must be signed in.');
  }

  logger.info('analyzeWebsiteForConcepts invoked', { uid: auth.uid });

  throw new HttpsError('unimplemented', 'Website analysis not yet implemented.');
});

const razorpayKeySecret = defineSecret('RAZORPAY_KEY_SECRET');
const razorpayWebhookSecret = defineSecret('RAZORPAY_WEBHOOK_SECRET');
const razorpayKeyId = defineString('RAZORPAY_KEY_ID');

export const createRazorpayOrder = onCall(
  { secrets: [razorpayKeySecret] },
  async ({ data, auth }) => {
    if (!auth) {
      throw new HttpsError('unauthenticated', 'You must be signed in.');
    }

    const { amount, currency = 'INR', planId = 'visionary-pro', receipt } = data ?? {};

    if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
      throw new HttpsError('invalid-argument', 'A valid amount is required.');
    }

    const keyId = razorpayKeyId.value();
    const keySecret = razorpayKeySecret.value();

    if (!keyId || !keySecret) {
      logger.error('Missing Razorpay credentials');
      throw new HttpsError('failed-precondition', 'Razorpay credentials are not configured.');
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    try {
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency,
        receipt: receipt ?? `vs_${Date.now()}`,
        notes: {
          uid: auth.uid,
          planId,
        },
      });

      await db.collection('payments').doc(order.id).set(
        {
          uid: auth.uid,
          amount: Number(order.amount) / 100,
          currency: order.currency,
          orderId: order.id,
          receipt: order.receipt,
          planId,
          status: order.status,
          createdAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

      logger.info('Razorpay order created', { uid: auth.uid, orderId: order.id });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: keyId,
      };
    } catch (error) {
      logger.error('Failed to create Razorpay order', error);
      throw new HttpsError('internal', 'Failed to create Razorpay order.');
    }
  },
);

export const razorpayWebhook = onRequest(
  { secrets: [razorpayWebhookSecret], cors: true },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const signature = req.get('x-razorpay-signature');
    if (!signature) {
      res.status(400).json({ error: 'Missing signature header' });
      return;
    }

    const payload = req.rawBody?.toString() ?? JSON.stringify(req.body);

    try {
      Razorpay.validateWebhookSignature(
        payload,
        signature,
        razorpayWebhookSecret.value(),
      );
    } catch (error) {
      logger.warn('Invalid Razorpay webhook signature', error);
      res.status(400).json({ error: 'Invalid signature' });
      return;
    }

    const event = req.body;
    const orderId =
      event?.payload?.payment?.entity?.order_id ??
      event?.payload?.order?.entity?.id;

    if (!orderId) {
      logger.warn('Webhook received without order ID', { event });
      res.status(400).json({ error: 'Missing order information' });
      return;
    }

    const status =
      event?.event === 'payment.captured'
        ? 'captured'
        : event?.event === 'payment.failed'
          ? 'failed'
          : event?.event ?? 'unknown';

    await db
      .collection('payments')
      .doc(orderId)
      .set(
        {
          status,
          paymentId: event?.payload?.payment?.entity?.id,
          method: event?.payload?.payment?.entity?.method,
          email: event?.payload?.payment?.entity?.email,
          contact: event?.payload?.payment?.entity?.contact,
          notes: event?.payload?.payment?.entity?.notes,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );

    logger.info('Processed Razorpay webhook', { orderId, status });

    res.status(200).json({ received: true });
  },
);

