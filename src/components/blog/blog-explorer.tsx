"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Clock, RotateCcw, Search } from "lucide-react";
import { BLOG_URL, formatDate, loadArticles, readingMinutes, topicsFor, type Article } from "@/lib/articles";
import { ArticleReader } from "./article-reader";

type State = { status: "loading" } | { status: "ready"; articles: Article[] } | { status: "error" };

export default function BlogExplorer() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [open, setOpen] = useState<Article | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadArticles().then((articles) => {
      if (cancelled) return;
      setState(articles.length ? { status: "ready", articles } : { status: "error" });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const articles = useMemo(() => (state.status === "ready" ? state.articles : []), [state]);
  const withTopics = useMemo(() => articles.map((a) => ({ article: a, topics: topicsFor(a) })), [articles]);
  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    withTopics.forEach(({ topics }) => topics.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [withTopics]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return withTopics.filter(({ article, topics }) => {
      const matchesTopic = topic === "All" || topics.includes(topic);
      const matchesQuery = !q || `${article.title} ${article.excerpt} ${topics.join(" ")}`.toLowerCase().includes(q);
      return matchesTopic && matchesQuery;
    });
  }, [withTopics, query, topic]);

  const showAll = () => {
    setQuery("");
    setTopic("All");
  };
  const close = useCallback(() => setOpen(null), []);

  return (
    <div>
      <div className="glass-strong flex flex-col gap-4 rounded-[1.6rem] p-4 md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search blog posts</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-mist" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles by title or topic…"
              className="w-full rounded-xl border border-line bg-ink-900/70 py-3 pr-4 pl-11 text-sm text-white placeholder:text-mist/70 focus:border-cyan/60 focus:outline-none"
            />
          </label>
          <button type="button" onClick={showAll} className="btn-ghost !py-3">
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Show all articles
          </button>
        </div>
        {topics.length > 0 && (
          <div role="group" aria-label="Filter articles by topic" className="flex flex-wrap gap-2">
            {[["All", articles.length] as const, ...topics].map(([t, n]) => {
              const on = topic === t;
              return (
                <button
                  key={t}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTopic(t)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    on ? "border-cyan/50 bg-cyan/15 text-white" : "border-line text-mist hover:border-line-strong hover:text-white"
                  }`}
                >
                  {t} <span className="font-mono text-[10.5px] opacity-70">{n}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="mt-5 mb-6 text-sm text-mist" aria-live="polite">
        {state.status === "loading" && "Loading published articles from BinaryBlogs…"}
        {state.status === "error" && "The article archive could not be loaded right now."}
        {state.status === "ready" &&
          (filtered.length === articles.length
            ? `Loaded ${articles.length} public articles. Select “Read article” to read the full content here on this page.`
            : `Showing ${filtered.length} of ${articles.length} articles.`)}
      </p>

      {state.status === "loading" && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="glass h-56 animate-pulse rounded-[1.4rem]" />
          ))}
        </ul>
      )}

      {state.status === "error" && (
        <div className="glass rounded-[1.4rem] p-10 text-center">
          <p className="text-haze">Blog synchronization is pending.</p>
          <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-5">
            Visit BinaryBlogs <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      )}

      {state.status === "ready" && filtered.length === 0 && (
        <div className="glass rounded-[1.4rem] p-10 text-center text-mist">
          No articles match your search.
          <button type="button" onClick={showAll} className="ml-2 text-cyan-soft underline underline-offset-4">
            Clear filters
          </button>
        </div>
      )}

      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map(({ article, topics }) => (
            <motion.li
              key={article.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
            >
              <article className="group glass relative flex h-full flex-col rounded-[1.4rem] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/35">
                <p className="flex items-center justify-between gap-2 font-mono text-[10.5px] text-cyan-soft">
                  <span>{formatDate(article.date)}</span>
                  <span className="inline-flex items-center gap-1 text-mist">
                    <Clock className="h-3 w-3" aria-hidden="true" /> {readingMinutes(article)} min
                  </span>
                </p>
                <h3 className="mt-3 text-[17px] leading-snug font-semibold">{article.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-mist">
                  {article.excerpt.slice(0, 170)}
                  {article.excerpt.length > 170 ? "…" : ""}
                </p>
                {topics.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {topics.slice(0, 3).map((t) => (
                      <li key={t} className="chip !px-2 !py-0.5 !text-[10.5px]">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(article)}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyan-soft after:absolute after:inset-0 after:rounded-[1.4rem] after:content-[''] hover:text-white"
                  >
                    <BookOpen className="h-4 w-4" aria-hidden="true" /> Read article
                  </button>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex items-center gap-1 text-xs text-mist hover:text-white"
                    aria-label={`Open original article: ${article.title}`}
                  >
                    Original <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </article>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>{open && <ArticleReader key={open.id} article={open} onClose={close} />}</AnimatePresence>
    </div>
  );
}
