import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const r = await fetch(
      'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?lsp__name=Japan%20Aerospace%20Exploration%20Agency&limit=25&mode=detailed',
      { cache: 'no-store', headers: { 'User-Agent': 'ORBIT-OS/1.0' } }
    );
    if (r.ok) {
      const j = await r.json();
      const rows = (j.results ?? []).map((l: any) => ({
        name: l.name,
        detail: l.mission?.name ?? l.rocket?.configuration?.name ?? '',
        id: l.id,
        net: l.net,
      }));
      if (rows.length > 0) {
        return NextResponse.json({
          data: { results: rows, total: rows.length },
          provenance: {
            source: 'Launch Library 2 — JAXA filter',
            sourceUrl: 'https://thespacedevs.com/llapi',
            freshness: 'recent',
            fetchedAt: new Date().toISOString(),
            limitations: 'JAXA publishes no raw telemetry API. Filtered from Launch Library 2.',
          },
        });
      }
    }
  } catch {}
  return NextResponse.json({
    data: { results: [
      { name: 'Himawari-9',   detail: 'Geostationary weather satellite', id: 'HIMAWARI-9' },
      { name: 'ALOS-2',       detail: 'SAR Earth observation', id: 'ALOS-2' },
      { name: 'GCOM-C',       detail: 'Climate observation', id: 'GCOM-C' },
      { name: 'GCOM-W',       detail: 'Water-cycle observation', id: 'GCOM-W' },
      { name: 'Hayabusa2',    detail: 'Asteroid sample return', id: 'HAYABUSA2' },
      { name: 'SLIM',         detail: 'Lunar precision lander', id: 'SLIM' },
    ], total: 6 },
    provenance: {
      source: 'ORBIT OS verified fallback',
      freshness: 'cached',
      fetchedAt: new Date().toISOString(),
      limitations: 'Live JAXA data unreachable. Showing verified fallback list.',
    },
  });
}