import Link from 'next/link';
import { Card } from '../../components/ui/card';
import { BackgroundBlobs } from '../../components/background-blobs';

export const metadata = {
  title: 'About Us | AdShotAI',
  description: 'About AdShotAI - AI-Powered Product Photography',
};

export default function AboutPage() {
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
              About Us
            </h1>

            <div className="prose prose-invert max-w-none space-y-6 text-sm text-white/80 sm:space-y-8 sm:text-base">
              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">Who We Are</h2>
                <p>
                  AdShotAI is an independent AI product photography platform built and operated by Shivank Sharma, a solo developer currently based in Bengaluru, India. The project is not a registered business entity; it is personally operated with a focus on quality, transparency, and accessibility.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">Our Mission</h2>
                <p>
                  AdShotAI was created to make high-quality, professional-grade product visuals accessible to every brand, business, and creator—without the cost or complexity of physical photoshoots.
                </p>
                <p className="mt-4">
                  Through advanced AI image generation, creative styling algorithms, and cinematic lighting models, AdShotAI helps users create stunning product imagery in minutes.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">What We Do</h2>
                <p>
                  AdShotAI provides:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Professional AI-generated product photography</li>
                  <li>Creative direction and styling presets</li>
                  <li>Realistic lighting and composition algorithms</li>
                  <li>Reference-based product rendering</li>
                  <li>Fast, credit-based generation workflow</li>
                  <li>Simple, user-friendly interface</li>
                </ul>
                <p className="mt-4">
                  Whether you&apos;re designing ads, running an e-commerce store, or launching a new product, AdShotAI helps you produce premium visuals instantly.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">Our Story</h2>
                <p>
                  AdShotAI began as a personal side project combining a passion for AI, automation, and digital design. Seeing small creators struggle with expensive and time-consuming product photoshoots inspired the creation of a fast, accessible, AI-powered alternative.
                </p>
                <p className="mt-4">
                  The platform continues to evolve through experimentation, user feedback, and constant improvements.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">Our Values</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong className="text-white">Innovation:</strong> Pushing boundaries in AI-generated creative tools</li>
                  <li><strong className="text-white">Quality:</strong> Delivering studio-grade results</li>
                  <li><strong className="text-white">Accessibility:</strong> Making great design affordable for all</li>
                  <li><strong className="text-white">Transparency:</strong> Clear pricing, policies, and communication</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">Contact Information</h2>
                <p>
                  For enquiries or support, reach out anytime:
                </p>
                <ul className="list-none pl-0 space-y-1 mt-2">
                  <li><strong className="text-white">Email:</strong> shivanksharma.ai@gmail.com</li>
                  <li><strong className="text-white">Location:</strong> Bengaluru, India</li>
                </ul>
                <p className="mt-2 text-sm text-white/60">
                  (AdShotAI is independently operated; no registered business address is publicly listed.)
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

