"use client";

import { useState } from "react";
import { ArrowUpRight, BookOpen, Check, Copy, Download, Mail, MapPin } from "lucide-react";
import { profile } from "@/content/profile";
import { withBase } from "@/lib/site";
import { LinkedinIcon } from "../icons";
import { Photo } from "../photo";
import { Reveal } from "../reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const channels = [
    { href: profile.links.linkedin, label: "LinkedIn", value: "in/nareshpalle", icon: <LinkedinIcon className="h-5 w-5" /> },
    { href: profile.links.blog, label: "BinaryBlogs", value: "Technical writing", icon: <BookOpen className="h-5 w-5" aria-hidden="true" /> },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <Reveal>
          {/* Split panel: portrait stays in its own column so it never sits under the copy. */}
          <div className="glass-strong grid overflow-hidden rounded-[2.25rem] md:grid-cols-[minmax(260px,0.9fr)_1.15fr]">
            <div className="relative min-h-[280px] bg-ink-950 sm:min-h-[360px] md:min-h-full">
              <Photo
                photo={profile.photos.contact}
                sizes="(min-width: 768px) 40vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-900/80 to-transparent md:hidden" />
              <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-ink-900/40 to-transparent md:block" />
            </div>

            <div className="relative bg-ink-900/95 p-7 sm:p-10 md:p-12 lg:p-14">
              <span className="eyebrow">
                <span className="text-mist">07</span>
                <span className="h-px w-8 bg-gradient-to-r from-cyan to-transparent" />
                Contact
              </span>
              <h2 id="contact-title" className="mt-4 text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] font-semibold">
                Let&apos;s connect
                <br />
                <span className="text-gradient">and build.</span>
              </h2>
              <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-haze">
                For professional opportunities, technical collaboration, and AI, quality engineering or platform engineering discussions.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href={`mailto:${profile.email}`} className="btn-primary">
                  <Mail className="h-4 w-4" aria-hidden="true" /> {profile.email}
                </a>
                <button type="button" onClick={copyEmail} className="btn-ghost" aria-live="polite">
                  {copied ? <Check className="h-4 w-4 text-emerald-300" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                  {copied ? "Copied" : "Copy email"}
                </button>
                <a href={withBase(profile.resume)} download className="btn-ghost">
                  <Download className="h-4 w-4" aria-hidden="true" /> Resume
                </a>
              </div>

              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group glass flex h-full items-center gap-3 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-cyan/40"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.05] text-white">{c.icon}</span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1 text-sm font-semibold text-white">
                          {c.label} <ArrowUpRight className="h-3.5 w-3.5 text-mist transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                        </span>
                        <span className="block truncate text-xs text-mist">{c.value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-6 inline-flex items-center gap-2 text-sm text-mist">
                <MapPin className="h-4 w-4 text-cyan-soft" aria-hidden="true" /> {profile.location}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
