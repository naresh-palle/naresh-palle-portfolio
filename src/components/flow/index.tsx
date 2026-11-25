"use client";

import dynamic from "next/dynamic";

export const ArchitectureFlow = dynamic(() => import("./architecture-flow"), {
  ssr: false,
  loading: () => <div className="glass h-[560px] animate-pulse rounded-[1.6rem] md:h-[640px]" aria-hidden="true" />,
});
