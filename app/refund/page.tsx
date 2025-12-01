import Link from 'next/link';
import { Card } from '../../components/ui/card';
import { BackgroundBlobs } from '../../components/background-blobs';

export const metadata = {
  title: 'Payment & Refund Policy | AdShotAI',
  description: 'Payment and Refund Policy for AdShotAI',
};

export default function RefundPolicyPage() {
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
              Payment &amp; Refund Policy — AdShotAI
            </h1>
            <p className="text-sm text-white/60 mb-8 sm:text-base">
              Last Updated: 2025-12-02
            </p>

            <div className="prose prose-invert max-w-none space-y-6 text-sm text-white/80 sm:space-y-8 sm:text-base">
              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">1. Payments</h2>
                <p>
                  Payments are processed securely through Razorpay.
                </p>
                <p className="mt-2">
                  We do not store credit card or bank details.
                </p>
                <p className="mt-2">
                  Prices are shown in INR unless stated otherwise.
                </p>
                <p className="mt-2">
                  GST is not charged until applicable.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">2. Credits</h2>
                <p>
                  AdShotAI uses a credit-based system.
                </p>
                <p className="mt-2">
                  Credits are consumed per image generation.
                </p>
                <p className="mt-2">
                  Credits are non-transferable.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">3. Refunds</h2>
                <p>Refunds are only provided for:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Duplicate payments</li>
                  <li>Technical errors verified by us</li>
                  <li>Unused credits (only under special approval)</li>
                </ul>
                <p className="mt-4">Refunds are NOT provided for:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Used credits</li>
                  <li>Generated outputs</li>
                  <li>Wrong prompt usage / user errors</li>
                </ul>
                <p className="mt-4">
                  Refund decisions remain at the sole discretion of the operator.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">4. Chargebacks</h2>
                <p>
                  Chargebacks or payment disputes may result in account suspension.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">5. Billing Issues</h2>
                <p>
                  Contact us within 14 days at: shivanksharma.ai@gmail.com
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">6. Changes</h2>
                <p>
                  We may update pricing or credit rules with notice on the website.
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

