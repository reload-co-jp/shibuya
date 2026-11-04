import { locale as localeParam } from "next/root-params"
import {
  Area,
  AREAS,
  CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  CATEGORY_TITLES,
  Category,
  GOURMET_GENRES,
  GourmetGenre,
  PLACE_TYPES,
  PlaceType,
} from "./types"
import { Locale } from "./i18n-config"

export * from "./i18n-config"

// 日本語ページ((ja)ルートグループ)には[locale]が無くundefinedになる
export const getLocale = async (): Promise<Locale> =>
  ((await localeParam()) as Locale | undefined) ?? "ja"

const ja = {
  siteName: "渋谷ライブ",
  siteDescription:
    "渋谷・原宿・表参道・恵比寿エリアのイベント・新店舗・閉店・セール・POP UP・公演・展示・地域ニュースを届ける渋谷地域メディア",
  nav: {
    latest: "最新情報",
    events: "イベント",
    today: "今日",
    thisWeek: "今週",
    weekend: "今週末",
    nextWeek: "来週",
    thisMonth: "今月",
    festival: "祭り・季節行事",
    performance: "公演・ライブ",
    newOpening: "新店舗",
    closing: "閉店",
    sale: "セール",
    popup: "POP UP",
    exhibition: "展示・アート",
    places: "施設",
    gourmet: "グルメ",
    spots: "スポット",
    areas: "エリア",
    news: "ニュース",
    guide: "紹介記事",
  },
  breadcrumbLabel: "パンくずリスト",
  languageLabel: "言語",
  home: {
    title: "渋谷のイベント情報【毎日更新】今日・今週末の予定｜渋谷ライブ",
    description:
      "渋谷で今日・今週末・今月に開催されるイベントを毎日更新。代々木公園のフェス、渋谷ヒカリエ・渋谷スクランブルスクエア・SHIBUYA SKYの催し、ライブ・公演、展示・POP UP、新店舗・地域ニュースまで渋谷の今がわかる地域メディア。",
    heading: "渋谷のイベント・ライブ・展示・POP UP・新店舗・地域ニュース",
    today: "今日の渋谷",
    thisWeek: "今週の渋谷",
    weekend: "今週末の渋谷イベント",
    newOpening: "渋谷の新店舗",
    sale: "現在開催中のセール",
    latest: "渋谷の最新情報",
    places: "施設から探す",
    gourmet: "渋谷グルメ・人気店",
    hero: "渋谷の今を、見つける。",
    heroAlt: "渋谷スクランブル交差点",
    todayLead: "渋谷で、今日なにする？",
    featured: "注目記事",
    weekendLead: "週末に訪れたい、写真で選ぶイベント",
    newOpeningLead: "新しくオープンした店舗・施設",
    latestLead: "街の動きを新着順で",
    byCategory: "カテゴリーから読む",
    viewAll: "すべて見る",
  },
  search: {
    label: "サイト内検索",
    placeholder: "記事を検索",
    submit: "検索",
    title: "検索結果",
    count: "{n}件",
    empty: "該当する記事はありません。",
  },
  interstitial: { label: "広告", close: "閉じる", top: "トップへ" },
  footer: {
    about: "サイトについて",
    aboutText:
      "渋谷ライブ（SHIBUYA JOURNAL）は、渋谷エリアのイベント・祭り・公演・新店舗・地域ニュースを毎日更新で届ける地域メディアです。",
    operator: "運営者",
    operatorName: "株式会社リロード",
    contact: "お問い合わせ",
    contactText: "運営会社サイトよりご連絡ください",
  },
  carousel: {
    label: "開催中・近日開催のイベント",
    ongoing: "開催中",
    tomorrow: "明日から",
    dayAfter: "明後日から",
    today: "本日開催",
    endsToday: "本日まで",
    endsTomorrow: "明日まで",
    daysLeft: (days: number) => `あと${days}日`,
  },
  card: {
    held: (period: string) => `開催 ${period}`,
    published: (date: string) => `公開 ${date}`,
    empty: "現在情報はありません。",
  },
  imageAlt: (place: string, title: string) => `${place}の${title}`,
  themes: {
    free: {
      label: "無料イベント",
      title: "渋谷の無料イベント・入場無料の催し",
      description:
        "渋谷で開催中・開催予定の入場無料・参加無料のイベントをまとめています。祭り・展示・コンサート・体験企画など、お金をかけずに渋谷を楽しめる催しを開催日順に掲載。",
    },
    kids: {
      label: "子連れ・親子",
      title: "渋谷の子連れ・親子で楽しめるイベント",
      description:
        "渋谷で開催中・開催予定の子ども向け・親子向けイベントをまとめています。キッズ向け体験・ワークショップや親子で参加できる催しなど、家族で楽しめる催しを開催日順に掲載。",
    },
    workshop: {
      label: "体験・ワークショップ",
      title: "渋谷の体験・ワークショップイベント",
      description:
        "渋谷で開催中・開催予定の体験イベント・ワークショップをまとめています。ものづくりやアート・カルチャー体験など、見るだけでなく参加して楽しめる催しを開催日順に掲載。",
    },
    night: {
      label: "夜・ライトアップ",
      title: "夜の渋谷イベント・ライトアップ情報",
      description:
        "渋谷で開催中・開催予定の夜のイベント・ライトアップ・夜公演をまとめています。イルミネーションや夜景を楽しめる催し、夜のライブ・公演など、夜の渋谷の楽しみ方を開催日順に掲載。",
    },
  },
  hub: {
    byPeriod: "期間から探す",
    byGenre: "ジャンルから探す",
    byTheme: "テーマから探す",
    periodTitle: (label: string, period: string) =>
      `${label}の渋谷イベント｜${period}`,
    periodMetaTitle: (label: string) =>
      `${label}の渋谷イベント・祭り情報【毎日更新】`,
    thisMonthTitle: (month: string) => `${month}の渋谷イベント・祭り・公演`,
    periodDescription: (period: string) =>
      `${period}に渋谷で開催されるイベント・祭り・公演・ライブ・展示・POP UP情報を一覧でまとめています。代々木公園・渋谷ヒカリエ・渋谷パルコなど施設別の開催情報も掲載。`,
    periodLead: (period: string, count: number, updated: string) =>
      `${period}に渋谷で開催中・開催予定のイベント ${count}件（${updated}更新）`,
  },
  events: {
    title: "渋谷のイベント情報｜フェス・ライブ・展示・POP UP｜渋谷ライブ",
    description:
      "渋谷で開催中・開催予定のイベントを開催日順に掲載。代々木公園のフェスや季節行事、LINE CUBE SHIBUYA・渋谷公会堂などの公演・ライブ、展示やPOP UPまで、今日・今週末・今月の予定から探せます。",
    heading: "渋谷のイベント情報",
    lead: (count: number) => `渋谷で開催中・開催予定のイベント ${count}件`,
    archive: "月別アーカイブ",
    schedule: "開催スケジュール",
    upcoming: "開催中・開催予定のイベント一覧",
    monthTitle: (month: string) =>
      `${month}の渋谷イベント・祭り・公演一覧｜渋谷ライブ`,
    monthDescription: (month: string, count: number) =>
      `${month}に渋谷で開催された・開催されるイベント${count}件の一覧。祭り・フェス、公演・ライブ、展示、POP UPなどの開催日・会場をまとめています。`,
    monthHeading: (month: string) => `${month}の渋谷イベント`,
    monthLead: (month: string, count: number) =>
      `${month}に渋谷で開催のイベント ${count}件`,
  },
  festivals: {
    label: "祭り年間カレンダー",
    title:
      "渋谷の祭り・年間イベントカレンダー｜明治神宮・代々木公園のフェス・スーパーよさこい｜渋谷ライブ",
    description:
      "渋谷の祭り・年間イベントを月別にまとめた年間カレンダー。明治神宮の初詣・春の大祭・秋の大祭、代々木公園のタイフェスティバル、原宿表参道元氣祭スーパーよさこい、渋谷の神社の例大祭、ふるさと渋谷フェスティバルまで、例年の開催時期と会場を掲載。",
    heading: "渋谷の祭り・年間イベントカレンダー",
    lead: "日程は例年の目安です。開催予定が発表済みの行事は「次回」から詳細を確認できます。",
    month: (month: number) => `${month}月`,
    next: "次回",
  },
  category: {
    description: (base: string, count: number) =>
      `${base}。掲載${count}件を開催日・公開日順に紹介。`,
  },
  content: {
    ended: "開催終了",
    published: (date: string) => `${date} 公開`,
    period: "開催期間",
    place: "場所",
    address: "住所",
    source: "情報源",
    placeLink: (place: string) => `${place}のイベント・施設情報を見る →`,
    categoryLink: (category: string) => `渋谷の${category}情報一覧 →`,
    official: "公式情報を見る →",
    related: "関連する渋谷の情報",
  },
  place: {
    listTitle:
      "渋谷の観光スポット・施設情報｜商業施設・ホール・公園・神社｜渋谷ライブ",
    listDescription: (count: number) =>
      `渋谷ヒカリエ・渋谷スクランブルスクエア・渋谷パルコなどの商業施設、LINE CUBE SHIBUYAなどのホール、代々木公園・明治神宮まで、渋谷の施設${count}件の基本情報と開催中・今後のイベントをまとめています。`,
    listHeading: "渋谷の観光スポット・施設",
    listLead: "施設ごとに開催中・今後のイベントや関連ニュースを掲載",
    typeTitle: (type: string) => `渋谷の${type}一覧`,
    typeDescription: (type: string, count: number) =>
      `渋谷エリアの${type}${count}件の基本情報と開催中・今後のイベントをまとめています。`,
    more: (type: string) => `${type}をすべて見る`,
    eventCount: (count: number) => `開催中・今後のイベント ${count}件`,
    title: (name: string, type: string, area: string) =>
      `${name}のイベント・最新情報｜${type}・${area}｜渋谷ライブ`,
    descriptionSuffix: (count: number) =>
      ` 開催中・今後のイベント${count}件を掲載。`,
    imageAlt: (name: string) => `${name}の外観`,
    address: "住所",
    hours: "営業時間",
    updated: "情報更新日",
    map: (name: string) => `${name}の地図`,
    googleMaps: "Googleマップで開く →",
    hotels: "周辺のホテルを探す（楽天トラベル） →",
    nearbyHotels: (name: string) => `${name}周辺のホテル`,
    minCharge: (yen: number) => `${yen.toLocaleString()}円〜`,
    phone: "電話",
    official: "公式サイト →",
    ongoing: (name: string) => `${name}で開催中のイベント`,
    upcoming: (name: string) => `${name}の今後のイベント・行事`,
    others: (name: string) => `${name}の関連ニュース・過去のイベント`,
    otherPlaces: "渋谷のほかの施設",
  },
  categories: CATEGORIES as Record<Category, string>,
  categoryTitles: CATEGORY_TITLES,
  categoryDescriptions: CATEGORY_DESCRIPTIONS,
  placeTypes: PLACE_TYPES as Record<PlaceType, string>,
  gourmetGenres: GOURMET_GENRES as Record<GourmetGenre, string>,
  gourmet: {
    listTitle:
      "渋谷グルメ・人気店一覧｜ラーメン・焼肉・カフェ・スイーツ｜渋谷ライブ",
    listHeading: "渋谷グルメ・人気店",
    listDescription: (count: number) =>
      `ラーメン・和食・焼肉・洋食・カレー・スイーツ・カフェなど、渋谷の人気店・有名店${count}件をジャンル別にまとめています。`,
    genreTitle: (genre: string) => `渋谷の${genre}の人気店`,
    genreDescription: (genre: string, count: number) =>
      `渋谷エリアの${genre}の人気店・有名店${count}件の住所・電話番号などの基本情報をまとめています。`,
    more: (genre: string) => `${genre}をすべて見る`,
    viewAll: "グルメ一覧",
    placeTitle: (name: string, genre: string, area: string) =>
      `${name}｜渋谷の${genre}の人気店（${area}）｜渋谷ライブ`,
    sameGenre: (genre: string) => `渋谷のほかの${genre}の人気店`,
  },
  areas: AREAS as Record<Area, string>,
  area: {
    title: (area: string) => `${area}のイベント・新店舗・地域ニュース`,
    description: (area: string, count: number) =>
      `${area}エリアのイベント・新店舗・地域ニュースなど${count}件を公開日順に掲載。`,
    link: (area: string) => `${area}エリアの情報一覧 →`,
    listTitle: "エリアから探す｜渋谷周辺のイベント・新店舗・ニュース",
    listHeading: "エリアから探す",
    listDescription:
      "渋谷・原宿・表参道・恵比寿・代官山など渋谷周辺のエリア別に、イベント・新店舗・地域ニュースをまとめています。",
  },
}

