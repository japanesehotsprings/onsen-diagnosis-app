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

const spots: OnsenSpot[] = [spot('A', 1), spot('B', 2), spot('C', 4), spot('D', 4)]

describe('filterSpotsByTier', () => {
  it('都内近場(tier1)を選ぶとtier1のスポットだけ・isFallback=false', () => {
    const r = filterSpotsByTier(spots, 1)
    expect(r.isFallback).toBe(false)
    expect(r.spots.map((s) => s.name)).toEqual(['A'])
  })

  it('tier2はtier1とtier2を近い順で含む', () => {
    const r = filterSpotsByTier(spots, 2)
    expect(r.spots.map((s) => s.name)).toEqual(['A', 'B'])
  })

  it('どこでもOK(tier4)は近い〜遠いをバランス良く選び、両端を含む', () => {
    const r = filterSpotsByTier(spots, 4, 3)
    expect(r.isFallback).toBe(false)
    expect(r.spots.length).toBe(3)
    expect(r.spots[0].name).toBe('A') // 最寄りを含む
    expect(r.spots[r.spots.length - 1].name).toBe('D') // 最遠を含む
  })

  it('候補が多くても最寄り帯と最遠帯の両方を含む', () => {
    const set: OnsenSpot[] = [spot('a', 1), spot('b', 1), spot('c', 2), spot('d', 4), spot('e', 4)]
    const r = filterSpotsByTier(set, 4, 3)
    expect(r.spots[0].tier).toBe(1) // 最寄り帯
    expect(r.spots[r.spots.length - 1].tier).toBe(4) // 最遠帯
  })

  it('該当タイプに近場が無ければisFallback=trueで最寄りから近い順に埋める', () => {
    const farOnly: OnsenSpot[] = [spot('E', 2), spot('F', 4)]
    const r = filterSpotsByTier(farOnly, 1)
    expect(r.isFallback).toBe(true)
    expect(r.spots.map((s) => s.name)).toEqual(['E', 'F']) // 最寄りから limit まで
  })

  it('fallback時も limit を超えない', () => {
    const farOnly: OnsenSpot[] = [spot('E', 3), spot('F', 4), spot('G', 4), spot('H', 4)]
    const r = filterSpotsByTier(farOnly, 1, 2)
    expect(r.isFallback).toBe(true)
    expect(r.spots.map((s) => s.name)).toEqual(['E', 'F'])
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
