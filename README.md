<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Pk3IopIyDiD5VVc87wshGuYMoRuLg9mN

## Run Locally

**Prerequisites:** Node.js 20+, Supabase project, Razorpay account, Gemini API key.

1. Install dependencies  
   ```bash
   npm install
   ```

2. Copy `env.example` to `.env.local` and fill in:
   - **Client-side** Supabase config (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **Server-side** Supabase service role key (`SUPABASE_SERVICE_ROLE_KEY`)
   - **Client-side** Razorpay ID (`NEXT_PUBLIC_RAZORPAY_KEY_ID`)
   - **Server-side** Razorpay secret (`RAZORPAY_KEY_SECRET`)
   - **Server-side** Gemini API key (`GEMINI_API_KEY`)

3. Set up Supabase:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL migration from `supabase-migration.sql` in the Supabase SQL Editor
   - Create a storage bucket named `shots` and configure policies
   - Enable Google OAuth and Phone authentication providers
   - See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup instructions

4. Start the Next.js dev server  
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- **AI-Powered Campaign Generation**: Create luxury campaign visuals with multi-agent AI orchestration
- **Shot Library**: Automatically saves all generated images to Supabase with multi-select and bulk delete
- **Responsive Design**: Fully responsive across mobile, tablet, and desktop devices
- **Real-time Storage**: All shots persist across sessions using Supabase Storage & Postgres
- **Authentication**: Google OAuth and Phone OTP (SMS) sign-in

## Supabase & Razorpay Setup

### 1. Supabase project
- Create a Supabase project at [supabase.com](https://supabase.com)
- Run the SQL migration from `supabase-migration.sql` to create the database schema
- Create a storage bucket named `shots` and configure storage policies
- Enable Google OAuth and Phone (SMS) authentication providers
- **Important**: Configure Row Level Security (RLS) policies and Storage policies (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for details)

### 2. Razorpay
- Create a Razorpay account and obtain the **key id** and **key secret**.
- Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` in `.env.local` for client-side checkout
- Set `RAZORPAY_KEY_SECRET` in `.env.local` for server-side order creation (Next.js API route)
- Orders are created via `/api/payment/create-order` which keeps the secret server-side

### 3. Gemini AI API
- Obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Set `GEMINI_API_KEY` in `.env.local` - this remains server-side in Next.js API routes
- All AI operations (concept generation, orchestration, captions) use Next.js API routes for security

## Available Scripts

- `npm run dev` – Start Next.js development server (default port: 3000)
- `npm run build` – Create production build (validates TypeScript and optimizes for deployment)
- `npm run start` – Start production server (requires `npm run build` first)
- `npm run lint` – Run ESLint to check for code issues

## Deploy to Production

### Vercel (Recommended)

This app is optimized for Vercel serverless deployment:

1. Push your code to GitHub
2. Import the repository to [Vercel](https://vercel.com)
3. Configure environment variables in Vercel dashboard:
   - All `NEXT_PUBLIC_*` variables (Supabase URL/Key, Razorpay Key ID)
   - All server-side secrets (`GEMINI_API_KEY`, `RAZORPAY_KEY_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`)
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
2. Verify Supabase RLS policies are configured correctly
3. Check storage bucket policies are set up properly
4. See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed troubleshooting steps

### Common Issues
- **Permission Denied**: Update Supabase RLS policies and Storage policies (see SUPABASE_SETUP.md)
- **Authentication Errors**: Verify OAuth redirect URLs match your domain
- **Storage Upload Errors**: Check bucket exists and policies allow authenticated uploads
- **Network Errors**: Check Supabase project status and quotas
