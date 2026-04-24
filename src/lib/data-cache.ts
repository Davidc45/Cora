import { unstable_cache } from 'next/cache';
import { adminClient } from '@/lib/supabase/admin';

/**
 * Cached wrappers for expensive read-only database queries.
 *
 * Uses `unstable_cache` so even dynamically-rendered pages (which read cookies
 * for auth) avoid re-running identical Supabase queries on every request.
 * The admin client bypasses RLS so the cache is shared across all users.
 */

// ── Reports listing (explore page) ─────────────────────────────────

export const getCachedAllReports = unstable_cache(
  async () => {
    const db = adminClient;
    if (!db) return null;
    const { data, error } = await db
      .from('reports_with_meta_updated')
      .select('*')
      .order('report_id', { ascending: false });
    if (error) {
      console.error('data-cache: reports_with_meta_updated', error.message);
      return null;
    }
    return data;
  },
  ['all-reports-listing'],
  { revalidate: 30 }
);

// ── Comment counts for all reports ──────────────────────────────────

export const getCachedCommentCounts = unstable_cache(
  async (reportIds: number[]) => {
    if (!reportIds.length) return {};
    const db = adminClient;
    if (!db) return null;
    const { data: rows } = await db
      .from('report_comments')
      .select('report_id')
      .in('report_id', reportIds);
    const out: Record<number, number> = {};
    reportIds.forEach((id) => { out[id] = 0; });
    rows?.forEach((r) => { out[r.report_id] = (out[r.report_id] ?? 0) + 1; });
    return out;
  },
  ['report-comment-counts'],
  { revalidate: 30 }
);

// ── Interactive map: all report meta ────────────────────────────────

const PAGE_SIZE = 1000;

type MetaRow = {
  report_id: number;
  report_title: string | null;
  report_description: string | null;
  report_image: string | null;
  status: string | null;
  score: number | null;
  upvotes: number | null;
  downvotes: number | null;
};

export const getCachedMapMeta = unstable_cache(
  async () => {
    const db = adminClient;
    if (!db) return null;
    const all: MetaRow[] = [];
    let from = 0;
    for (;;) {
      const { data, error } = await db
        .from('reports_with_meta')
        .select(
          'report_id, report_title, report_description, report_image, status, score, upvotes, downvotes'
        )
        .order('report_id', { ascending: true })
        .range(from, from + PAGE_SIZE - 1);
      if (error) {
        console.error('data-cache: reports_with_meta', error.message);
        break;
      }
      const batch = (data ?? []) as MetaRow[];
      all.push(...batch);
      if (batch.length < PAGE_SIZE) break;
      from += PAGE_SIZE;
    }
    return all;
  },
  ['map-meta-all'],
  { revalidate: 60 }
);

// ── Interactive map: geo data for report ids ────────────────────────

const GEO_IN_CHUNK = 300;

type GeoRow = {
  report_id: number;
  category_id: number | null;
  created_at: string | null;
  location: unknown;
};

function chunkIds(ids: number[], size: number): number[][] {
  const out: number[][] = [];
  for (let i = 0; i < ids.length; i += size) out.push(ids.slice(i, i + size));
  return out;
}

export const getCachedMapGeo = unstable_cache(
  async (reportIds: number[]) => {
    const db = adminClient;
    if (!db) return null;
    const map: Record<number, GeoRow> = {};
    if (reportIds.length === 0) return map;

    const results = await Promise.all(
      chunkIds(reportIds, GEO_IN_CHUNK).map((ids) =>
        db.from('reports').select('report_id, category_id, created_at, location').in('report_id', ids)
      )
    );

    for (const { data, error } of results) {
      if (error) {
        console.error('data-cache: reports geometry', error.message);
        continue;
      }
      for (const row of (data ?? []) as GeoRow[]) {
        map[row.report_id] = row;
      }
    }
    return map;
  },
  ['map-geo-all'],
  { revalidate: 60 }
);

// ── Single report detail ────────────────────────────────────────────

export const getCachedReport = unstable_cache(
  async (reportId: number) => {
    const db = adminClient;
    if (!db) return null;
    const { data, error } = await db
      .from('reports_with_meta_updated')
      .select('*')
      .eq('report_id', reportId)
      .maybeSingle();
    if (error) {
      console.error('data-cache: single report', error.message);
      return null;
    }
    return data;
  },
  ['single-report'],
  { revalidate: 30 }
);

// ── Cloudflare images list ──────────────────────────────────────────

export const getCachedImages = unstable_cache(
  async () => {
    try {
      const base = process.env.NEXT_PUBLIC_HOME_PAGE;
      if (!base) return null;
      const res = await fetch(`${base}/api/cloudflare`);
      const data = await res.json();
      if (data?.success) return data.images as string[];
      return null;
    } catch {
      return null;
    }
  },
  ['cloudflare-images'],
  { revalidate: 60 }
);

// ── Report comments ─────────────────────────────────────────────────

export const getCachedReportComments = unstable_cache(
  async (reportId: number) => {
    const db = adminClient;
    if (!db) return null;
    const { data: comments } = await db
      .from('report_comments')
      .select('id, body, created_at, user_id')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });
    if (!comments?.length) return [];

    const userIds = [...new Set(comments.map((c) => c.user_id))];
    const { data: profilesData } = await db
      .from('profiles')
      .select('id, username, avatar_url, avatar_name')
      .in('id', userIds);

    const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_AVATAR_URL;
    const profileMap = new Map<string, { username: string; avatar_url: string | null }>(
      profilesData?.map((p) => {
        const rawUrl = typeof p.avatar_url === 'string' ? p.avatar_url.trim() : '';
        let url: string | null = null;
        if (rawUrl && !rawUrl.includes('X-Amz-Signature')) {
          url = rawUrl;
        } else if (publicBase && p.avatar_name) {
          url = `${publicBase.replace(/\/$/, '')}/${p.avatar_name}`;
        }
        return [p.id, { username: p.username ?? 'Unknown', avatar_url: url }];
      }) ?? []
    );

    return comments.map((c) => ({
      id: c.id,
      body: c.body,
      username: profileMap.get(c.user_id)?.username ?? 'Unknown',
      avatar_url: profileMap.get(c.user_id)?.avatar_url ?? null,
      created_at: c.created_at,
    }));
  },
  ['report-comments'],
  { revalidate: 15 }
);
