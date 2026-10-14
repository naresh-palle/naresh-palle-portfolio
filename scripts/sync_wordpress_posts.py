#!/usr/bin/env python3
"""Download all public BinaryBlogs articles into posts.json for the portfolio.

BinaryBlogs publishes most articles as WordPress pages, plus a smaller set of posts.
This script fetches both so the portfolio archive is complete.

Usage: python scripts/sync_wordpress_posts.py
Uses only the Python standard library. No WordPress login is required for public content.
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

def normalize(item):
    categories = item.get("categories") or {}
    return {
        "id": str(item.get("ID", "")),
        "title": plain_text(item.get("title", "")),
        "date": item.get("date", ""),
        "url": item.get("URL") or item.get("short_URL") or "https://binaryblogs1.wordpress.com/",
        "categories": list(categories.keys()) if isinstance(categories, dict) else [],
        "excerpt": plain_text(item.get("excerpt") or item.get("content") or ""),
        "content": item.get("content") or "",
        "modified": item.get("modified", ""),
        "type": item.get("type") or "post",
    }

def fetch_type(post_type):
    collected = []
    page = 1
    while True:
        params = urllib.parse.urlencode({"number": PER_PAGE, "page": page, "order": "DESC", "type": post_type})
        data = request_json(API + "?" + params)
        batch = data.get("posts", [])
        if not batch:
            break
        collected.extend(normalize(item) for item in batch)
        print(f"Fetched {post_type} page {page}: {len(batch)} items (total {len(collected)})")
        total_found = data.get("found")
        if len(batch) < PER_PAGE or (total_found is not None and len(collected) >= total_found):
            break
        page += 1
        time.sleep(0.15)
    return collected

def main():
    by_id = {}
    for post_type in ("post", "page"):
        for item in fetch_type(post_type):
            if item["id"]:
                by_id[item["id"]] = item
    all_posts = sorted(by_id.values(), key=lambda item: item.get("date") or "", reverse=True)
    if not all_posts:
        raise SystemExit("No public articles returned. Nothing written; check the public blog/API.")
    OUTPUT.write_text(json.dumps({"source": "https://binaryblogs1.wordpress.com/", "synced_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "count": len(all_posts), "posts": all_posts}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"Saved {len(all_posts)} public articles, including full content, to {OUTPUT}")

if __name__ == "__main__":
    main()
