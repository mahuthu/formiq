import Link from 'next/link';
import { DM_Mono, Playfair_Display } from 'next/font/google';
import { FileText } from 'lucide-react';
import { BLOG_POSTS, getPost } from '@/lib/blog';

const serif = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '600'] });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400'] });

const TAG_STYLES: Record<string, string> = {
  tax: 'bg-amber-50 text-amber-700',
  health: 'bg-emerald-50 text-emerald-800',
  data: 'bg-indigo-50 text-indigo-700',
};

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  return {
    title: post ? `${post.title} — FormIQ Blog` : 'Blog — FormIQ',
    description: post?.excerpt ?? 'FormIQ blog article.',
  };
}

function Callout({
  tone = 'default',
  title,
  text,
}: {
  tone?: 'default' | 'warn' | 'danger';
  title: string;
  text: string;
}) {
  const cls =
    tone === 'danger'
      ? 'border-red-600 bg-red-50'
      : tone === 'warn'
        ? 'border-amber-600 bg-amber-50'
        : 'border-emerald-800 bg-slate-50';
  const titleCls =
    tone === 'danger'
      ? 'text-red-700'
      : tone === 'warn'
        ? 'text-amber-700'
        : 'text-emerald-800';
  return (
    <div className={`my-7 rounded-r-xl border-l-4 p-5 ${cls}`}>
      <p className={`text-sm font-semibold ${titleCls}`}>{title}</p>
      <p className="mt-2 text-sm text-slate-700 leading-relaxed">{text}</p>
    </div>
  );
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) {
    return (
      <div className="min-h-screen bg-white text-slate-950">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <Link href="/blog" className="text-sm text-emerald-800 hover:text-slate-950">← Back to blog</Link>
          <h1 className="mt-6 text-2xl font-semibold">Article not found</h1>
        </div>
      </div>
    );
  }

  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

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
          </div>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-6 py-14">
        <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-950">
          ← Back to blog
        </Link>

        <header className="mt-8 pb-8 border-b border-slate-200">
          <span className={`${mono.className} inline-flex items-center rounded-full px-3 py-1 text-[10px] tracking-[0.1em] uppercase ${TAG_STYLES[post.tag]}`}>
            {post.tagLabel}
          </span>
          <h1 className={`${serif.className} mt-5 text-3xl sm:text-4xl font-medium leading-tight`}>
            {post.title}
          </h1>
          <div className="mt-4 text-sm text-slate-500 flex flex-wrap items-center gap-3">
            <span>{post.author}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{post.monthYear}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{post.readTime}</span>
          </div>
        </header>

        <p className="mt-8 text-lg font-light text-slate-600 leading-relaxed pb-8 border-b border-slate-100">
          {post.lede}
        </p>

        <div className="mt-8 text-[16px] leading-[1.85] text-slate-800">
          {post.body.map((b, idx) => {
            if (b.type === 'h2') {
              return <h2 key={idx} className={`${serif.className} mt-10 mb-4 text-2xl font-medium text-slate-950`}>{b.text}</h2>;
            }
            if (b.type === 'h3') {
              return <h3 key={idx} className="mt-8 mb-3 text-lg font-semibold text-slate-950">{b.text}</h3>;
            }
            if (b.type === 'p') {
              return <p key={idx} className="mb-5 text-slate-700" dangerouslySetInnerHTML={{ __html: b.text }} />;
            }
            if (b.type === 'ul') {
              return (
                <ul key={idx} className="mb-6 list-disc pl-5 space-y-2 text-slate-700">
                  {b.items.map((it, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: it }} />
                  ))}
                </ul>
              );
            }
            if (b.type === 'divider') {
              return <div key={idx} className="my-10 h-px bg-slate-200" />;
            }
            if (b.type === 'callout') {
              return <Callout key={idx} tone={b.tone} title={b.title} text={b.text} />;
            }
            if (b.type === 'cta') {
              return (
                <div key={idx} className="my-10 rounded-2xl bg-emerald-50 border border-emerald-800/15 p-8 text-center">
                  <h3 className={`${serif.className} text-xl font-medium text-slate-950`}>{b.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{b.text}</p>
                  <Link href={b.href} className="mt-6 inline-flex items-center justify-center rounded-lg bg-emerald-800 text-white px-6 py-3 text-sm font-semibold hover:bg-slate-950 transition-colors">
                    {b.label}
                  </Link>
                </div>
              );
            }
            return null;
          })}
        </div>
      </article>

      {/* More */}
      <section className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className={`${serif.className} text-2xl font-medium`}>More from FormIQ</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="block hover:opacity-90 transition-opacity">
                <span className={`${mono.className} inline-flex items-center rounded-full px-3 py-1 text-[10px] tracking-[0.1em] uppercase ${TAG_STYLES[p.tag]}`}>
                  {p.tagLabel}
                </span>
                <h3 className={`${serif.className} mt-3 text-lg font-medium text-slate-950 leading-snug`}>
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

