import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const url = new URL(req.url);
  const win = url.searchParams.get('window') === 'recent' ? 'previous' : 'upcoming';
  const limit = Math.min(50, Number(url.searchParams.get('limit') ?? 20));
  try {
    const r = await fetch(
      `https://ll.thespacedevs.com/2.2.0/launch/${win}/?limit=${limit}&mode=detailed`,
      { cache: 'no-store', headers: { 'User-Agent': 'ORBIT-OS/1.0' } }
    );
    if (!r.ok) throw new Error('upstream ' + r.status);
    const j = await r.json();
    return NextResponse.json({
      data: { results: j.results ?? [], count: j.count ?? 0 },
      provenance: {
        source: 'Launch Library 2',
        sourceUrl: 'https://thespacedevs.com/llapi',
        freshness: 'recent',
        fetchedAt: new Date().toISOString(),
        limitations: 'NET means No Earlier Than. Not a launch confirmation.',
      },
    });
  } catch (err) {
    return NextResponse.json({ data: null, error: String(err) }, { status: 502 });
  }
}