import { withBase } from "./site";

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  url: string;
  date: string;
  categories: string[];
  type?: string;
};

const WP_API = "https://public-api.wordpress.com/rest/v1.1/sites/binaryblogs1.wordpress.com/posts/";

export const BLOG_URL = "https://binaryblogs1.wordpress.com/";

export function stripHtml(html: string): string {
  if (typeof document === "undefined") return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const el = document.createElement("div");
  el.innerHTML = html || "";
  return (el.textContent || "").replace(/\s+/g, " ").trim();
}

type WpItem = {
  ID: number;
  title?: string;
  excerpt?: string;
  content?: string;
  URL?: string;
  short_URL?: string;
  date?: string;
  type?: string;
  categories?: Record<string, unknown>;
};

async function fetchPublic(type: "post" | "page"): Promise<Article[]> {
  let page = 1;
  let totalPages = 1;
  const all: Article[] = [];
  while (page <= totalPages && page <= 10) {
    const res = await fetch(`${WP_API}?number=100&page=${page}&type=${type}`);
    if (!res.ok) throw new Error(`WordPress API returned ${res.status}`);
    const data: { posts?: WpItem[]; pages?: number } = await res.json();
    totalPages = Math.min(data.pages || 1, 10);
    const batch = data.posts || [];
    for (const p of batch) {
      all.push({
        id: String(p.ID),
        title: stripHtml(p.title || ""),
        excerpt: stripHtml(p.excerpt || p.content || ""),
        content: p.content || "",
        url: p.URL || p.short_URL || BLOG_URL,
        date: p.date || "",
        categories: Object.keys(p.categories || {}),
        type: p.type || type,
      });
    }
    if (batch.length < 100) break;
    page++;
  }
  return all;
}

/**
 * Most BinaryBlogs articles are WordPress pages, so posts alone are not the full archive.
 * Live API results are merged with the build-time posts.json snapshot, which wins on conflicts.
 */
export async function loadArticles(): Promise<Article[]> {
  const byId = new Map<string, Article>();
  try {
    const [posts, pages] = await Promise.all([fetchPublic("post"), fetchPublic("page")]);
    [...posts, ...pages].forEach((a) => a.id && byId.set(a.id, a));
  } catch {
    // Fall back to the synchronized archive below.
  }
  try {
    const res = await fetch(withBase("/posts.json"), { cache: "no-store" });
    if (res.ok) {
      const data: { posts?: Article[] } = await res.json();
      (data.posts || []).forEach((a) => a?.id && byId.set(String(a.id), { ...a, categories: a.categories || [] }));
    }
  } catch {
    // Live results (if any) are still shown.
  }
  return [...byId.values()].filter((a) => a.title).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
}

const TOPIC_RULES: { topic: string; pattern: RegExp }[] = [
  { topic: "Kubernetes", pattern: /kubernetes|\bk8s\b|kubectl|\bk3s\b|\beks\b|minikube/i },
  { topic: "Cloud & AWS", pattern: /\baws\b|amazon|\beks\b|cloud/i },
  { topic: "DevOps & Linux", pattern: /devops|linux|\bvi\b|vim|shell|centos|rocky/i },
  { topic: "Testing & QA", pattern: /test|testing|\bqa\b|jmeter|penetration|load testing/i },
  { topic: "Process", pattern: /agile|scrum|sdlc|waterfall/i },
  { topic: "Databases", pattern: /redis|mysql|postgres|mongodb/i },
];

export function topicsFor(article: Article): string[] {
  const haystack = `${article.title} ${article.excerpt.slice(0, 600)}`;
  const topics = TOPIC_RULES.filter((r) => r.pattern.test(haystack)).map((r) => r.topic);
  const categories = (article.categories || []).filter((c) => c && c.toLowerCase() !== "uncategorized");
  return Array.from(new Set([...topics, ...categories]));
}

/** WordPress content is published HTML. Remove scripts, embeds, inline event handlers and javascript: URLs. */
export function sanitizeHtml(html: string): string {
  const t = document.createElement("template");
  t.innerHTML = html || "";
  t.content.querySelectorAll("script,style,iframe,object,embed,form,link,meta").forEach((n) => n.remove());
  t.content.querySelectorAll("*").forEach((n) => {
    [...n.attributes].forEach((a) => {
      if (/^on/i.test(a.name) || ((a.name === "href" || a.name === "src" || a.name === "xlink:href") && /^\s*(javascript|data):/i.test(a.value))) {
        n.removeAttribute(a.name);
      }
    });
    if (n.tagName === "A") {
      n.setAttribute("target", "_blank");
      n.setAttribute("rel", "noopener noreferrer");
    }
    if (n.tagName === "IMG") n.setAttribute("loading", "lazy");
  });
  return t.innerHTML;
}

export function formatDate(value: string): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function readingMinutes(article: Article): number {
  const words = stripHtml(article.content || article.excerpt).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
