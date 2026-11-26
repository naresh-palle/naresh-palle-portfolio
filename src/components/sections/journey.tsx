"use client";

import { useRef } from "react";
import { journey } from "@/content/journey";
import { gsap, MOTION_OK, useGSAP } from "@/lib/gsap";
import { Icon } from "../icons";
import { SectionHeading } from "../section-heading";

export function Journey() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-journey='progress']",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 75%", end: "bottom 55%", scrub: 0.35 } },
        );
        gsap.utils.toArray<HTMLElement>("[data-journey='item']").forEach((item) => {
          const fromLeft = item.dataset.side === "left";
          gsap.fromTo(
            item.querySelector("[data-journey='card']"),
            { x: fromLeft ? -20 : 20, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.45,
              ease: "power2.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: { trigger: item, start: "top 85%", once: true },
            },
          );
          gsap.fromTo(
            item.querySelector("[data-journey='node']"),
            { scale: 0.7, autoAlpha: 0 },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.35,
              ease: "power2.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: { trigger: item, start: "top 85%", once: true },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="journey" aria-labelledby="journey-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          id="journey-title"
          index="04"
          eyebrow="Career journey"
          title={
            <>
              A continuous <span className="text-gradient">engineering evolution</span>
            </>
          }
          description="Three chapters, each building on the last: quality first, then platforms and automation, now intelligent systems."
        />

        <div ref={root} className="relative">
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-[19px] w-px bg-line md:left-1/2 md:-translate-x-1/2" />
          <div
            aria-hidden="true"
            data-journey="progress"
            className="absolute top-0 bottom-0 left-[19px] w-px origin-top bg-gradient-to-b from-cyan via-electric to-violet shadow-[0_0_12px_rgb(34_211_238/0.6)] md:left-1/2 md:-translate-x-1/2"
          />

          <ol className="space-y-12 md:space-y-16">
            {journey.map((step, i) => {
              const side = i % 2 === 0 ? "left" : "right";
              return (
                <li key={step.period} data-journey="item" data-side={side} className="relative grid md:grid-cols-2 md:gap-16">
                  <span
                    data-journey="node"
                    aria-hidden="true"
                    className="absolute top-6 left-0 grid h-10 w-10 place-items-center rounded-full border border-cyan/40 bg-ink-850 text-cyan-soft shadow-[0_0_0_6px_rgb(34_211_238/0.08)] md:left-1/2 md:-translate-x-1/2"
                  >
                    <Icon name={step.icon} className="h-4 w-4" />
                    {step.current && <span className="animate-pulse-ring absolute inset-0 rounded-full border border-cyan" />}
                  </span>

                  <article
                    data-journey="card"
                    className={`glass group ml-16 rounded-[1.6rem] p-6 transition-colors hover:border-cyan/35 md:ml-0 md:p-8 ${
                      side === "left" ? "md:col-start-1 md:text-right" : "md:col-start-2"
                    }`}
                  >
                    <p className={`flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-cyan-soft uppercase ${side === "left" ? "md:justify-end" : ""}`}>
                      {step.period}
                      {step.current && <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] tracking-normal text-emerald-300 normal-case">Current</span>}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold">{step.title}</h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-mist">{step.body}</p>
                    <ul className={`mt-5 flex flex-wrap gap-1.5 ${side === "left" ? "md:justify-end" : ""}`}>
                      {step.focus.map((f) => (
                        <li key={f} className="chip !text-[11.5px]">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
