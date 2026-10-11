import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const r = await fetch(
      'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?lsp__name=China%20Aerospace%20Science%20and%20Technology%20Corporation&limit=25&mode=detailed',
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
            source: 'Launch Library 2 — CNSA/CASC filter',
            sourceUrl: 'https://thespacedevs.com/llapi',
            freshness: 'recent',
            fetchedAt: new Date().toISOString(),
            limitations: 'CNSA publishes no public API. Filtered from Launch Library 2.',
          },
        });
      }
    }
  } catch {}
  return NextResponse.json({
    data: { results: [
      { name: 'Tiangong',    detail: 'Modular space station', id: 'TIANGONG' },
      { name: "Chang'e 5",   detail: 'Lunar sample return', id: 'CHANG-E-5' },
      { name: "Chang'e 6",   detail: 'Far-side sample return', id: 'CHANG-E-6' },
      { name: 'Tianwen-1',   detail: 'Mars orbiter/lander/rover', id: 'TIANWEN-1' },
      { name: 'BeiDou-3',    detail: 'Global navigation constellation', id: 'BEIDOU-3' },
      { name: 'Shenzhou-17', detail: 'Crewed flight to Tiangong', id: 'SHENZHOU-17' },
    ], total: 6 },
    provenance: {
      source: 'ORBIT OS verified fallback',
      freshness: 'cached',
      fetchedAt: new Date().toISOString(),
      limitations: 'Live CNSA data unreachable. Showing verified fallback list.',
    },
  });
}