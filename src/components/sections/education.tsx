import { GraduationCap, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { Reveal } from "../reveal";
import { SectionHeading } from "../section-heading";

export function Education() {
  const { degree, institution, location } = profile.education;
  return (
    <section id="education" aria-labelledby="education-title" className="relative py-24 md:py-28">
      <div className="wrap">
        <SectionHeading id="education-title" index="06" eyebrow="Education" title={<>Academic <span className="text-gradient">foundation</span></>} />
        <Reveal>
          <article className="glass-strong group relative overflow-hidden rounded-[2rem] p-8 md:p-12">
            <div aria-hidden="true" className="absolute -top-32 -right-20 h-72 w-72 rounded-full bg-gradient-to-br from-violet/25 to-electric/10 blur-3xl transition-transform duration-700 group-hover:scale-110" />
            <div className="relative flex flex-col gap-8 md:flex-row md:items-center">
              <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-cyan/20 via-electric/15 to-violet/25 text-cyan-soft ring-1 ring-white/10">
                <GraduationCap className="h-9 w-9" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-2xl font-semibold md:text-3xl">{degree}</h3>
                <p className="mt-2 text-lg text-haze">{institution}</p>
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-mist">
                  <MapPin className="h-4 w-4 text-cyan-soft" aria-hidden="true" /> {location}
                </p>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
