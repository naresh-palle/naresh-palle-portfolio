import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Backdrop } from "@/components/backdrop";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import { absoluteUrl, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", weight: ["400", "500"] });

const title = "Naresh Palle | Senior QA Engineer, DevOps & AI Solutions Architect";
const description =
  "Naresh Palle — 12+ years across Quality Engineering, Cybersecurity, Telecom OSS/BSS, DevOps, Cloud Infrastructure and AI-enabled Automation. Projects, career journey and technical articles.";
const ogImage = absoluteUrl("/og-image.jpg");

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: { default: title, template: "%s | Naresh Palle" },
  description,
  applicationName: "Naresh Palle Portfolio",
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    "Naresh Palle",
    "Senior QA Engineer",
    "DevOps Engineer",
    "AI Solutions Architect",
    "Quality Engineering",
    "Test Automation",
    "Kubernetes",
    "AWS EKS",
    "DevSecOps",
    "RAG",
    "AI Agents",
    "n8n",
    "Hyderabad",
  ],
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/`,
    siteName: "Naresh Palle",
    title,
    description,
    locale: "en_US",
    firstName: "Naresh",
    lastName: "Palle",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Naresh Palle — Senior QA Engineer, DevOps Engineer, AI Solutions Architect" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#05070f",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.name,
      url: `${SITE_URL}/`,
      image: ogImage,
      jobTitle: profile.roles.join(", "),
      description: profile.summary,
      email: `mailto:${profile.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
      alumniOf: { "@type": "CollegeOrUniversity", name: profile.education.institution, address: profile.education.location },
      sameAs: [profile.links.linkedin, profile.links.github, profile.links.blog],
      knowsAbout: skillGroups.flatMap((g) => g.skills).slice(0, 40),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Naresh Palle — Portfolio",
      author: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen overflow-x-hidden">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <Backdrop />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
