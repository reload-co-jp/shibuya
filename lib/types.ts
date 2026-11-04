export const CATEGORIES = {
  event: "イベント",
  festival: "祭り・季節行事",
  performance: "公演・ライブ",
  theater: "演劇",
  concert: "コンサート",
  new_opening: "新規オープン",
  closing: "閉店",
  renewal: "リニューアル",
  sale: "セール",
  campaign: "キャンペーン",
  popup: "POP UP",
  new_product: "新商品",
  exhibition: "展示会",
  facility_news: "施設ニュース",
  local_news: "地域ニュース",
  guide: "紹介記事",
} as const

export type Category = keyof typeof CATEGORIES

export const CATEGORY_DESCRIPTIONS: Record<Category, string> = {
  event: "渋谷エリアで開催されるイベント情報をまとめてお届け",
  festival: "渋谷の祭り・季節行事の開催情報をまとめてお届け",
  performance: "渋谷の公演・ライブ情報をまとめてお届け",
  theater: "渋谷の演劇公演情報をまとめてお届け",
  concert: "渋谷エリアのコンサート情報をまとめてお届け",
  new_opening: "渋谷エリアの新規オープン店舗・施設情報をまとめてお届け",
  closing: "渋谷エリアの閉店情報をまとめてお届け",
  renewal: "渋谷エリアのリニューアル情報をまとめてお届け",
  sale: "渋谷エリアで開催中のセール情報をまとめてお届け",
  campaign: "渋谷エリアのキャンペーン情報をまとめてお届け",
  popup: "渋谷エリアのPOP UP出店情報をまとめてお届け",
  new_product: "渋谷エリアの新商品情報をまとめてお届け",
  exhibition: "渋谷エリアの展示会情報をまとめてお届け",
  facility_news: "渋谷エリアの施設ニュースをまとめてお届け",
  local_news: "渋谷エリアの地域ニュースをまとめてお届け",
  guide: "渋谷のエリア・ストリート・注目スポットなどの紹介記事をまとめてお届け",
}

// カテゴリページのtitle/H1。検索意図(例: 渋谷 新店舗)に合わせる
export const CATEGORY_TITLES: Record<Category, string> = {
  event: "渋谷のイベント・体験情報",
  festival: "渋谷の祭り・季節行事・ストリートイベント",
  performance: "渋谷の公演・ライブ・お笑い情報",
  theater: "渋谷の演劇・舞台公演情報",
  concert: "渋谷のコンサート・ライブ情報",
  new_opening: "渋谷の新店舗・新規オープン情報",
  closing: "渋谷の閉店情報",
  renewal: "渋谷のリニューアル情報",
  sale: "渋谷のセール情報",
  campaign: "渋谷のキャンペーン情報",
  popup: "渋谷のPOP UP・期間限定ショップ情報",
  new_product: "渋谷の新商品・限定商品情報",
  exhibition: "渋谷の展示・展覧会情報",
  facility_news: "渋谷の施設ニュース",
  local_news: "渋谷の地域ニュース",
  guide: "渋谷の紹介記事・エリア・ストリート・スポットガイド",
}

// パンくずで「イベント」配下に置くカテゴリ
export const EVENT_CATEGORIES: Category[] = [
  "event",
  "festival",
  "performance",
  "theater",
  "concert",
  "exhibition",
  "popup",
]

// 記事のエリアタグ。道玄坂・宮益坂・センター街・桜丘・神南などは「渋谷」に含める
export const AREAS = {
  shibuya: "渋谷",
  harajuku: "原宿",
  omotesando: "表参道",
  ebisu: "恵比寿",
  daikanyama: "代官山",
  yoyogi: "代々木",
  sendagaya: "千駄ヶ谷",
} as const

export type Area = keyof typeof AREAS

// 検索ニーズ別のテーマページ(例: 渋谷 無料 イベント)。記事の tags で判定(scripts/lib/themes.mjs に判定基準)
export const THEMES = {
  free: "無料イベント",
  kids: "子連れ・親子",
  workshop: "体験・ワークショップ",
  night: "夜・ライトアップ",
} as const

export type Theme = keyof typeof THEMES

export const PLACE_TYPES = {
  store: "店舗",
  facility: "商業施設・施設",
  temple: "寺院",
  shrine: "神社",
  museum: "博物館",
  theater: "劇場・ホール",
  park: "公園",
  tourist_spot: "観光スポット",
  restaurant: "飲食店",
  other: "その他",
} as const

export type PlaceType = keyof typeof PLACE_TYPES

// グルメスポット(飲食店・食品店)のジャンル
export const GOURMET_GENRES = {
  ramen: "ラーメン・つけ麺",
  washoku: "和食・寿司・そば",
  yakiniku: "焼肉・肉料理",
  yoshoku: "洋食・とんかつ",
  ethnic: "カレー・エスニック",
  sweets: "スイーツ・パン",
  cafe: "カフェ・喫茶",
  bar: "居酒屋・バー",
} as const

export type GourmetGenre = keyof typeof GOURMET_GENRES

export type Place = {
  id: string
  name: string
  type: PlaceType
  description: string
  address: string
  latitude: number | null
  longitude: number | null
  opening_hours: string | null
  phone: string | null
  url: string | null
  image_url: string | null
  genre?: GourmetGenre
  area: string
  source_id: string | null
  source_url: string | null
  // 掲載情報(住所・営業時間等)を最後に確認した日(YYYY-MM-DD)
  updated_at: string
}

// 楽天トラベルの施設。url はアフィリエイトURL
export type Hotel = {
  id: number
  name: string
  url: string
  image_url: string | null
  min_charge: number | null
  review_average: number | null
  nearest_station: string | null
  latitude: number
  longitude: number
}

export type ContentType = "event" | "news"

export type Content = {
  id: number
  type: ContentType
  title: string
  summary: string
  body: string
  category: Category
  area: Area
  // テーマページ(/theme/〇〇/)用のタグ。scripts/tag-contents.mjs・fetch-contents.mjs が付与
  tags?: Theme[]
  published_at: string
  start_at: string | null
  end_at: string | null
  place_id: string | null
  source_id: string | null
  source_url: string | null
  // 同一記事が複数回クロールされ内容統合された場合に追記される、source_url以外の出典URL一覧
  source_urls?: string[]
  image_url: string | null
}

export type SourceType =
  | "government"
  | "official"
  | "press_release"
  | "event_platform"
  | "gourmet_site"
  | "sns"
  | "web_media"

export type Source = {
  id: string
  name: string
  url: string
  source_type: SourceType
  priority: number
}

type Localized = Record<"ja" | "en" | "zh", string>

// 祭り年間カレンダー(/festivals/)の例年の行事。keyword を含むタイトルの開催予定記事を「次回」としてリンク
export type Festival = {
  month: number
  keyword: string
  name: Localized
  date: Localized
  venue: Localized
  description: Localized
}
