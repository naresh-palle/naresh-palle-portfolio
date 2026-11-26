---
name: portfolio-e2e-verification
description: End-to-end verification workflow for naresh-palle-portfolio before deploying to Cloudflare Pages. Covers TypeScript check, static build, hero cursor-tracking gaze verification, console/network health, section/image checks, and responsive layout.
---

# Portfolio E2E Verification

Run this verification workflow after any UI, animation, content, or build change before committing and pushing to `main` (which triggers Cloudflare Pages deployment).

## 1. Typecheck & Static Build

From the repository root:

```powershell
npm run typecheck
$env:NEXT_PUBLIC_BASE_PATH=""; npx next build
```

(On macOS/Linux: `npm run typecheck && npm run build:cloudflare`.)

Confirm `out/index.html` and `out/_next` are generated with exit code `0`.

## 2. Serve the Production Export

```powershell
npx --yes serve out -l 4173
```

Always test against the static `out/` export rather than `next dev` so asset paths, `withBase()`, and Cloudflare Pages behavior match production.

## 3. E2E Browser Checks (`http://localhost:4173`)

### A. Console & Network Health
- Verify zero `console.error` messages and zero uncaught `pageerror` exceptions.
- Verify all same-origin assets (`/video/hero-scrub.mp4`, `/images/*`, `/_next/*`) return HTTP `200`/`206`/`304` (no `404` or `5xx`).

### B. Hero Cursor-Tracking Gaze Animation (Desktop `1280x800`)
Wait for the hero `<canvas>` to become visible (`opacity-100`). Move the mouse pointer and wait ~500ms at each position:
1. **Left (`x=40, y=400`)**: Character's head turns to the **viewer's left**.
2. **Center (`x=640, y=400`)**: Character faces **straight toward the camera**.
3. **Right (`x=1220, y=400`)**: Character holds the clean front pose (`2.25s`) with a subtle CSS 3D `rotateY` tilt toward the right (no seams, no flipped laptop/background, and does not drop down to the laptop frames).

### C. Sections, Images & Project Routes
- Scroll through `#home`, `#about`, `#expertise`, `#projects`, `#journey`, `#blog`, `#education`, and `#contact`.
- Verify every visible `<img>` has `complete === true && naturalWidth > 0`.
- Click or navigate to at least one `/projects/<slug>` case study page and verify it renders without errors and navigates back cleanly.

### D. Responsive Layout (`390x844`)
- Verify no horizontal overflow (`document.documentElement.scrollWidth <= window.innerWidth`).
- Verify hero fallback video/poster renders cleanly on touch/mobile viewports.

## 4. Fix Before Deploying
If any check fails, fix the root cause, re-run steps 1–3, and only then commit and push to `origin/main`.
