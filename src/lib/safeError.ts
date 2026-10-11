// Never leak stack traces or upstream details to clients.
export function safeError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  // Log full detail server-side only
  console.error('[orbit-os]', msg);
  // Return generic message to client
  if (msg.includes('upstream 4')) return 'Upstream provider rejected the request';
  if (msg.includes('upstream 5')) return 'Upstream provider unavailable';
  if (msg.includes('abort') || msg.includes('timeout')) return 'Upstream timed out';
  if (msg.includes('Blocked outbound')) return 'Blocked outbound request';
  return 'Data temporarily unavailable';
}