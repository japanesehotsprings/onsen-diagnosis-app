import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '温泉診断 | あなたにぴったりの温泉地を見つけよう',
  description:
    '7問に答えるだけ。あなたの温泉スタイルタイプを診断して、ぴったりの温泉地を提案します。',
  // スマホのホーム画面に追加したときのアプリ名（iOS）
  appleWebApp: {
    capable: true,
    title: '温泉診断',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: '温泉診断 | あなたにぴったりの温泉地を見つけよう',
    description: '7問・約1分でわかる、あなたの温泉スタイル診断。',
    type: 'website',
  },
}

// ブラウザのテーマ色（アドレスバー等）をブランドのブラウンに合わせる
export const viewport: Viewport = {
  themeColor: '#7b4f2e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-onsen-light font-sans">{children}</body>
    </html>
  )
}
