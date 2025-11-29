import Link from 'next/link';
import { Card } from '../../components/ui/card';
import { BackgroundBlobs } from '../../components/background-blobs';

export const metadata = {
  title: 'Shipping Policy | AdShotAI',
  description: 'Shipping and Delivery Policy for AdShotAI',
};

export default function ShippingPolicyPage() {
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
              Shipping & Delivery Policy
            </h1>
            <p className="text-sm text-white/60 mb-8 sm:text-base">
              Last updated: [DATE]
            </p>

            <div className="prose prose-invert max-w-none space-y-6 text-sm text-white/80 sm:space-y-8 sm:text-base">
              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">1. Digital Product Delivery</h2>
                <p>
                  AdShotAI is a digital service that provides AI-generated product images. We do not ship physical products. 
                  All deliverables are digital files delivered instantly through our platform.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">2. Delivery Method</h2>
                <p>
                  Generated images are delivered immediately upon completion through:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Direct download from your dashboard</li>
                  <li>Access to your image library within the platform</li>
                  <li>Email notification (if enabled) with download links</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">3. Delivery Timeline</h2>
                <h3 className="font-semibold text-white mb-2 mt-4">3.1 Image Generation</h3>
                <p>
                  AI-generated images are typically delivered within [X] seconds to [X] minutes after you initiate generation, 
                  depending on server load and image complexity.
                </p>

                <h3 className="font-semibold text-white mb-2 mt-4">3.2 Processing Time</h3>
                <p>
                  In rare cases of high demand, processing may take up to [X] minutes. You will be notified of any delays 
                  through the platform interface.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">4. Delivery Costs</h2>
                <p>
                  There are no shipping costs associated with digital delivery. All images are delivered free of charge 
                  through our platform. You only pay for credits used to generate images.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">5. International Delivery</h2>
                <p>
                  Our digital service is available worldwide. There are no geographical restrictions or additional fees 
                  for international users. All images are delivered instantly regardless of your location.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">6. File Formats and Quality</h2>
                <p>
                  Images are delivered in the following formats:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>High-resolution PNG or JPEG format</li>
                  <li>Resolution: [SPECIFY_RESOLUTION] (e.g., up to 2048x2048 pixels)</li>
                  <li>Color profile: sRGB</li>
                </ul>
                <p className="mt-2">
                  You can download images in your preferred format and resolution from your dashboard.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">7. Access and Storage</h2>
                <p>
                  Generated images are stored in your account library for [X] days/months. You are responsible for downloading 
                  and backing up your images. We recommend downloading important images promptly.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">8. Delivery Issues</h2>
                <p>
                  If you experience any issues accessing or downloading your generated images:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Check your internet connection</li>
                  <li>Try refreshing your dashboard</li>
                  <li>Contact our support team at [YOUR_EMAIL]</li>
                </ul>
                <p className="mt-2">
                  We will assist you in resolving any delivery issues within [X] business hours.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">9. Courier Services</h2>
                <p>
                  <strong className="text-white">Not Applicable:</strong> As we provide digital services only, 
                  we do not use any courier or shipping services. All products are delivered digitally through our platform.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">10. Contact for Delivery Inquiries</h2>
                <p>
                  For questions about delivery or access to your images, please contact us:
                </p>
                <ul className="list-none pl-0 space-y-1 mt-2">
                  <li>Email: [YOUR_EMAIL]</li>
                  <li>Support Hours: [YOUR_BUSINESS_HOURS]</li>
                </ul>
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

