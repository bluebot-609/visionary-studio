"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayWebhook = exports.createRazorpayOrder = exports.analyzeWebsiteForConcepts = exports.generateImageCaptions = exports.generateCampaignImages = exports.generateCreativeBrief = exports.createStudioSession = exports.healthcheck = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const logger = __importStar(require("firebase-functions/logger"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const razorpay_1 = __importDefault(require("razorpay"));
if (!(0, app_1.getApps)().length) {
    (0, app_1.initializeApp)();
}
const db = (0, firestore_1.getFirestore)();
exports.healthcheck = (0, https_1.onCall)(() => {
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
    };
});
exports.createStudioSession = (0, https_1.onCall)(async ({ data, auth }) => {
    if (!auth) {
        throw new https_1.HttpsError('unauthenticated', 'You must be signed in.');
    }
    logger.info('createStudioSession invoked', {
        uid: auth.uid,
        payload: data,
    });
    return {
        message: 'Session scaffolding ready',
    };
});
exports.generateCreativeBrief = (0, https_1.onCall)(async ({ data, auth }) => {
    if (!auth) {
        throw new https_1.HttpsError('unauthenticated', 'You must be signed in.');
    }
    logger.info('generateCreativeBrief invoked', { uid: auth.uid });
    throw new https_1.HttpsError('unimplemented', 'Creative brief generation not yet implemented.');
});
exports.generateCampaignImages = (0, https_1.onCall)(async ({ data, auth }) => {
    if (!auth) {
        throw new https_1.HttpsError('unauthenticated', 'You must be signed in.');
    }
    logger.info('generateCampaignImages invoked', { uid: auth.uid });
    throw new https_1.HttpsError('unimplemented', 'Campaign image generation not yet implemented.');
});
exports.generateImageCaptions = (0, https_1.onCall)(async ({ data, auth }) => {
    if (!auth) {
        throw new https_1.HttpsError('unauthenticated', 'You must be signed in.');
    }
    logger.info('generateImageCaptions invoked', { uid: auth.uid });
    throw new https_1.HttpsError('unimplemented', 'Caption generation not yet implemented.');
});
exports.analyzeWebsiteForConcepts = (0, https_1.onCall)(async ({ data, auth }) => {
    if (!auth) {
        throw new https_1.HttpsError('unauthenticated', 'You must be signed in.');
    }
    logger.info('analyzeWebsiteForConcepts invoked', { uid: auth.uid });
    throw new https_1.HttpsError('unimplemented', 'Website analysis not yet implemented.');
});
const razorpayKeySecret = (0, params_1.defineSecret)('RAZORPAY_KEY_SECRET');
const razorpayWebhookSecret = (0, params_1.defineSecret)('RAZORPAY_WEBHOOK_SECRET');
const razorpayKeyId = (0, params_1.defineString)('RAZORPAY_KEY_ID');
exports.createRazorpayOrder = (0, https_1.onCall)({ secrets: [razorpayKeySecret] }, async ({ data, auth }) => {
    if (!auth) {
        throw new https_1.HttpsError('unauthenticated', 'You must be signed in.');
    }
    const { amount, currency = 'INR', planId = 'visionary-pro', receipt } = data ?? {};
    if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {
        throw new https_1.HttpsError('invalid-argument', 'A valid amount is required.');
    }
    const keyId = razorpayKeyId.value();
    const keySecret = razorpayKeySecret.value();
    if (!keyId || !keySecret) {
        logger.error('Missing Razorpay credentials');
        throw new https_1.HttpsError('failed-precondition', 'Razorpay credentials are not configured.');
    }
    const razorpay = new razorpay_1.default({
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
        await db.collection('payments').doc(order.id).set({
            uid: auth.uid,
            amount: Number(order.amount) / 100,
            currency: order.currency,
            orderId: order.id,
            receipt: order.receipt,
            planId,
            status: order.status,
            createdAt: firestore_1.FieldValue.serverTimestamp(),
        }, { merge: true });
        logger.info('Razorpay order created', { uid: auth.uid, orderId: order.id });
        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: keyId,
        };
    }
    catch (error) {
        logger.error('Failed to create Razorpay order', error);
        throw new https_1.HttpsError('internal', 'Failed to create Razorpay order.');
    }
});
exports.razorpayWebhook = (0, https_1.onRequest)({ secrets: [razorpayWebhookSecret], cors: true }, async (req, res) => {
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
        razorpay_1.default.validateWebhookSignature(payload, signature, razorpayWebhookSecret.value());
    }
    catch (error) {
        logger.warn('Invalid Razorpay webhook signature', error);
        res.status(400).json({ error: 'Invalid signature' });
        return;
    }
    const event = req.body;
    const orderId = event?.payload?.payment?.entity?.order_id ??
        event?.payload?.order?.entity?.id;
    if (!orderId) {
        logger.warn('Webhook received without order ID', { event });
        res.status(400).json({ error: 'Missing order information' });
        return;
    }
    const status = event?.event === 'payment.captured'
        ? 'captured'
        : event?.event === 'payment.failed'
            ? 'failed'
            : event?.event ?? 'unknown';
    await db
        .collection('payments')
        .doc(orderId)
        .set({
        status,
        paymentId: event?.payload?.payment?.entity?.id,
        method: event?.payload?.payment?.entity?.method,
        email: event?.payload?.payment?.entity?.email,
        contact: event?.payload?.payment?.entity?.contact,
        notes: event?.payload?.payment?.entity?.notes,
        updatedAt: firestore_1.FieldValue.serverTimestamp(),
    }, { merge: true });
    logger.info('Processed Razorpay webhook', { orderId, status });
    res.status(200).json({ received: true });
});
//# sourceMappingURL=index.js.map