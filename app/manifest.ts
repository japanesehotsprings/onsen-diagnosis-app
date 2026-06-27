import type { MetadataRoute } from 'next'

// PWA マニフェスト（スマホのホーム画面に追加した際のアイコン・名称・テーマ色）
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '温泉診断 | あなたにぴったりの温泉地を見つけよう',
    short_name: '温泉診断',
    description:
      '7問に答えるだけ。あなたの温泉スタイルタイプを診断して、ぴったりの温泉地を提案します。',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5ead8',
    theme_color: '#7b4f2e',
    icons: [
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
