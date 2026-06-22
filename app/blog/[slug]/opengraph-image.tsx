import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { getAllPostSlugs, getPostBySlug } from '@/src/lib/blog';

/**
 * Per-post 1200x630 Open Graph image. Renders the post title + tag + Buzzr
 * brand strip on the same midnight-canvas / emerald-glow gradient as the
 * homepage OG, so every share preview is recognizably Buzzr.
 */

export const alt = 'Buzzr, AI-native sports social media.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

const logoDataUrlPromise = readFile(
  join(process.cwd(), 'public', 'brand', 'buzzr-mark-transparent.png')
).then((buffer) => `data:image/png;base64,${buffer.toString('base64')}`);

export default async function BlogOpengraphImage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const logoSrc = await logoDataUrlPromise;

  const title = post?.title ?? 'Buzzr Blog';
  const tag = post?.tags[0] ?? 'Blog';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 88px',
          background:
            'radial-gradient(ellipse 60% 50% at 18% 18%, rgba(0, 230, 118, 0.22), transparent 60%),' +
            'radial-gradient(ellipse 60% 50% at 90% 88%, rgba(0, 230, 118, 0.14), transparent 60%),' +
            'linear-gradient(180deg, #0c0c0b 0%, #050507 100%)',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <img src={logoSrc} alt="" width={48} height={48} style={{ display: 'block' }} />
            <div
              style={{
                display: 'flex',
                fontSize: 28,
                fontWeight: 400,
                letterSpacing: '-0.025em'
              }}
            >
              buzzr<span style={{ color: '#00e676' }}>.</span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#7d8187',
              border: '1px solid #1f2228',
              padding: '8px 14px'
            }}
          >
            {tag}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: title.length > 80 ? 56 : title.length > 50 ? 68 : 80,
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: '#ffffff',
            maxWidth: 1024
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            color: '#7d8187',
            fontSize: 20,
            letterSpacing: '-0.025em'
          }}
        >
          <div style={{ display: 'flex' }}>AI-native sports social media.</div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontSize: 16
            }}
          >
            getbuzzr.online
          </div>
        </div>
      </div>
    ),
    size
  );
}
