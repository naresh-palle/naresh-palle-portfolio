# Naresh Palle — Personal Portfolio

## Included
- `index.html`: responsive portfolio homepage.
- `assets/Naresh_Palle_AI_Automation_Architect_Resume.pdf`: downloadable resume.
- `scripts/sync_wordpress_posts.py`: fetches every public post from BinaryBlogs, including full article HTML, categories, dates and source permalinks.
- All article cards open a built-in reader modal on the portfolio page. Readers do not need to navigate to WordPress to read articles.
- `.github/workflows/pages.yml`: synchronizes public WordPress posts and deploys the static site to GitHub Pages on push and weekly.
- `posts.json`: generated automatically during deployment; it is not checked in by default.

## Publish to GitHub Pages
1. Create a **public** repository named `naresh-palle-portfolio`.
2. Upload all files and folders from this package to the repository root, including `.github` and `scripts`.
3. In repository **Settings → Pages**, set the source to **GitHub Actions**.
4. Open **Actions** and watch “Sync blog and deploy portfolio”. The first run fetches all publicly accessible WordPress posts, generates `posts.json`, and deploys the site.
5. After a successful deployment, open the URL shown in the workflow summary.

The workflow runs weekly to synchronize new public posts. It does not edit or delete content on WordPress. Articles open in an on-page reader; the original permalink is retained in the data but is not shown as the primary reading action.

## Local preview
Run `python -m http.server 8000` from this directory and open `http://localhost:8000`.
To generate the archive locally first, run `python scripts/sync_wordpress_posts.py`.

## Review before public launch
- Confirm official employment dates and titles. The career timeline is an editable draft based on information provided, not verified employment records.
- Verify project descriptions and public links.
- Confirm that the resume details are accurate. The resume is a draft; do not publish unsupported metrics or certifications.
- WordPress public posts are synchronized. Private, draft, password-protected, or otherwise non-public content is not copied.
- This package does not log in to GitHub or modify your LinkedIn/WordPress accounts.
