// lib/scoring.ts

import type { OnsenType } from './questions'

export type TypeScores = Record<OnsenType, number>

// 同点時の優先順位: T > B > S > K
const TYPE_PRIORITY: OnsenType[] = ['T', 'B', 'S', 'K']

// 回答配列（OnsenType[]）から各タイプの合計スコアを計算する
// 各回答は選択されたタイプに3点を加算
export function calcTypeScores(answers: OnsenType[]): TypeScores {
  const scores: TypeScores = { T: 0, B: 0, S: 0, K: 0 }
  answers.forEach((type) => {
    scores[type] += 3
  })
  return scores
}

// スコアが最大のタイプを返す（同点の場合はTYPE_PRIORITYに従う）
export function determineType(scores: TypeScores): OnsenType {
  const max = Math.max(...Object.values(scores))
  const type = TYPE_PRIORITY.find((t) => scores[t] === max)
  if (!type) throw new Error(`determineType: no matching type in ${JSON.stringify(scores)}`)
  return type
}
