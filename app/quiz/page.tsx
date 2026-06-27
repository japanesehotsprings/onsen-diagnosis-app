// app/quiz/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QUESTIONS, DISTANCE_QUESTION } from '@/lib/questions'
import { calcTypeScores, determineType } from '@/lib/scoring'
import ProgressBar from '@/components/ProgressBar'
import OnsenQuizCard from '@/components/OnsenQuizCard'
import type { OnsenType, TravelTier } from '@/lib/questions'

const STORAGE_KEY = 'onsen_quiz_result'
const TOTAL = QUESTIONS.length + 1 // 性格6問 + 距離1問

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [typeAnswers, setTypeAnswers] = useState<OnsenType[]>([])

  // 性格回答からタイプを判定し、距離(tier)付きで結果ページへ
  function goResult(answers: OnsenType[], tier: TravelTier) {
    try {
      const resultType = determineType(calcTypeScores(answers))
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ type: resultType, tier }))
      } catch {
        // プライベートブラウジング等でsessionStorageが使えない場合は無視
      }
      router.push(`/result?type=${resultType}&tier=${tier}`)
    } catch {
      // determineTypeが例外を投げた場合はデフォルトTで遷移
      router.push(`/result?type=T&tier=${tier}`)
    }
  }

  function handleSelect(index: number) {
    if (step < QUESTIONS.length) {
      // 性格の質問: 選んだタイプを蓄積して次へ
      const type = QUESTIONS[step].options[index].type
      setTypeAnswers((prev) => [...prev, type])
      setStep((prev) => prev + 1)
    } else {
      // 距離の質問（最終問）: tierを確定して結果へ
      const tier = DISTANCE_QUESTION.options[index].tier
      goResult(typeAnswers, tier)
    }
  }

  const isDistanceStep = step >= QUESTIONS.length
  const current = isDistanceStep ? DISTANCE_QUESTION : QUESTIONS[step]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ヘッダー（進捗バー） */}
        <div className="bg-onsen-dark text-onsen-white rounded-t-2xl px-6 py-4">
          <p className="text-xs opacity-70 tracking-widest uppercase mb-2">温泉スタイル診断</p>
          <ProgressBar current={step + 1} total={TOTAL} />
        </div>

        {/* 質問カード */}
        <div className="bg-onsen-white border border-t-0 border-onsen/20 rounded-b-2xl px-6 py-8 shadow-sm">
          <OnsenQuizCard
            scenario={current.scenario}
            text={current.text}
            options={current.options.map((o) => ({ label: o.label }))}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </main>
  )
}
