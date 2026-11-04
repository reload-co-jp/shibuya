# 渋谷ライブ

渋谷地域メディア（SHIBUYA JOURNAL）

URL: https://shibuya.reload.co.jp

## 1. 目的

渋谷エリアのイベント・新店舗・閉店・セール・キャンペーン・POP UP・公演・ライブ・展示・季節行事・地域ニュースなどをWebから収集し、店舗・施設・スポット・イベントを構造化して記事を生成する。

## 2. 対象エリア

渋谷区内の以下のエリア（`lib/types.ts` の `AREAS`）。

- 渋谷（渋谷駅周辺・道玄坂・宮益坂・センター街・公園通り・神南・桜丘・宇田川町・松濤）
- 原宿（神宮前・竹下通り・キャットストリート）
- 表参道
- 恵比寿（恵比寿ガーデンプレイス・広尾）
- 代官山
- 代々木（代々木公園・明治神宮・富ヶ谷・代々木上原・初台）
- 千駄ヶ谷（国立競技場・東京体育館・北参道）

## 3. 情報源

`data/sources.json` で管理する。

### 公的・地域情報

- 渋谷区: https://www.city.shibuya.tokyo.jp/
- ふるさと渋谷フェスティバル: https://www.shibuya-fes.online/

### 寺社・季節行事

- 明治神宮: https://www.meijijingu.or.jp/

### 商業施設・展望施設

- 渋谷ヒカリエ イベント＆ニュース: https://www.hikarie.jp/event/
- 渋谷PARCO イベント・ポップアップ: https://shibuya.parco.jp/event/
- SHIBUYA SKY（渋谷スクランブルスクエア）: https://www.shibuya-scramble-square.com/sky/
- MIYASHITA PARK スケジュール: https://www.miyashita-park.tokyo/schedule/
- 表参道ヒルズ イベント&トピック: https://www.omotesandohills.com/events/
- 恵比寿ガーデンプレイス イベント: https://gardenplace.jp/event/
- 東急プラザ原宿「ハラカド」: https://harakado.tokyu-plaza.com/harakado/event/

### イベント・公演

- LINE CUBE SHIBUYA: https://linecube-shibuya.com/
- 代々木公園のフェス（フィエスタ・デ・エスパーニャ等）・イルミネーション公式サイト

### プレスリリース・ニュース

- PR TIMES「渋谷」「原宿」「表参道」「恵比寿」検索
- Google ニュース「渋谷」「渋谷 イベント」「原宿」

### 店舗情報

- 食べログ 渋谷: https://tabelog.com/tokyo/A1303/A130301/
- 食べログ 原宿・表参道: https://tabelog.com/tokyo/A1306/

### 情報源の扱い

- 公式サイトを一次情報として優先する
- 商業施設はトップページではなく、イベント・ニュース等の更新ページを優先する
- 食べログ等は新店舗候補の発見に利用し、開店日・住所・営業時間は公式情報で再確認する
- イベントプラットフォーム・Webメディアは補完情報として利用する
- 取得URL・取得日時・source_typeを保存する

### スポットの画像

スポット(店舗・施設)の写真は `public/images/spots/{place_id}.{jpg|png|webp}` にローカル保存し、`data/places.json` の `image_url` から参照する。

```bash
npm run fetch-spot-images              # 画像未設定のスポットをまとめて取得
npm run fetch-spot-images -- --ids=maisen-aoyama,fuglen-tokyo   # 対象を指定
npm run fetch-spot-images -- --area=表参道                      # エリアを指定
npm run fetch-spot-images -- --prefer=tabelog --all          # 食べログの画像を優先して再取得
```

- 取得元は「公式サイト → 食べログ」の順。公式サイトが無い店舗は食べログの店舗ページから取得する
- 食べログの店舗は「店名の一致度 + 住所の一致 + 位置(緯度経度)の近さ」で判定し、別の店舗の写真を取得しない
- 画像の取得元URLは `source_url` に保存する

## 4. 情報収集フロー

```text
Webサイト
  ↓
スクレイピング
  ↓
Rawデータ保存
  ↓
情報抽出
  ↓
イベント・店舗・施設などに分類
  ↓
重複チェック
  ↓
Entityと紐付け
  ↓
記事生成
  ↓
確認
  ↓
公開
```

## 5. 情報カテゴリ

