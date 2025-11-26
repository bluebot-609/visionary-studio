import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { grantTrialCredits } from '@/services/creditService';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Error exchanging code:', error);
      return NextResponse.redirect(
        new URL('/?error=auth_failed&message=Authentication failed', request.url)
      );
    }
    
    if (data?.user) {
      // Detect if this is a new user (signup) or existing (signin)
      const userCreatedAt = new Date(data.user.created_at);
      const now = new Date();
      const timeDiff = now.getTime() - userCreatedAt.getTime();
      const isNewUser = timeDiff < 10000; // Created within last 10 seconds
      
      if (isNewUser) {
        // NEW USER SIGNUP - Check device fingerprint
        // Get fingerprint from URL query param (passed by client before OAuth)
        const fingerprint = requestUrl.searchParams.get('fingerprint');
        const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                        request.headers.get('x-real-ip') || 
                        'unknown';
        const userAgent = request.headers.get('user-agent') || '';
        
        if (fingerprint) {
          // Check device limit BEFORE granting trial credits
          const { data: checkResult, error: checkError } = await supabase
            .rpc('check_device_account_limit', {
              fingerprint_text: fingerprint,
              max_accounts: 2
            });
          
          if (checkError) {
            console.error('Error checking device limit:', checkError);
            // On error, allow signup but don't grant trial (safer)
            return NextResponse.redirect(
              new URL('/dashboard?trial=error', request.url)
            );
          }
          
          if (checkResult === false) {
            // Only check device limit if function exists and returned false
            // Device limit reached - account created but no trial credits
            // Store fingerprint for analytics (is_signup = TRUE but no credits)
            // Use UPSERT to avoid duplicate key errors if signup flow is triggered multiple times
            const { error: insertError } = await supabase
              .from('device_fingerprints')
              .upsert({
                user_id: data.user.id,
                fingerprint: fingerprint,
                ip_address: clientIP,
                user_agent: userAgent,
                is_signup: true
              }, {
                onConflict: 'user_id,fingerprint,is_signup',
                ignoreDuplicates: true
              });
            
            if (insertError && insertError.code !== '23505') {
              // Only log if it's not a duplicate key error (23505)
              console.error('Error storing fingerprint:', insertError);
            }
            
            return NextResponse.redirect(
              new URL('/dashboard?trial=limit_reached&message=Device limit reached. Please purchase credits to continue.', request.url)
            );
          }
          
          // Device check passed - store fingerprint
          // Use UPSERT to avoid duplicate key errors if signup flow is triggered multiple times
          const { error: insertError2 } = await supabase
            .from('device_fingerprints')
            .upsert({
              user_id: data.user.id,
              fingerprint: fingerprint,
              ip_address: clientIP,
              user_agent: userAgent,
              is_signup: true
            }, {
              onConflict: 'user_id,fingerprint,is_signup',
              ignoreDuplicates: true
            });
          
          if (insertError2 && insertError2.code !== '23505') {
            // Only log if it's not a duplicate key error (23505)
            console.error('Error storing fingerprint:', insertError2);
          }
          
          // Grant trial credits
          const grantResult = await grantTrialCredits(data.user.id);
          if (!grantResult.success) {
            console.error('Error granting trial credits:', grantResult.error);
            return NextResponse.redirect(
              new URL('/dashboard?trial=error&message=Failed to grant trial credits', request.url)
            );
          }

          const successRedirect = new URL(next, request.url);
          successRedirect.searchParams.set('trial', 'activated');
          successRedirect.searchParams.set('message', 'Welcome to Visionary Studio! Free trial activated (3 credits).');
          return NextResponse.redirect(successRedirect);
        } else {
          // No fingerprint provided - grant trial anyway (graceful degradation)
          // This shouldn't happen in production but allows manual testing
          console.warn('No fingerprint provided for new user, granting trial anyway');
          const grantResultWithoutFingerprint = await grantTrialCredits(data.user.id);
          if (!grantResultWithoutFingerprint.success) {
            console.error('Error granting trial without fingerprint:', grantResultWithoutFingerprint.error);
            return NextResponse.redirect(
              new URL('/dashboard?trial=error&message=Failed to grant trial credits', request.url)
            );
          }

          const successRedirect = new URL(next, request.url);
          successRedirect.searchParams.set('trial', 'activated');
          successRedirect.searchParams.set('message', 'Welcome to Visionary Studio! Free trial activated (3 credits).');
          return NextResponse.redirect(successRedirect);
        }
      } else {
        // EXISTING USER SIGNIN - No checks needed, always allow
        // Optionally store fingerprint for analytics (is_signup = FALSE)
        // Use UPSERT to avoid duplicate key errors if this signin was already tracked
        const fingerprint = requestUrl.searchParams.get('fingerprint');
        if (fingerprint) {
          const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                          request.headers.get('x-real-ip') || 
                          'unknown';
          const userAgent = request.headers.get('user-agent') || '';
          
          // Use UPSERT: if this combination already exists, do nothing (we don't need to track every signin)
          const { error: signinInsertError } = await supabase
            .from('device_fingerprints')
            .upsert({
              user_id: data.user.id,
              fingerprint: fingerprint,
              ip_address: clientIP,
              user_agent: userAgent,
              is_signup: false // Signin only
            }, {
              onConflict: 'user_id,fingerprint,is_signup',
              ignoreDuplicates: true
            });
          
          if (signinInsertError && signinInsertError.code !== '23505') {
            // Only log if it's not a duplicate key error (23505)
            // We use ignoreDuplicates, but still handle it gracefully
            console.error('Error storing signin fingerprint:', signinInsertError);
          }
        }
      }
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}

