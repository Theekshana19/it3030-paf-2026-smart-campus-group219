/**
 * Web OAuth client IDs from Google Cloud end with `.apps.googleusercontent.com`.
 * The tracked `.env.example` placeholder must not enable GIS (would load with a bad client_id).
 */
export function getGoogleWebClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';
}

export function isGoogleOAuthConfigured() {
  const id = getGoogleWebClientId();
  if (!id) return false;
  if (/your-client-id|placeholder|changeme/i.test(id)) return false;
  return /\.apps\.googleusercontent\.com$/i.test(id);
}
