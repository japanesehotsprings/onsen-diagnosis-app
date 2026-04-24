import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '温泉診断 | あなたにぴったりの温泉地を見つけよう',
  description:
    '7問に答えるだけ。あなたの温泉スタイルタイプを診断して、ぴったりの温泉地を提案します。',
  openGraph: {
    title: '温泉診断 | あなたにぴったりの温泉地を見つけよう',
    description: '7問・約1分でわかる、あなたの温泉スタイル診断。',
    type: 'website',
  },
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
