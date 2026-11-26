export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";

// Cloudflare Pages sets CF_PAGES_URL during its build. A manual override still wins.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.CF_PAGES_URL ||
  "https://naresh-palle.github.io/naresh-palle-portfolio"
).replace(/\/$/, "");

/** Prefix a public-folder path with the deployment base path. next/link and next/image do this automatically; plain <a>, <img> and fetch() do not. */
export function withBase(path: string): string {
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
