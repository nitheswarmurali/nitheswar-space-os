import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const r = await fetch(
      'https://ll.thespacedevs.com/2.2.0/launch/upcoming/?lsp__name=Indian%20Space%20Research%20Organisation&limit=25&mode=detailed',
      { cache: 'no-store', headers: { 'User-Agent': 'ORBIT-OS/1.0' } }
    );
    if (r.ok) {
      const j = await r.json();
      const rows = (j.results ?? []).map((l: any) => ({
        name: l.name,
        detail: l.mission?.name ?? l.rocket?.configuration?.name ?? '',
        id: l.id,
        net: l.net,
        status: l.status?.abbrev ?? 'TBD',
      }));
      if (rows.length > 0) {
        return NextResponse.json({
          data: { results: rows, total: rows.length },
          provenance: {
            source: 'Launch Library 2 — ISRO filter',
            sourceUrl: 'https://thespacedevs.com/llapi',
            freshness: 'recent',
            fetchedAt: new Date().toISOString(),
            limitations: 'ISRO does not publish a public API. Data filtered from Launch Library 2.',
          },
        });
      }
    }
  } catch {}
  return NextResponse.json({
    data: { results: [
      { name: 'Chandrayaan-3', detail: 'Lunar lander and rover', id: 'CHANDRAYAAN-3' },
      { name: 'Aditya-L1',     detail: 'Solar observation at L1', id: 'ADITYA-L1' },
      { name: 'Mangalyaan',    detail: 'Mars Orbiter Mission',    id: 'MOM' },
      { name: 'AstroSat',      detail: 'Multi-wavelength observatory', id: 'ASTROSAT' },
      { name: 'PSLV',          detail: 'Polar Satellite Launch Vehicle', id: 'PSLV' },
      { name: 'GSLV Mk II',    detail: 'Geosynchronous SLV', id: 'GSLV-MK2' },
      { name: 'LVM3',          detail: 'Launch Vehicle Mark 3', id: 'LVM3' },
    ], total: 7 },
    provenance: {
      source: 'ORBIT OS verified fallback',
      freshness: 'cached',
      fetchedAt: new Date().toISOString(),
      limitations: 'Live ISRO API unreachable. Showing verified fallback list.',
    },
  });
}