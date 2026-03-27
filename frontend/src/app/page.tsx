'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google';
import { FileText, Sparkles, ShieldCheck, PlugZap, Check, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog';

const serif = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600'] });
const sans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'] });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400'] });

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('formiq_token');
}

export default function LandingPage() {
  const router = useRouter();

  // If already authenticated, go straight to the product.
  useEffect(() => {
    if (getToken()) router.replace('/dashboard');
  }, [router]);

  return (
    <div className={`${sans.className} min-h-screen bg-white text-slate-950`}>
      {/* Nav */}
      <div className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className={`flex items-center gap-2.5 ${serif.className}`}>
            <img src="/icon.png" alt="FormIQ" className="w-8 h-8 rounded-md" />
            <span className="text-lg font-semibold">FormIQ</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-950">How it works</a>
            <a href="#use-cases" className="text-slate-600 hover:text-slate-950">Use cases</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-950">Pricing</a>
            <a href="#faq" className="text-slate-600 hover:text-slate-950">FAQ</a>
            <Link href="/login" className="text-slate-600 hover:text-slate-950">Sign in</Link>
            <Link
              href="/register"
              className="rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
            >
              Start free →
            </Link>
          </div>

          <div className="md:hidden">
            <Link
              href="/register"
              className="rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
            >
              Start free
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-14">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className={`${mono.className} inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-800" />
              AI-powered document digitization
            </div>

            <h1 className={`${serif.className} mt-6 text-4xl sm:text-5xl font-medium leading-[1.15]`}>
              Turn paper records into <span className="italic text-emerald-800">structured data</span>, instantly
            </h1>

            <p className="mt-5 text-base sm:text-[17px] font-light text-slate-600 leading-relaxed max-w-xl">
              Upload any document — invoice, lab result, KYC form, admission record — and FormIQ extracts structured fields in seconds.
              Printed or handwritten. No setup required.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 text-white px-6 py-3.5 text-sm font-semibold hover:bg-emerald-800 transition-colors"
              >
                Start free — 50 docs/month <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 text-sm text-slate-900 hover:gap-3 transition-all">
                See how it works <span aria-hidden>→</span>
              </a>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200">
              <p className={`${mono.className} text-[12px] tracking-[0.08em] uppercase text-slate-400 mb-4`}>
                Built for East Africa
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                {['Works with handwriting', 'English & Swahili', 'CSV / API export', 'No setup required'].map((t) => (
                  <span key={t} className="inline-flex items-center gap-2">
                    <span className="text-emerald-800 text-xs font-bold">✓</span> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-[0_2px_0_0_#e2e8f0,0_20px_60px_rgba(2,6,23,0.08)]">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-200" />
                </span>
                <span className={`${mono.className} text-[11px] text-slate-400 ml-2`}>formiq.ke — document review</span>
              </div>
              <div className="grid grid-cols-2">
                <div className="bg-slate-50 border-r border-slate-200 p-4">
                  <p className={`${mono.className} text-[10px] tracking-[0.1em] uppercase text-slate-400`}>Original document</p>
                  <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
                    <p className="text-sm font-semibold text-slate-900 mb-3">KNH Patient Lab Result</p>
                    <div className="space-y-2">
                      <div className="h-2 rounded bg-slate-200" />
                      <div className="h-2 rounded bg-slate-200 w-5/6" />
                      <div className="h-2 rounded bg-slate-200 w-3/5" />
                      <div className="h-2 rounded bg-slate-200" />
                      <div className="h-2 rounded bg-emerald-50 w-2/3" />
                      <div className="h-2 rounded bg-slate-200 w-5/6" />
                      <div className="h-2 rounded bg-slate-200 w-3/5" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <p className={`${mono.className} text-[10px] tracking-[0.1em] uppercase text-slate-400`}>Extracted data</p>
                  <div className="mt-3 space-y-2">
                    {[
                      ['Patient name', 'J. Kamau', 'high'],
                      ['Test date', '2025-03-12', 'high'],
                      ['Test name', 'CBC panel', 'high'],
                      ['Result', '12.4 g/dL', 'high'],
                      ['Ref range', '11.5–16.5', 'med'],
                      ['Physician', 'Dr. Otieno', 'high'],
                    ].map(([k, v, c]) => (
                      <div key={k} className="flex items-center justify-between border-b border-slate-100 py-2 last:border-0">
                        <span className="text-xs text-slate-400">{k}</span>
                        <span className={`${mono.className} text-xs text-slate-900 font-medium`}>
                          {v}
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] ${c === 'high' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-700'}`}>
                            {c}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200">
                    <div className={`${mono.className} text-[10px] text-slate-400 flex justify-between mb-2`}>
                      <span>Confidence</span>
                      <span>91%</span>
                    </div>
                    <div className="h-1 rounded bg-slate-100 overflow-hidden">
                      <div className="h-full w-[91%] bg-emerald-800 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos strip */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-7 flex flex-wrap items-center gap-3">
          <span className={`${mono.className} text-xs tracking-[0.1em] uppercase text-slate-400 mr-2`}>Designed for</span>
          {['County Hospitals', 'Private Clinics', 'SACCOs', 'Microfinance Banks', 'Government Offices', 'Schools & Universities', 'NGOs', 'SMEs'].map((x) => (
            <span key={x} className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
              {x}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
        <p className={`${mono.className} text-[11px] tracking-[0.12em] uppercase text-emerald-800`}>How it works</p>
        <h2 className={`${serif.className} mt-4 text-3xl sm:text-4xl font-medium leading-tight`}>
          Three steps from paper<br className="hidden sm:block" /> to structured data
        </h2>
        <p className="mt-4 text-[17px] font-light text-slate-600 max-w-xl">
          No training. No templates to configure. Works on day one with any document type.
        </p>

        <div className="mt-12 grid md:grid-cols-3 gap-px border border-slate-200 rounded-2xl overflow-hidden">
          {[
            {
              num: '01',
              title: 'Upload',
              icon: <Sparkles className="w-5 h-5 text-emerald-800" />,
              desc: 'Drag and drop any document — JPG, PNG, or PDF. Batch upload up to 20 files at once. Works with phone photos.',
            },
            {
              num: '02',
              title: 'Extract',
              icon: <PlugZap className="w-5 h-5 text-emerald-800" />,
              desc: 'AI reads printed or handwritten text and pulls fields you need. Confidence scoring highlights what to verify.',
            },
            {
              num: '03',
              title: 'Review & export',
              icon: <ShieldCheck className="w-5 h-5 text-emerald-800" />,
              desc: 'Review side-by-side, edit inline, approve, then export CSV/XLSX/JSON or push to your system via API/webhooks.',
            },
          ].map((s) => (
            <div key={s.num} className="bg-white p-8 hover:bg-slate-50 transition-colors">
              <p className={`${mono.className} text-xs text-slate-400`}>{s.num}</p>
              <div className="flex items-center gap-2.5">
                <img src="/icon.png" alt="FormIQ" className="w-8 h-8 rounded-lg shrink-0" />
                <div>
                  <h3 className={`${serif.className} mt-5 text-xl font-medium text-slate-950`}>{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className={`${mono.className} text-[11px] tracking-[0.12em] uppercase text-emerald-800`}>Use cases</p>
          <h2 className={`${serif.className} mt-4 text-3xl sm:text-4xl font-medium leading-tight`}>
            Built for the institutions<br className="hidden sm:block" /> that run on paper
          </h2>
          <p className="mt-4 text-[17px] font-light text-slate-600 max-w-2xl">
            Every sector has its own document types. FormIQ ships with pre-built templates — and lets you create custom ones for anything else.
          </p>

          <div className="mt-12 grid lg:grid-cols-3 gap-4">
            {[
              {
                icon: '🏥',
                title: 'Hospitals & clinics',
                desc: 'Eliminate manual keying of lab results, OPD forms, and referral letters. Reduce transcription errors and make records searchable.',
                tags: ['Lab results', 'OPD forms', 'Referral letters', 'Discharge summaries'],
              },
              {
                icon: '🏦',
                title: 'SACCOs & MFIs',
                desc: 'Automate KYC and onboarding. Extract loan application data instantly and keep auditable digital records.',
                tags: ['KYC / ID docs', 'Loan applications', 'Member forms', 'Payslips'],
              },
              {
                icon: '🏛️',
                title: 'Government offices',
                desc: 'Clear backlogs for citizen applications, permits, and registrations. Build searchable archives and reduce processing time.',
                tags: ['Permits', 'Applications', 'Registration forms', 'Certificates'],
              },
            ].map((u) => (
              <div key={u.title} className="bg-white border border-slate-200 rounded-2xl p-7 hover:border-emerald-800/40 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-lg">{u.icon}</div>
                <h3 className={`${serif.className} mt-4 text-lg font-medium text-slate-950`}>{u.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{u.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {u.tags.map((t) => (
                    <span key={t} className={`${mono.className} text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-md`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px border border-slate-200 rounded-2xl overflow-hidden bg-slate-200">
          {[
            { big: <>8<span className="text-emerald-800">s</span></>, small: 'Average extraction time per document' },
            { big: <>91<span className="text-emerald-800">%</span></>, small: 'Average field confidence score' },
            { big: <>8<span className="text-emerald-800">×</span></>, small: 'Faster than manual data entry' },
            { big: <>0</>, small: 'Templates needed to get started' },
          ].map((s) => (
            <div key={String(s.small)} className="bg-white p-8 text-center">
              <div className={`${serif.className} text-4xl sm:text-5xl font-medium leading-none text-slate-950`}>
                {s.big}
              </div>
              <p className="mt-3 text-sm text-slate-500">{s.small}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
        <p className={`${mono.className} text-[11px] tracking-[0.12em] uppercase text-emerald-800`}>Pricing</p>
        <h2 className={`${serif.className} mt-4 text-3xl sm:text-4xl font-medium leading-tight`}>Simple, usage-based pricing</h2>
        <p className="mt-4 text-[17px] font-light text-slate-600 max-w-2xl">
          Start free. Scale as your team grows. No hidden fees, no per-seat charges for viewer roles.
        </p>

        <div className="mt-12 grid lg:grid-cols-4 gap-4 items-start">
          {[
            {
              name: 'Free',
              price: '$0',
              period: 'forever',
              featured: false,
              cta: { href: '/register', label: 'Get started →', solid: false },
              features: ['50 documents / month', '2 team members', 'System templates', 'CSV export', 'Community support'],
            },
            {
              name: 'Starter',
              price: '$29',
              period: 'per month',
              featured: true,
              badge: 'Most popular',
              cta: { href: '/register', label: 'Start free trial →', solid: true },
              features: ['500 documents / month', '5 team members', 'Custom templates', 'CSV + JSON export', 'REST API access', 'Webhook support', 'Email support'],
            },
            {
              name: 'Professional',
              price: '$99',
              period: 'per month',
              featured: false,
              cta: { href: '/register', label: 'Start free trial →', solid: false },
              features: ['5,000 documents / month', '20 team members', 'Custom templates', 'Full API access', 'Webhooks', 'Priority support', 'Usage analytics'],
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              period: 'contact us',
              featured: false,
              cta: { href: '/contact', label: 'Talk to us →', solid: false },
              features: ['Unlimited documents', 'Unlimited users', 'On-premise option', 'SLA guarantee', 'Dedicated support', 'HMIS / ERP integration', 'Custom training'],
            },
          ].map((p) => (
            <div key={p.name} className={`relative bg-white border rounded-2xl p-7 transition-shadow ${p.featured ? 'border-emerald-800 shadow-[0_4px_24px_rgba(5,150,105,0.12)]' : 'border-slate-200 hover:shadow-sm'}`}>
              {p.featured && (
                <div className={`${mono.className} absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-800 text-white text-[11px] px-3 py-1 rounded-full tracking-wide`}>
                  {p.badge}
                </div>
              )}
              <p className={`${mono.className} text-[11px] tracking-[0.1em] uppercase text-slate-400`}>{p.name}</p>
              <div className={`${serif.className} mt-3 text-4xl font-medium text-slate-950`}>
                {p.price === 'Custom' ? <span className="text-2xl">Custom</span> : p.price}
              </div>
              <p className="text-xs text-slate-400 mt-1">{p.period}</p>
              <div className="h-px bg-slate-200 my-5" />
              <ul className="space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-800 mt-0.5"><Check className="w-4 h-4" /></span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={p.cta.href}
                className={`mt-6 block text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${p.cta.solid
                    ? 'bg-emerald-800 text-white hover:bg-slate-950'
                    : 'border border-slate-200 text-slate-950 hover:border-slate-950'
                  }`}
              >
                {p.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-slate-950 text-white py-16 border-y border-white/10">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className={`${serif.className} text-7xl leading-[0.6] text-emerald-800`}>“</div>
          <p className={`${serif.className} mt-6 text-xl sm:text-2xl font-normal leading-relaxed text-white`}>
            We process over 400 lab result forms every week. FormIQ cut our data entry time from 3 hours a day to under 20 minutes.
            The accuracy on handwritten forms genuinely surprised us.
          </p>
          <div className="mt-8 text-sm text-slate-400 flex items-center justify-center gap-3 flex-wrap">
            <span>Head of IT</span>
            <span className="w-1 h-1 rounded-full bg-emerald-800" />
            <span>St Francis Hospital, Nairobi, Kenya</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <div className="text-center mb-10">
          <p className={`${mono.className} inline-block text-[11px] tracking-[0.12em] uppercase text-emerald-800`}>FAQ</p>
          <h2 className={`${serif.className} mt-4 text-3xl sm:text-4xl font-medium`}>Common questions</h2>
        </div>
        <div className="divide-y divide-slate-200 border-t border-slate-200">
          {[
            {
              q: 'Does it work with handwritten documents?',
              a: 'Yes. FormIQ is optimized for handwriting and low-quality scans. Each field includes a confidence signal so reviewers know what to verify.',
            },
            {
              q: 'What languages are supported?',
              a: 'English and Swahili are supported today. If you need additional languages, contact us and we’ll align on your rollout requirements.',
            },
            {
              q: 'How does it integrate with our existing system?',
              a: 'Export CSV/XLSX/JSON, use the REST API, or configure a webhook so FormIQ automatically POSTs extracted data to your systems.',
            },
            {
              q: 'Is our data secure?',
              a: 'Yes. Data is encrypted in transit and at rest, with org-level isolation and least-privilege access controls. Signed URLs are time-limited.',
            },
            {
              q: 'Is there an on-premise option?',
              a: 'Yes — available on Enterprise. We can deploy FormIQ in your infrastructure using Docker for stricter data residency requirements.',
            },
          ].map((item) => (
            <details key={item.q} className="py-5 group">
              <summary className={`${serif.className} cursor-pointer text-lg font-medium text-slate-950 flex items-center justify-between`}>
                {item.q}
                <span className={`${mono.className} text-emerald-800 text-xl group-open:rotate-45 transition-transform`}>+</span>
              </summary>
              <p className="mt-3 text-[15px] text-slate-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Blog section */}
      <section className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
            <div>
              <p className={`${mono.className} text-[11px] tracking-[0.12em] uppercase text-emerald-800`}>From the blog</p>
              <h2 className={`${serif.className} mt-4 text-3xl sm:text-4xl font-medium leading-tight`}>
                Why Africa and particularly Kenya wants<br className="hidden sm:block" /> every business to go digital
              </h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-emerald-800 hover:text-slate-950 whitespace-nowrap">
              All articles →
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {BLOG_POSTS.slice(0, 3).map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="block border-b border-slate-200 pb-6 hover:opacity-90 transition-opacity"
              >
                <span className={`${mono.className} inline-flex rounded-full px-3 py-1 text-[10px] tracking-[0.1em] uppercase ${p.tag === 'tax'
                    ? 'bg-amber-50 text-amber-700'
                    : p.tag === 'health'
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}>
                  {p.tagLabel}
                </span>
                <h3 className={`${serif.className} mt-4 text-xl font-medium leading-snug text-slate-950`}>
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {p.excerpt}
                </p>
                <span className="mt-4 inline-flex text-sm font-semibold text-emerald-800">Read article →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl bg-emerald-50 border border-emerald-800/15 p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className={`${serif.className} text-2xl sm:text-3xl font-medium text-slate-950`}>Ready to eliminate paper data entry?</h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl">
              Start with 50 free documents per month. No credit card required. Your team can be processing documents in under 10 minutes.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-2">
            <Link href="/register" className="inline-flex items-center gap-2 rounded-lg bg-slate-950 text-white px-7 py-3.5 text-sm font-semibold hover:bg-emerald-800 transition-colors whitespace-nowrap">
              Start for free → <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-950">
              Or contact us for a demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className={`flex items-center gap-2.5 ${serif.className}`}>
                <img src="/icon.png" alt="FormIQ" className="w-8 h-8 rounded-md" />
                <span className="text-lg font-semibold">FormIQ</span>
              </div>
              <p className="mt-3 text-sm text-slate-400 max-w-md">
                A universal document digitization platform for all businesses.
              </p>
            </div>
            <div>
              <p className={`${mono.className} text-[10px] tracking-[0.12em] uppercase text-slate-400 mb-4`}>Product</p>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#how-it-works" className="block text-slate-400 hover:text-white">How it works</a>
                <a href="#use-cases" className="block text-slate-400 hover:text-white">Use cases</a>
                <a href="#pricing" className="block text-slate-400 hover:text-white">Pricing</a>
                <Link href="/docs" className="block text-slate-400 hover:text-white">API docs</Link>
              </div>
            </div>
            <div>
              <p className={`${mono.className} text-[10px] tracking-[0.12em] uppercase text-slate-400 mb-4`}>Company</p>
              <div className="flex flex-col gap-2 text-sm">

                <Link href="/blog" className="block text-slate-400 hover:text-white">Blog</Link>
                <Link href="/contact" className="block text-slate-400 hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <p className={`${mono.className} text-[10px] tracking-[0.12em] uppercase text-slate-400 mb-4`}>Legal</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/privacy" className="block text-slate-400 hover:text-white">Privacy policy</Link>
                <Link href="/terms" className="block text-slate-400 hover:text-white">Terms of service</Link>
                <Link href="/security" className="block text-slate-400 hover:text-white">Security</Link>
                <Link href="/dpa" className="block text-slate-400 hover:text-white">Data processing agreement</Link>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} FormIQ. Built in Nairobi, Kenya.</p>
            <div className="flex gap-5 text-xs items-center">
              {/* <Link href="/privacy" className="text-slate-500 hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-slate-500 hover:text-white">Terms</Link> */}
              <a href="mailto:hello@formiq.ke" className="text-slate-500 hover:text-white">hello@formiq.ke</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

