import Link from 'next/link';
import { Playfair_Display, DM_Sans } from 'next/font/google';

const serif = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600'] });
const sans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'] });

export const metadata = {
  title: 'Security — FormIQ',
  description: 'Security practices and safeguards for FormIQ.',
};

export default function SecurityPage() {
  return (
    <div className={`${sans.className} min-h-screen bg-white text-slate-950`}>
      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-800 transition-colors">
            ← Back to home
          </Link>
          <h1 className={`mt-6 text-4xl font-semibold tracking-tight text-slate-950 ${serif.className}`}>Security</h1>
          <p className="mt-3 text-sm text-slate-500">How we protect your data</p>
        </div>

        <div className={`prose prose-slate prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-slate-950 prose-a:text-emerald-800 prose-strong:text-slate-950 ${sans.className}`}>
          <p className={`lead text-xl text-slate-600 font-light ${serif.className}`}>
            Security is at the core of everything we build at FormIQ. We employ a multi-layered security approach to ensure your sensitive business documents remain confidential and secure.
          </p>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>Data Encryption</h2>
          <p>
            We ensure your data is protected both in transit and at rest:
          </p>
          <ul>
            <li><strong>In Transit</strong>: All data transmitted between your browser and our servers is encrypted using industry-standard Transport Layer Security (TLS 1.2 or higher).</li>
            <li><strong>At Rest</strong>: Documents and extracted data stored in our systems are encrypted using AES-256 encryption.</li>
          </ul>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>Infrastructure Security</h2>
          <p>
            Our infrastructure is hosted on world-class cloud providers (e.g., AWS/GCP) that comply with rigorous security standards, including SOC 2, ISO 27001, and HIPAA.
          </p>
          <ul>
            <li><strong>Tenant Isolation</strong>: We use logical isolation to ensure that one customer's data is never accessible to another.</li>
            <li><strong>VPC Isolation</strong>: Our internal services are isolated within a Virtual Private Cloud (VPC) with strict network access control lists (ACLs).</li>
          </ul>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>Access Control</h2>
          <p>
            We implement strict access controls to minimize the risk of unauthorized access:
          </p>
          <ul>
            <li><strong>Role-Based Access Control (RBAC)</strong>: You can define specific permissions for your team members, ensuring they only have access to the data they need.</li>
            <li><strong>Signed URLs</strong>: Access to physical document files is provided via time-limited, cryptographically signed URLs.</li>
            <li><strong>Internal Access</strong>: FormIQ staff access to production systems is restricted to a "need-to-know" basis and requires multi-factor authentication (MFA).</li>
          </ul>

          <h2 className={`pt-8 border-t border-slate-100 ${serif.className}`}>Software Security</h2>
          <ul>
            <li><strong>Regular Audits</strong>: we perform regular dependency scans and code reviews to identify and mitigate potential vulnerabilities.</li>
            <li><strong>Secure Development</strong>: Our engineering team follows secure coding practices based on OWASP guidelines.</li>
          </ul>

          <div className="mt-16 p-8 rounded-2xl bg-emerald-50 border border-emerald-800/15">
            <h3 className={`text-emerald-900 mt-0 ${serif.className}`}>Reporting a Vulnerability</h3>
            <p className="text-emerald-800 text-base mb-0">
              If you believe you've found a security vulnerability in FormIQ, please contact our security team at <a href="mailto:security@formiq.ke" className="font-semibold underline decoration-emerald-800/30 hover:decoration-emerald-800">security@formiq.ke</a>. We appreciate your help in keeping FormIQ secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

