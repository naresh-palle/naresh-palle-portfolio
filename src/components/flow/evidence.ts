import type { Evidence } from "@/content/projects";

export const EVIDENCE: Record<Evidence | "context", { label: string; dot: string; text: string; badge: string }> = {
  code: { label: "Public code", dot: "bg-emerald-400", text: "text-emerald-300", badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" },
  documented: { label: "Documented on BinaryBlogs", dot: "bg-cyan", text: "text-cyan-soft", badge: "border-cyan/30 bg-cyan/10 text-cyan-soft" },
  practice: { label: "Professional practice", dot: "bg-electric", text: "text-electric-soft", badge: "border-electric/35 bg-electric/10 text-electric-soft" },
  plan: { label: "Planned", dot: "bg-amber-300", text: "text-amber-200", badge: "border-amber-300/30 bg-amber-300/10 text-amber-200" },
  context: { label: "Context", dot: "bg-slate-500", text: "text-mist", badge: "border-line bg-white/5 text-mist" },
};
