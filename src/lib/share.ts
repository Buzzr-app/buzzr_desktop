import { getSupabaseServerClient } from '@/src/lib/supabase/server';

export const SHARE_BASE_URL =
  process.env.NEXT_PUBLIC_SHARE_BASE_URL ?? 'https://www.getbuzzr.online';

const PROFILE_ICONS_BUCKET = 'profile-icons';

const ATTRIBUTION_PARAMS = ['ref', 'source'] as const;

export type ShareSearchParams = Record<string, string | string[] | undefined>;

export function pickAttribution(searchParams: ShareSearchParams | undefined): URLSearchParams {
  const out = new URLSearchParams();
  if (!searchParams) return out;
  for (const key of ATTRIBUTION_PARAMS) {
    const value = searchParams[key];
    if (typeof value === 'string' && value.length > 0) out.set(key, value);
  }
  return out;
}

export function appendParams(base: string, params: URLSearchParams): string {
  const qs = params.toString();
  if (!qs) return base;
  return base.includes('?') ? `${base}&${qs}` : `${base}?${qs}`;
}

export function avatarPublicUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  const supabase = getSupabaseServerClient();
  const { data } = supabase.storage.from(PROFILE_ICONS_BUCKET).getPublicUrl(path);
  return data?.publicUrl ?? null;
}

export function truncate(text: string, max: number): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1).trimEnd()}…`;
}

export function formatGameDate(starts_at: string | null | undefined): string {
  if (!starts_at) return 'Upcoming';
  const date = new Date(starts_at);
  if (Number.isNaN(date.getTime())) return 'Upcoming';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

export type GameRecord = {
  id: string;
  league: string | null;
  home_team: string | null;
  away_team: string | null;
  starts_at: string | null;
  status: string | null;
  home_score: number | null;
  away_score: number | null;
};

export async function fetchGame(gameId: string): Promise<GameRecord | null> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('games')
      .select('id, league, home_team, away_team, starts_at, status, home_score, away_score')
      .eq('id', gameId)
      .maybeSingle();
    if (error) return null;
    return (data as GameRecord | null) ?? null;
  } catch {
    return null;
  }
}

export type GameStatusKind = 'final' | 'live' | 'upcoming';

export function classifyGameStatus(status: string | null | undefined): GameStatusKind {
  const s = (status ?? '').toLowerCase();
  if (s === 'final' || s === 'completed' || s === 'closed' || s === 'ft') return 'final';
  if (s === 'live' || s === 'in_progress' || s === 'inprogress' || s === 'in-play' || s === 'live_now') return 'live';
  return 'upcoming';
}

export function gameDescription(game: GameRecord): string {
  const kind = classifyGameStatus(game.status);
  if (kind === 'final' && game.home_score != null && game.away_score != null) {
    if (game.home_score === game.away_score) return `Final · Draw ${game.home_score}–${game.away_score}.`;
    const winner =
      game.home_score > game.away_score ? game.home_team : game.away_team;
    return `Final · ${winner ?? 'Result in'} won ${Math.max(game.home_score, game.away_score)}–${Math.min(game.home_score, game.away_score)}.`;
  }
  if (kind === 'live') return 'LIVE on Buzzr — rate it now.';
  return formatGameDate(game.starts_at);
}

export function gameTitle(game: GameRecord): string {
  const away = game.away_team ?? 'Away';
  const home = game.home_team ?? 'Home';
  const league = game.league ? ` (${game.league})` : '';
  return `${away} @ ${home}${league} · Buzzr`;
}

export type ThreadRecord = {
  id: string;
  body: string | null;
  visibility: string | null;
  moderation_state: string | null;
  author_id: string | null;
};

export type ProfileRecord = {
  id: string;
  username: string | null;
  user_tag: string | null;
  headline: string | null;
  avatar_image_path: string | null;
  profile_icon: string | null;
};

const HIDDEN_MODERATION_STATES = new Set(['hidden', 'removed', 'flagged_removed']);

export function isThreadPublic(thread: ThreadRecord): boolean {
  if ((thread.visibility ?? '').toLowerCase() !== 'public') return false;
  const mod = (thread.moderation_state ?? '').toLowerCase();
  if (HIDDEN_MODERATION_STATES.has(mod)) return false;
  return true;
}

export async function fetchThreadWithAuthor(threadId: string): Promise<
  { thread: ThreadRecord; author: ProfileRecord | null } | null
> {
  try {
    const supabase = getSupabaseServerClient();
    const { data: thread, error } = await supabase
      .from('feed_threads')
      .select('id, body, visibility, moderation_state, author_id')
      .eq('id', threadId)
      .maybeSingle();
    if (error || !thread) return null;
    const t = thread as ThreadRecord;
    if (!t.author_id) return { thread: t, author: null };
    const { data: author } = await supabase
      .from('profiles')
      .select('id, username, user_tag, headline, avatar_image_path, profile_icon')
      .eq('id', t.author_id)
      .maybeSingle();
    return { thread: t, author: (author as ProfileRecord | null) ?? null };
  } catch {
    return null;
  }
}

export async function fetchProfileByTag(tag: string): Promise<ProfileRecord | null> {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, user_tag, headline, avatar_image_path, profile_icon')
      .eq('user_tag', tag)
      .maybeSingle();
    if (error) return null;
    return (data as ProfileRecord | null) ?? null;
  } catch {
    return null;
  }
}
