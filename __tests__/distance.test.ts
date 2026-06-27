// __tests__/distance.test.ts

import { filterSpotsByTier, parseTier } from '@/lib/distance'
import type { OnsenSpot } from '@/lib/onsenData'
import type { TravelTier } from '@/lib/questions'

const spot = (name: string, tier: TravelTier): OnsenSpot => ({
  name,
  prefecture: 'X県',
  tier,
  description: '',
  affiliateUrl: '#',
  articleUrl: '#',
})

describe('filterSpotsByTier', () => {
  it('距離内に十分あれば、距離内のみをバランス良く返す（遠方は出ない）', () => {
    const s: OnsenSpot[] = [spot('A', 1), spot('B', 1), spot('C', 1), spot('D', 4)]
    const r = filterSpotsByTier(s, 1)
    expect(r.isFallback).toBe(false)
    expect(r.spots.map((x) => x.name).sort()).toEqual(['A', 'B', 'C'])
    expect(r.spots.every((x) => x.tier <= 1)).toBe(true) // 最遠Dは出ない
  })

  it('距離内が3件未満なら「次に近い」温泉で3件まで補完する', () => {
    const s: OnsenSpot[] = [spot('A', 1), spot('B', 2), spot('C', 4), spot('D', 4)]
    const r = filterSpotsByTier(s, 1)
    expect(r.isFallback).toBe(false)
    expect(r.spots.length).toBe(3)
    expect(r.spots[0].name).toBe('A') // 最寄りを最優先
    expect(r.spots.map((x) => x.name)).toEqual(['A', 'B', 'C']) // 近い順で補完・最遠Dは出ない
  })

  it('総数が3未満なら、ある分だけ返す', () => {
    const s: OnsenSpot[] = [spot('A', 1), spot('B', 4)]
    const r = filterSpotsByTier(s, 1)
    expect(r.spots.length).toBe(2)
  })

  it('どこでもOK(tier4)は近い〜遠いをバランス良く選び、両端を含む', () => {
    const s: OnsenSpot[] = [spot('A', 1), spot('B', 2), spot('C', 4), spot('D', 4)]
    const r = filterSpotsByTier(s, 4, 3)
    expect(r.isFallback).toBe(false)
    expect(r.spots.length).toBe(3)
    expect(r.spots[0].name).toBe('A') // 最寄りを含む
    expect(r.spots[r.spots.length - 1].name).toBe('D') // 最遠を含む
  })

  it('距離内に候補が無ければ isFallback=true で最寄りから3件返す', () => {
    const s: OnsenSpot[] = [spot('E', 2), spot('F', 4), spot('G', 4)]
    const r = filterSpotsByTier(s, 1)
    expect(r.isFallback).toBe(true)
    expect(r.spots[0].name).toBe('E') // 最寄り
    expect(r.spots.length).toBe(3)
  })
})

describe('parseTier', () => {
  it('未指定はtier4（全件表示）にフォールバック', () => {
    expect(parseTier(undefined)).toBe(4)
  })
  it('不正値はtier4', () => {
    expect(parseTier('9')).toBe(4)
  })
  it('正常値はそのまま', () => {
    expect(parseTier('1')).toBe(1)
  })
})
