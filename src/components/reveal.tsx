"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Animate direct children one after another instead of the wrapper as a whole. */
  stagger?: number;
  y?: number;
  delay?: number;
};

export function Reveal({ children, as: Tag = "div", className, stagger, y = 16, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = stagger ? Array.from(el.children) : [el];
        // Short fade/slide only — no blur. Blur + long duration reads as laggy or broken.
        gsap.fromTo(
          targets,
          { y, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            delay,
            ease: "power2.out",
            stagger: stagger ?? 0,
            clearProps: "transform,opacity,visibility",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