type Dictionary = typeof ja

const en: Dictionary = {
  siteName: "Shibuya Live",
  siteDescription:
    "Local media covering Shibuya, Harajuku, Omotesando and Ebisu in Tokyo: events, live shows, exhibitions, new shops, closures, sales, pop-ups and neighborhood news.",
  nav: {
    latest: "Latest",
    events: "Events",
    today: "Today",
    thisWeek: "This Week",
    weekend: "This Weekend",
    nextWeek: "Next Week",
    thisMonth: "This Month",
    festival: "Festivals",
    performance: "Shows & Live",
    newOpening: "New Shops",
    closing: "Closures",
    sale: "Sales",
    popup: "Pop-ups",
    exhibition: "Exhibitions",
    places: "Places",
    gourmet: "Food",
    spots: "Spots",
    areas: "Areas",
    news: "News",
    guide: "Guides",
  },
  breadcrumbLabel: "Breadcrumb",
  languageLabel: "Language",
  home: {
    title: "Shibuya Events Today & This Weekend | Shibuya Live",
    description:
      "Daily-updated guide to events in Shibuya, Tokyo: festivals at Yoyogi Park, happenings at Shibuya Hikarie, Shibuya Scramble Square and SHIBUYA SKY, live shows, exhibitions, pop-ups, new shops and local news.",
    heading:
      "Events, live shows, exhibitions, pop-ups, new shops and local news in Shibuya, Tokyo",
    today: "Today in Shibuya",
    thisWeek: "This Week in Shibuya",
    weekend: "Shibuya Events This Weekend",
    newOpening: "New Shops in Shibuya",
    sale: "Sales Now On",
    latest: "Latest from Shibuya",
    places: "Browse by Place",
    gourmet: "Shibuya Food",
    hero: "Discover Shibuya, right now.",
    heroAlt: "Shibuya Scramble Crossing",
    todayLead: "What to do in Shibuya today?",
    featured: "Featured",
    weekendLead: "Pick your weekend in pictures",
    newOpeningLead: "Newly opened shops and venues",
    latestLead: "What's happening around town, newest first",
    byCategory: "Browse by Category",
    viewAll: "View all",
  },
  search: {
    label: "Search this site",
    placeholder: "Search articles",
    submit: "Search",
    title: "Search results",
    count: "{n} results",
    empty: "No matching articles.",
  },
  interstitial: { label: "Advertisement", close: "Close", top: "Home" },
  footer: {
    about: "About",
    aboutText:
      "Shibuya Live (SHIBUYA JOURNAL) is a local media covering events, festivals, performances, new shops and news in Shibuya, Tokyo — updated daily.",
    operator: "Operator",
    operatorName: "Reload, Inc.",
    contact: "Contact",
    contactText: "Please reach us via our company website",
  },
  carousel: {
    label: "Ongoing and upcoming events",
    ongoing: "Ongoing",
    tomorrow: "From tomorrow",
    dayAfter: "In 2 days",
    today: "Today only",
    endsToday: "Ends today",
    endsTomorrow: "Ends tomorrow",
    daysLeft: (days) => `${days} days left`,
  },
  card: {
    held: (period) => `Dates: ${period}`,
    published: (date) => `Published ${date}`,
    empty: "No information at the moment.",
  },
  imageAlt: (place, title) => `${title} at ${place}`,
  themes: {
    free: {
      label: "Free Events",
      title: "Free Events in Shibuya",
      description:
        "Free-admission and free-to-join events ongoing or coming up in Shibuya, including festivals, exhibitions, concerts and hands-on activities, listed by date.",
    },
    kids: {
      label: "Kids & Families",
      title: "Family-Friendly Events in Shibuya",
      description:
        "Events for kids and families ongoing or coming up in Shibuya, from seasonal events to children's workshops, listed by date.",
    },
    workshop: {
      label: "Experiences & Workshops",
      title: "Hands-on Experiences & Workshops in Shibuya",
      description:
        "Hands-on experiences, crafts and workshops ongoing or coming up in Shibuya, listed by date.",
    },
    night: {
      label: "Night & Illuminations",
      title: "Shibuya at Night: Evening Events & Illuminations",
      description:
        "Evening events, illuminations and night performances ongoing or coming up in Shibuya, listed by date.",
    },
  },
  hub: {
    byPeriod: "Browse by Date",
    byGenre: "Browse by Genre",
    byTheme: "Browse by Theme",
    periodTitle: (label, period) => `Shibuya Events ${label} | ${period}`,
    periodMetaTitle: (label) =>
      `Shibuya Events ${label} | Festivals & Shows, Updated Daily`,
    thisMonthTitle: (month) =>
      `Shibuya Events, Festivals & Performances in ${month}`,
    periodDescription: (period) =>
      `Events, festivals, live shows, exhibitions and pop-ups in Shibuya on ${period}, including listings by venue such as Yoyogi Park, Shibuya Hikarie and Shibuya PARCO.`,
    periodLead: (period, count, updated) =>
      `${count} events ongoing or scheduled in Shibuya on ${period} (updated ${updated})`,
  },
  events: {
    title:
      "Shibuya Events | Festivals, Live Shows, Exhibitions & Pop-ups | Shibuya Live",
    description:
      "Ongoing and upcoming events in Shibuya, sorted by date: festivals at Yoyogi Park, shows at LINE CUBE SHIBUYA and other halls, exhibitions and pop-ups. Browse by today, this weekend or this month.",
    heading: "Shibuya Events",
    lead: (count) => `${count} ongoing and upcoming events in Shibuya`,
    archive: "Monthly Archive",
    schedule: "Schedule",
    upcoming: "All Ongoing & Upcoming Events",
    monthTitle: (month) =>
      `Shibuya Events, Festivals & Performances in ${month} | Shibuya Live`,
    monthDescription: (month, count) =>
      `A list of ${count} events held in Shibuya in ${month}, including festivals, live shows, exhibitions and pop-ups, with dates and venues.`,
    monthHeading: (month) => `Shibuya Events in ${month}`,
    monthLead: (month, count) => `${count} events in Shibuya in ${month}`,
  },
  festivals: {
    label: "Festival Calendar",
    title:
      "Shibuya Festival & Annual Events Calendar: Meiji Jingu, Yoyogi Park Festivals, Super Yosakoi | Shibuya Live",
    description:
      "A month-by-month calendar of festivals and annual events in Shibuya, Tokyo: New Year and grand festivals at Meiji Jingu, Thai Festival at Yoyogi Park, Harajuku Omotesando Genki Matsuri Super Yosakoi, shrine festivals and the Furusato Shibuya Festival, with usual dates and venues.",
    heading: "Shibuya Festival & Annual Events Calendar",
    lead: 'Dates are typical for each year. Where this year\'s dates are announced, follow "Next" for details.',
    month: (month) =>
      new Date(Date.UTC(2000, month - 1)).toLocaleString("en", {
        month: "long",
        timeZone: "UTC",
      }),
    next: "Next",
  },
  category: {
    description: (base, count) =>
      `${base}. ${count} listings sorted by event or publication date.`,
  },
  content: {
    ended: "Ended",
    published: (date) => `Published ${date}`,
    period: "Dates",
    place: "Venue",
    address: "Address",
    source: "Source",
    placeLink: (place) => `Events and info for ${place} →`,
    categoryLink: (category) => `All ${category} in Shibuya →`,
    official: "Official information →",
    related: "Related in Shibuya",
  },
  place: {
    listTitle:
      "Shibuya Sightseeing Spots & Venues | Shopping, Halls, Parks & Shrines | Shibuya Live",
    listDescription: (count) =>
      `Basic information and ongoing/upcoming events for ${count} venues in Shibuya, from shopping complexes such as Shibuya Hikarie, Shibuya Scramble Square and Shibuya PARCO to concert halls, Yoyogi Park and Meiji Jingu.`,
    listHeading: "Shibuya Sightseeing Spots & Venues",
    listLead: "Ongoing and upcoming events and news for each venue",
    typeTitle: (type) => `${type} List in Shibuya`,
    typeDescription: (type, count) =>
      `Basic information and ongoing/upcoming events for ${count} places (${type}) in the Shibuya area.`,
    more: (type) => `See all: ${type}`,
    eventCount: (count) => `${count} ongoing/upcoming events`,
    title: (name, type, area) =>
      `${name} Events & News | ${type}, ${area} | Shibuya Live`,
    descriptionSuffix: (count) => ` ${count} ongoing and upcoming events.`,
    imageAlt: (name) => `Exterior of ${name}`,
    address: "Address",
    hours: "Hours",
    updated: "Last updated",
    map: (name) => `Map of ${name}`,
    googleMaps: "Open in Google Maps →",
    hotels: "Find nearby hotels (Rakuten Travel) →",
    nearbyHotels: (name: string) => `Hotels near ${name}`,
    minCharge: (yen: number) => `From ¥${yen.toLocaleString()}`,
    phone: "Phone",
    official: "Official website →",
    ongoing: (name) => `Ongoing Events at ${name}`,
    upcoming: (name) => `Upcoming Events at ${name}`,
    others: (name) => `News & Past Events at ${name}`,
    otherPlaces: "Other Places in Shibuya",
  },
  categories: {
    event: "Events",
    festival: "Festivals & Seasonal Events",
    performance: "Shows & Live",
    theater: "Theater",
    concert: "Concerts",
    new_opening: "New Openings",
    closing: "Closures",
    renewal: "Renewals",
    sale: "Sales",
    campaign: "Campaigns",
    popup: "Pop-ups",
    new_product: "New Products",
    exhibition: "Exhibitions",
    facility_news: "Venue News",
    local_news: "Local News",
    guide: "Spot Guides",
  },
  categoryTitles: {
    event: "Shibuya Events & Experiences",
    festival: "Shibuya Festivals, Seasonal & Street Events",
    performance: "Shibuya Shows, Live Music & Comedy",
    theater: "Shibuya Theater & Stage Shows",
    concert: "Shibuya Concerts & Live Music",
    new_opening: "New Shops & Openings in Shibuya",
    closing: "Closures in Shibuya",
    renewal: "Renewals in Shibuya",
    sale: "Sales in Shibuya",
    campaign: "Campaigns in Shibuya",
    popup: "Pop-up & Limited-time Shops in Shibuya",
    new_product: "New & Limited Products in Shibuya",
    exhibition: "Exhibitions in Shibuya",
    facility_news: "Shibuya Venue News",
    local_news: "Shibuya Local News",
    guide: "Shibuya Guides: Areas, Streets & Notable Spots",
  },
  categoryDescriptions: {
    event: "Events happening around Shibuya",
    festival: "Festivals and seasonal events in Shibuya",
    performance: "Shows and live performances in Shibuya",
    theater: "Theater performances in Shibuya",
    concert: "Concerts around Shibuya",
    new_opening: "Newly opened shops and venues around Shibuya",
    closing: "Shop closures around Shibuya",
    renewal: "Renewals around Shibuya",
    sale: "Sales happening around Shibuya",
    campaign: "Campaigns around Shibuya",
    popup: "Pop-up shops around Shibuya",
    new_product: "New products around Shibuya",
    exhibition: "Exhibitions around Shibuya",
    facility_news: "News from venues around Shibuya",
    local_news: "Local news from around Shibuya",
    guide: "Guides to Shibuya areas, streets and notable spots",
  },
  gourmetGenres: {
    ramen: "Ramen & Tsukemen",
    washoku: "Japanese, Sushi & Soba",
    yakiniku: "Yakiniku & Meat",
    yoshoku: "Western & Tonkatsu",
    ethnic: "Curry & Ethnic",
    sweets: "Sweets & Bakeries",
    cafe: "Cafés & Coffee",
    bar: "Izakaya & Bars",
  },
  gourmet: {
    listTitle:
      "Shibuya Food Guide: Popular Restaurants by Genre | Shibuya Live",
    listHeading: "Shibuya Food & Popular Restaurants",
    listDescription: (count) =>
      `${count} popular restaurants and food shops in Shibuya, by genre: ramen, Japanese, yakiniku, western, curry, sweets, cafés and more.`,
    genreTitle: (genre) => `Popular ${genre} in Shibuya`,
    genreDescription: (genre, count) =>
      `Addresses, phone numbers and basic information for ${count} popular ${genre} spots in Shibuya.`,
    more: (genre) => `See all ${genre}`,
    viewAll: "All food spots",
    placeTitle: (name, genre, area) =>
      `${name} | Popular ${genre} in Shibuya (${area}) | Shibuya Live`,
    sameGenre: (genre) => `More ${genre} in Shibuya`,
  },
  areas: {
    shibuya: "Shibuya",
    harajuku: "Harajuku",
    omotesando: "Omotesando",
    ebisu: "Ebisu",
    daikanyama: "Daikanyama",
    yoyogi: "Yoyogi",
    sendagaya: "Sendagaya",
  },
  area: {
    title: (area) => `${area} Events, New Shops & Local News`,
    description: (area, count) =>
      `${count} listings of events, new shops and local news in the ${area} area, sorted by publication date.`,
    link: (area) => `All listings in ${area} →`,
    listTitle: "Browse by Area | Events, New Shops & News around Shibuya",
    listHeading: "Browse by Area",
    listDescription:
      "Events, new shops and local news around Shibuya, organized by area: Shibuya, Harajuku, Omotesando, Ebisu, Daikanyama and more.",
  },
  placeTypes: {
    store: "Shop",
    facility: "Shopping & Facilities",
    temple: "Temple",
    shrine: "Shrine",
    museum: "Museum",
    theater: "Theaters & Halls",
    park: "Park",
    tourist_spot: "Sightseeing Spot",
    restaurant: "Restaurant",
    other: "Other",
  },
}

