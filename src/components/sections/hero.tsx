"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Download, Mail } from "lucide-react";
import { profile } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { withBase } from "@/lib/site";
import { Icon, LinkedinIcon } from "../icons";

type SceneMode = "still" | "scrub" | "loop";

// hero-scrub.mp4, checked frame by frame:
// ~2.25 faces the camera, later times (~4.9) turn to the viewer's left.
// Early times (<1.5) look down at the laptop, so right-side tracking holds front pose with a subtle 3D tilt.
const LOOK_FRONT = 2.25;
const LOOK_LEFT = 4.9;

/** Cursor X (0 = left edge, 1 = right edge) maps left half to video turn and right half to subtle 3D tilt. */
function pointerToTime(x: number) {
  const p = Math.min(1, Math.max(0, x));
  if (p <= 0.5) return LOOK_LEFT + ((LOOK_FRONT - LOOK_LEFT) * p) / 0.5;
  return LOOK_FRONT;
}

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
  const canvas = useRef<HTMLCanvasElement>(null);
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
    const surface = canvas.current;
    if (!v || !surface || !src || mode !== "scrub") return;
    const ctx = surface.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Paint only inside `seeked`. Drawing earlier (or on a later video-frame callback) keeps an old
    // picture on screen while currentTime has already moved, so the face looks the wrong way.
    let target = LOOK_FRONT;
    let eased = LOOK_FRONT;
    let targetTilt = 0;
    let easedTilt = 0;
    let shown = -1;
    let pending: number | null = null;
    let busy = false;
    let frame = 0;
    let visible = true;
    let tracking = false;
    let alive = true;

    const paint = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(surface.clientWidth * dpr));
      const h = Math.max(1, Math.round(surface.clientHeight * dpr));
      if (surface.width !== w || surface.height !== h) {
        surface.width = w;
        surface.height = h;
      }
      const vw = v.videoWidth;
      const vh = v.videoHeight;
      if (!vw || !vh) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      const scale = Math.max(w / vw, h / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      ctx.drawImage(v, (w - dw) * 0.62, (h - dh) * 0.5, dw, dh);
    };

    const seek = (time: number) => {
      if (!alive) return;
      const duration = Number.isFinite(v.duration) ? v.duration : 5.9;
      const next = Math.min(Math.max(time, 0.08), Math.max(duration - 0.08, 0.08));
      if (busy) {
        pending = next;
        return;
      }
      if (Math.abs(next - shown) < 1 / 24) return;
      busy = true;
      let settled = false;
      const finish = (fromSeek: boolean) => {
        if (settled) return;
        settled = true;
        v.removeEventListener("seeked", onSeeked);
        window.clearTimeout(timer);
        if (!alive) {
          busy = false;
          return;
        }
        // A timeout means the frame is not ready. Unlock and try again; never draw the previous pose.
        if (fromSeek) {
          paint();
          shown = v.currentTime;
          setReady(true);
        }
        busy = false;
        if (pending != null && Math.abs(pending - shown) >= 1 / 24) {
          const follow = pending;
          pending = null;
          seek(follow);
        } else {
          pending = null;
        }
      };
      const onSeeked = () => finish(true);
      const timer = window.setTimeout(() => finish(false), 180);
      v.addEventListener("seeked", onSeeked);
      v.currentTime = next;
    };

    const tick = () => {
      eased += (target - eased) * 0.62;
      easedTilt += (targetTilt - easedTilt) * 0.18;
      if (visible) {
        seek(eased);
        surface.style.transform =
          Math.abs(easedTilt) > 0.02
            ? `perspective(1200px) rotateY(${easedTilt.toFixed(2)}deg) scale(1.03)`
            : "";
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tracking = true;
      const p = Math.min(1, Math.max(0, e.clientX / window.innerWidth));
      target = pointerToTime(p);
      targetTilt = p > 0.5 ? ((p - 0.5) / 0.5) * 6 : 0;
    };
    const onLeave = () => {
      if (!tracking) return;
      tracking = false;
      target = LOOK_FRONT;
      targetTilt = 0;
    };
    const onReady = () => {
      v.pause();
      seek(LOOK_FRONT);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    const onResize = () => {
      if (shown >= 0) paint();
    };

    io.observe(surface);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    if (v.readyState >= 2) onReady();
    else v.addEventListener("loadeddata", onReady, { once: true });

    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
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
      {src && mode === "loop" && (
        <video
          key={src}
          src={src}
          muted
          playsInline
          preload="auto"
          autoPlay
          loop
          onLoadedData={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover object-[62%_center] transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {src && mode === "scrub" && (
        <>
          <video ref={video} key={src} src={src} muted playsInline preload="auto" className="pointer-events-none absolute inset-0 h-full w-full opacity-0" />
          <canvas
            ref={canvas}
            className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
          />
        </>
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
        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
        tl.fromTo("[data-hero='hello']", { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4 }, 0.05)
          .fromTo(
            "[data-hero='role']",
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.06, clearProps: "transform,opacity,visibility" },
            "-=0.25",
          )
          .fromTo(
            "[data-hero='cta'] > *",
            { y: 12, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.05, clearProps: "transform,opacity,visibility" },
            "-=0.25",
          )
          .fromTo(
            "[data-hero='line']",
            { y: 14, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.05, clearProps: "transform,opacity,visibility" },
            "-=0.2",
          )
          .fromTo(
            "[data-hero='panel']",
            { y: 10, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.04, clearProps: "transform,opacity,visibility" },
            "-=0.25",
          );

        // Soft parallax only — fading the hero copy to invisible on scroll looked broken.
        gsap.to("[data-hero='content']", {
          yPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "40% top", end: "bottom top", scrub: true },
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
              {skillGroups.map((group) => (
                <li
                  key={group.id}
                  data-hero="panel"
                  title={group.skills.join(" · ")}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-ink-950/45 py-1.5 pr-3.5 pl-1.5 text-[12px] font-medium text-white backdrop-blur-md"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-cyan/30 to-violet/30 text-cyan-soft">
                    <Icon name={group.icon} className="h-3.5 w-3.5" />
                  </span>
                  {group.short}
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
