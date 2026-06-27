// components/OnsenResultCard.tsx

import type { OnsenTypeData, OnsenSpot } from '@/lib/onsenData'
import { TIER_LABEL } from '@/lib/distance'

type Props = {
  data: OnsenTypeData
  spots: OnsenSpot[] // 距離フィルタ適用後の表示スポット
  isFallback?: boolean // 希望距離に該当が無く、最寄りで代替表示しているか
}

export default function OnsenResultCard({ data, spots, isFallback }: Props) {
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

      {/* 希望距離に近い候補が無かった場合の注記 */}
      {isFallback && (
        <p className="text-xs text-gray-500 bg-onsen-light/60 border border-onsen/20 rounded-lg px-3 py-2 mb-3 leading-relaxed">
          ご希望の距離に近い候補が少なかったため、都内から近い順にご紹介します。
        </p>
      )}

      <div className="flex flex-col gap-3 mb-6">
        {spots.map((spot) => (
          <div
            key={spot.name}
            className="bg-onsen-light rounded-xl p-4"
          >
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <span className="font-bold text-onsen-dark text-sm">{spot.name}</span>
              <span className="text-xs text-gray-500">{spot.prefecture}</span>
              <span className="text-[10px] text-onsen bg-onsen-white border border-onsen/30 rounded-full px-2 py-0.5">
                {TIER_LABEL[spot.tier]}
              </span>
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
