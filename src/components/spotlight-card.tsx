"use client";

import type { HTMLAttributes, PointerEvent } from "react";

export function SpotlightCard({ className = "", onPointerMove, ...props }: HTMLAttributes<HTMLDivElement>) {
  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
    onPointerMove?.(e);
  };
  return <div onPointerMove={handleMove} className={`spotlight ${className}`} {...props} />;
}
