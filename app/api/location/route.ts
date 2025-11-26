import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to detect user location from IP address
 * Used for pricing display on the landing page
 */
export async function GET(request: NextRequest) {
  const defaultLocation = {
    country: 'OTHER',
    currency: 'USD',
    isIndia: false,
  };

  try {
    // Get client IP from request headers (handled by Vercel/proxy)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const rawIp = forwardedFor?.split(',')[0]?.trim() || realIp || '';

    const isPrivateIp =
      !rawIp ||
      rawIp === '::1' ||
      rawIp === '127.0.0.1' ||
      rawIp === 'localhost' ||
      rawIp.startsWith('10.') ||
      rawIp.startsWith('192.168.') ||
      rawIp.startsWith('172.16.') ||
      rawIp.startsWith('172.17.') ||
      rawIp.startsWith('172.18.') ||
      rawIp.startsWith('172.19.') ||
      rawIp.startsWith('172.2') ||
      rawIp.startsWith('172.3');

    if (isPrivateIp) {
      // For private/local IPs, try to use Accept-Language header as a hint
      const acceptLanguage = request.headers.get('accept-language') || '';
      const langLower = acceptLanguage.toLowerCase();
      
      // Check if language hints suggest India
      if (
        langLower.includes('-in') ||
        langLower.startsWith('hi-') ||
        langLower.startsWith('en-in') ||
        langLower.includes('hi,') ||
        langLower.includes('hi;')
      ) {
        return NextResponse.json({
          country: 'IN',
          currency: 'INR',
          isIndia: true,
        });
      }
      
      // For localhost, return a special flag that tells client to use browser detection
      // We'll still return default but client-side will handle browser detection
      return NextResponse.json({
        ...defaultLocation,
        useBrowserDetection: true, // Flag to trigger browser detection
      });
    }

    // Try a couple of endpoints in case the first fails (rate limits, etc.)
    const endpoints = [
      `https://ipapi.co/${rawIp}/json/`,
      'https://ipapi.co/json/', // Fallback uses request IP detected by ipapi
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });

        if (!response.ok) {
          continue;
        }

        const text = await response.text();
        if (!text) {
          continue;
        }

        const data = JSON.parse(text);
        const countryCode = data.country_code || data.country || 'US';

        if (countryCode === 'IN') {
          return NextResponse.json({
            country: 'IN',
            currency: 'INR',
            isIndia: true,
          });
        }

        // Any non-India country defaults to USD pricing
        return NextResponse.json(defaultLocation);
      } catch (innerError) {
        console.warn('IP geo lookup failed, trying fallback:', innerError);
        continue;
      }
    }

    return NextResponse.json(defaultLocation);
  } catch (error) {
    console.error('Error detecting location from IP:', error);
    // Return default (international) on error
    return NextResponse.json(defaultLocation);
  }
}

