// app/page.tsx

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ヘッダー */}
        <div className="bg-onsen-dark text-onsen-white rounded-t-2xl px-6 py-5 text-center">
          <p className="text-xs opacity-70 tracking-widest uppercase mb-1">日本温泉</p>
          <h1 className="text-xl font-bold leading-snug">
            あなたにぴったりの<br />温泉地を見つけよう
          </h1>
        </div>

        {/* ボディ */}
        <div className="bg-onsen-white border border-t-0 border-onsen/20 rounded-b-2xl px-6 py-8 shadow-sm">
          <p className="text-center text-gray-700 leading-relaxed mb-6">
            疲れ？美容？絶景？<br />
            <span className="font-bold text-onsen-dark">あなたの「温泉スタイル」</span>を診断して、<br />
            ぴったりの温泉地をご提案します。
            <span className="block text-sm text-gray-400 mt-1">7問・約1分で診断</span>
          </p>

          <ul className="space-y-2 text-sm text-gray-600 mb-8">
            <li className="flex items-start gap-2">
              <span className="text-onsen font-bold mt-0.5">♨</span>
              <span>4タイプの温泉スタイル診断</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-onsen font-bold mt-0.5">♨</span>
              <span>タイプ別おすすめ温泉地3選</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-onsen font-bold mt-0.5">♨</span>
              <span>宿の予約リンク・詳細記事へ直接アクセス</span>
            </li>
          </ul>

          <Link
            href="/quiz"
            className="block w-full bg-onsen-dark text-onsen-white text-center py-4 rounded-xl font-bold text-base hover:bg-onsen-dark/90 active:scale-95 transition-all"
          >
            診断スタート →
          </Link>

          <p className="text-center text-xs text-gray-400 mt-4">無料</p>
        </div>
      </div>
    </main>
  )
}
