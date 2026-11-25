import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center pt-24">
      <div className="wrap text-center">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] font-bold">
          Page <span className="text-gradient">not found</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-mist">The page you were looking for doesn&apos;t exist or has moved.</p>
        <Link href="/" className="btn-primary mt-8">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to home
        </Link>
      </div>
    </section>
  );
}
