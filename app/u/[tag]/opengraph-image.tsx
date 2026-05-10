import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  avatarPublicUrl,
  fetchProfileByTag,
  truncate,
} from '@/src/lib/share';

export const alt = 'A Buzzr profile.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const logoDataUrlPromise = readFile(
  join(process.cwd(), 'public', 'brand', 'buzzr-mark-transparent.png')
).then((buffer) => `data:image/png;base64,${buffer.toString('base64')}`);

type Props = { params: { tag: string } };

export default async function ProfileOpengraphImage({ params }: Props) {
  const logoSrc = await logoDataUrlPromise;
  const cleanTag = params.tag.replace(/^@/, '');
  const profile = await fetchProfileByTag(cleanTag);

  const handle = profile?.user_tag ?? cleanTag;
  const displayName = profile?.username ?? `@${handle}`;
  const headline = profile?.headline ? truncate(profile.headline, 140) : null;
  const avatarUrl = avatarPublicUrl(profile?.avatar_image_path ?? null);
  const profileEmoji = profile?.profile_icon ?? null;

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              width={196}
              height={196}
              style={{ width: 196, height: 196, borderRadius: 999, objectFit: 'cover', border: '3px solid rgba(0, 230, 118, 0.5)' }}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 196,
                height: 196,
                borderRadius: 999,
                background: 'rgba(0, 230, 118, 0.12)',
                border: '3px solid rgba(0, 230, 118, 0.5)',
                fontSize: 110,
              }}
            >
              {profileEmoji ?? '👤'}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', fontSize: 64, fontWeight: 600, color: '#ffffff', letterSpacing: '-0.03em' }}>
              {displayName}
            </div>
            <div style={{ display: 'flex', fontSize: 32, color: '#8391a0' }}>@{handle}</div>
            {headline ? (
              <div
                style={{
                  display: 'flex',
                  marginTop: 12,
                  fontSize: 28,
                  color: '#cfd8e0',
                  letterSpacing: '-0.01em',
                  maxWidth: 720,
                  lineHeight: 1.3,
                }}
              >
                {headline}
              </div>
            ) : null}
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
          Follow on Buzzr
        </div>
      </div>
    ),
    { ...size }
  );
}
