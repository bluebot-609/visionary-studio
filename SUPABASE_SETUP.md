# Supabase Setup Guide

This guide will help you set up Supabase for the Visionary Studio application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Create a new project
3. Wait for the project to be fully provisioned

## 2. Get Your Supabase Credentials

1. Go to Project Settings → API
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## 3. Set Up Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 4. Create Database Schema

1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from `supabase-migration.sql` to create:
   - `shots` table with proper schema
   - Indexes for performance
   - Row Level Security (RLS) policies

Alternatively, you can use the Supabase CLI:
```bash
supabase db push
```

## 5. Set Up Storage Bucket

### Step 1: Create the Bucket

1. Go to Supabase Dashboard → **Storage** (in the left sidebar)
2. Click **"New bucket"** button
3. Name it: `shots`
4. **Bucket visibility**: You can choose either:
   - **Public**: Files are accessible via public URLs (simpler, good for images)
   - **Private**: Files require signed URLs (more secure, but requires code changes)
   
   For this app, **Public** is recommended since we're storing images that users should be able to view directly.
5. Click **"Create bucket"**

### Step 2: Set Up Storage Policies

You have two options to set up the policies:

#### Option A: Using SQL Editor (Recommended)

1. Go to Supabase Dashboard → **SQL Editor** (in the left sidebar)
2. Click **"New query"**
3. Copy and paste the following SQL:

```sql
-- Policy: Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'shots' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to read files from their own folder
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'shots' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Allow authenticated users to delete files from their own folder
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'shots' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

4. Click **"Run"** (or press Ctrl+Enter / Cmd+Enter)
5. You should see "Success. No rows returned" for each policy

#### Option B: Using the Dashboard UI

1. Go to Supabase Dashboard → **Storage** → **Policies**
2. Select the `shots` bucket from the dropdown
3. Click **"New Policy"** for each policy type:

   **For INSERT (Upload):**
   - Policy name: `Users can upload own files`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated`
   - USING expression: Leave empty
   - WITH CHECK expression:
     ```sql
     bucket_id = 'shots' AND (storage.foldername(name))[1] = auth.uid()::text
     ```

   **For SELECT (Read):**
   - Policy name: `Users can read own files`
   - Allowed operation: `SELECT`
   - Target roles: `authenticated`
   - USING expression:
     ```sql
     bucket_id = 'shots' AND (storage.foldername(name))[1] = auth.uid()::text
     ```
   - WITH CHECK expression: Leave empty

   **For DELETE:**
   - Policy name: `Users can delete own files`
   - Allowed operation: `DELETE`
   - Target roles: `authenticated`
   - USING expression:
     ```sql
     bucket_id = 'shots' AND (storage.foldername(name))[1] = auth.uid()::text
     ```
   - WITH CHECK expression: Leave empty

### What These Policies Do

- **Upload Policy**: Users can only upload files to folders that match their user ID (e.g., `shots/{user_id}/filename.jpg`)
- **Read Policy**: Users can only read files from their own folder
- **Delete Policy**: Users can only delete files from their own folder

This ensures users can only access their own files, maintaining data isolation and security.

## 6. Configure Authentication Providers

### Google OAuth

**Good news!** If you already have Google OAuth set up for Firebase, you can reuse the same credentials. Just add the Supabase callback URL to your existing OAuth client.

#### Option A: Reuse Existing Firebase OAuth Credentials (Recommended if you already have Firebase setup)

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Select the same project you used for Firebase

2. **Update Existing OAuth Client**
   - Go to **"APIs & Services"** → **"Credentials"**
   - Find your existing OAuth 2.0 Client ID (the one you use for Firebase)
   - Click on it to edit
   - In **"Authorized redirect URIs"**, you should see your existing Firebase URIs (like `https://your-project.firebaseapp.com/__/auth/handler`)
   - **Keep all existing URIs** - just add the new Supabase callback URL to the list:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
     (Replace `your-project` with your actual Supabase project reference)
   - Click **"Save"**
   - **Important**: Don't remove any existing URIs - both Firebase and Supabase need to work!

