import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'Join Buzzr with this invite code.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CODE_PATTERN = /^[A-Za-z0-9]{4,16}$/;

const logoDataUrlPromise = readFile(
  join(process.cwd(), 'public', 'brand', 'buzzr-mark-transparent.png')
).then((buffer) => `data:image/png;base64,${buffer.toString('base64')}`);

type Props = { params: { code: string } };

export default async function ReferralOpengraphImage({ params }: Props) {
  const logoSrc = await logoDataUrlPromise;
  const trimmed = (params.code ?? '').trim();
  const code = CODE_PATTERN.test(trimmed) ? trimmed.toUpperCase() : 'BUZZR';

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
            'radial-gradient(ellipse 70% 60% at 18% 20%, rgba(0, 230, 118, 0.3), transparent 60%),' +
            'radial-gradient(ellipse 60% 50% at 88% 82%, rgba(0, 230, 118, 0.18), transparent 60%),' +
            'linear-gradient(180deg, #0a0a0c 0%, #050507 100%)',
          color: '#f5fbff',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <img src={logoSrc} alt="" width={64} height={64} style={{ objectFit: 'contain' }} />
          <div style={{ display: 'flex', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
            buzzr<span style={{ color: '#00e676' }}>.</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', fontSize: 28, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#00e676' }}>
            You&apos;re invited
          </div>
          <div style={{ display: 'flex', fontSize: 80, fontWeight: 300, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1 }}>
            Join Buzzr<span style={{ color: '#00e676' }}>.</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-start',
              padding: '24px 40px',
              borderRadius: 24,
              border: '2px solid rgba(0, 230, 118, 0.5)',
              background: 'rgba(0, 230, 118, 0.06)',
              fontSize: 96,
              fontWeight: 600,
              letterSpacing: '0.32em',
              color: '#ffffff',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          >
            {code}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 20,
            color: '#8391a0',
          }}
        >
          <div style={{ display: 'flex', letterSpacing: '0.08em' }}>
            Rate sports games by entertainment.
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 18px',
              borderRadius: 999,
              border: '1px solid rgba(0, 230, 118, 0.4)',
              color: '#00e676',
              fontSize: 18,
              letterSpacing: '0.08em',
            }}
          >
            Free on iOS
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
