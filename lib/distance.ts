// lib/distance.ts

import type { OnsenSpot } from './onsenData'
import type { TravelTier } from './questions'

export const VALID_TIERS: TravelTier[] = [1, 2, 3, 4]

// 都内（東京）を起点とした距離帯のラベル。tier から表示文言を引く。
export const TIER_LABEL: Record<TravelTier, string> = {
  1: '都内から約2時間以内',
  2: '都内から約2〜4時間',
  3: '都内から約4〜6時間',
  4: '都内から約6時間〜',
}

// searchParams 等の文字列を TravelTier に変換する。
// 未指定・不正値は 4（=全件表示）にフォールバックし、過剰な絞り込みを避ける。
export function parseTier(raw?: string): TravelTier {
  const n = Number(raw)
  return (VALID_TIERS as number[]).includes(n) ? (n as TravelTier) : 4
}

// 距離(tier)昇順ソート済みのスポットから limit 件を「近い〜遠いが偏らないよう」選ぶ。
// 均等間隔で取るため両端（最寄り・最遠）を必ず含み、結果に距離のバランスが出る
// （例: 「どこでもOK」で近場ばかり/遠方ばかりにならず、近・中・遠が混ざる）。
function balancedPick(sorted: OnsenSpot[], limit: number): OnsenSpot[] {
  if (limit <= 0) return []
  if (sorted.length <= limit) return sorted
  if (limit === 1) return [sorted[0]]
  const picked: OnsenSpot[] = []
  for (let i = 0; i < limit; i++) {
    const idx = Math.round((i * (sorted.length - 1)) / (limit - 1))
    picked.push(sorted[idx])
  }
  return picked
}

// 選んだ距離帯(maxTier)を優先しつつ、常に limit 件を返す（「3選」と数を合わせる）。
// - 距離内に limit 件以上 → 距離内を近い〜遠いバランスで limit 件
// - 距離内が limit 未満 → 距離内を優先し、足りない分は「次に近い」温泉地で補完
//   （最寄りから埋めるので、近場を選んで最遠が出ることはない）
// - 距離内が0件 → 最寄りから limit 件で代替し isFallback=true（例: 秘湯×都内近場）
export function filterSpotsByTier(
  spots: OnsenSpot[],
  maxTier: TravelTier,
  limit = 3,
): { spots: OnsenSpot[]; isFallback: boolean } {
  const byTier = (a: OnsenSpot, b: OnsenSpot) => a.tier - b.tier
  const sorted = [...spots].sort(byTier)
  const within = sorted.filter((s) => s.tier <= maxTier)
  if (within.length >= limit) {
    return { spots: balancedPick(within, limit), isFallback: false }
  }
  if (within.length === 0) {
    return { spots: sorted.slice(0, limit), isFallback: true }
  }
  const beyond = sorted.filter((s) => s.tier > maxTier)
  return { spots: [...within, ...beyond].slice(0, limit), isFallback: false }
}
