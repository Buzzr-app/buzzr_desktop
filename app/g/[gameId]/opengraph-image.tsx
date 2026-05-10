import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import {
  classifyGameStatus,
  fetchGame,
  formatGameDate,
} from '@/src/lib/share';

export const alt = 'Buzzr — rate this matchup by entertainment.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const logoDataUrlPromise = readFile(
  join(process.cwd(), 'public', 'brand', 'buzzr-mark-transparent.png')
).then((buffer) => `data:image/png;base64,${buffer.toString('base64')}`);

type Props = { params: { gameId: string } };

export default async function GameOpengraphImage({ params }: Props) {
  const logoSrc = await logoDataUrlPromise;
  const game = await fetchGame(params.gameId);

  const away = game?.away_team ?? 'Away';
  const home = game?.home_team ?? 'Home';
  const league = game?.league ?? null;
  const kind = classifyGameStatus(game?.status);
  const showScore =
    kind === 'final' && game?.home_score != null && game?.away_score != null;
  const statusLabel =
    kind === 'live'
      ? 'LIVE'
      : kind === 'final'
        ? 'FINAL'
        : formatGameDate(game?.starts_at);

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <img src={logoSrc} alt="" width={64} height={64} style={{ objectFit: 'contain' }} />
            <div style={{ display: 'flex', fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>
              buzzr<span style={{ color: '#00e676' }}>.</span>
            </div>
          </div>
          {league ? (
            <div
              style={{
                display: 'flex',
                padding: '10px 18px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.16)',
                background: 'rgba(255,255,255,0.04)',
                fontSize: 18,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#b8c6d0',
              }}
            >
              {league}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 300,
              letterSpacing: '-0.04em',
              lineHeight: 1.02,
              color: '#ffffff',
            }}
          >
            {away}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 28,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#00e676',
            }}
          >
            @
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 96,
              fontWeight: 300,
              letterSpacing: '-0.04em',
              lineHeight: 1.02,
              color: '#ffffff',
            }}
          >
            {home}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 20px',
              borderRadius: 999,
              border:
                kind === 'live'
                  ? '1px solid rgba(255, 80, 80, 0.6)'
                  : '1px solid rgba(0, 230, 118, 0.4)',
              color: kind === 'live' ? '#ff6b6b' : '#00e676',
              fontSize: 20,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {kind === 'live' ? <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 999, background: '#ff6b6b' }} /> : null}
            {statusLabel}
          </div>

          {showScore ? (
            <div style={{ display: 'flex', fontSize: 64, fontWeight: 500, letterSpacing: '-0.03em', color: '#ffffff' }}>
              {game!.away_score}
              <span style={{ color: '#3a3f48', margin: '0 18px' }}>–</span>
              {game!.home_score}
            </div>
          ) : (
            <div style={{ display: 'flex', fontSize: 20, color: '#8391a0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Rate the game
            </div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
