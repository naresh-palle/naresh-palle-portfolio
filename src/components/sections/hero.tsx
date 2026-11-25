"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Download, Mail } from "lucide-react";
import { heroPanels, profile } from "@/content/profile";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { withBase } from "@/lib/site";
import { GithubIcon, Icon, LinkedinIcon } from "../icons";

type SceneMode = "still" | "scrub" | "loop";

/**
 * Maps a horizontal pointer position (0 = left edge, 1 = right edge) to a time in hero-scrub.mp4.
 * The clip looks left for ~0–1.2s, faces the viewer for ~1.2–3.2s and turns right for ~3.2–5.2s,
 * so the centre band is compressed onto the front-facing frames.
 */
function pointerToTime(x: number) {
  const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));
  if (x < 0.42) return lerp(0.2, 1.2, x / 0.42);
  if (x < 0.58) return lerp(1.2, 3.2, (x - 0.42) / 0.16);
  return lerp(3.2, 5.2, (x - 0.58) / 0.42);
}

const FRONT_TIME = 2.0;

function useSceneMode(): SceneMode {
  const [mode, setMode] = useState<SceneMode>("still");
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) return;
    setMode(window.matchMedia("(hover: hover) and (pointer: fine)").matches ? "scrub" : "loop");
  }, []);
  return mode;
}