- `event` - イベント
- `festival` - 祭り・季節行事
- `performance` - 公演・ライブ
- `new_opening` - 新規オープン
- `closing` - 閉店
- `renewal` - リニューアル
- `sale` - セール
- `campaign` - キャンペーン
- `popup` - POP UP
- `new_product` - 新商品
- `exhibition` - 展示会
- `facility_news` - 施設ニュース
- `local_news` - 地域ニュース
- `guide` - 紹介記事（エリア・通り・名店などの紹介）

## 6. 管理する情報

### Place（店舗・施設・スポット）

店舗・施設・スポットを1つの型で管理する。

```text
places
- id
- name
- type
- description
- address
- latitude
- longitude
- opening_hours
- phone
- url
- image_url
- area
- source_id
- source_url
```

`type` の例:

- store
- facility（商業施設・施設）
- temple
- shrine
- museum
- theater（劇場・ホール・ライブハウス）
- park
- tourist_spot
- restaurant
- other

### Content（イベント・ニュース）

イベント・ニュースを1つの型で管理する。

```text
contents
- id
- type
- title
- summary
- body
- category
- published_at
- start_at
- end_at
- place_id
- source_id
- source_url
```

`type`:

- `event`
- `news`

イベントの場合は `start_at` / `end_at` / `place_id` を使用し、ニュースの場合は `published_at` を中心に管理する。

### 関係

```text
Place
  └── Content

Content
  ├── Event
  └── News
```

例:

````text
渋谷PARCO（Place）
  ├── 7周年イベント（Content / Event）
  ├── セール（Content / News）
  ├── 新店舗オープン（Content / News）
  └── POP UP（Content / Event）

同じEntityに複数の情報源を紐付ける。

## 7. LLMによる情報抽出

スクレイピングした情報から構造化データを生成する。

```json
{
  "category": "event",
  "title": "○○イベント",
  "area": "渋谷",
  "place": "渋谷ROX",
  "start_at": "2026-09-10",
  "end_at": "2026-09-20",
  "summary": "..."
}
````

## 8. 記事生成

### 新店舗

```text
【渋谷】○○が○月○日にオープン！

概要

店舗情報
- 店名
- 住所
- 営業時間
- オープン日
- アクセス
```

### イベント

```text
【渋谷】○○開催！○月○日から○○で

概要

イベント情報
- 開催期間
- 場所
- 料金
- アクセス
```

## 9. サイト構成

```text
/
├── 渋谷の最新情報
├── イベント
├── 祭り・季節行事
├── 公演・ライブ
├── 新店舗
├── 閉店
├── セール
├── POP UP
├── 展示・アート
└── エリア
```

### 特集ページ

- 今日の渋谷
- 今週の渋谷
- 今週末の渋谷イベント
- 渋谷の新店舗
- 現在開催中のイベント
- 現在開催中のセール

## 10. DB

JSONデータを静的に利用。

```text
sources
source_documents
places
stores
events
news
categories
articles
entity_relations
```

## 11. 情報源の優先順位

1. 行政・公的機関
2. 寺社・施設・店舗の公式サイト
3. 公式プレスリリース
4. イベントプラットフォーム
5. 食べログ等
6. SNS
7. その他Webメディア

重要な開催日・営業時間・料金などは、可能な限り公式情報で確認する。

## 12. 開発

```bash
pnpm install
pnpm dev        # 開発サーバー
pnpm test       # vitest
pnpm lint
pnpm typecheck
pnpm build      # 静的export(out/)
```

- `pnpm fetch-contents`: `data/sources.json` を巡回し、Claude Code CLI(headless)で記事候補を抽出して `data/contents.json` に追加する
- `pnpm fetch-hotels`: 楽天トラベルAPIで渋谷駅周辺のホテルを `data/hotels.json` に保存する（`.env` に `RAKUTEN_APPLICATION_ID` / `RAKUTEN_ACCESS_KEY`）
- 記事の手動収集・追加は `.claude/skills/shibuya-article-harvester` の手順に従う

### 公開前に設定するもの

- `app/(ja)/layout.tsx` の `GA_MEASUREMENT_ID`（渋谷ライブ用のGA4プロパティ。空の間は計測タグを出さない）
- GitHub Pages のカスタムドメイン `shibuya.reload.co.jp`

### クレジット

- トップのヒーロー画像: [Shibuya Scramble crossing](https://commons.wikimedia.org/wiki/File:Shibuya_Scramble_crossing.jpg)（Wikimedia Commons, CC0）
