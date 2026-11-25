"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { navItems, profile } from "@/content/profile";
import { withBase } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const onHome = pathname === "/" || pathname === "";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return;
    const sections = navItems.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [onHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-line bg-ink-900/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:rounded-lg focus:bg-cyan focus:px-4 focus:py-2 focus:text-ink-950"
      >
        Skip to content
      </a>
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${profile.name} — home`}>
          <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-line-strong bg-ink-800 font-display text-sm font-bold">
            <span className="text-gradient">NP</span>
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan/30 via-transparent to-violet/30 opacity-0 transition-opacity group-hover:opacity-100" />
          </span>
          <span className="hidden font-display text-[15px] font-semibold tracking-tight text-white sm:block">
            Naresh Palle<span className="text-cyan">.</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 rounded-full border border-line bg-white/[0.03] p-1 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = onHome && active === item.id;
              return (
                <li key={item.id} className="relative">
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan/20 to-violet/20 ring-1 ring-cyan/30"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Link
                    href={href(item.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${
                      isActive ? "text-white" : "text-mist hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={withBase(profile.resume)} download className="btn-ghost hidden !px-4 !py-2 text-[13px] md:inline-flex">
            <Download className="h-4 w-4" aria-hidden="true" /> Resume
          </a>
          <button
            ref={menuButton}
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line-strong bg-white/[0.04] text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-ink-900/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="wrap flex flex-col gap-1 py-6">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                >
                  <Link
                    href={href(item.id)}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-4 font-display text-2xl text-white hover:border-line hover:bg-white/[0.03]"
                  >
                    {item.label}
                    <span className="font-mono text-xs text-mist">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
              <li className="mt-4 px-4">
                <a href={withBase(profile.resume)} download className="btn-primary w-full">
                  <Download className="h-4 w-4" aria-hidden="true" /> Download Resume
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
