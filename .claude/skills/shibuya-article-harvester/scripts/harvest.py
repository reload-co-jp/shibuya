#!/usr/bin/env python3
"""渋谷ライブの記事候補収集ヘルパー。

使い方:
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py links <listing-url> [url-regex]
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py detail <url> [max-chars]
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py dedup "<keyword>|<url>" ...
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py image <image-url> <content-id>
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py next-id
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py scan [out.json]
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py exclude "<url>|<reason>" ...
  python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py validate
"""
import html
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse
from concurrent.futures import ThreadPoolExecutor
from datetime import date, timedelta

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
CONTENTS = os.path.join(ROOT, "data/contents.json")
PLACES = os.path.join(ROOT, "data/places.json")
SOURCES = os.path.join(ROOT, "data/sources.json")
TYPES = os.path.join(ROOT, "lib/types.ts")
EXCLUDED = os.path.join(ROOT, "data/harvest-excluded.json")
QUEUE = os.path.join(ROOT, "tmp/harvest-queue.json")
EXCLUDE_KEEP_DAYS = 90
IMAGES = os.path.join(ROOT, "public/images/contents")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"


class FetchError(Exception):
    pass


def fetch_or_raise(url):
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
    raise FetchError(f"FETCH FAILED after retries: {url}")


def fetch(url):
    try:
        return fetch_or_raise(url)
    except FetchError as e:
        sys.exit(str(e))


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


def extract_links(text, url, pattern=""):
    seen, rows = set(), []
    for m in re.finditer(r'<a[^>]+href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', text, re.S):
        href = urllib.parse.urljoin(url, html.unescape(m.group(1)))
        label = html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m.group(2))).strip())
        if (pattern and not re.search(pattern, href)) or href in seen:
            continue
        seen.add(href)
        rows.append((href, label))
    return rows


def cmd_links(url, pattern=""):
    for href, label in extract_links(fetch(url), url, pattern):
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
    for attempt in range(3):
        if subprocess.run(["curl", "-sL", "--max-time", "30", "-A", UA, "-o", tmp, url]).returncode == 0:
            break
        time.sleep(2 * (attempt + 1))
    else:
        sys.exit(f"DOWNLOAD FAILED after retries: {url}")
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


# ---- 自動巡回(scan) -------------------------------------------------------
# 一覧ページ: (source_id, URL, 詳細URLの正規表現)。ハラカドはJS描画のため対象外
PRTIMES_SEARCH = "https://prtimes.jp/main/action.php?run=html&page=searchkey&search_word="
LISTINGS = [
    ("hikarie", "https://www.hikarie.jp/event/", r"event/detail"),
    ("parco", "https://shibuya.parco.jp/event/", r"event/detail"),
    ("omotesando-hills", "https://www.omotesandohills.com/events/", r"events/(event|topic)/"),
    ("gardenplace", "https://gardenplace.jp/event/", r"event/detail"),
    ("miyashita-park", "https://www.miyashita-park.tokyo/schedule/", r"schedule/\?p="),
    ("prtimes", PRTIMES_SEARCH + "%E6%B8%8B%E8%B0%B7", r"html/rd/p/"),
    ("prtimes-harajuku", PRTIMES_SEARCH + "%E5%8E%9F%E5%AE%BF", r"html/rd/p/"),
    ("prtimes-omotesando", PRTIMES_SEARCH + "%E8%A1%A8%E5%8F%82%E9%81%93", r"html/rd/p/"),
    ("prtimes-ebisu", PRTIMES_SEARCH + "%E6%81%B5%E6%AF%94%E5%AF%BF", r"html/rd/p/"),
]
ENDED_LABEL = re.compile(r"【終了】|開催終了|受付終了")
# PR TIMES 検索結果は全国のリリースが混ざる(本社所在地やサイト共通部分でもヒットする)。
# 見出し・概要文に渋谷区内の地名が出るものだけ残す
AREA_WORDS = re.compile(
    r"渋谷|原宿|表参道|恵比寿|代官山|代々木|千駄ヶ谷|神宮前|神南|宇田川町|道玄坂|宮益坂|桜丘|松濤|広尾|北参道|ラフォーレ|ハラカド|ヒカリエ|PARCO|パルコ|MIYASHITA"
)
SCAN_DETAIL_CHARS = 3500


