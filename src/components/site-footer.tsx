import { profile } from "@/content/profile";
import { LinkedinIcon } from "./icons";
import { BookOpen, Mail } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const links = [
    { href: profile.links.linkedin, label: "LinkedIn", icon: <LinkedinIcon className="h-4 w-4" /> },
    { href: profile.links.blog, label: "BinaryBlogs", icon: <BookOpen className="h-4 w-4" aria-hidden="true" /> },
    { href: `mailto:${profile.email}`, label: "Email", icon: <Mail className="h-4 w-4" aria-hidden="true" /> },
  ];
  return (
    <footer className="relative border-t border-line py-10">
      <div className="wrap flex flex-col items-start justify-between gap-6 text-sm text-mist md:flex-row md:items-center">
        <p>
          © {year} {profile.name} · Personal portfolio
        </p>
        <ul className="flex flex-wrap gap-2">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 transition-colors hover:border-cyan/50 hover:text-white"
              >
                {l.icon}
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
