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

// 選んだ距離帯(maxTier)に収まるスポットを「都内から近い順」で返す。
// 該当が1件も無ければ、最寄りのスポットから limit 件を埋め isFallback=true を返す
// （例: 秘湯タイプ×都内近場のように、近場の候補が無いケースを誠実に扱う）。
export function filterSpotsByTier(
  spots: OnsenSpot[],
  maxTier: TravelTier,
  limit = 3,
): { spots: OnsenSpot[]; isFallback: boolean } {
  const byTier = (a: OnsenSpot, b: OnsenSpot) => a.tier - b.tier
  const within = spots.filter((s) => s.tier <= maxTier).sort(byTier)
  if (within.length > 0) {
    return { spots: within.slice(0, limit), isFallback: false }
  }
  const nearest = [...spots].sort(byTier).slice(0, limit)
  return { spots: nearest, isFallback: true }
}