def load_excluded():
    try:
        return json.load(open(EXCLUDED, encoding="utf-8"))
    except FileNotFoundError:
        return []


def save_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def known_urls():
    urls = set()
    for c in json.load(open(CONTENTS, encoding="utf-8")):
        for u in [c.get("source_url")] + c.get("source_urls", []):
            if u:
                urls.add(normalize_url(u))
    return urls


def detail_facts(url):
    text = fetch_or_raise(url)
    body = body_text(text)
    # 渋谷PARCOは本文の前にナビが長く続く。ステータス表記以降を本文とみなす
    m = re.search(r"\n\s*(開催中|予告|本日開催)\s*\n", body)
    if "shibuya.parco.jp" in url and m:
        body = body[m.start():]
    return {
        "og_image": meta(text, "og:image"),
        "og_description": meta(text, "og:description") or meta(text, "description"),
        "text": body[:SCAN_DETAIL_CHARS],
    }


def safe_detail(url):
    try:
        return detail_facts(url)
    except Exception as e:  # noqa: BLE001
        return {"error": str(e)}


def listing_rows(listing):
    source_id, url, pattern = listing
    return [(source_id, href, label) for href, label in extract_links(fetch_or_raise(url), url, pattern)]


def cmd_scan(out_path=QUEUE):
    """機械的な部分(一覧取得・URL重複除外・詳細取得)をまとめて行い、キューJSONを書く。
    掲載可否・統合・執筆の判断はキューを読むエージェントに任せる。"""
    known = known_urls()
    excluded = {normalize_url(e["url"]) for e in load_excluded()}
    errors, candidates, seen = {}, [], set()
    with ThreadPoolExecutor(6) as ex:
        futs = [(l[0], ex.submit(listing_rows, l)) for l in LISTINGS]
    skipped = {"known": 0, "excluded": 0, "ended": 0}
    for source_id, fut in futs:
        try:
            rows = fut.result()
        except Exception as e:  # noqa: BLE001
            errors[source_id] = str(e)
            continue
        for _, href, label in rows:
            key = normalize_url(href)
            if key in seen:
                continue
            seen.add(key)
            if key in known:
                skipped["known"] += 1
            elif key in excluded:
                skipped["excluded"] += 1
            elif ENDED_LABEL.search(label):
                skipped["ended"] += 1
            else:
                candidates.append({"source_id": source_id, "url": href, "label": label[:200]})
    with ThreadPoolExecutor(6) as ex:
        for c, d in zip(candidates, ex.map(safe_detail, [c["url"] for c in candidates])):
            c["detail"] = d
    kept = []
    for c in candidates:
        d = c["detail"]
        if c["source_id"].startswith("prtimes") and "error" not in d:
            if not AREA_WORDS.search(c["label"] + "\n" + (d.get("og_description") or "")):
                skipped["out_of_area"] = skipped.get("out_of_area", 0) + 1
                continue
        if "error" not in d and len(d["text"]) < 200:
            d["note"] = "本文を取得できなかった。一覧の label と WebFetch で事実を確認する"
        kept.append(c)
    candidates = kept
    save_json(out_path, {"scanned_at": date.today().isoformat(), "errors": errors, "candidates": candidates})
    print(f"wrote {out_path}: new={len(candidates)} skipped={skipped} source errors={list(errors) or 'none'}")


