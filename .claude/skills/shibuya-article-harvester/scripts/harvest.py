#!/usr/bin/env python3
"""渋谷ライブの記事候補収集ヘルパー。

使い方:
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py links <listing-url> [url-regex]
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py detail <url> [max-chars]
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py dedup "<keyword>|<url>" ...
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py image <image-url> <content-id>
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py next-id
"""
import html
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
CONTENTS = os.path.join(ROOT, "data/contents.json")
IMAGES = os.path.join(ROOT, "public/images/contents")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"


def fetch(url):
    for attempt in range(3):
        res = subprocess.run(
            ["curl", "-sL", "--max-time", "25", "-A", UA, url], capture_output=True
        )
        if res.returncode == 0 and res.stdout:
            raw = res.stdout
            for enc in ("utf-8", "shift_jis", "euc-jp"):
                try:
                    return raw.decode(enc)
                except UnicodeDecodeError:
                    pass
            return raw.decode("utf-8", "ignore")
        time.sleep(2 * (attempt + 1))
    sys.exit(f"FETCH FAILED after retries: {url}")


def meta(text, name):
    for pattern in (
        r'<meta[^>]+(?:property|name)=["\']%s["\'][^>]*content=["\']([^"\']*)',
        r'<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name)=["\']%s["\']',
    ):
        m = re.search(pattern % re.escape(name), text)
        if m:
            return html.unescape(m.group(1))
    return None


def body_text(text):
    text = re.sub(r"(?is)<(script|style|noscript|svg|header|footer|nav)[^>]*>.*?</\1>", " ", text)
    text = re.sub(r"(?i)<br\s*/?>|</(p|div|li|h\d|tr|dt|dd)>", "\n", text)
    text = html.unescape(re.sub(r"<[^>]+>", " ", text))
    text = re.sub(r"[ \t　]+", " ", text)
    return re.sub(r"\n\s*\n+", "\n", text).strip()


def cmd_links(url, pattern=""):
    text = fetch(url)
    seen = set()
    for m in re.finditer(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', text, re.S):
        href = urllib.parse.urljoin(url, html.unescape(m.group(1)))
        label = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m.group(2))).strip()
        if (pattern and not re.search(pattern, href)) or href in seen:
            continue
        seen.add(href)
        print(f"{href} | {label[:140]}")


def cmd_detail(url, limit="4000"):
    text = fetch(url)
    title = re.search(r"<title[^>]*>(.*?)</title>", text, re.S)
    print("URL:", url)
    print("TITLE:", html.unescape(title.group(1)).strip() if title else "")
    print("OGIMG:", meta(text, "og:image"))
    print("OGDESC:", meta(text, "og:description") or meta(text, "description"))
    print("TEXT:")
    print(body_text(text)[: int(limit)])


def normalize_url(url):
    parts = urllib.parse.urlsplit(url or "")
    query = [
        (k, v)
        for k, v in urllib.parse.parse_qsl(parts.query)
        if not k.startswith("utm_") and k not in ("fbclid", "gclid")
    ]
    return urllib.parse.urlunsplit(
        (parts.scheme, parts.netloc.lower(), parts.path.rstrip("/"), urllib.parse.urlencode(query), "")
    )


def cmd_dedup(*candidates):
    contents = json.load(open(CONTENTS))
    for candidate in candidates:
        keyword, _, url = candidate.partition("|")
        hits = []
        for c in contents:
            urls = [c.get("source_url")] + c.get("source_urls", [])
            if url and normalize_url(url) in {normalize_url(u) for u in urls if u}:
                hits.append(f"SOURCE URL MATCH id={c['id']} {c['title']}")
            elif keyword and (keyword in c["title"] or keyword in c["summary"] or keyword in c["body"]):
                hits.append(
                    f"TEXT MATCH id={c['id']} {c['title']} ({c.get('start_at')}〜{c.get('end_at')})"
                )
        print(f"== {candidate}")
        print("\n".join(f"  {h}" for h in hits) if hits else "  NEW")


def cmd_image(url, content_id):
    os.makedirs(IMAGES, exist_ok=True)
    existing = [f for f in os.listdir(IMAGES) if os.path.splitext(f)[0] == str(content_id)]
    if existing:
        sys.exit(f"REFUSED: image for id={content_id} already exists ({existing[0]})")
    tmp = os.path.join("/tmp", f"harvest_img_{content_id}")
    subprocess.run(["curl", "-sL", "--max-time", "30", "-A", UA, "-o", tmp, url], check=True)
    info = subprocess.run(["identify", "-format", "%m %w", tmp + "[0]"], capture_output=True, text=True).stdout.split()
    if not info:
        sys.exit(f"NOT AN IMAGE: {url}")
    fmt, width = info[0], int(info[1])
    ext = "png" if fmt == "PNG" else "jpg"
    dst = os.path.join(IMAGES, f"{content_id}.{ext}")
    # 長辺1600pxに縮小。WebP/GIFや大きいPNGはJPEGに変換してサイズを抑える
    if fmt == "PNG" and os.path.getsize(tmp) > 400_000:
        ext = "jpg"
        dst = os.path.join(IMAGES, f"{content_id}.jpg")
        subprocess.run(["convert", tmp + "[0]", "-background", "white", "-flatten", "-resize", "1600x1600>", "-quality", "82", dst], check=True)
    elif fmt in ("JPEG", "PNG") and width <= 1600:
        subprocess.run(["cp", tmp, dst], check=True)
    else:
        subprocess.run(["convert", tmp + "[0]", "-resize", "1600x1600>", "-quality", "82", dst], check=True)
    print(f"/images/contents/{content_id}.{ext}")


def cmd_next_id():
    contents = json.load(open(CONTENTS))
    print(max((c["id"] for c in contents), default=0) + 1)


COMMANDS = {
    "links": cmd_links,
    "detail": cmd_detail,
    "dedup": cmd_dedup,
    "image": cmd_image,
    "next-id": cmd_next_id,
}

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        sys.exit(__doc__)
    COMMANDS[sys.argv[1]](*sys.argv[2:])
