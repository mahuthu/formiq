import Link from 'next/link';
import { Playfair_Display, DM_Sans } from 'next/font/google';

const serif = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600'] });
const sans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'] });

export const metadata = {
  title: 'Privacy Policy — FormIQ',
  description: 'How FormIQ collects, uses, and protects your information.',
};

export default function PrivacyPage() {
  return (
    <div className={`${sans.className} min-h-screen bg-white text-slate-950`}>
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-800 transition-colors">
            ← Back to home
          </Link>
          <h1 className={`mt-6 text-4xl font-semibold tracking-tight text-slate-950 ${serif.className}`}>Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: March 17, 2026</p>
        </div>

        <div className={`prose prose-slate prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-950 prose-a:text-emerald-800 prose-strong:text-slate-950 ${sans.className}`}>
          <p className={`lead text-xl text-slate-600 font-light ${serif.className}`}>
            This Privacy Policy describes how FormIQ (“FormIQ”, “we”, “us”) collects, uses, and protects personal information when you use our
            website and product (the “Services”).
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>1. Information we collect</h2>
          <p>
            We collect information to provide better services to all our users. The types of personal information we collect include:
          </p>
          <ul>
            <li><strong>Account information</strong>: name, email address, organization name, role.</li>
            <li><strong>Usage information</strong>: activity logs (e.g., document uploads, approvals), feature usage, and performance metrics.</li>
            <li><strong>Document data</strong>: documents you upload and any extracted fields you review or edit.</li>
            <li><strong>Technical data</strong>: device and browser information, IP address, and diagnostic logs.</li>
          </ul>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>2. How we use information</h2>
          <p>
            We use the information we collect for the following purposes:
          </p>
          <ul>
            <li>To provide and operate the Services (authentication, storage, extraction, exports).</li>
            <li>To improve reliability, security, and product experience.</li>
            <li>To communicate service notices and support messages.</li>
            <li>To comply with legal obligations and protect our legal rights.</li>
          </ul>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>3. Data security</h2>
          <p>
            We use industry-standard safeguards to protect data in transit and at rest. This includes encryption (TLS/SSL), access controls, and regular security audits. Access to personal information is restricted to FormIQ employees, contractors, and agents who need that information to process it.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>4. Data retention</h2>
          <p>
            We retain your personal information for as long as your account is active or as needed to provide you the Services. We will also retain and use your personal information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>5. Third-party services</h2>
          <p>
            We may use third-party infrastructure providers (e.g., cloud storage and analytics) to operate the Services. These providers process data only under our instructions and are subject to appropriate confidentiality and security measures.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>6. Your rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. To exercise these rights, please contact us.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>7. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@formiq.ke">hello@formiq.ke</a>.
          </p>

          <div className="mt-16 p-6 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-sm text-slate-600 m-0">
              <strong>Enterprise requirements:</strong> If your organization requires a Data Processing Agreement (DPA) or specific jurisdictional compliance (e.g., GDPR, NDPR), please reach out to our team for our standard enterprise terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

