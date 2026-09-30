import type { NextConfig } from "vinext";

// `forbidden()` — the App Router 403 signal behind /admin — is documented as
// gated on `experimental.authInterrupts` at the pinned Next 16.3.6. vinext's
// shim does not read the flag, so this is inert under the current build; it
// keeps the page correct if it is ever rendered by Next itself.
const nextConfig: NextConfig = {
  experimental: { authInterrupts: true },
};

export default nextConfig;
