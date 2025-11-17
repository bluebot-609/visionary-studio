<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Pk3IopIyDiD5VVc87wshGuYMoRuLg9mN

## Run Locally

**Prerequisites:** Node.js 20+, Firebase project (Web App), Razorpay account, Gemini API key.

1. Install dependencies  
   ```bash
   npm install
   ```

2. Copy `env.example` to `.env.local` and fill in:
   - **Client-side** Firebase config (`NEXT_PUBLIC_FIREBASE_*`)
   - **Client-side** Razorpay ID (`NEXT_PUBLIC_RAZORPAY_KEY_ID`)
   - **Server-side** Razorpay secret (`RAZORPAY_KEY_SECRET`)
   - **Server-side** Gemini API key (`GEMINI_API_KEY`)
   - (Optional) Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` for local emulators

3. Start the Next.js dev server  
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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

### 2. Razorpay
- Create a Razorpay account and obtain the **key id** and **key secret**.
- Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` in `.env.local` for client-side checkout
- Set `RAZORPAY_KEY_SECRET` in `.env.local` for server-side order creation (Next.js API route)
- Orders are created via `/api/payment/create-order` which keeps the secret server-side

### 3. Gemini AI API
- Obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Set `GEMINI_API_KEY` in `.env.local` - this remains server-side in Next.js API routes
- All AI operations (concept generation, orchestration, captions) use Next.js API routes for security

### 4. Optional: Firebase Emulators
- Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true` in `.env.local`.
- Run `firebase emulators:start` to spin up Auth, Firestore, and Storage locally.
- **Note**: Firebase Functions are no longer used - all logic moved to Next.js API routes

## Available Scripts

- `npm run dev` – Start Next.js development server (default port: 3000)
- `npm run build` – Create production build (validates TypeScript and optimizes for deployment)
- `npm run start` – Start production server (requires `npm run build` first)
- `npm run lint` – Run ESLint to check for code issues
- `firebase emulators:start` – Run Firebase emulators (Auth, Firestore, Storage)

## Deploy to Production

### Vercel (Recommended)

This app is optimized for Vercel serverless deployment:

1. Push your code to GitHub
2. Import the repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard:
   - All `NEXT_PUBLIC_*` variables (Firebase, Razorpay Key ID)
   - All server-side secrets (`GEMINI_API_KEY`, `RAZORPAY_KEY_SECRET`)
4. Deploy - Vercel will automatically build and deploy

### Manual Deployment

```bash
npm run build
npm run start
```

The app will be available at `http://localhost:3000`. You can deploy the `.next` folder and `package.json` to any Node.js hosting provider.

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
