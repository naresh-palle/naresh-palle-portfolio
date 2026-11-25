"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, X } from "lucide-react";
import { formatDate, readingMinutes, sanitizeHtml, type Article } from "@/lib/articles";

export function ArticleReader({ article, onClose }: { article: Article; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const html = useMemo(() => sanitizeHtml(article.content || `<p>${article.excerpt}</p>`), [article]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink-950/80 p-3 backdrop-blur-md sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="article-title"
        className="glass-strong relative mx-auto my-4 max-w-3xl rounded-[1.75rem] sm:my-10"
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-[1.75rem] border-b border-line bg-ink-850/90 px-6 py-5 backdrop-blur-xl sm:px-10">
          <div>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-cyan-soft">
              <span>{formatDate(article.date)}</span>
              <span className="inline-flex items-center gap-1 text-mist">
                <Clock className="h-3 w-3" aria-hidden="true" /> {readingMinutes(article)} min read
              </span>
              {article.categories.length > 0 && <span className="text-mist">{article.categories.join(", ")}</span>}
            </p>
            <h2 id="article-title" className="mt-2 text-[clamp(1.4rem,3.2vw,2.1rem)] leading-tight font-semibold">
              {article.title}
            </h2>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} className="btn-ghost shrink-0 !px-3 !py-2" aria-label="Close article">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <article className="article-content px-6 py-8 sm:px-10" dangerouslySetInnerHTML={{ __html: html }} />

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-6 py-5 sm:px-10">
          <p className="text-xs text-mist">Synchronized from BinaryBlogs on WordPress.</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5">
            Open original article <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </footer>
      </motion.div>
    </motion.div>
  );
}
