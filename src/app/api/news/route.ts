import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.min(50, Number(url.searchParams.get('limit') ?? 30));
  try {
    const r = await fetch(
      `https://api.spaceflightnewsapi.net/v4/articles/?limit=${limit}`,
      { cache: 'no-store', headers: { 'User-Agent': 'ORBIT-OS/1.0' } }
    );
    if (!r.ok) throw new Error('upstream ' + r.status);
    const j = await r.json();
    const items = (j.results ?? []).map((a: any) => ({
      id: String(a.id),
      headline: a.title,
      summary: a.summary ?? null,
      publisher: a.news_site ?? 'unknown',
      url: a.url,
      publishedAt: a.published_at ?? null,
    }));
    return NextResponse.json({
      data: { results: items, total: items.length },
      provenance: {
        source: 'Spaceflight News API v4',
        sourceUrl: 'https://api.spaceflightnewsapi.net/v4/docs/',
        freshness: 'recent',
        fetchedAt: new Date().toISOString(),
        limitations: 'Headlines shown exactly as published.',
      },
    });
  } catch (err) {
    return NextResponse.json({ data: null, error: String(err) }, { status: 502 });
  }
}