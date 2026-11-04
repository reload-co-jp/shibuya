import { Archivo, Noto_Sans_JP } from "next/font/google"

// 見出し(ゴシック)。和文は分割配信されるためpreloadしない
export const heading = Noto_Sans_JP({
  weight: ["700", "900"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--font-heading-jp",
})

// ロゴ・欧文見出し用のディスプレイサンセリフ
export const display = Archivo({
  weight: ["800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
})
