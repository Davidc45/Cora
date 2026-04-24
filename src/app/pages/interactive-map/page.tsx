import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import ReportsMap from '@/app/components/ReportsMap';
import type { Report } from '@/app/components/mapTypes';
import { locationToGeoJSON } from '@/lib/mapLocation';
import ScrollLock from './scroll-lock';
import { getCachedMapMeta, getCachedMapGeo } from '@/lib/data-cache';

export const revalidate = 60;

const PLACEHOLDER: [number, number] = [-117.8311, 33.7175];
const GEO_IN_CHUNK = 300;

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

type GeoRow = {
  report_id: number;
  category_id: number | null;
  created_at: string | null;
  location: unknown;
};

function normalizeToReport(m: MetaRow, g: GeoRow | undefined): Report {
  let location_geojson = locationToGeoJSON(g?.location ?? null);

  if (
    location_geojson &&
    location_geojson.coordinates[0] === 0 &&
    location_geojson.coordinates[1] === 0
  ) {
    location_geojson = { type: 'Point', coordinates: [...PLACEHOLDER] };
  }

  if (!location_geojson) {
    const j = (m.report_id % 24) * 0.004;
    const k = ((m.report_id * 7) % 19) * 0.004;
    location_geojson = {
      type: 'Point',
      coordinates: [PLACEHOLDER[0] + j, PLACEHOLDER[1] + k],
    };
  }

  return {
    report_id: m.report_id,
    created_at: g?.created_at ?? null,
    report_title: m.report_title,
    report_description: m.report_description,
    report_image: m.report_image,
    category_id: g?.category_id ?? null,
    upvotes: m.upvotes,
    downvotes: m.downvotes,
    score: m.score,
    status: m.status ?? null,
    location_geojson,
  };
}

function chunkIds(ids: number[], size: number): number[][] {
  const out: number[][] = [];
  for (let i = 0; i < ids.length; i += size) out.push(ids.slice(i, i + size));
  return out;
}

export default async function InteractiveMapPage() {
  // Try cached data first (uses adminClient, no cookies → page can be ISR'd)
  let meta = await getCachedMapMeta();
  let usedCache = !!meta;

  if (!meta) {
    const supabase = await createClient();
    const all: MetaRow[] = [];
    let from = 0;
    for (;;) {
      const { data, error } = await supabase
        .from('reports_with_meta')
        .select('report_id, report_title, report_description, report_image, status, score, upvotes, downvotes')
        .order('report_id', { ascending: true })
        .range(from, from + 999);
      if (error) break;
      const batch = (data ?? []) as MetaRow[];
      all.push(...batch);
      if (batch.length < 1000) break;
      from += 1000;
    }
    meta = all;
  }

  const reportIds = meta.map((r) => r.report_id);

  let geoRecord = usedCache ? await getCachedMapGeo(reportIds) : null;
  if (!geoRecord) {
    const db = adminClient ?? await createClient();
    geoRecord = {};
    const results = await Promise.all(
      chunkIds(reportIds, GEO_IN_CHUNK).map((ids) =>
        db.from('reports').select('report_id, category_id, created_at, location').in('report_id', ids)
      )
    );
    for (const { data } of results) {
      for (const row of (data ?? []) as GeoRow[]) {
        geoRecord[row.report_id] = row;
      }
    }
  }

  const reports: Report[] = meta.map((m) =>
    normalizeToReport(m, geoRecord![m.report_id])
  );

  return (
    <div className="interactive-map-page">
      <ScrollLock />
      <h1 className="sr-only">Interactive map</h1>
      <ReportsMap reports={reports} fillViewport />
    </div>
  );
}
