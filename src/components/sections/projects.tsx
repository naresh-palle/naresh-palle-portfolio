"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layers } from "lucide-react";
import { diagrams, showcaseDiagrams, type DiagramId } from "@/content/diagrams";
import { projectCategories, projects, type ProjectCategory } from "@/content/projects";
import { ArchitectureFlow } from "../flow";
import { Icon } from "../icons";
import { Reveal } from "../reveal";
import { SectionHeading } from "../section-heading";
import { SpotlightCard } from "../spotlight-card";
import { StatusBadge } from "../status-badge";

export function Projects() {
  const [filter, setFilter] = useState<"All" | ProjectCategory>("All");
  const [diagram, setDiagram] = useState<DiagramId>(showcaseDiagrams[0]);
  const visible = useMemo(() => (filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter))), [filter]);

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          id="projects-title"
          index="03"
          eyebrow="Engineering case studies"
          title={
            <>
              QA &amp; DevOps <span className="text-gradient">case studies</span>
            </>
          }
          description="GUI automation, CI/CD, DevSecOps, Kubernetes on AWS and quality strategy. Every component is labelled with its evidence: public code, a BinaryBlogs article, professional practice or a plan."
        />

        <Reveal className="mb-8 flex flex-wrap gap-2">
          <div role="group" aria-label="Filter case studies by category" className="flex flex-wrap gap-2">
            {projectCategories.map((c) => {
              const count = c === "All" ? projects.length : projects.filter((p) => p.categories.includes(c)).length;
              const on = filter === c;
              return (
                <button
                  key={c}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(c)}
                  className={`relative rounded-full px-4 py-2 text-[13px] transition-colors ${on ? "text-white" : "border border-line text-mist hover:text-white"}`}
                >
                  {on && <motion.span layoutId="project-filter" className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan/20 to-violet/20 ring-1 ring-cyan/30" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="relative">
                    {c} <span className="font-mono text-[11px] text-mist">{count}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <motion.ul layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <SpotlightCard className="group glass relative flex h-full flex-col overflow-hidden rounded-[1.6rem] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-cyan/35 hover:shadow-[0_30px_80px_-30px_rgb(34_211_238/0.35)]">
                  <div aria-hidden="true" className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-gradient-to-br from-cyan/20 to-violet/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan/20 via-electric/10 to-violet/25 text-cyan-soft ring-1 ring-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon name={p.icon} className="h-5 w-5" />
                    </span>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="mt-6 font-mono text-[11px] tracking-wider text-mist uppercase">{p.tagline}</p>
                  <h3 className="mt-1.5 text-xl font-semibold">
                    <Link href={`/projects/${p.slug}/`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-[14px] leading-relaxed text-mist">{p.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technology stack">
                    {p.stack.slice(0, 4).map((s) => (
                      <li key={s} className="chip !px-2.5 !py-0.5 !text-[11px]">
                        {s}
                      </li>
                    ))}
                    {p.stack.length > 4 && <li className="chip !px-2.5 !py-0.5 !text-[11px] !text-cyan-soft">+{p.stack.length - 4}</li>}
                  </ul>
                  <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
                    <Link href={`/projects/${p.slug}/`} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] font-semibold text-cyan-soft hover:text-white">
                      <Layers className="h-4 w-4" aria-hidden="true" /> Case study
                    </Link>
                  </div>
                </SpotlightCard>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <div className="mt-20">
          <Reveal>
            <span className="eyebrow">Interactive architecture</span>
            <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.3rem)] leading-tight font-semibold">Explore the reference architectures</h3>
          </Reveal>
          <div role="tablist" aria-label="Architecture diagrams" className="mt-6 mb-5 flex flex-wrap gap-2">
            {showcaseDiagrams.map((id) => {
              const on = diagram === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="architecture-panel"
                  onClick={() => setDiagram(id)}
                  className={`relative rounded-full px-4 py-2 text-[13px] transition-colors ${on ? "text-white" : "border border-line text-mist hover:text-white"}`}
                >
                  {on && <motion.span layoutId="diagram-tab" className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan/20 to-violet/20 ring-1 ring-cyan/30" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className="relative">{diagrams[id].title}</span>
                </button>
              );
            })}
          </div>
          <div id="architecture-panel" role="tabpanel" aria-label={diagrams[diagram].title}>
            <ArchitectureFlow key={diagram} id={diagram} />
          </div>
        </div>
      </div>
    </section>
  );
}
