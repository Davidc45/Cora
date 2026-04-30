import { buildPublicR2Url, isPresignedUrl } from '@/lib/presigned-url';

const HARDCODED_DEFAULT_AVATAR_URL =
  'https://pub-2cb33e70d73b4e729e9246e178904e40.r2.dev/default-pfp.png';

export const DEFAULT_AVATAR_URL =
  buildPublicR2Url(process.env.NEXT_PUBLIC_R2_PUBLIC_AVATAR_URL, 'default-pfp.png') ??
  HARDCODED_DEFAULT_AVATAR_URL;

export function normalizeAvatarUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const t = value.trim();
  if (!t || t === 'null' || t === 'undefined') return null;
  if (t === '/assets/user.png') return DEFAULT_AVATAR_URL;
  return t;
}

function extractAvatarKeyFromUrl(value: string): string | null {
  try {
    const url = new URL(value);
    const rawPath = decodeURIComponent(url.pathname || '').replace(/^\/+/, '');
    if (!rawPath) return null;
    // Presigned R2 URLs can include the bucket segment in pathname.
    const withoutBucket = rawPath.replace(/^(user-avatars|cora-image-database)\//, '');
    return withoutBucket || null;
  } catch {
    return null;
  }
}

/**
 * Resolve a profile avatar to a stable display URL.
 * Prefer non-presigned values. If presigned, try rebuilding from avatar_name.
 * If rebuild fails, keep the original URL as a best-effort fallback.
 */
export function resolveProfileAvatarUrl(args: {
  avatarUrl: unknown;
  avatarName: unknown;
  publicBase: string | null | undefined;
}): string | null {
  const normalized = normalizeAvatarUrl(args.avatarUrl);
  const avatarName =
    typeof args.avatarName === 'string' && args.avatarName.trim()
      ? args.avatarName.trim()
      : null;
  if (!normalized) {
    return buildPublicR2Url(args.publicBase, avatarName);
  }
  if (!isPresignedUrl(normalized)) return normalized;
  const keyFromUrl = extractAvatarKeyFromUrl(normalized);
  const rebuilt = buildPublicR2Url(args.publicBase, avatarName ?? keyFromUrl);
  return rebuilt ?? normalized;
}
