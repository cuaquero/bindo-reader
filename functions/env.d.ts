// Secrets are set via `wrangler pages secret put <NAME>` and don't appear in
// wrangler.jsonc, so declare them here to extend the generated Env interface
// (worker-configuration.d.ts) via TypeScript's interface merging.
interface Env {
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  MICROSOFT_CLIENT_ID?: string;
  MICROSOFT_CLIENT_SECRET?: string;
  APP_BASE_URL?: string; // e.g. https://books.itstem.org — falls back to request origin if unset
  // Shared secret this app presents to the Iterverse roster service's
  // entitlement check (see iterverse_hub/worker/src/entitlement.ts) -
  // `wrangler pages secret put ROSTER_SERVICE_KEY`. Same value the roster
  // service issued via its own `wrangler secret put SERVICE_KEY`.
  ROSTER_SERVICE_KEY?: string;
  // Optional - unauthenticated Google Books API requests work fine at admin
  // catalog-curation volume (see functions/api/admin/metadata-search.ts);
  // this only raises the daily quota if that's ever needed.
  GOOGLE_BOOKS_API_KEY?: string;
}
