#!/usr/bin/env python3
"""Download all public posts from BinaryBlogs into posts.json for the portfolio.

Usage: python scripts/sync_wordpress_posts.py
Uses only the Python standard library. No WordPress login is required for public posts.
"""
import html
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "posts.json"
API = "https://public-api.wordpress.com/rest/v1.1/sites/binaryblogs1.wordpress.com/posts/"
PER_PAGE = 100

def plain_text(markup):
    markup = re.sub(r"(?is)<(script|style).*?>.*?</\1>", " ", markup or "")
    markup = re.sub(r"(?s)<[^>]+>", " ", markup)
    return re.sub(r"\s+", " ", html.unescape(markup)).strip()

def request_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "NareshPallePortfolio/1.0 (public WordPress post sync)"})
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))

def main():
    all_posts = []
    page = 1
    while True:
        params = urllib.parse.urlencode({"number": PER_PAGE, "page": page, "order": "ASC"})
        data = request_json(API + "?" + params)
        batch = data.get("posts", [])
        if not batch:
            break
        for p in batch:
            categories = p.get("categories") or {}
            all_posts.append({
                "id": str(p.get("ID", "")),
                "title": plain_text(p.get("title", "")),
                "date": p.get("date", ""),
                "url": p.get("URL") or p.get("short_URL") or "https://binaryblogs1.wordpress.com/",
                "categories": list(categories.keys()) if isinstance(categories, dict) else [],
                "excerpt": plain_text(p.get("excerpt") or p.get("content") or ""),
                "content": p.get("content") or "",
                "modified": p.get("modified", ""),
            })
        print(f"Fetched page {page}: {len(batch)} posts (total {len(all_posts)})")
        total_found = data.get("found")
        if len(batch) < PER_PAGE or (total_found is not None and len(all_posts) >= total_found):
            break
        page += 1
        time.sleep(0.15)
    if not all_posts:
        raise SystemExit("No posts returned. Nothing written; check the public blog/API.")
    OUTPUT.write_text(json.dumps({"source": "https://binaryblogs1.wordpress.com/", "synced_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "count": len(all_posts), "posts": all_posts}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Saved {len(all_posts)} posts, including full public post content, to {OUTPUT}")

if __name__ == "__main__":
    main()
