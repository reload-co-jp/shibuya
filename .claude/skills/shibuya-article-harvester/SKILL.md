---
name: shibuya-article-harvester
description: >
  Use this skill when asked to find, collect, or add new Shibuya-area articles
  (渋谷・原宿・表参道・恵比寿・代官山・代々木・千駄ヶ谷) by checking the recurring
  source sites in `data/sources.json` for events, festivals, exhibitions,
  pop-ups, live shows, store openings, closures, renewals, campaigns and local
  news. It prioritizes bulk harvesting: collect many candidates, remove
  duplicates against `data/contents.json`, confirm facts on primary sources,
  then add every safely verified article in one pass.
metadata:
  short-description: 渋谷エリアの記事候補を重複除外し一括記事化する
---

# Shibuya Article Harvester

渋谷ライブ（`data/contents.json`）の記事を、公式情報で裏付けを取りながらまとめて追加する手順。
「渋谷の記事を追加」「イベントを拾う」「新店舗を探す」「巡回して追加」などの依頼で使う。

## Quick Start

1. `data/sources.json` の巡回先を確認する（公式 > プレスリリース > イベントプラットフォーム > Webメディアの順に優先）。
2. 一覧ページから候補を拾う:
   ```bash
   python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py links "https://www.hikarie.jp/event/" "event/detail" > /tmp/harvest_links.txt 2>&1
   ```
   主要な一覧ページと詳細URLのパターン:
   - 渋谷ヒカリエ `https://www.hikarie.jp/event/` → `event/detail`
   - 渋谷PARCO `https://shibuya.parco.jp/event/` → `event/detail`（詳細本文はナビの後ろ、`開催中`/`予告` 以降）
   - 表参道ヒルズ `https://www.omotesandohills.com/events/` → `events/(event|topic)/`
   - 恵比寿ガーデンプレイス `https://gardenplace.jp/event/` → `event/detail`
   - MIYASHITA PARK `https://www.miyashita-park.tokyo/schedule/` → `schedule/\?p=`
   - PR TIMES 検索（渋谷・原宿・表参道・恵比寿）→ `html/rd/p/`
   - ハラカドはJS描画のため一覧が取れない。PR TIMES・Webメディアで補完する
3. 候補をまとめて重複チェック（本文に入る固有名詞とURLを渡す）:
   ```bash
   python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py dedup "SAKE PARK|https://www.miyashita-park.tokyo/schedule/?p=3020" ...
   ```
   `SOURCE URL MATCH` は既存記事。`TEXT MATCH` は同名の別回の可能性もあるので会期・会場を比べて判断する。
4. 残った候補の詳細ページを取得して事実確認:
   ```bash
   python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py detail "<url>" 4000
   ```
   イベントは「会期・時間・会場・料金・予約要否」、ニュースは「発表日/開始日・場所・影響」を一次情報で確認する。
5. 次のIDを `harvest.py next-id` で取り、画像を保存する:
   ```bash
   python3 .claude/skills/shibuya-article-harvester/scripts/harvest.py image "<og:image URL>" <id>
   ```
   出力されたパスを `image_url` に入れる。既存IDの画像は上書きしない（拒否される）。使える画像がなければ `image_url: null`（カテゴリのプレースホルダー表示）。
6. `data/contents.json` に一括で追記し、`pnpm validate:contents` → `pnpm test` → `pnpm build` で確認する。

## 自動巡回モード（`pnpm harvest scan` 済みの場合）

GitHub Actions（`.github/workflows/content-harvest.yml`）からは、機械的な部分を先に済ませてから呼び出す。

1. `pnpm harvest scan` が `tmp/harvest-queue.json` を出力済み。scan は再実行しない。
   - 収録済みの `source_url`・`data/harvest-excluded.json` の URL・【終了】表記・PR TIMES の区外リリースは除外済み
   - 各候補の `detail` に og:image・概要・本文抜粋が入る。`detail.note` があるもの（本文が取れなかったもの）は WebFetch で一次情報を確認する
2. キューの候補を上の Candidate Rules で判定し、Quick Start 3〜6 の手順で記事化する（`dedup` で同名の既存記事を確認、`next-id`、`image`）。
3. 記事化しない候補は理由を付けて除外リストに入れる（90日間は scan に出なくなる）:
   ```bash
   pnpm harvest exclude "<url>|区外" "<url>|終了済み" "<url>|会期未確認"
   ```
   事実が後から出そろいそうなもの（日付未発表など）は除外せず残す。
4. `data/contents.json` への追記後に `pnpm validate:contents` を通す。`pnpm build` はワークフロー側で実行するので不要。
5. 確認や質問はしない。判断に迷う候補は保留にして報告に書く。

## スキーマ（`lib/types.ts` の `Content`）

```json
{
  "id": 30,
  "type": "event",
  "title": "記事タイトル（【渋谷】は付けない）",
  "summary": "1〜2文の要約。会期・会場を含める",
  "body": "Markdown本文。導入 → 見どころ(##) → 開催概要(##, 箇条書き)",
  "category": "event | festival | performance | theater | concert | new_opening | closing | renewal | sale | campaign | popup | new_product | exhibition | facility_news | local_news | guide",
  "area": "shibuya | harajuku | omotesando | ebisu | daikanyama | yoyogi | sendagaya",
  "tags": ["free", "kids", "workshop", "night"],
  "published_at": "YYYY-MM-DD（発表日。今日以前）",
  "start_at": "YYYY-MM-DD または null",
  "end_at": "YYYY-MM-DD または null",
  "place_id": "data/places.json の id または null",
  "source_id": "data/sources.json の id または null",
  "source_url": "一次情報のURL",
  "image_url": "/images/contents/{id}.{ext} または null"
}
```

- 会期のあるものは `type: "event"`、新店舗・リニューアル・地域ニュースは `type: "news"`（`start_at`/`end_at` は null）。
- `tags` の基準は `scripts/lib/themes.mjs`（無料・子連れ・体験・夜）。
- 会場が `data/places.json` にない常設施設なら、住所・公式URLを確認したうえで Place も追加する（`updated_at` は確認日）。
- 2つ目以降の出典は `source_urls` に追加する。既存記事に新情報があれば新規作成せず追記する。

## Candidate Rules

含める:

- 渋谷区内（渋谷・原宿・表参道・恵比寿・代官山・代々木・千駄ヶ谷）の会場で行われるイベント、展示、POP UP、ライブ・公演、祭り、イルミネーション
- 新規オープン・閉店・リニューアル・移転、キャンペーン、施設のお知らせ、交通規制など来街者に影響するニュース

除外:

- 渋谷区外の会場（中目黒・下北沢・青山の港区側など）。ただし恵比寿ガーデンプレイス内の施設は含める
- 会期・会場など核になる事実を一次情報で確認できないもの、SNS投稿だけが根拠のもの
- 既に終了したイベント、全国一律のキャンペーンで渋谷固有の要素がないもの
- 事件・事故の扇情的なニュース（交通規制や施設閉鎖など生活影響があるものは可）

## 執筆ルール

- 事実はソースに書かれていることだけ。日付の曜日・価格・時間は原文どおり、価格は税込/税別を明記
- 公式サイト間で記述が食い違う場合は断定せず、確認できる方だけ書く
- 文体は常体（〜だ・〜である）。末尾に「最新情報は公式サイトで確認」の旨を簡潔に
- 1記事 6〜12文程度。見出しは `##`、要点は箇条書き

## 報告

- `追加`: id とタイトル
- `マージ`: 既存 id に追記した内容
- `保留`: 理由（事実未確認・区外など）
- `確認`: `pnpm test` / `pnpm build` の結果
