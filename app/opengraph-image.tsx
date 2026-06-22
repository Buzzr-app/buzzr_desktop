import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Auto-generated 1200x630 Open Graph image for `/`.
 * Uses the stored transparent brand mark so social previews match the app.
 */

export const alt = 'Buzzr, AI-native sports social media.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const logoDataUrlPromise = readFile(
  join(process.cwd(), 'public', 'brand', 'buzzr-mark-transparent.png')
).then((buffer) => `data:image/png;base64,${buffer.toString('base64')}`);

export default async function OpengraphImage() {
  const logoSrc = await logoDataUrlPromise;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 88px',
          background:
            'radial-gradient(ellipse 70% 60% at 18% 20%, rgba(0, 230, 118, 0.28), transparent 60%),' +
            'radial-gradient(ellipse 60% 50% at 88% 82%, rgba(0, 230, 118, 0.18), transparent 60%),' +
            'linear-gradient(180deg, #0a0a0c 0%, #050507 100%)',
          color: '#f5fbff',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Helvetica, Arial, sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <img
            src={logoSrc}
            alt=""
            width={92}
            height={92}
            style={{
              objectFit: 'contain'
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', fontSize: 34, fontWeight: 600, letterSpacing: '-0.03em' }}>
              buzzr<span style={{ color: '#00e676' }}>.</span>
            </div>
            <div style={{ display: 'flex', fontSize: 18, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#b8c6d0' }}>
              AI-native sports social
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 128,
              fontWeight: 300,
              letterSpacing: '-0.05em',
              lineHeight: 1,
              color: '#ffffff'
            }}
          >
            Scroll<span style={{ color: '#00e676' }}>.</span> Rate<span style={{ color: '#00e676' }}>.</span> Chat<span style={{ color: '#00e676' }}>.</span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 32,
              fontWeight: 300,
              letterSpacing: '-0.01em',
              color: '#b8c6d0',
              maxWidth: 880
            }}
          >
            The AI-native sports app for Scroll, dashboards, friends, leagues, and Buzzr Bets.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 20,
            fontWeight: 400,
            color: '#8391a0'
          }}
        >
          <div style={{ display: 'flex', letterSpacing: '0.08em' }}>
            NBA · NFL · EPL · NCAAM · F1 · MLS · ESPORTS
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
              letterSpacing: '0.04em'
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
