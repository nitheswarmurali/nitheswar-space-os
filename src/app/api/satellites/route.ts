import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const GROUPS = ['stations','active','weather','gps-ops','science','starlink','geo'];
function regime(mm: number): string {
  const n = (mm * 2 * Math.PI) / 86400;
  if (!Number.isFinite(n) || n <= 0) return 'UNKNOWN';
  const a = Math.cbrt(398600.4418 / (n * n));
  const alt = a - 6378.137;
  if (alt < 2000) return 'LEO';
  if (alt < 35000) return 'MEO';
  if (alt <= 36500) return 'GEO';
  return 'HEO';
}
export async function GET(req: Request) {
  const url = new URL(req.url);
  const g = url.searchParams.get('group') ?? 'stations';
  const group = GROUPS.includes(g) ? g : 'stations';
  const q = (url.searchParams.get('q') ?? '').trim().toLowerCase();
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const limit = Math.min(100, Number(url.searchParams.get('limit') ?? 25));
  try {
    const r = await fetch(
      `https://celestrak.org/NORAD/elements/gp.php?GROUP=${group}&FORMAT=json`,
      { cache: 'no-store', headers: { 'User-Agent': 'ORBIT-OS/1.0' } }
    );
    if (!r.ok) throw new Error('upstream ' + r.status);
    let rows: any[] = await r.json();
    if (!Array.isArray(rows)) throw new Error('non-array response');
    if (q) rows = rows.filter(x =>
      String(x.OBJECT_NAME).toLowerCase().includes(q) || String(x.NORAD_CAT_ID).includes(q));
    const total = rows.length;
    const offset = (page - 1) * limit;
    const slice = rows.slice(offset, offset + limit).map(x => ({
      noradId: String(x.NORAD_CAT_ID),
      name: x.OBJECT_NAME,
      intlDesignator: x.OBJECT_ID || '',
      epoch: x.EPOCH,
      inclination: x.INCLINATION,
      eccentricity: x.ECCENTRICITY,
      meanMotion: x.MEAN_MOTION,
      regime: regime(x.MEAN_MOTION),
    }));
    return NextResponse.json({
      data: { results: slice, total, group },
      provenance: {
        source: 'CelesTrak GP (OMM JSON)',
        sourceUrl: 'https://celestrak.org/',
        freshness: 'recent',
        fetchedAt: new Date().toISOString(),
        observedAt: rows[0]?.EPOCH ?? null,
        limitations: 'Element sets are epochs, not live positions.',
      },
    });
  } catch (err) {
    return NextResponse.json({ data: null, error: String(err) }, { status: 502 });
  }
}