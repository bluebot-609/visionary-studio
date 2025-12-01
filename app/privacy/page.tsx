import Link from 'next/link';
import { Card } from '../../components/ui/card';
import { BackgroundBlobs } from '../../components/background-blobs';

export const metadata = {
  title: 'Privacy Policy | AdShotAI',
  description: 'Privacy Policy for AdShotAI - AI-Powered Product Photography',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-mesh-linear text-slate-100">
      <BackgroundBlobs />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(124,208,255,0.12),_transparent_60%)]" />
      
      <div className="relative z-10">
        <header className="sticky top-2 z-50 mx-auto flex w-[95%] max-w-5xl items-center justify-between gap-2 rounded-full border border-white/10 bg-black/60 px-2.5 py-1.5 backdrop-blur-xl transition-all duration-300 sm:top-6 sm:w-fit sm:gap-12 sm:px-6 sm:py-4 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white sm:h-12 sm:w-12 sm:text-2xl">
              AS
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xs leading-tight text-white sm:text-lg">
                AdShotAI
              </span>
              <span className="hidden text-[9px] uppercase tracking-[0.15em] text-white/50 sm:block sm:text-xs sm:tracking-[0.25em]">
                AI Product Photography
              </span>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50 transition hover:border-white/25 hover:bg-white/[0.08] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.35em]"
          >
            Back to Home
          </Link>
        </header>

        <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
          <Card className="bg-white/[0.04] p-6 sm:p-8 md:p-10">
            <h1 className="font-display text-3xl text-white sm:text-4xl md:text-5xl mb-2">
              Privacy Policy — AdShotAI
            </h1>
            <p className="text-sm text-white/60 mb-8 sm:text-base">
              Last Updated: 2025-12-02
            </p>

            <div className="prose prose-invert max-w-none space-y-6 text-sm text-white/80 sm:space-y-8 sm:text-base">
              <section>
                <p>
                  AdShotAI (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is operated by Shivank Sharma, an independent developer based in India. This Privacy Policy explains how we collect, use, and protect your information when you use our services.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">1. Information We Collect</h2>
                <h3 className="font-semibold text-white mb-2 mt-4">A. Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email address</li>
                  <li>Name (optional or from Google Sign-in)</li>
                  <li>Uploaded product images</li>
                  <li>Support messages</li>
                  <li>Payment-related details required by Razorpay (we never store card data)</li>
                </ul>

                <h3 className="font-semibold text-white mb-2 mt-4">B. Information Collected Automatically</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>IP address</li>
                  <li>Device/browser data</li>
                  <li>Usage logs</li>
                  <li>Analytics</li>
                  <li>Cookies required for functionality and auth</li>
                </ul>

                <h3 className="font-semibold text-white mb-2 mt-4">C. Google OAuth Data</h3>
                <p>
                  If you sign in using Google, we receive:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Your name</li>
                  <li>Your email</li>
                  <li>Your Google profile picture</li>
                </ul>
                <p className="mt-2">
                  We only request basic scopes (openid, email, profile).
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">2. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To provide AI image generation services</li>
                  <li>To process payments via Razorpay</li>
                  <li>To authenticate users (Google OAuth or email login)</li>
                  <li>To send service-related messages (billing, support, updates)</li>
                  <li>To improve stability, performance, and features (analytics)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">3. Sharing of Information</h2>
                <p>We do not sell personal data.</p>
                <p className="mt-2">
                  We only share information with third parties necessary to operate the service:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Razorpay (payments)</li>
                  <li>Cloud storage providers (image storage)</li>
                  <li>Analytics providers (usage insights)</li>
                </ul>
                <p className="mt-2">
                  All third parties comply with applicable privacy and data security standards.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">4. Cookies</h2>
                <p>We use cookies for:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Login sessions</li>
                  <li>Site functionality</li>
                  <li>Analytics</li>
                </ul>
                <p className="mt-2">
                  You can control cookies in browser settings.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">5. Data Retention</h2>
                <p>
                  We retain your data as long as your account exists and for legitimate business needs.
                </p>
                <p className="mt-2">
                  You may request deletion anytime by emailing: shivanksharma.ai@gmail.com
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">6. Data Security</h2>
                <p>
                  We use SSL/TLS and industry-standard safeguards.
                </p>
                <p className="mt-2">
                  No system is fully secure; use the service with this understanding.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">7. Children</h2>
                <p>
                  Not intended for users under 13.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">8. International Processing</h2>
                <p>
                  Your data may be stored or processed on servers located outside your region.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">9. Changes</h2>
                <p>
                  We may update this policy. A new &quot;Last Updated&quot; date will reflect changes.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">10. Contact</h2>
                <p>
                  For privacy requests or questions:
                </p>
                <ul className="list-none pl-0 space-y-1 mt-2">
                  <li>shivanksharma.ai@gmail.com</li>
                  <li>Operated from Bengaluru, India</li>
                </ul>
                <p className="mt-2 text-sm text-white/60">
                  (Govt-verified legal address: Ghaziabad, Uttar Pradesh — not displayed publicly)
                </p>
              </section>
            </div>
          </Card>
        </main>

        <footer className="border-t border-white/10 bg-black/30 py-6 backdrop-blur-xl sm:py-8 md:py-10 mt-12">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-3 px-4 text-xs text-white/60 sm:gap-4 sm:px-6 sm:text-sm md:flex-row md:items-center md:justify-between md:px-8 lg:px-12 xl:px-16">
            <span>© {new Date().getFullYear()} AdShotAI. All rights reserved.</span>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <a href="/about" className="hover:text-white transition">
                About
              </a>
              <a href="/contact" className="hover:text-white transition">
                Contact
              </a>
              <a href="/privacy" className="hover:text-white transition">
                Privacy
              </a>
              <a href="/terms" className="hover:text-white transition">
                Terms
              </a>
              <a href="/shipping" className="hover:text-white transition">
                Shipping
              </a>
              <a href="/refund" className="hover:text-white transition">
                Refund
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