function HeroScene() {
  const mode = useSceneMode();
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [src, setSrc] = useState<string>();

  // The scrub clip is loaded into a blob URL because seeking a streamed file needs HTTP range support from the host.
  useEffect(() => {
    if (mode === "still") return;
    if (mode === "loop") {
      setSrc(withBase("/video/hero-loop.mp4"));
      return;
    }
    const controller = new AbortController();
    let objectUrl: string | undefined;
    fetch(withBase("/video/hero-scrub.mp4"), { signal: controller.signal })
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(String(res.status)))))
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => {});
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [mode]);

  useEffect(() => {
    const v = video.current;
    if (!v || !src || mode !== "scrub") return;

    let target = FRONT_TIME;
    let current = 0.2;
    let frame = 0;
    let visible = true;

    const tick = () => {
      current += (target - current) * 0.09;
      if (!v.seeking && Math.abs(v.currentTime - current) > 1 / 48) v.currentTime = current;
      if (visible) frame = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") target = pointerToTime(e.clientX / window.innerWidth);
    };
    const onLeave = () => (target = FRONT_TIME);
    const onReady = () => {
      setReady(true);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible && v.readyState >= 2) frame = requestAnimationFrame(tick);
    });

    io.observe(v);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    if (v.readyState >= 2) onReady();
    else v.addEventListener("loadeddata", onReady, { once: true });

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      v.removeEventListener("loadeddata", onReady);
    };
  }, [mode, src]);

  const poster = withBase("/images/hero-poster-1600.webp");

  return (
    <div aria-hidden="true" className="absolute inset-0">
      <img
        src={poster}
        srcSet={`${withBase("/images/hero-poster-960.webp")} 960w, ${poster} 1600w`}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
      />
      {src && (
        <video
          ref={video}
          key={src}
          src={src}
          muted
          playsInline
          preload="auto"
          autoPlay={mode === "loop"}
          loop={mode === "loop"}
          onLoadedData={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover object-[62%_center] transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_8%_18%,rgb(4_8_20/0.55),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_96%_92%,rgb(4_8_20/0.55),transparent_70%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink-950/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.fromTo("[data-hero='hello']", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.3)
          .fromTo("[data-hero='role']", { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.12 }, "-=0.35")
          .fromTo(
            "[data-hero='cta'] > *",
            { y: 16, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, clearProps: "transform,opacity,visibility" },
            "-=0.6",
          )
          .fromTo("[data-hero='line']", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12 }, "-=0.5")
          .fromTo("[data-hero='panel']", { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06 }, "-=0.6");

        gsap.to("[data-hero='content']", {
          yPercent: -8,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "35% top", end: "bottom top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate h-[100svh] min-h-[640px] overflow-hidden bg-ink-950"
    >
      <HeroScene />

      <div data-hero="content" className="wrap relative z-10 flex h-full flex-col justify-between pt-28 pb-10 [text-shadow:0_2px_24px_rgb(0_0_0/0.35)] sm:pb-14">
        <div className="max-w-2xl">
          <p data-hero="hello" className="font-mono text-xs tracking-[0.3em] text-white/85 uppercase">
            {profile.name} · {profile.location}
          </p>
          <h1 id="hero-title" className="mt-4 font-display text-[clamp(2.1rem,4.4vw,3.75rem)] leading-[1.02] font-bold tracking-[-0.03em] text-white">
            <span className="sr-only">{profile.name}, </span>
            {profile.roles.map((role, i) => (
              <span key={role} className="block overflow-hidden pb-1">
                <span data-hero="role" className="block">
                  {role}
                  {i === 0 && <span className="text-cyan-soft">,</span>}
                  {i === 1 && <span className="text-cyan-soft"> &amp;</span>}
                </span>
              </span>
            ))}
          </h1>

          <div data-hero="cta" className="mt-7 flex flex-wrap gap-2.5 [text-shadow:none]">
            <a href="#projects" className="btn-primary group !px-4 !py-2.5 text-[13px]">
              Explore My Work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href={withBase(profile.resume)} download className="btn-ghost !border-white/25 !bg-ink-950/35 !px-4 !py-2.5 text-[13px] backdrop-blur-md">
              <Download className="h-4 w-4" aria-hidden="true" /> Download Resume
            </a>
            <a href="#contact" className="btn-ghost !border-white/25 !bg-ink-950/35 !px-4 !py-2.5 text-[13px] backdrop-blur-md">
              <Mail className="h-4 w-4" aria-hidden="true" /> Connect With Me
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="order-2 lg:order-1">
            <ul className="hidden max-w-xl flex-wrap gap-2 [text-shadow:none] md:flex" aria-label="Core focus areas">
              {heroPanels.map((panel) => (
                <li
                  key={panel.label}
                  data-hero="panel"
                  title={panel.detail}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-ink-950/45 py-1.5 pr-3.5 pl-1.5 text-[12px] font-medium text-white backdrop-blur-md"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-cyan/30 to-violet/30 text-cyan-soft">
                    <Icon name={panel.icon} className="h-3.5 w-3.5" />
                  </span>
                  {panel.label}
                </li>
              ))}
            </ul>
            <ul data-hero="cta" className="mt-4 flex items-center gap-2 [text-shadow:none]" aria-label="Social profiles">
              <li>
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className="grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-ink-950/40 text-white/85 backdrop-blur-md transition-colors hover:border-cyan/60 hover:text-white">
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className="grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-ink-950/40 text-white/85 backdrop-blur-md transition-colors hover:border-cyan/60 hover:text-white">
                  <GithubIcon className="h-4 w-4" />
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} aria-label="Send an email" className="grid h-9 w-9 place-items-center rounded-xl border border-white/20 bg-ink-950/40 text-white/85 backdrop-blur-md transition-colors hover:border-cyan/60 hover:text-white">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <p className="order-1 text-left font-display text-[clamp(1.35rem,3vw,2.5rem)] leading-[1.08] font-bold tracking-[-0.02em] text-white lg:order-2 lg:max-w-[30rem] lg:text-right">
            {profile.tagline.map((line, i) => (
              <span key={line} data-hero="line" className={`block ${i === 2 ? "text-cyan-soft" : ""}`}>
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>

      <a href="#about" aria-label="Scroll to About section" className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 text-white/70 transition-colors hover:text-white lg:block">
        <ArrowDown className="animate-float h-5 w-5" aria-hidden="true" />
      </a>
    </section>
  );
}
