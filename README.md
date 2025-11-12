<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Pk3IopIyDiD5VVc87wshGuYMoRuLg9mN

## Run Locally

**Prerequisites:** Node.js 20+, Firebase project (Web App), Razorpay account.

1. Install dependencies  
   `npm install`
2. Copy `env.example` to `.env.local` (or `.env`) and fill in:
   - Firebase config (`VITE_FIREBASE_*`)
   - `VITE_RAZORPAY_KEY_ID`
   - `RAZORPAY_WEBHOOK_SECRET`
   - `GEMINI_API_KEY`
3. (Optional) To use local Firebase emulators set `VITE_USE_FIREBASE_EMULATOR=true`.
4. Start the dev server  
   `npm run dev`

## Features

- **AI-Powered Campaign Generation**: Create luxury campaign visuals with multi-agent AI orchestration
- **Shot Library**: Automatically saves all generated images to Firebase with multi-select and bulk delete
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop devices
- **Real-time Storage**: All shots persist across sessions using Firebase Storage & Firestore

## Firebase & Razorpay Setup

### 1. Firebase project
- Create a Firebase project and add a Web App.
- Enable **Authentication** (Google provider), **Cloud Firestore**, and **Cloud Storage**.
- Create a Cloud Storage bucket (default) and optional Firebase Hosting if desired.
- Download the web config and populate the `VITE_FIREBASE_*` values in `.env.local`.
- **Important**: Configure Firestore and Storage security rules (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for details)

### 2. Cloud Functions
- Install the Firebase CLI and log in: `npm install -g firebase-tools` then `firebase login`.
- Set the default project in `.firebaserc` or run `firebase use --add`.
- Install the Functions workspace deps:  
  `cd functions && npm install && cd ..`
- Deploy (or emulate) with:  
  `firebase deploy --only functions`  
  or  
  `firebase emulators:start`

### 3. Razorpay
- Create a Razorpay account and obtain the **key id** and **key secret**.
- Set the public key in `.env.local` (`VITE_RAZORPAY_KEY_ID`) so the frontend can initialize Checkout.
- Store secrets for Cloud Functions:
  ```bash
  firebase functions:secrets:set RAZORPAY_KEY_SECRET
  firebase functions:secrets:set RAZORPAY_WEBHOOK_SECRET
  firebase functions:config:set RAZORPAY_KEY_ID="rzp_live_..."
  ```
  Alternatively, supply `RAZORPAY_KEY_ID` via `firebase functions:config:set` or by editing the deployed environment.
- Configure the Razorpay webhook endpoint to point at `https://<your-cloud-function-domain>/razorpayWebhook` and use the same webhook secret.

### 4. Optional: Firebase Emulators
- Set `VITE_USE_FIREBASE_EMULATOR=true` in `.env.local`.
- Run `firebase emulators:start` (from project root) to spin up Auth, Firestore, Storage, and Functions locally.

## Available Scripts

- `npm run dev` – Vite dev server
- `npm run build` – production build (also validates TypeScript)
- `npm run preview` – preview built assets locally
- `firebase emulators:start` – run backend emulators (requires Firebase CLI)

## Troubleshooting

### Shot Library Not Persisting
If generated shots don't appear in the Shot Library after page reload:

1. Check browser console for detailed error logs
2. Verify Firebase Security Rules are configured correctly
3. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed troubleshooting steps

### Common Issues
- **Permission Denied**: Update Firestore/Storage rules (see FIREBASE_SETUP.md)
- **Index Required**: Create Firestore composite index (userId + timestamp)
- **Network Errors**: Check Firebase project status and quotas
