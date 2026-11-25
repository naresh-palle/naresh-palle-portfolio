import { Reveal } from "./reveal";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  id,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  id?: string;
}) {
  return (
    <Reveal stagger={0.09} className="mb-12 grid gap-5 md:mb-16 md:grid-cols-[1.1fr_0.9fr] md:items-end">
      <div>
        <span className="eyebrow">
          <span className="text-mist">{index}</span>
          <span className="h-px w-8 bg-gradient-to-r from-cyan to-transparent" />
          {eyebrow}
        </span>
        <h2 id={id} className="mt-4 text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] font-semibold">
          {title}
        </h2>
      </div>
      {description ? <p className="max-w-xl text-[15px] leading-relaxed text-mist md:justify-self-end">{description}</p> : <span />}
    </Reveal>
  );
}
