import type { Metadata } from 'next';
import { Inter, Sora } from 'next/font/google';
import { AuthProvider } from '../providers/auth-provider';
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

export const metadata: Metadata = {
  title: 'Visionary Studio — AI-Powered Creative Suite',
  description:
    'Design premium product imagery with AI direction, professional styling, and instant iteration.',
  openGraph: {
    type: 'website',
    title: 'Visionary Studio',
    description:
      'Design premium product imagery with AI direction, professional styling, and instant iteration.',
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
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

