import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { AuthProvider } from '../providers/auth-provider';
import { CreditsProvider } from '../providers/credits-provider';
import { ErrorBoundary } from '../components/ErrorBoundary';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'AdShotAI — AI-Powered Product Photography',
  description:
    'Create stunning product photos with AI. Professional ad-ready imagery in seconds.',
  openGraph: {
    type: 'website',
    title: 'AdShotAI',
    description:
      'Create stunning product photos with AI. Professional ad-ready imagery in seconds.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <CreditsProvider>{children}</CreditsProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

