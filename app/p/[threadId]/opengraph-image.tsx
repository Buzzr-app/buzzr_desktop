import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  avatarPublicUrl,
  fetchThreadWithAuthor,
  isThreadPublic,
  truncate,
} from '@/src/lib/share';

export const alt = 'A take on Buzzr.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const logoDataUrlPromise = readFile(
  join(process.cwd(), 'public', 'brand', 'buzzr-mark-transparent.png')
).then((buffer) => `data:image/png;base64,${buffer.toString('base64')}`);

type Props = { params: { threadId: string } };

export default async function ThreadOpengraphImage({ params }: Props) {
  const logoSrc = await logoDataUrlPromise;
  const result = await fetchThreadWithAuthor(params.threadId);
  const valid = result && isThreadPublic(result.thread);
  const author = valid ? result.author : null;
  const body = valid && result.thread.body ? truncate(result.thread.body, 220) : null;
  const handle = author?.user_tag ?? author?.username ?? null;
  const displayName = author?.username ?? (handle ? `@${handle}` : 'Buzzr take');
  const avatarUrl = avatarPublicUrl(author?.avatar_image_path ?? null);
  const profileEmoji = author?.profile_icon ?? null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 80px',
          background:
            'radial-gradient(ellipse 70% 60% at 18% 20%, rgba(0, 230, 118, 0.28), transparent 60%),' +
            'radial-gradient(ellipse 60% 50% at 88% 82%, rgba(0, 230, 118, 0.18), transparent 60%),' +
            'linear-gradient(180deg, #0a0a0c 0%, #050507 100%)',
          color: '#f5fbff',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src={logoSrc} alt="" width={56} height={56} style={{ objectFit: 'contain' }} />
          <div style={{ display: 'flex', fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>
            buzzr<span style={{ color: '#00e676' }}>.</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt=""
                width={96}
                height={96}
                style={{ width: 96, height: 96, borderRadius: 999, objectFit: 'cover', border: '2px solid rgba(0, 230, 118, 0.4)' }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 96,
                  height: 96,
                  borderRadius: 999,
                  background: 'rgba(0, 230, 118, 0.12)',
                  border: '2px solid rgba(0, 230, 118, 0.4)',
                  fontSize: 52,
                }}
              >
                {profileEmoji ?? '👤'}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', fontSize: 36, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.02em' }}>
                {displayName}
              </div>
              {handle && author?.username ? (
                <div style={{ display: 'flex', fontSize: 22, color: '#8391a0' }}>@{handle}</div>
              ) : null}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 44,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              lineHeight: 1.18,
              color: '#ffffff',
              maxWidth: 1040,
            }}
          >
            {body ? `“${body}”` : 'Open this take on Buzzr.'}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 18px',
            borderRadius: 999,
            border: '1px solid rgba(0, 230, 118, 0.4)',
            color: '#00e676',
            fontSize: 18,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            alignSelf: 'flex-start',
          }}
        >
          Rate the game
        </div>
      </div>
    ),
    { ...size }
  );
}
