/**
 * Location detection utilities for pricing
 */

export type Currency = 'INR' | 'USD';
export type CountryCode = 'IN' | 'US' | 'OTHER';

export interface LocationData {
  country: CountryCode;
  currency: Currency;
  isIndia: boolean;
}

/**
 * Detect user location from browser locale
 * Falls back to IP-based detection if available
 */
export function detectLocationFromBrowser(): LocationData {
  if (typeof window === 'undefined') {
    // Server-side: default to international
    return {
      country: 'OTHER',
      currency: 'USD',
      isIndia: false,
    };
  }

  try {
    // Try timezone first (most reliable for India)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const timezoneLower = timezone.toLowerCase();
    
    // Comprehensive India timezone detection
    const indiaTimezones = [
      'asia/kolkata',
      'asia/calcutta',
      'asia/mumbai',
      'asia/delhi',
      'asia/chennai',
      'asia/bangalore',
      'asia/hyderabad',
      'asia/pune',
      'kolkata',
      'calcutta',
      'mumbai',
      'delhi',
      'chennai',
      'bangalore',
      'hyderabad',
      'pune',
      'ist', // Indian Standard Time
    ];
    
    if (indiaTimezones.some(tz => timezoneLower.includes(tz))) {
      return {
        country: 'IN',
        currency: 'INR',
        isIndia: true,
      };
    }

    // Try locale
    const locale = navigator.language || (navigator as any).userLanguage || 'en-US';
    const localeLower = locale.toLowerCase();
    
    // Check for India locale indicators
    if (
      localeLower.includes('-in') ||
      localeLower.startsWith('hi-') ||
      localeLower.startsWith('en-in') ||
      localeLower === 'hi' ||
      localeLower === 'in'
    ) {
      return {
        country: 'IN',
        currency: 'INR',
        isIndia: true,
      };
    }

    // Check Intl.DateTimeFormat with India locale
    try {
      const formatter = new Intl.DateTimeFormat('en-IN', { timeZone: timezone });
      const testDate = new Date();
      const parts = formatter.formatToParts(testDate);
      
      // If formatter works with en-IN, likely in India
      if (parts && parts.length > 0) {
        // Check if we can detect IST offset (UTC+5:30)
        const offset = testDate.getTimezoneOffset();
        // IST is UTC+5:30, so offset is -330 minutes
        if (offset === -330 || (offset >= -345 && offset <= -315)) {
          return {
            country: 'IN',
            currency: 'INR',
            isIndia: true,
          };
        }
      }
    } catch (e) {
      // Ignore formatter errors
    }
  } catch (error) {
    console.error('Error in browser detection:', error);
  }

  // Default to international
  return {
    country: 'OTHER',
    currency: 'USD',
    isIndia: false,
  };
}

/**
 * Fetch location from IP-based API (client-side)
 * Uses our own API route for better reliability
 */
export async function detectLocationFromIP(): Promise<LocationData> {
  try {
    // Use our own API route for IP-based detection
    const response = await fetch('/api/location', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('IP detection failed');
    }

    const data = await response.json();
    return data as LocationData;
  } catch (error) {
    console.error('Error detecting location from IP:', error);
    // Fallback to browser detection
    return detectLocationFromBrowser();
  }
}

/**
 * Get location with fallback strategy
 * Tries IP-based first, then browser-based
 */
export async function getLocation(): Promise<LocationData> {
  if (typeof window === 'undefined') {
    // Server-side: can't detect, default to international
    return {
      country: 'OTHER',
      currency: 'USD',
      isIndia: false,
    };
  }

  // Try IP-based detection first (more accurate)
  try {
    const ipLocation = await detectLocationFromIP();
    return ipLocation;
  } catch (error) {
    // Fallback to browser-based detection
    return detectLocationFromBrowser();
  }
}

