/**
 * Web OAuth client IDs from Google Cloud contain `*.googleusercontent.com`.
 * Normalize Windows `.env` (CRLF, quotes) so the GIS button and provider stay in sync.
 */
export function getGoogleWebClientId() {
  let v = String(import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim();
  v = v.replace(/\r/g, '');
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

export function isGoogleOAuthConfigured() {
  const id = getGoogleWebClientId();
  if (!id || id.length < 15) return false;
  if (/your-client-id|placeholder|changeme/i.test(id)) return false;
  // Lenient: some editors add trailing junk; web client IDs always contain this host fragment
  return /\.googleusercontent\.com/i.test(id);
}
