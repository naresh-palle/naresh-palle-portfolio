# Naresh Palle — Personal Portfolio

## Included
- `index.html`: responsive portfolio homepage.
- `assets/Naresh_Palle_AI_Automation_Architect_Resume.pdf`: downloadable resume.
- `scripts/sync_wordpress_posts.py`: fetches every public post from BinaryBlogs, including full article HTML, categories, dates and source permalinks.
- All article cards open a built-in reader modal on the portfolio page. Readers do not need to navigate to WordPress to read articles.
- `.github/workflows/pages.yml`: synchronizes public WordPress posts and verifies the static export. Cloudflare Pages publishes the site from `main`.
- `posts.json`: generated automatically during deployment; it is not checked in by default.

## Publish to Cloudflare Pages
Production branch: `main`. Build command: `npm run build`. The static export is written to `out` (`wrangler.toml` sets `pages_build_output_dir`). Node 20 is selected by `.node-version`. Leave the base path empty so assets load from the domain root.

The GitHub workflow runs on every push to `main` and weekly. It refreshes public WordPress posts and confirms `out/index.html` builds. It does not edit or delete content on WordPress.

## Local preview
Run `python -m http.server 8000` from this directory and open `http://localhost:8000`.
To generate the archive locally first, run `python scripts/sync_wordpress_posts.py`.

## Review before public launch
- Confirm official employment dates and titles. The career timeline is an editable draft based on information provided, not verified employment records.
- Verify project descriptions and public links.
- Confirm that the resume details are accurate. The resume is a draft; do not publish unsupported metrics or certifications.
- WordPress public posts are synchronized. Private, draft, password-protected, or otherwise non-public content is not copied.
- This package does not log in to GitHub or modify your LinkedIn/WordPress accounts.
