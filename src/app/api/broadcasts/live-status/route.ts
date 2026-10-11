import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
const CHANNELS = [
  { id: 'UCLA_DiR1FfKNvjuUpBHmylQ', name: 'NASA',                 site: 'nasa.gov' },
  { id: 'UCmheCYT4HlbFi943lpH009Q', name: 'NASA Johnson (ISS)',    site: 'nasa.gov' },
  { id: 'UCIBaDdAbGlFDeS33shmlD0A', name: 'European Space Agency', site: 'esa.int' },
  { id: 'UCtI0Hodo5o5dUb67FeUjDeA', name: 'SpaceX',                site: 'spacex.com' },
];
export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const checkedAt = new Date().toISOString();
  if (!apiKey) {
    const fallback = CHANNELS.map(c => ({
      channelId: c.id, channelName: c.name, site: c.site,
      isLive: false, videoId: null, title: null, embedUrl: null,
      watchUrl: `https://www.youtube.com/channel/${c.id}/live`,
      verified: false, checkedAt,
    }));
    return NextResponse.json({
      data: { channels: fallback, apiConfigured: false },
      provenance: {
        source: 'YouTube Data API v3 (not configured)',
        fetchedAt: checkedAt,
        freshness: 'unverified',
        limitations: 'Add YOUTUBE_API_KEY to .env.local to enable live verification.',
      },
    });
  }
  const results = [];
  for (const c of CHANNELS) {
    try {
      const s = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${c.id}&eventType=live&type=video&maxResults=1&key=${apiKey}`, { cache: 'no-store' });
      const sj = s.ok ? await s.json() : null;
      const videoId = sj?.items?.[0]?.id?.videoId ?? null;
      const title   = sj?.items?.[0]?.snippet?.title ?? null;
      let isLive = false;
      if (videoId) {
        const v = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${videoId}&key=${apiKey}`, { cache: 'no-store' });
        const vj = v.ok ? await v.json() : null;
        const lbc = vj?.items?.[0]?.snippet?.liveBroadcastContent;
        isLive = lbc === 'live' || lbc === 'active';
      }
      results.push({
        channelId: c.id, channelName: c.name, site: c.site,
        isLive, videoId, title,
        embedUrl: isLive && videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1` : null,
        watchUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : `https://www.youtube.com/channel/${c.id}/live`,
        verified: true, checkedAt,
      });
    } catch {
      results.push({
        channelId: c.id, channelName: c.name, site: c.site,
        isLive: false, videoId: null, title: null, embedUrl: null,
        watchUrl: `https://www.youtube.com/channel/${c.id}/live`,
        verified: false, checkedAt,
      });
    }
  }
  return NextResponse.json({
    data: { channels: results, apiConfigured: true },
    provenance: {
      source: 'YouTube Data API v3',
      sourceUrl: 'https://developers.google.com/youtube/v3',
      fetchedAt: checkedAt,
      freshness: 'live',
      limitations: 'Free quota: 10,000 units/day.',
    },
  });
}