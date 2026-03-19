import Link from 'next/link';
import { DM_Mono, Playfair_Display } from 'next/font/google';
import { FileText } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog';

export const metadata = {
  title: 'FormIQ Blog — Insights on digitization in East Africa',
  description: 'Insights and analysis on digitization, compliance, and structured data in East Africa.',
};

const serif = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600'] });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400'] });

const TAG_STYLES: Record<string, string> = {
  tax: 'bg-amber-50 text-amber-700',
  health: 'bg-emerald-50 text-emerald-800',
  data: 'bg-indigo-50 text-indigo-700',
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      {/* Nav */}
      <div className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className={`flex items-center gap-2.5 ${serif.className}`}>
            <span className="w-8 h-8 rounded-md bg-emerald-800 text-white inline-flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-lg font-semibold">FormIQ</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-600">
            <Link href="/" className="text-slate-600 hover:text-slate-950">Product</Link>
            <Link href="/#pricing" className="text-slate-600 hover:text-slate-950">Pricing</Link>
            <Link href="/blog" className="text-slate-600 hover:text-slate-950">Blog</Link>
            <Link href="/contact" className="text-slate-600 hover:text-slate-950">Contact</Link>
            <Link href="/login" className="text-slate-600 hover:text-slate-950">Sign in</Link>
            <Link
              href="/register"
              className="rounded-md bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition-colors"
            >
              Start free →
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10 border-b border-slate-200">
        <p className={`${mono.className} text-[11px] tracking-[0.12em] uppercase text-emerald-800`}>FormIQ Insights</p>
        <h1 className={`${serif.className} mt-4 text-4xl sm:text-5xl font-medium leading-[1.15]`}>
          Insights on digitization<br className="hidden sm:block" /> in East Africa
        </h1>
        <p className="mt-4 text-[17px] font-light text-slate-600 max-w-2xl leading-relaxed">
          Analysis of regulatory shifts and the operational reality — eTIMS, digital health, and structured records —
          that are making paper-based operations a liability.
        </p>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <div key={post.slug} className="border-b border-slate-200 pb-8">
            <Link href={`/blog/${post.slug}`} className="block group">
              <span className={`${mono.className} inline-flex items-center rounded-full px-3 py-1 text-[10px] tracking-[0.1em] uppercase ${TAG_STYLES[post.tag]}`}>
                {post.tagLabel}
              </span>
              <h2 className={`${serif.className} mt-4 text-xl font-medium leading-snug text-slate-950 group-hover:opacity-90`}>
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-4 text-xs text-slate-500 flex items-center gap-3">
                <span>{post.monthYear}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span>{post.readTime}</span>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-800 group-hover:gap-2 transition-all">
                Read article <span aria-hidden>→</span>
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-white border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} FormIQ. Built in Nairobi, Kenya.</p>
          <div className="flex gap-5 text-xs">
            <Link href="/privacy" className="text-slate-500 hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-slate-500 hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

