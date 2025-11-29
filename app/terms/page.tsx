import Link from 'next/link';
import { Card } from '../../components/ui/card';
import { BackgroundBlobs } from '../../components/background-blobs';

export const metadata = {
  title: 'Terms of Service | AdShotAI',
  description: 'Terms of Service for AdShotAI - AI-Powered Product Photography',
};

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="text-sm text-white/60 mb-8 sm:text-base">
              Last updated: [DATE]
            </p>

            <div className="prose prose-invert max-w-none space-y-6 text-sm text-white/80 sm:space-y-8 sm:text-base">
              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">1. Agreement to Terms</h2>
                <p>
                  By accessing or using AdShotAI (&quot;the Service&quot;), you agree to be bound by these Terms of Service. 
                  If you disagree with any part of these terms, you may not access the Service.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">2. Description of Service</h2>
                <p>
                  AdShotAI is an AI-powered product photography service that generates professional product images 
                  using artificial intelligence. The Service allows users to upload product images and generate 
                  stylized, professional photographs for commercial and personal use.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">3. User Accounts</h2>
                <h3 className="font-semibold text-white mb-2 mt-4">3.1 Account Creation</h3>
                <p>
                  To use the Service, you must create an account using Google OAuth authentication. 
                  You are responsible for maintaining the security of your account.
                </p>

                <h3 className="font-semibold text-white mb-2 mt-4">3.2 Account Responsibilities</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for all activities under your account</li>
                  <li>You must notify us immediately of any unauthorized use</li>
                  <li>You must be at least 18 years old to use the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">4. Credits and Payment</h2>
                <h3 className="font-semibold text-white mb-2 mt-4">4.1 Credit System</h3>
                <p>
                  The Service operates on a credit-based system. Each image generation consumes credits. 
                  Credits can be purchased through Razorpay payment gateway.
                </p>

                <h3 className="font-semibold text-white mb-2 mt-4">4.2 Payment Terms</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All payments are processed through Razorpay</li>
                  <li>Credits are non-refundable except as specified in our Refund Policy</li>
                  <li>Prices are subject to change with notice</li>
                  <li>Unused credits do not expire unless otherwise stated</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">5. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Use the Service for illegal purposes</li>
                  <li>Upload content that is illegal, harmful, or violates others&apos; rights</li>
                  <li>Attempt to reverse engineer or extract AI models</li>
                  <li>Use the Service to generate content that infringes on intellectual property rights</li>
                  <li>Resell or redistribute generated images without proper licensing</li>
                  <li>Interfere with or disrupt the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">6. Intellectual Property</h2>
                <h3 className="font-semibold text-white mb-2 mt-4">6.1 Your Content</h3>
                <p>
                  You retain ownership of images you upload. By uploading content, you grant us a license to use 
                  it solely for providing the Service.
                </p>

                <h3 className="font-semibold text-white mb-2 mt-4">6.2 Generated Images</h3>
                <p>
                  You own the rights to images generated through the Service. You may use generated images for 
                  commercial purposes, subject to these Terms.
                </p>

                <h3 className="font-semibold text-white mb-2 mt-4">6.3 Service Intellectual Property</h3>
                <p>
                  The Service, including its design, functionality, and AI technology, is owned by [YOUR_BUSINESS_NAME] 
                  and protected by intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">7. Limitation of Liability</h2>
                <p>
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
                  EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
                </p>
                <p className="mt-2">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                  SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE SERVICE.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">8. Service Availability</h2>
                <p>
                  We strive to maintain Service availability but do not guarantee uninterrupted access. 
                  We reserve the right to modify, suspend, or discontinue the Service at any time.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">9. Termination</h2>
                <p>
                  We may terminate or suspend your account immediately, without prior notice, for conduct that 
                  we believe violates these Terms or is harmful to other users or the Service.
                </p>
                <p className="mt-2">
                  You may terminate your account at any time by contacting us at [YOUR_EMAIL].
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">10. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of material changes. 
                  Continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">11. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of [YOUR_JURISDICTION], 
                  without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">12. Contact Information</h2>
                <p>
                  If you have questions about these Terms, please contact us at:
                </p>
                <ul className="list-none pl-0 space-y-1 mt-2">
                  <li>Email: [YOUR_EMAIL]</li>
                  <li>Address: [YOUR_BUSINESS_ADDRESS]</li>
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

