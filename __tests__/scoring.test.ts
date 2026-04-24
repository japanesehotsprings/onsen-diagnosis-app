// __tests__/scoring.test.ts

import { calcTypeScores, determineType } from '@/lib/scoring'
import type { OnsenType } from '@/lib/questions'

describe('calcTypeScores', () => {
  it('7問すべてT選択 → T=21, B=0, S=0, K=0', () => {
    const answers: OnsenType[] = ['T', 'T', 'T', 'T', 'T', 'T', 'T']
    expect(calcTypeScores(answers)).toEqual({ T: 21, B: 0, S: 0, K: 0 })
  })

  it('7問すべてB選択 → B=21, T=0, S=0, K=0', () => {
    const answers: OnsenType[] = ['B', 'B', 'B', 'B', 'B', 'B', 'B']
    expect(calcTypeScores(answers)).toEqual({ T: 0, B: 21, S: 0, K: 0 })
  })

  it('T=2, B=2, S=2, K=1 → T=6, B=6, S=6, K=3', () => {
    const answers: OnsenType[] = ['T', 'B', 'S', 'T', 'B', 'S', 'K']
    expect(calcTypeScores(answers)).toEqual({ T: 6, B: 6, S: 6, K: 3 })
  })
})

describe('determineType', () => {
  it('T最高スコア → T', () => {
    expect(determineType({ T: 21, B: 0, S: 0, K: 0 })).toBe('T')
  })

  it('K最高スコア → K', () => {
    expect(determineType({ T: 0, B: 0, S: 0, K: 21 })).toBe('K')
  })

  it('同点（T=9, B=9）→ T優先', () => {
    expect(determineType({ T: 9, B: 9, S: 0, K: 0 })).toBe('T')
  })

  it('同点（B=9, S=9）→ B優先', () => {
    expect(determineType({ T: 0, B: 9, S: 9, K: 0 })).toBe('B')
  })

  it('同点（S=9, K=9）→ S優先', () => {
    expect(determineType({ T: 0, B: 0, S: 9, K: 9 })).toBe('S')
  })

  it('全員同点（T=B=S=K=3）→ T優先', () => {
    expect(determineType({ T: 3, B: 3, S: 3, K: 3 })).toBe('T')
  })
})
