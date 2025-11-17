/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Legacy Firebase images (if any)
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // Vercel serverless function configuration
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;

