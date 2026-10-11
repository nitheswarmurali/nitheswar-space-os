'use client';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Radio, ExternalLink } from 'lucide-react';
export default function BroadcastsPage() {
  const [channels, setChannels] = useState<any[]>([]);
  const [prov, setProv] = useState<any>(null);
  const [apiConfigured, setApiConfigured] = useState<boolean|null>(null);
  const [active, setActive] = useState<string|null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch('/api/broadcasts/live-status', { cache: 'no-store' })
      .then(r => r.json())
      .then(j => {
        const list = j?.data?.channels ?? [];
        setChannels(list);
        setApiConfigured(j?.data?.apiConfigured ?? false);
        setProv(j?.provenance ?? null);
        const firstLive = list.find((c: any) => c.isLive);
        setActive((firstLive ?? list[0])?.channelId ?? null);
      })
      .catch(() => setChannels([]))
      .finally(() => setLoading(false));
  }, []);
  const c = channels.find(x => x.channelId === active) ?? channels[0];
  return (
    <div className="p-6 space-y-5">
      <header>
        <h1 className="text-xl font-semibold">Live Broadcasts</h1>
        <p className="text-sm text-fg-2">Official YouTube channels. Live status verified when a key is set.</p>
      </header>
      {apiConfigured === false && (
        <div className="rounded border border-amber-900/60 bg-amber-950/30 px-3 py-2 text-xs text-amber-400">
          <strong>YOUTUBE_API_KEY not set.</strong> Add it to <code>.env.local</code> to enable live verification.
          Without a key, embeds may show &ldquo;unavailable&rdquo; when a channel is not live.
        </div>
      )}
      {prov && (
        <div className="rounded border border-line bg-bg-2 px-3 py-2 text-2xs text-fg-3">
          <Badge tone={prov.freshness}>{prov.freshness}</Badge>
          <span className="ml-2">{prov.source}</span>
        </div>
      )}
      <div className="flex flex-wrap gap-1 rounded border border-line p-0.5 text-xs">
        {channels.map(x => (
          <button key={x.channelId} onClick={() => setActive(x.channelId)}
            className={`flex items-center gap-1.5 rounded px-2.5 py-1.5 ${active === x.channelId ? 'bg-card text-fg' : 'text-fg-3 hover:text-fg'}`}>
            {x.isLive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
            {x.channelName}
          </button>
        ))}
      </div>
      {loading && <p className="text-sm text-fg-3">Loading channels…</p>}
      {!loading && c && (
        <Card>
          <CardHeader
            title={c.channelName}
            subtitle={c.isLive ? `LIVE: ${c.title ?? ''}` : `Official channel · ${c.site}`}
            right={<a href={c.watchUrl} target="_blank" rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-xs text-fg-2 underline decoration-dotted hover:text-fg">
              Watch on YouTube <ExternalLink className="h-3 w-3" />
            </a>} />
          <CardBody className="p-0">
            <div className="aspect-video w-full bg-black">
              {c.embedUrl && c.isLive ? (
                <iframe key={c.videoId} src={c.embedUrl} title={c.channelName}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen className="h-full w-full border-0" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
                  <Radio className="h-8 w-8 text-fg-3" />
                  <p className="text-sm text-fg-2">Not currently broadcasting</p>
                  <a href={c.watchUrl} target="_blank" rel="noreferrer noopener"
                    className="rounded border border-line px-3 py-1.5 text-xs text-fg-2 hover:bg-neutral-900 hover:text-fg">
                    Open channel live page
                  </a>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}