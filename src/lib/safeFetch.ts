// Guards against SSRF to private ranges. Use for ANY user-influenced outbound URL.
const PRIVATE = [
  /^https?:\/\/localhost/i,
  /^https?:\/\/127\./,
  /^https?:\/\/10\./,
  /^https?:\/\/192\.168\./,
  /^https?:\/\/172\.(1[6-9]|2\d|3[01])\./,
  /^https?:\/\/169\.254\./,
  /^https?:\/\/\[::1\]/,
];

export function assertSafeOutbound(url: string) {
  let parsed: URL;
  try { parsed = new URL(url); } catch { throw new Error('Invalid URL'); }
  if (!/^https?:$/.test(parsed.protocol)) throw new Error('Only http(s) allowed');
  if (PRIVATE.some(r => r.test(url))) throw new Error('Blocked outbound host');
  return parsed;
}

export async function safeFetch(url: string, init: RequestInit = {}, timeoutMs = 12000) {
  assertSafeOutbound(url);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}