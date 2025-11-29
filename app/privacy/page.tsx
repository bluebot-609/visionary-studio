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
              Privacy Policy
            </h1>
            <p className="text-sm text-white/60 mb-8 sm:text-base">
              Last updated: [DATE]
            </p>

            <div className="prose prose-invert max-w-none space-y-6 text-sm text-white/80 sm:space-y-8 sm:text-base">
              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">1. Introduction</h2>
                <p>
                  [YOUR_BUSINESS_NAME] (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates AdShotAI, an AI-powered product photography service. 
                  This Privacy Policy explains how we collect, use, store, and share your information when you use our service.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">2. Information We Collect</h2>
                <h3 className="font-semibold text-white mb-2 mt-4">2.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (name, email address) when you sign up</li>
                  <li>Product images and reference photos you upload</li>
                  <li>Payment information processed through Razorpay</li>
                </ul>

                <h3 className="font-semibold text-white mb-2 mt-4">2.2 Google OAuth Data</h3>
                <p>
                  When you sign in with Google, we collect the following information from your Google account:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Basic profile information (name, email address, profile picture)</li>
                  <li>Account identifier for authentication purposes</li>
                </ul>
                <p className="mt-2">
                  We only access the minimum information necessary to provide our authentication service. 
                  We do not access, store, or share any other Google user data beyond what is required for authentication.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our AI photography services</li>
                  <li>Process your payments and manage your account</li>
                  <li>Authenticate your identity through Google OAuth</li>
                  <li>Generate AI-powered product images based on your uploads</li>
                  <li>Communicate with you about your account and our services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">4. Google API Services User Data Policy</h2>
                <p>
                  Our use of information received from Google APIs adheres to the{' '}
                  <a href="https://developers.google.com/terms/api-services-user-data-policy" 
                     className="text-accent hover:underline" 
                     target="_blank" 
                     rel="noopener noreferrer">
                    Google API Services User Data Policy
                  </a>, including the Limited Use requirements.
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>We only use Google user data to provide authentication services</li>
                  <li>We do not transfer Google user data to third parties except as necessary to provide our service</li>
                  <li>We do not use Google user data for advertising purposes</li>
                  <li>We do not allow humans to read Google user data unless required for security purposes or with your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">5. Data Storage and Security</h2>
                <p>
                  We store your data securely using industry-standard encryption and security measures. 
                  Your images and account information are stored on [YOUR_STORAGE_PROVIDER] servers.
                </p>
                <p className="mt-2">
                  We retain your data for as long as your account is active or as needed to provide our services. 
                  You may request deletion of your data at any time by contacting us at [YOUR_EMAIL].
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">6. Data Sharing</h2>
                <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>With service providers who assist us in operating our service (e.g., payment processors, cloud storage)</li>
                  <li>When required by law or to protect our rights</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Export your data</li>
                  <li>Revoke Google OAuth access at any time through your Google account settings</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">8. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar technologies to maintain your session and improve your experience. 
                  You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">9. Children&apos;s Privacy</h2>
                <p>
                  Our service is not intended for users under the age of 18. We do not knowingly collect personal information from children.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">10. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                  Privacy Policy on this page and updating the &quot;Last updated&quot; date.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">11. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at:
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