def cmd_exclude(*entries):
    """記事化しないと判断した候補URLを記録し、次回以降のscanで除外する(90日で失効)。"""
    today = date.today()
    limit = (today - timedelta(days=EXCLUDE_KEEP_DAYS)).isoformat()
    data = [e for e in load_excluded() if e.get("date", "") >= limit]
    have = {normalize_url(e["url"]) for e in data}
    added = 0
    for entry in entries:
        url, _, reason = entry.partition("|")
        if not url or normalize_url(url) in have:
            continue
        data.append({"url": url, "reason": reason.strip(), "date": today.isoformat()})
        have.add(normalize_url(url))
        added += 1
    save_json(EXCLUDED, data)
    print(f"excluded +{added} (total {len(data)})")


def ts_keys(name):
    src = open(TYPES, encoding="utf-8").read()
    m = re.search(r"export const %s = \{(.*?)\}" % name, src, re.S)
    return set(re.findall(r"^\s*(\w+):", m.group(1), re.M))


def cmd_validate():
    """data/contents.json を lib/types.ts の Content スキーマに照らして検査する。"""
    contents = json.load(open(CONTENTS, encoding="utf-8"))
    places = {p["id"] for p in json.load(open(PLACES, encoding="utf-8"))}
    sources = {s["id"] for s in json.load(open(SOURCES, encoding="utf-8"))}
    categories, areas, themes = ts_keys("CATEGORIES"), ts_keys("AREAS"), ts_keys("THEMES")
    today = date.today().isoformat()
    date_re = re.compile(r"^\d{4}-\d{2}-\d{2}$")
    errors, ids = [], set()
    for c in contents:
        cid = c.get("id")
        err = lambda msg: errors.append(f"id={cid}: {msg}")  # noqa: E731
        if not isinstance(cid, int) or cid in ids:
            err("id が整数でない、または重複")
        ids.add(cid)
        for key in ("title", "summary", "body"):
            if not isinstance(c.get(key), str) or not c[key].strip():
                err(f"{key} が空")
        if "【渋谷】" in c.get("title", ""):
            err("title に【渋谷】を付けない")
        if c.get("type") not in ("event", "news"):
            err(f"type 不正: {c.get('type')}")
        if c.get("category") not in categories:
            err(f"category 不正: {c.get('category')}")
        if c.get("area") not in areas:
            err(f"area 不正: {c.get('area')}")
        bad_tags = set(c.get("tags", [])) - themes
        if bad_tags:
            err(f"tags 不正: {sorted(bad_tags)}")
        pub = c.get("published_at")
        if not isinstance(pub, str) or not date_re.match(pub):
            err(f"published_at 不正: {pub}")
        elif pub > today:
            err(f"published_at が未来: {pub}")
        for key in ("start_at", "end_at"):
            v = c.get(key)
            if v is not None and not (isinstance(v, str) and date_re.match(v)):
                err(f"{key} 不正: {v}")
        if c.get("start_at") and c.get("end_at") and c["start_at"] > c["end_at"]:
            err("start_at が end_at より後")
        if c.get("place_id") is not None and c["place_id"] not in places:
            err(f"place_id が places.json にない: {c['place_id']}")
        if c.get("source_id") is not None and c["source_id"] not in sources:
            err(f"source_id が sources.json にない: {c['source_id']}")
        # まとめ記事(guide)は単一の出典を持たないことがある
        if c.get("category") != "guide" and not (c.get("source_url") or "").startswith("http"):
            err("source_url がない")
        img = c.get("image_url")
        if img is not None:
            if not os.path.isfile(os.path.join(ROOT, "public", img.lstrip("/"))):
                err(f"image_url のファイルがない: {img}")
    if errors:
        print("\n".join(errors))
        sys.exit(f"INVALID: {len(errors)} error(s)")
    print(f"OK: {len(contents)} contents")


COMMANDS = {
    "links": cmd_links,
    "detail": cmd_detail,
    "dedup": cmd_dedup,
    "image": cmd_image,
    "next-id": cmd_next_id,
    "scan": cmd_scan,
    "exclude": cmd_exclude,
    "validate": cmd_validate,
}

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        sys.exit(__doc__)
    COMMANDS[sys.argv[1]](*sys.argv[2:])
