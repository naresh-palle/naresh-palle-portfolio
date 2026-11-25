import type { ProjectStatus } from "@/content/projects";
import { EVIDENCE } from "./flow/evidence";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10.5px] tracking-wide uppercase ${EVIDENCE[status.tone].badge}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {status.label}
    </span>
  );
}
