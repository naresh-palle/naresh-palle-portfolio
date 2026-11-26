"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { skillGroups } from "@/content/skills";
import { Icon } from "../icons";
import { Reveal } from "../reveal";
import { SectionHeading } from "../section-heading";
import { SpotlightCard } from "../spotlight-card";

const accentRing = {
  cyan: "from-cyan/30 to-cyan/5 text-cyan-soft",
  blue: "from-electric/35 to-electric/5 text-electric-soft",
  purple: "from-violet/35 to-violet/5 text-violet-soft",
} as const;

export function Expertise() {
  const [activeId, setActiveId] = useState(skillGroups[0].id);
  const active = skillGroups.find((g) => g.id === activeId) ?? skillGroups[0];
  const total = skillGroups.reduce((n, g) => n + g.skills.length, 0);

  return (
    <section id="expertise" aria-labelledby="expertise-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          id="expertise-title"
          index="02"
          eyebrow="Expertise"
          title={
            <>
              Technology <span className="text-gradient">toolkit</span>
            </>
          }
          description={`${skillGroups.length} domains and ${total} technologies, grouped by the work each set of tools helps deliver — not just a list of logos.`}
        />

        <Reveal className="glass-strong grid overflow-hidden rounded-[2rem] lg:grid-cols-[320px_1fr]">
          <div role="tablist" aria-label="Expertise categories" aria-orientation="vertical" className="flex gap-2 overflow-x-auto border-b border-line p-3 lg:flex-col lg:overflow-visible lg:border-r lg:border-b-0 lg:p-4">
            {skillGroups.map((g) => {
              const selected = g.id === activeId;
              return (
                <button
                  key={g.id}
                  role="tab"
                  id={`tab-${g.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${g.id}`}
                  onClick={() => setActiveId(g.id)}
                  onKeyDown={(e) => {
                    const i = skillGroups.findIndex((x) => x.id === g.id);
                    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
                    if (!next) return;
                    e.preventDefault();
                    const target = skillGroups[(i + next + skillGroups.length) % skillGroups.length];
                    setActiveId(target.id);
                    document.getElementById(`tab-${target.id}`)?.focus();
                  }}
                  tabIndex={selected ? 0 : -1}
                  className={`relative flex shrink-0 items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors lg:w-full ${
                    selected ? "text-white" : "text-mist hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  {selected && (
                    <motion.span layoutId="skill-tab" className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan/15 via-electric/10 to-violet/15 ring-1 ring-cyan/25" transition={{ type: "spring", stiffness: 350, damping: 32 }} />
                  )}
                  <span className={`relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${accentRing[g.accent]}`}>
                    <Icon name={g.icon} className="h-[18px] w-[18px]" />
                  </span>
                  <span className="relative text-sm font-semibold whitespace-nowrap">{g.title}</span>
                  <span className="relative ml-auto hidden font-mono text-[11px] text-mist lg:block">{String(g.skills.length).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[360px] p-6 md:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                role="tabpanel"
                id={`panel-${active.id}`}
                aria-labelledby={`tab-${active.id}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-semibold md:text-3xl">{active.title}</h3>
                    <p className="mt-2 max-w-xl text-[15px] text-mist">{active.blurb}</p>
                  </div>
                  <span className={`hidden h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br md:grid ${accentRing[active.accent]}`}>
                    <Icon name={active.icon} className="h-6 w-6" />
                  </span>
                </div>
                <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {active.skills.map((skill, i) => (
                    <motion.li key={skill} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.025 * i, duration: 0.25 }}>
                      <SpotlightCard className="group h-full rounded-xl border border-line bg-white/[0.025] px-4 py-3.5 transition-colors hover:border-cyan/40">
                        <span className="flex items-center gap-2.5 text-[13.5px] font-medium text-haze group-hover:text-white">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-cyan to-violet" aria-hidden="true" />
                          {skill}
                        </span>
                      </SpotlightCard>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal as="ul" stagger={0.04} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((g) => (
            <li key={g.id}>
              <SpotlightCard className="glass h-full rounded-2xl p-5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(g.id);
                    document.getElementById(`tab-${g.id}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
                  }}
                  className="w-full text-left"
                  aria-label={`Show ${g.title} skills`}
                >
                  <span className="flex items-center gap-3">
                    <Icon name={g.icon} className={`h-4 w-4 ${accentRing[g.accent].split(" ").pop()}`} />
                    <span className="text-sm font-semibold text-white">{g.title}</span>
                  </span>
                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {g.skills.slice(0, 5).map((s) => (
                      <span key={s} className="chip !px-2.5 !py-0.5 !text-[11px]">
                        {s}
                      </span>
                    ))}
                    {g.skills.length > 5 && <span className="chip !px-2.5 !py-0.5 !text-[11px] !text-cyan-soft">+{g.skills.length - 5}</span>}
                  </span>
                </button>
              </SpotlightCard>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
