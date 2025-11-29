import Link from 'next/link';
import { Card } from '../../components/ui/card';
import { BackgroundBlobs } from '../../components/background-blobs';

export const metadata = {
  title: 'Refund & Cancellation Policy | AdShotAI',
  description: 'Refund and Cancellation Policy for AdShotAI',
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
              Refund & Cancellation Policy
            </h1>
            <p className="text-sm text-white/60 mb-8 sm:text-base">
              Last updated: [DATE]
            </p>

            <div className="prose prose-invert max-w-none space-y-6 text-sm text-white/80 sm:space-y-8 sm:text-base">
              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">1. Overview</h2>
                <p>
                  This Refund and Cancellation Policy outlines the terms and conditions for refunds and cancellations 
                  for purchases made through AdShotAI. As a digital service provider, our refund policy is designed 
                  to be fair while protecting against abuse.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">2. Credit-Based System</h2>
                <p>
                  AdShotAI operates on a credit-based system. Credits are purchased in packages and used to generate images. 
                  Once credits are used to generate an image, they cannot be refunded unless under exceptional circumstances 
                  outlined in this policy.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">3. Refund Eligibility</h2>
                <h3 className="font-semibold text-white mb-2 mt-4">3.1 Unused Credits</h3>
                <p>
                  Unused credits may be eligible for refund under the following conditions:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Refund request made within [X] days of purchase</li>
                  <li>Credits have not been used to generate any images</li>
                  <li>Account is in good standing</li>
                </ul>

                <h3 className="font-semibold text-white mb-2 mt-4">3.2 Service Issues</h3>
                <p>
                  Refunds may be issued if:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Service is unavailable for extended periods (more than [X] hours)</li>
                  <li>Technical errors prevent image generation despite valid attempts</li>
                  <li>Generated images do not meet quality standards due to platform errors</li>
                </ul>

                <h3 className="font-semibold text-white mb-2 mt-4">3.3 Duplicate Charges</h3>
                <p>
                  If you are charged multiple times for a single transaction due to a technical error, 
                  we will refund all duplicate charges immediately upon verification.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">4. Non-Refundable Scenarios</h2>
                <p>Refunds will NOT be issued for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Credits that have been used to generate images</li>
                  <li>Dissatisfaction with AI-generated image quality or style (subjective results)</li>
                  <li>User error in image upload or prompt selection</li>
                  <li>Change of mind after credits have been purchased</li>
                  <li>Account suspension or termination due to Terms of Service violations</li>
                  <li>Credits that have expired (if applicable)</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">5. Refund Process</h2>
                <h3 className="font-semibold text-white mb-2 mt-4">5.1 How to Request a Refund</h3>
                <p>To request a refund:</p>
                <ol className="list-decimal pl-6 space-y-2 mt-2">
                  <li>Contact our support team at [YOUR_EMAIL]</li>
                  <li>Include your account email and transaction ID</li>
                  <li>Provide reason for refund request</li>
                  <li>Allow [X] business days for review</li>
                </ol>

                <h3 className="font-semibold text-white mb-2 mt-4">5.2 Refund Review</h3>
                <p>
                  All refund requests are reviewed within [X] business days. We may request additional information 
                  to process your request. You will be notified of the decision via email.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">6. Refund Processing Time</h2>
                <p>
                  Once a refund is approved:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Refunds are processed within [X] business days</li>
                  <li>Refunds are issued to the original payment method</li>
                  <li>Processing time may vary by payment provider (Razorpay, bank, etc.)</li>
                  <li>You will receive email confirmation when refund is processed</li>
                </ul>
                <p className="mt-2">
                  <strong className="text-white">Note:</strong> It may take additional [X-X] business days for the 
                  refund to appear in your account, depending on your bank or payment provider.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">7. Cancellation Policy</h2>
                <h3 className="font-semibold text-white mb-2 mt-4">7.1 Account Cancellation</h3>
                <p>
                  You may cancel your account at any time by contacting us at [YOUR_EMAIL]. 
                  Unused credits will be handled according to Section 3.1 of this policy.
                </p>

                <h3 className="font-semibold text-white mb-2 mt-4">7.2 Subscription Cancellation</h3>
                <p>
                  If you have an active subscription (if applicable), you may cancel at any time. 
                  Cancellation takes effect at the end of the current billing period. 
                  No refunds are provided for the current billing period.
                </p>

                <h3 className="font-semibold text-white mb-2 mt-4">7.3 Service Cancellation by Us</h3>
                <p>
                  We reserve the right to cancel or suspend accounts that violate our Terms of Service. 
                  In such cases, refunds are at our discretion and subject to review.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">8. Credit Expiration</h2>
                <p>
                  [SPECIFY IF CREDITS EXPIRE] - If credits expire, they cannot be refunded after expiration. 
                  We recommend using credits before expiration or contacting us if you need an extension.
                </p>
                <p className="mt-2">
                  <strong className="text-white">Current Policy:</strong> [SPECIFY - e.g., &quot;Credits do not expire&quot; or &quot;Credits expire after [X] months of inactivity&quot;]
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">9. Chargebacks</h2>
                <p>
                  If you initiate a chargeback through your payment provider, your account will be immediately suspended 
                  pending investigation. We encourage you to contact us first to resolve any issues, as chargebacks 
                  may result in permanent account termination.
                </p>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">10. Dispute Resolution</h2>
                <p>
                  If you disagree with a refund decision, you may:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Request a review by providing additional information</li>
                  <li>Contact our support team for clarification</li>
                  <li>Escalate to [YOUR_SUPERVISOR_EMAIL] if needed</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">11. Contact for Refunds</h2>
                <p>
                  For refund requests or questions about this policy, contact us:
                </p>
                <ul className="list-none pl-0 space-y-1 mt-2">
                  <li>Email: [YOUR_EMAIL]</li>
                  <li>Subject: &quot;Refund Request - [Your Transaction ID]&quot;</li>
                  <li>Response Time: Within [X] business days</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-xl text-white mb-4 sm:text-2xl">12. Changes to This Policy</h2>
                <p>
                  We reserve the right to modify this Refund and Cancellation Policy at any time. 
                  Changes will be posted on this page with an updated &quot;Last updated&quot; date. 
                  Continued use of the Service after changes constitutes acceptance of the updated policy.
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

