export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0b1430_0%,#05070f_55%,#03050b_100%)]" />
      <div className="grid-bg absolute inset-0" />
      <div className="animate-drift absolute -top-[18%] right-[-10%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgb(59_130_246/0.22),transparent_62%)] blur-2xl" />
      <div className="animate-drift absolute bottom-[-25%] left-[-15%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,rgb(168_85_247/0.16),transparent_62%)] blur-2xl [animation-delay:-8s]" />
      <div className="animate-drift absolute top-[35%] left-[30%] h-[35vmax] w-[35vmax] rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.08),transparent_65%)] blur-2xl [animation-delay:-14s]" />
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />
    </div>
  );
}
