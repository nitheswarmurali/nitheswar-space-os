import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const r = await fetch('https://api.wheretheiss.at/v1/satellites/25544', { cache: 'no-store' });
    if (!r.ok) throw new Error('upstream ' + r.status);
    const feed = await r.json();
    return NextResponse.json({
      data: { feed },
      provenance: {
        source: 'Where The ISS At?',
        sourceUrl: 'https://wheretheiss.at/w/developer',
        freshness: 'live',
        fetchedAt: new Date().toISOString(),
        observedAt: new Date(feed.timestamp * 1000).toISOString(),
        limitations: 'Provider cadence ~1 Hz. Not a GPS-precision state vector.',
      },
    });
  } catch (err) {
    return NextResponse.json({ data: null, error: String(err) }, { status: 502 });
  }
}