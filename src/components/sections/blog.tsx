"use client";

import dynamic from "next/dynamic";
import { SectionHeading } from "../section-heading";

const BlogExplorer = dynamic(() => import("../blog/blog-explorer"), {
  ssr: false,
  loading: () => <div className="glass h-40 animate-pulse rounded-[1.6rem]" aria-hidden="true" />,
});

export function Blog() {
  return (
    <section id="blog" aria-labelledby="blog-title" className="relative py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          id="blog-title"
          index="05"
          eyebrow="Knowledge library"
          title={
            <>
              Technical <span className="text-gradient">blog</span>
            </>
          }
          description="Browse and read technical articles directly on this page. The archive is synchronized from BinaryBlogs on WordPress, and every article keeps a link to its original."
        />
        <BlogExplorer />
      </div>
    </section>
  );
}
