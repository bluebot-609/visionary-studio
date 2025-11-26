/**
 * Generate a device fingerprint using browser characteristics
 * Returns a hash string that uniquely identifies the device/browser
 */
export async function generateDeviceFingerprint(): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Device fingerprinting only works in browser');
  }

  const components: string[] = [];

  // Screen characteristics
  components.push(`${screen.width}x${screen.height}`);
  components.push(`${screen.colorDepth}`);
  components.push(`${screen.pixelDepth || screen.colorDepth}`);
  
  // Browser characteristics
  components.push(navigator.userAgent);
  components.push(navigator.language);
  components.push(navigator.platform);
  components.push(`${navigator.hardwareConcurrency || 'unknown'}`);
  components.push(`${navigator.maxTouchPoints || '0'}`);
  
  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
  
  // Canvas fingerprint (most reliable)
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 50;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Device fingerprint', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('Device fingerprint', 4, 17);
    components.push(canvas.toDataURL());
  }
  
  // WebGL fingerprint
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (gl) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '');
      components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '');
    }
    components.push(gl.getParameter(gl.VERSION) || '');
    components.push(gl.getParameter(gl.SHADING_LANGUAGE_VERSION) || '');
  }
  
  // Create hash from components
  const fingerprintString = components.join('|');
  
  // Use crypto.subtle for better hash (if available)
  if (crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprintString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback: Simple hash
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Store fingerprint in localStorage before OAuth redirect
 */
export function storeFingerprintForAuth(fingerprint: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('device_fingerprint', fingerprint);
    // Also store timestamp for expiration check (valid for 5 minutes)
    localStorage.setItem('device_fingerprint_time', Date.now().toString());
  }
}

/**
 * Retrieve fingerprint from localStorage after OAuth redirect
 * Returns null if expired or not found
 */
export function getStoredFingerprint(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const fingerprint = localStorage.getItem('device_fingerprint');
  const timestamp = localStorage.getItem('device_fingerprint_time');
  
  if (!fingerprint || !timestamp) {
    return null;
  }
  
  // Check if expired (5 minutes)
  const age = Date.now() - parseInt(timestamp, 10);
  if (age > 5 * 60 * 1000) {
    localStorage.removeItem('device_fingerprint');
    localStorage.removeItem('device_fingerprint_time');
    return null;
  }
  
  return fingerprint;
}

/**
 * Clear stored fingerprint after successful signup
 */
export function clearStoredFingerprint(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('device_fingerprint');
    localStorage.removeItem('device_fingerprint_time');
  }
}





