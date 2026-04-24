// components/OnsenResultCard.tsx

import type { OnsenTypeData } from '@/lib/onsenData'

type Props = {
  data: OnsenTypeData
}

export default function OnsenResultCard({ data }: Props) {
  return (
    <>
      {/* タイプ表示 */}
      <div className="text-center mb-5">
        <p className="text-xs text-gray-500 mb-2">あなたの温泉スタイル</p>
        <p className="text-2xl font-bold text-onsen-dark mb-1">{data.name}</p>
        <p className="text-sm text-onsen">{data.catchPhrase}</p>
      </div>

      {/* 区切り */}
      <div className="border-t border-onsen/20 my-4" />

      {/* 説明文 */}
      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        {data.description}
      </p>

      {/* おすすめ温泉地 */}
      <p className="text-xs font-bold text-onsen-dark tracking-widest uppercase mb-3">
        ♨ あなたにおすすめの温泉地
      </p>
      <div className="flex flex-col gap-3 mb-6">
        {data.spots.map((spot) => (
          <div
            key={spot.name}
            className="bg-onsen-light rounded-xl p-4"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-bold text-onsen-dark text-sm">{spot.name}</span>
              <span className="text-xs text-gray-500">{spot.prefecture}</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">{spot.description}</p>
            <div className="flex gap-2">
              <a
                href={spot.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${spot.name}の宿を予約する（外部リンク）`}
                className="flex-1 text-center py-2 rounded-lg text-xs font-bold text-onsen-white transition-all active:scale-95"
                style={{ backgroundColor: '#c8956c' }}
              >
                宿を予約する
              </a>
              <a
                href={spot.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${spot.name}の記事を読む（外部リンク）`}
                className="flex-1 text-center py-2 rounded-lg text-xs font-bold text-onsen-dark border-2 border-onsen transition-all active:scale-95"
              >
                記事を読む
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
