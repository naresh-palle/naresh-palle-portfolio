import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Info, Rocket, ShieldCheck, Target, Wrench } from "lucide-react";
import { ArchitectureFlow } from "@/components/flow";
import { EVIDENCE } from "@/components/flow/evidence";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";
import { diagrams } from "@/content/diagrams";
import { getProject, projects } from "@/content/projects";
import { absoluteUrl, SITE_URL } from "@/lib/site";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const url = absoluteUrl(`/projects/${project.slug}/`);
  return {
    title: `${project.name} — Case study`,
    description: project.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${project.name} — Case study by Naresh Palle`,
      description: project.summary,
      images: [{ url: absoluteUrl("/og-image.jpg"), width: 1200, height: 630 }],
    },
  };
}

function Panel({ id, icon, eyebrow, tone, children }: { id: string; icon: React.ReactNode; eyebrow: string; tone: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-[1.6rem] p-7 md:p-8" aria-labelledby={id}>
      <h2 id={id} className={`flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase ${tone}`}>
        {icon} {eyebrow}
      </h2>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-haze">
          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const links = project.links.articles ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}/`),
    author: { "@id": `${SITE_URL}/#person` },
    keywords: project.stack.join(", "),
  };

  return (
    <article className="pt-28 pb-24 md:pt-36">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap">
        <Reveal>
          <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All case studies
          </Link>
        </Reveal>

        <header className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <Reveal stagger={0.08}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan/20 via-electric/10 to-violet/25 text-cyan-soft ring-1 ring-white/10">
                <Icon name={project.icon} className="h-5 w-5" />
              </span>
              <StatusBadge status={project.status} />
              <span className="font-mono text-[11px] tracking-wider text-mist uppercase">{project.categories.join(" · ")}</span>
            </div>
            <h1 className="mt-6 text-[clamp(2.3rem,5.5vw,4.3rem)] leading-[1] font-bold tracking-[-0.035em]">{project.name}</h1>
            <p className="mt-3 font-mono text-sm text-cyan-soft">{project.tagline}</p>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-haze">{project.overview}</p>
          </Reveal>

          <Reveal className="glass-strong rounded-[1.6rem] p-6">
            <p className="font-mono text-[11px] tracking-[0.18em] text-mist uppercase">Related articles</p>
            <div className="mt-4 flex flex-col gap-2.5">
              {links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="btn-ghost justify-between !text-[13px]">
                  <span className="inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4" aria-hidden="true" /> {l.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              ))}
              {!links.length && <p className="text-sm text-mist">No public article links for this case study.</p>}
            </div>
            {project.note && (
              <p className="mt-5 flex gap-2 border-t border-line pt-4 text-[12.5px] leading-relaxed text-mist">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-soft" aria-hidden="true" />
                {project.note}
              </p>
            )}
          </Reveal>
        </header>

        <Reveal className="mt-16">
          <Panel id="problem" icon={<Target className="h-4 w-4" aria-hidden="true" />} eyebrow="The problem" tone="text-amber-200">
            <p className="mt-4 max-w-3xl text-[16px] leading-relaxed text-haze">{project.problem}</p>
          </Panel>
        </Reveal>

        <section className="mt-16" aria-labelledby="architecture">
          <Reveal>
            <span className="eyebrow">Architecture</span>
            <h2 id="architecture" className="mt-3 mb-6 text-3xl font-semibold">
              {diagrams[project.diagram].title}
            </h2>
          </Reveal>
          <Reveal>
            <ArchitectureFlow id={project.diagram} />
          </Reveal>
        </section>

        <div className="mt-16 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="glass rounded-[1.6rem] p-7 md:p-8" aria-labelledby="scope">
            <h2 id="scope" className="text-2xl font-semibold">
              Scope &amp; evidence
            </h2>
            <p className="mt-2 text-[13.5px] text-mist">What is implemented publicly, documented, done in professional work, or still planned.</p>
            <ul className="mt-6 divide-y divide-line">
              {project.scope.map((s) => (
                <li key={s.label} className="flex flex-col gap-1.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span className="text-[14.5px] leading-snug text-haze">{s.label}</span>
                  <span className={`inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase sm:self-auto ${EVIDENCE[s.evidence].badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${EVIDENCE[s.evidence].dot}`} aria-hidden="true" />
                    {EVIDENCE[s.evidence].label}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <section className="glass rounded-[1.6rem] p-7 md:p-8" aria-labelledby="stack">
            <h2 id="stack" className="text-2xl font-semibold">
              Technology stack
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <li key={s} className="chip !border-line-strong !px-3.5 !py-1.5 !text-[13px]">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-16" aria-labelledby="challenges">
          <Reveal>
            <span className="eyebrow">Engineering challenges</span>
            <h2 id="challenges" className="mt-3 mb-6 text-3xl font-semibold">
              What makes it hard
            </h2>
          </Reveal>
          <Reveal stagger={0.08} className="grid gap-4 md:grid-cols-2">
            {project.challenges.map((c, i) => (
              <div key={c.title} className="glass rounded-2xl p-6">
                <p className="font-mono text-[11px] text-cyan-soft">0{i + 1}</p>
                <h3 className="mt-2 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-haze">{c.body}</p>
              </div>
            ))}
          </Reveal>
        </section>

        <section className="mt-16 glass rounded-[1.6rem] p-7 md:p-8" aria-labelledby="approach">
          <h2 id="approach" className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-emerald-300 uppercase">
            <Wrench className="h-4 w-4" aria-hidden="true" /> Implementation approach
          </h2>
          <ol className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-2">
            {project.approach.map((step, i) => (
              <li key={step} className="flex gap-4 text-[15px] leading-relaxed text-haze">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-cyan/20 to-violet/20 font-mono text-[12px] text-cyan-soft">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Panel id="security" icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />} eyebrow="Security considerations" tone="text-violet-soft">
            <Bullets items={project.security} />
          </Panel>
          <Panel id="deployment" icon={<Rocket className="h-4 w-4" aria-hidden="true" />} eyebrow="Deployment approach" tone="text-electric-soft">
            <Bullets items={project.deployment} />
          </Panel>
        </div>

        <nav aria-label="More case studies" className="mt-16 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
          <Link href={`/projects/${prev.slug}/`} className="group glass rounded-2xl p-5 transition-colors hover:border-cyan/35">
            <span className="flex items-center gap-2 font-mono text-[11px] text-mist uppercase">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" /> Previous
            </span>
            <span className="mt-2 block font-display text-lg font-semibold text-white">{prev.name}</span>
          </Link>
          <Link href={`/projects/${next.slug}/`} className="group glass rounded-2xl p-5 text-right transition-colors hover:border-cyan/35">
            <span className="flex items-center justify-end gap-2 font-mono text-[11px] text-mist uppercase">
              Next <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
            <span className="mt-2 block font-display text-lg font-semibold text-white">{next.name}</span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
