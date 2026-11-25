#!/usr/bin/env node
// Generates optimized WebP images, the Apple touch icon and the social sharing image from design/*.jpg.
// Run with `npm run images` after replacing a source photo; outputs are committed to public/ and src/app/.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "public/images");
mkdirSync(OUT, { recursive: true });

const photos = [
  { src: "hero-portrait.jpg", name: "hero-portrait", sizes: [480, 768] },
  { src: "about-workspace.jpg", name: "about-workspace", sizes: [480, 768] },
  { src: "contact-profile.jpg", name: "contact-profile", sizes: [640, 1024] },
];

for (const { src, name, sizes } of photos) {
  for (const size of sizes) {
    await sharp(path.join(ROOT, "design", src))
      .rotate()
      .resize({ width: size, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(path.join(OUT, `${name}-${size}.webp`));
  }
}

const monogram = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 64 64">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="0.55" stop-color="#3b82f6"/><stop offset="1" stop-color="#a855f7"/></linearGradient></defs>
  <rect width="64" height="64" rx="14" fill="#070b18"/>
  <rect x="1.5" y="1.5" width="61" height="61" rx="12.5" fill="none" stroke="url(#g)" stroke-width="3"/>
  <text x="32" y="42" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-weight="700" font-size="26" fill="url(#g)">NP</text>
</svg>`;
await sharp(Buffer.from(monogram)).png().toFile(path.join(ROOT, "src/app/apple-icon.png"));

// Social sharing card: portrait on the right, faded into the background on its left and bottom edges.
const W = 1200;
const H = 630;
const PW = 470;
const portrait = await sharp(path.join(ROOT, "design/og-portrait.jpg")).resize({ width: PW, height: H, fit: "cover", position: "top" }).toBuffer();
const fade = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${PW}" height="${H}">
  <defs>
    <linearGradient id="h" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.35" stop-color="#fff" stop-opacity="1"/></linearGradient>
  </defs>
  <rect width="${PW}" height="${H}" fill="url(#h)"/>
</svg>`);
const fadedPortrait = await sharp(portrait).ensureAlpha().composite([{ input: fade, blend: "dest-in" }]).png().toBuffer();

const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="a" cx="0.82" cy="0.35" r="0.6"><stop offset="0" stop-color="#1d4ed8" stop-opacity="0.45"/><stop offset="1" stop-color="#05070f" stop-opacity="0"/></radialGradient>
    <radialGradient id="b" cx="0.1" cy="1" r="0.7"><stop offset="0" stop-color="#7c3aed" stop-opacity="0.45"/><stop offset="1" stop-color="#05070f" stop-opacity="0"/></radialGradient>
    <linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset="0.6" stop-color="#60a5fa"/><stop offset="1" stop-color="#c084fc"/></linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#93c5fd" stroke-opacity="0.06"/></pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="#05070f"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#a)"/>
  <rect width="${W}" height="${H}" fill="url(#b)"/>
  <g font-family="DejaVu Sans, Arial, sans-serif">
    <text x="72" y="150" font-size="22" fill="#67e8f9" letter-spacing="5">PORTFOLIO</text>
    <text x="72" y="235" font-size="76" font-weight="700" fill="#f8fafc">Naresh Palle</text>
    <text x="72" y="292" font-size="28" fill="url(#t)" font-weight="700">Senior QA Engineer · DevOps Engineer</text>
    <text x="72" y="332" font-size="28" fill="url(#t)" font-weight="700">AI Solutions Architect</text>
    <text x="72" y="420" font-size="24" fill="#cbd5e1">Engineering Quality. Automating Infrastructure.</text>
    <text x="72" y="456" font-size="24" fill="#cbd5e1">Architecting Intelligent AI Solutions.</text>
    <text x="72" y="552" font-size="20" fill="#94a3b8">12+ years in IT · QA · DevOps · Cloud · AI</text>
  </g>
  <rect x="72" y="372" width="120" height="3" rx="1.5" fill="url(#t)"/>
</svg>`;
await sharp(Buffer.from(og))
  .composite([{ input: fadedPortrait, left: W - PW, top: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(ROOT, "public/og-image.jpg"));

console.log("Images written to public/images, public/og-image.jpg and src/app/apple-icon.png");
