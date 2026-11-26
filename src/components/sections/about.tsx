import { aboutPillars, aboutStats, profile } from "@/content/profile";
import { Icon } from "../icons";
import { Photo } from "../photo";
import { Reveal } from "../reveal";
import { SectionHeading } from "../section-heading";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          id="about-title"
          index="01"
          eyebrow="About me"
          title={
            <>
              From quality engineering
              <br />
              to <span className="text-gradient">AI-enabled automation.</span>
            </>
          }
          description="A practical engineering foundation, evolving toward intelligent systems and workflow orchestration."
        />

        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal className="relative mx-auto w-full max-w-[460px]">
            <div className="glass relative overflow-hidden rounded-[2rem] p-2">
              <Photo photo={profile.photos.workspace} sizes="(min-width: 1024px) 440px, 90vw" className="aspect-[4/5] w-full rounded-[1.6rem] object-cover object-top" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-[1.6rem] bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
              <p className="absolute bottom-6 left-6 font-mono text-[11px] tracking-[0.2em] text-cyan-soft uppercase">Engineering · Automation · AI</p>
            </div>
          </Reveal>

          <div>
            <Reveal stagger={0.05} className="space-y-5 text-[16.5px] leading-relaxed text-haze">
              <p>
                I&apos;m <strong className="text-white">{profile.name}</strong> — a technology professional with{" "}
                <strong className="text-white">12+ years of IT experience</strong> across quality engineering, DevOps, cloud-native platforms, and
                AI-enabled automation. I connect engineering discipline with practical AI applications to solve real operational problems.
              </p>
              <p>
                My foundation is in software quality: automated testing, security validation and release quality in{" "}
                <span className="text-white">cybersecurity</span> and <span className="text-white">telecom OSS/BSS</span> environments. That grew into
                DevOps and cloud engineering — Linux, CI/CD, infrastructure as code, Kubernetes platforms and production troubleshooting.
              </p>
              <p>
                Today I build and explore AI-powered applications, RAG-based knowledge experiences, agentic workflows and n8n automation — grounded
                in operational reliability, security, and maintainability.
              </p>
            </Reveal>

            <Reveal stagger={0.04} className="mt-10 grid grid-cols-3 gap-3">
              {aboutStats.map((s) => (
                <div key={s.label} className="glass rounded-2xl px-4 py-5 text-center">
                  <p className="font-display text-3xl font-bold text-gradient md:text-4xl">{s.value}</p>
                  <p className="mt-1 text-xs text-mist">{s.label}</p>
                </div>
              ))}
            </Reveal>

            <Reveal as="ul" stagger={0.04} className="mt-10 grid gap-3 sm:grid-cols-2">
              {aboutPillars.map((p, i) => (
                <li
                  key={p.title}
                  className={`group glass rounded-2xl p-5 transition-colors hover:border-cyan/30 ${i === aboutPillars.length - 1 ? "sm:col-span-2" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan/15 to-violet/15 text-cyan-soft ring-1 ring-white/10 transition-transform group-hover:scale-110">
                      <Icon name={p.icon} className="h-[18px] w-[18px]" />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold">{p.title}</h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist">{p.body}</p>
                    </div>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