const zh: Dictionary = {
  siteName: "涩谷Live",
  siteDescription:
    "介绍东京涩谷・原宿・表参道・惠比寿地区活动、演出、展览、新店、闭店、促销、快闪店及地区新闻的本地媒体",
  nav: {
    latest: "最新资讯",
    events: "活动",
    today: "今天",
    thisWeek: "本周",
    weekend: "本周末",
    nextWeek: "下周",
    thisMonth: "本月",
    festival: "祭典・节庆",
    performance: "演出・现场",
    newOpening: "新店",
    closing: "闭店",
    sale: "促销",
    popup: "快闪店",
    exhibition: "展览・艺术",
    places: "设施",
    gourmet: "美食",
    spots: "景点",
    areas: "地区",
    news: "新闻",
    guide: "特色介绍",
  },
  breadcrumbLabel: "面包屑导航",
  languageLabel: "语言",
  home: {
    title: "涩谷活动信息【每日更新】今天・本周末的活动｜涩谷Live",
    description:
      "每日更新东京涩谷今天・本周末・本月举办的活动。代代木公园的节庆活动、涩谷Hikarie・涩谷Scramble Square・SHIBUYA SKY的活动、演出・现场、展览・快闪店、新店及地区新闻。",
    heading: "东京涩谷的活动・演出・展览・快闪店・新店・地区新闻",
    today: "今天的涩谷",
    thisWeek: "本周的涩谷",
    weekend: "本周末涩谷活动",
    newOpening: "涩谷新店",
    sale: "正在进行的促销",
    latest: "涩谷最新资讯",
    places: "按设施查找",
    gourmet: "涩谷美食・人气店",
    hero: "发现此刻的涩谷。",
    heroAlt: "涩谷十字路口",
    todayLead: "今天在涩谷做什么？",
    featured: "精选文章",
    weekendLead: "用照片挑选周末活动",
    newOpeningLead: "新开业的店铺与设施",
    latestLead: "按时间顺序了解街区动态",
    byCategory: "按分类阅读",
    viewAll: "查看全部",
  },
  search: {
    label: "站内搜索",
    placeholder: "搜索文章",
    submit: "搜索",
    title: "搜索结果",
    count: "{n}条结果",
    empty: "没有找到相关文章。",
  },
  interstitial: { label: "广告", close: "关闭", top: "首页" },
  footer: {
    about: "关于本站",
    aboutText:
      "涩谷Live（SHIBUYA JOURNAL）是每日更新涩谷地区活动、祭典、演出、新店与地区新闻的地方媒体。",
    operator: "运营者",
    operatorName: "株式会社Reload",
    contact: "联系我们",
    contactText: "请通过运营公司网站联系",
  },
  carousel: {
    label: "正在举办・即将举办的活动",
    ongoing: "举办中",
    tomorrow: "明天开始",
    dayAfter: "后天开始",
    today: "仅限今天",
    endsToday: "今天结束",
    endsTomorrow: "明天结束",
    daysLeft: (days) => `还剩${days}天`,
  },
  card: {
    held: (period) => `举办 ${period}`,
    published: (date) => `发布 ${date}`,
    empty: "目前暂无信息。",
  },
  imageAlt: (place, title) => `${place}的${title}`,
  themes: {
    free: {
      label: "免费活动",
      title: "涩谷免费活动・免费入场活动",
      description:
        "汇总涩谷正在举办和即将举办的免费入场・免费参加活动，包括祭典、展览、音乐会和体验活动，按日期排列。",
    },
    kids: {
      label: "亲子・带孩子",
      title: "涩谷亲子活动・适合带孩子的活动",
      description:
        "汇总涩谷正在举办和即将举办的儿童・亲子活动，从季节活动到儿童工作坊，按日期排列。",
    },
    workshop: {
      label: "体验・工作坊",
      title: "涩谷体验活动・工作坊",
      description:
        "汇总涩谷正在举办和即将举办的体验、手工制作和工作坊活动，按日期排列。",
    },
    night: {
      label: "夜晚・灯光秀",
      title: "涩谷夜间活动・灯光秀信息",
      description:
        "汇总涩谷正在举办和即将举办的夜间活动、灯光秀和夜场演出，按日期排列。",
    },
  },
  hub: {
    byPeriod: "按日期查找",
    byGenre: "按类别查找",
    byTheme: "按主题查找",
    periodTitle: (label, period) => `${label}涩谷活动｜${period}`,
    periodMetaTitle: (label) => `${label}涩谷活动・祭典信息【每日更新】`,
    thisMonthTitle: (month) => `${month}涩谷活动・祭典・演出`,
    periodDescription: (period) =>
      `汇总${period}在涩谷举办的活动、祭典、演出、现场、展览及快闪店信息，并按代代木公园、涩谷Hikarie、涩谷PARCO等设施分类介绍。`,
    periodLead: (period, count, updated) =>
      `${period}在涩谷举办中・即将举办的活动 ${count}项（${updated}更新）`,
  },
  events: {
    title: "涩谷活动信息｜节庆・演出・展览・快闪店｜涩谷Live",
    description:
      "按日期介绍涩谷正在举办和即将举办的活动。从代代木公园的节庆活动，到LINE CUBE SHIBUYA等会场的演出与现场，以及展览和快闪店，可按今天、本周末、本月查找。",
    heading: "涩谷活动信息",
    lead: (count) => `涩谷正在举办・即将举办的活动 ${count}项`,
    archive: "按月归档",
    schedule: "举办日程",
    upcoming: "正在举办・即将举办的活动一览",
    monthTitle: (month) => `${month}涩谷活动・祭典・演出一览｜涩谷Live`,
    monthDescription: (month, count) =>
      `${month}在涩谷举办的${count}项活动一览，汇总祭典、演出、现场、展览、快闪店等的日期与会场。`,
    monthHeading: (month) => `${month}涩谷活动`,
    monthLead: (month, count) => `${month}在涩谷举办的活动 ${count}项`,
  },
  festivals: {
    label: "祭典年历",
    title:
      "涩谷祭典・年度活动日历｜明治神宫・代代木公园节庆・超级YOSAKOI｜涩谷Live",
    description:
      "按月份整理的涩谷祭典与年度活动日历。明治神宫的新年参拜・春季大祭・秋季大祭，代代木公园的泰国节，原宿表参道元气祭超级YOSAKOI，神社例大祭及故乡涩谷节等，介绍往年的举办时间与会场。",
    heading: "涩谷祭典・年度活动日历",
    lead: "日期为往年的大致时间。已公布举办日期的活动可通过「下次」查看详情。",
    month: (month) => `${month}月`,
    next: "下次",
  },
  category: {
    description: (base, count) =>
      `${base}。共${count}条，按举办日・发布日排序。`,
  },
  content: {
    ended: "已结束",
    published: (date) => `${date} 发布`,
    period: "举办期间",
    place: "地点",
    address: "地址",
    source: "信息来源",
    placeLink: (place) => `查看${place}的活动・设施信息 →`,
    categoryLink: (category) => `涩谷${category}信息一览 →`,
    official: "查看官方信息 →",
    related: "涩谷相关信息",
  },
  place: {
    listTitle: "涩谷观光景点・设施信息｜商业设施・演出厅・公园・神社｜涩谷Live",
    listDescription: (count) =>
      `汇总涩谷Hikarie、涩谷Scramble Square、涩谷PARCO等商业设施，LINE CUBE SHIBUYA等演出厅，以及代代木公园、明治神宫共${count}处的基本信息与正在举办・即将举办的活动。`,
    listHeading: "涩谷观光景点・设施",
    listLead: "按设施介绍正在举办・即将举办的活动及相关新闻",
    typeTitle: (type) => `涩谷${type}一览`,
    typeDescription: (type, count) =>
      `汇总涩谷地区${type}共${count}处的基本信息与正在举办・即将举办的活动。`,
    more: (type) => `查看全部${type}`,
    eventCount: (count) => `举办中・即将举办的活动 ${count}项`,
    title: (name, type, area) =>
      `${name}的活动・最新资讯｜${type}・${area}｜涩谷Live`,
    descriptionSuffix: (count) => ` 收录举办中・即将举办的活动${count}项。`,
    imageAlt: (name) => `${name}外观`,
    address: "地址",
    hours: "营业时间",
    updated: "信息更新日",
    map: (name) => `${name}地图`,
    googleMaps: "在Google地图中打开 →",
    hotels: "查找附近酒店（乐天旅游） →",
    nearbyHotels: (name: string) => `${name}附近的酒店`,
    minCharge: (yen: number) => `${yen.toLocaleString()}日元起`,
    phone: "电话",
    official: "官方网站 →",
    ongoing: (name) => `${name}正在举办的活动`,
    upcoming: (name) => `${name}即将举办的活动・仪式`,
    others: (name) => `${name}的相关新闻・往期活动`,
    otherPlaces: "涩谷其他设施",
  },
  categories: {
    event: "活动",
    festival: "祭典・节庆",
    performance: "演出・现场",
    theater: "戏剧",
    concert: "音乐会",
    new_opening: "新店开业",
    closing: "闭店",
    renewal: "重新装修",
    sale: "促销",
    campaign: "优惠活动",
    popup: "快闪店",
    new_product: "新品",
    exhibition: "展览",
    facility_news: "设施新闻",
    local_news: "地区新闻",
    guide: "特色介绍",
  },
  categoryTitles: {
    event: "涩谷活动・体验信息",
    festival: "涩谷祭典・季节・街头活动",
    performance: "涩谷演出・现场・喜剧信息",
    theater: "涩谷戏剧・舞台演出信息",
    concert: "涩谷音乐会・现场演出信息",
    new_opening: "涩谷新店・新开业信息",
    closing: "涩谷闭店信息",
    renewal: "涩谷重新装修信息",
    sale: "涩谷促销信息",
    campaign: "涩谷优惠活动信息",
    popup: "涩谷快闪店・限时店铺信息",
    new_product: "涩谷新品・限定商品信息",
    exhibition: "涩谷展览・展会信息",
    facility_news: "涩谷设施新闻",
    local_news: "涩谷地区新闻",
    guide: "涩谷特色介绍・街区与景点指南",
  },
  categoryDescriptions: {
    event: "汇总涩谷地区举办的活动信息",
    festival: "汇总涩谷的祭典・节庆活动信息",
    performance: "汇总涩谷的演出・现场信息",
    theater: "汇总涩谷的戏剧演出信息",
    concert: "汇总涩谷地区的音乐会信息",
    new_opening: "汇总涩谷地区新开业的店铺・设施信息",
    closing: "汇总涩谷地区的闭店信息",
    renewal: "汇总涩谷地区的重新装修信息",
    sale: "汇总涩谷地区正在进行的促销信息",
    campaign: "汇总涩谷地区的优惠活动信息",
    popup: "汇总涩谷地区的快闪店信息",
    new_product: "汇总涩谷地区的新品信息",
    exhibition: "汇总涩谷地区的展览信息",
    facility_news: "汇总涩谷地区的设施新闻",
    local_news: "汇总涩谷地区的地区新闻",
    guide: "汇总涩谷街区、街道与景点的特色介绍文章",
  },
  gourmetGenres: {
    ramen: "拉面・蘸面",
    washoku: "日料・寿司・荞麦面",
    yakiniku: "烤肉・肉料理",
    yoshoku: "西餐・炸猪排",
    ethnic: "咖喱・异国料理",
    sweets: "甜品・面包",
    cafe: "咖啡馆",
    bar: "居酒屋・酒吧",
  },
  gourmet: {
    listTitle: "涩谷美食・人气店一览｜拉面・烤肉・咖啡馆・甜品｜涩谷Live",
    listHeading: "涩谷美食・人气店",
    listDescription: (count) =>
      `按类别汇总拉面、日料、烤肉、西餐、咖喱、甜品、咖啡馆等涩谷人气店共${count}家。`,
    genreTitle: (genre) => `涩谷的${genre}人气店`,
    genreDescription: (genre, count) =>
      `汇总涩谷地区${genre}人气店共${count}家的地址、电话等基本信息。`,
    more: (genre) => `查看全部${genre}`,
    viewAll: "美食一览",
    placeTitle: (name, genre, area) =>
      `${name}｜涩谷${genre}人气店（${area}）｜涩谷Live`,
    sameGenre: (genre) => `涩谷的其他${genre}人气店`,
  },
  areas: {
    shibuya: "涩谷",
    harajuku: "原宿",
    omotesando: "表参道",
    ebisu: "惠比寿",
    daikanyama: "代官山",
    yoyogi: "代代木",
    sendagaya: "千驮谷",
  },
  area: {
    title: (area) => `${area}的活动・新店・地区新闻`,
    description: (area, count) =>
      `按发布日期介绍${area}地区的活动、新店及地区新闻等共${count}条信息。`,
    link: (area) => `${area}地区信息一览 →`,
    listTitle: "按地区查找｜涩谷周边的活动・新店・新闻",
    listHeading: "按地区查找",
    listDescription:
      "按涩谷、原宿、表参道、惠比寿、代官山等涩谷周边地区，汇总活动、新店及地区新闻。",
  },
  placeTypes: {
    store: "店铺",
    facility: "商业设施・设施",
    temple: "寺院",
    shrine: "神社",
    museum: "博物馆",
    theater: "剧场・演出厅",
    park: "公园",
    tourist_spot: "观光景点",
    restaurant: "餐饮店",
    other: "其他",
  },
}

export const DICTIONARIES: Record<Locale, Dictionary> = { ja, en, zh }

export const getDictionary = async () => {
  const locale = await getLocale()
  return { locale, t: DICTIONARIES[locale] }
}