3. **Get Your Credentials**
   - Your **Client ID** is visible in the credentials list
   - **Client Secret**: Google doesn't show the secret after initial creation for security reasons
   - **Option 1**: Check your Firebase project settings - the secret might be stored there
     - Go to Firebase Console → Project Settings → Your Apps → Web App
     - Look for OAuth configuration
   - **Option 2**: Reset the client secret (⚠️ **Important**: This affects Firebase!)
     - In Google Cloud Console, click on your OAuth client
     - Click **"Reset secret"** or the refresh icon next to the secret
     - Copy the new secret immediately
     - **⚠️ WARNING**: This invalidates the old secret. If Firebase is still using the old secret, Google sign-in in Firebase will break!
     - **You'll need to update Firebase** with the new secret (if you're still using Firebase)
     - **OR** use the new secret only for Supabase and keep Firebase using the old one (if you have it stored)
   - **Option 3**: Create a NEW OAuth client (Recommended if you can't find the old secret):
     - In Google Cloud Console → **"APIs & Services"** → **"Credentials"**
     - Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
     - Select **"Web application"**
     - Name it: "Supabase OAuth Client" (to distinguish from Firebase)
     - Add the Supabase redirect URI: `https://your-project.supabase.co/auth/v1/callback`
     - **Keep the Firebase redirect URIs in the OLD client** (don't modify the existing one)
     - This way, Firebase keeps using the old client, and Supabase uses the new one
     - **No need to disable anything** - both clients can coexist
   - **Option 4**: If you have the secret stored in your `.env` files or Firebase config, you can retrieve it from there

4. **Skip to Step 2** below to configure in Supabase

#### Option B: Create New OAuth Credentials (If you prefer separate credentials)

#### Step 1: Create OAuth Credentials in Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Sign in with your Google account

2. **Create or Select a Project**
   - Click the project dropdown at the top
   - Click **"New Project"** (or select an existing project)
   - Enter a project name (e.g., "Visionary Studio")
   - Click **"Create"**

3. **Enable Required APIs** (Optional but recommended)
   - In the left sidebar, go to **"APIs & Services"** → **"Library"**
   - Search for **"Google+ API"** or **"People API"**
   - Click on it and click **"Enable"**
   - Note: This step may not be strictly necessary for basic OAuth, but it's recommended

4. **Configure OAuth Consent Screen**
   - Go to **"APIs & Services"** → **"OAuth consent screen"**
   - Choose **"External"** (unless you have a Google Workspace account)
   - Click **"Create"**
   - Fill in the required information:
     - **App name**: Visionary Studio (or your app name)
     - **User support email**: Your email address
     - **Developer contact information**: Your email address
   - Click **"Save and Continue"**
   - On the **Scopes** page, click **"Save and Continue"** (default scopes are fine)
   - On the **Test users** page (if in testing mode), you can add test users or skip
   - Click **"Save and Continue"** → **"Back to Dashboard"**

5. **Create OAuth 2.0 Credentials**
   - Go to **"APIs & Services"** → **"Credentials"**
   - Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
   - If prompted, configure the consent screen (you may have already done this)
   - Select **"Web application"** as the application type
   - Give it a name: "Visionary Studio Web Client" (or any name)
   - **Authorized JavaScript origins**: Add your Supabase project URL:
     ```
     https://your-project.supabase.co
     ```
     (Replace `your-project` with your actual Supabase project reference)
     - For local development, you can also add: `http://localhost:3000` (optional)
   - **Authorized redirect URIs**: Add your Supabase callback URL:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
     (Replace `your-project` with your actual Supabase project reference)
     - **Important**: This is the only redirect URI you need - Supabase handles the OAuth flow and redirects back to your app
   - Click **"Create"**
   - **Important**: A popup will show your **Client ID** and **Client Secret**
     - Copy both values immediately (you won't be able to see the secret again!)
     - If you lose the secret, you'll need to create new credentials

#### Step 2: Configure Google OAuth in Supabase (For both Option A and Option B)

1. **Get Your Supabase Project URL**
   - Go to Supabase Dashboard → **Project Settings** → **API**
   - Copy your **Project URL** (e.g., `https://abcdefgh.supabase.co`)

2. **Add Credentials to Supabase**
   - Go to Supabase Dashboard → **Authentication** → **Providers**
   - Find **"Google"** in the list and click to expand it
   - Toggle **"Enable Google provider"** to ON
   - Paste your **Client ID** from Google Cloud Console
   - Paste your **Client Secret** from Google Cloud Console
   - **Authorized redirect URL** should already be set to:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
     (This should match what you added in Google Cloud Console)
   - Click **"Save"**

#### Step 3: Verify the Setup

1. Go to your app's landing page
2. Click "Sign in" or "Start free trial"
3. You should see a Google sign-in option
4. After signing in, you should be redirected back to your app

**Troubleshooting Google OAuth:**
- **"redirect_uri_mismatch" error**: Make sure the redirect URI in Google Cloud Console exactly matches `https://your-project.supabase.co/auth/v1/callback`
- **"invalid_client" error**: Double-check that your Client ID and Secret are correct
- **"access_denied" error**: Make sure the OAuth consent screen is properly configured
- **Local development**: The Supabase callback URL works for both production and local development - no need to add localhost redirect URIs

### Phone Authentication (SMS OTP)

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Phone** provider
3. Configure SMS provider (Twilio, MessageBird, etc.)
4. Add your SMS provider credentials

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Try signing in with Google
3. Try signing in with phone number
4. Generate an image and verify it saves to the database and storage

## Troubleshooting

### RLS Policy Errors
If you get permission errors, check:
- RLS is enabled on the `shots` table
- Policies are correctly set up
- User is authenticated (check `auth.uid()`)

### Storage Upload Errors
If file uploads fail:
- Check bucket exists and is named `shots`
- Verify storage policies are set up correctly
- Check file path format matches: `shots/{user_id}/{filename}`

### Authentication Errors
If auth doesn't work:
- Verify environment variables are set correctly
- Check OAuth redirect URLs match
- Ensure phone provider is configured if using phone auth

## Need Help?

Check the [Supabase Documentation](https://supabase.com/docs) for more details.

