import Link from 'next/link';
import { Playfair_Display, DM_Sans } from 'next/font/google';

const serif = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600'] });
const sans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'] });

export const metadata = {
  title: 'Terms of Service — FormIQ',
  description: 'Terms governing the use of FormIQ.',
};

export default function TermsPage() {
  return (
    <div className={`${sans.className} min-h-screen bg-white text-slate-950`}>
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-800 transition-colors">
            ← Back to home
          </Link>
          <h1 className={`mt-6 text-4xl font-semibold tracking-tight text-slate-950 ${serif.className}`}>Terms of Service</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: March 17, 2026</p>
        </div>

        <div className={`prose prose-slate prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-950 prose-a:text-emerald-800 prose-strong:text-slate-950 ${sans.className}`}>
          <p className={`lead text-xl text-slate-600 font-light ${serif.className}`}>
            These Terms of Service (“Terms”) govern access to and use of the FormIQ website and product (the “Services”). By using the Services,
            you agree to these Terms.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>1. Accounts</h2>
          <p>
            To access certain features of the Services, you must register for an account. When you register, you agree to:
          </p>
          <ul>
            <li>Provide accurate, current, and complete information.</li>
            <li>Maintain the security of your password and accept all risks of unauthorized access to your account.</li>
            <li>Promptly notify us if you discover or otherwise suspect any security breaches related to the Services.</li>
          </ul>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>2. Customer data</h2>
          <p>
            You retain all rights and ownership in your documents and any data extracted from them (“Customer Data”). By using the Services, you grant us a limited license to:
          </p>
          <ul>
            <li>Process Customer Data solely for the purpose of providing and improving the Services to you.</li>
            <li>Generate anonymized, aggregated metrics for product performance analysis (provided such metrics do not identify you or your Customer Data).</li>
          </ul>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>3. Acceptable use</h2>
          <p>
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul>
            <li>Using the Services for any illegal purpose or in violation of any local, state, national, or international law.</li>
            <li>Violating or encouraging others to violate the rights of third parties.</li>
            <li>Interfering with security-related features of the Services.</li>
            <li>Reverse engineering or attempting to extract the source code of the Services.</li>
          </ul>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>4. Billing and Payment</h2>
          <p>
            Certain features of the Services may require payment of fees. All fees are in US Dollars and are non-refundable unless required by law. We reserve the right to change our fees at any time, upon notice to you.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>5. Termination</h2>
          <p>
            We may terminate or suspend your access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>6. Limitation of liability</h2>
          <p>
            In no event shall FormIQ, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>7. Disclaimer</h2>
          <p>
            The Services are provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the Services will be uninterrupted, timely, secure, or error-free. Extraction results should always be reviewed by a human for accuracy.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>8. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>9. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:hello@formiq.ke">hello@formiq.ke</a>.
          </p>

          <div className="mt-16 p-6 rounded-2xl bg-slate-50 border border-slate-200 uppercase tracking-wide text-[10px] font-bold text-slate-400">
            End of Terms of Service
          </div>
        </div>
      </div>
    </div>
  );
}

