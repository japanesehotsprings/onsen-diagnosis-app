// app/quiz/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QUESTIONS } from '@/lib/questions'
import { calcTypeScores, determineType } from '@/lib/scoring'
import ProgressBar from '@/components/ProgressBar'
import OnsenQuizCard from '@/components/OnsenQuizCard'
import type { OnsenType } from '@/lib/questions'

const STORAGE_KEY = 'onsen_quiz_result'

export default function QuizPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<OnsenType[]>([])

  function handleAnswer(type: OnsenType) {
    const newAnswers = [...answers, type]

    if (newAnswers.length === QUESTIONS.length) {
      // 全問完了: タイプを判定してsessionStorageに保存し結果ページへ
      setAnswers(newAnswers)
      try {
        const scores = calcTypeScores(newAnswers)
        const resultType = determineType(scores)
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ type: resultType }))
        } catch {
          // プライベートブラウジング等でsessionStorageが使えない場合は無視
        }
        router.push(`/result?type=${resultType}`)
      } catch {
        // determineTypeが例外を投げた場合はデフォルトTで遷移
        router.push('/result?type=T')
      }
    } else {
      setAnswers(newAnswers)
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const question = QUESTIONS[currentIndex]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ヘッダー（進捗バー） */}
        <div className="bg-onsen-dark text-onsen-white rounded-t-2xl px-6 py-4">
          <p className="text-xs opacity-70 tracking-widest uppercase mb-2">温泉スタイル診断</p>
          <ProgressBar current={currentIndex + 1} total={QUESTIONS.length} />
        </div>

        {/* 質問カード */}
        <div className="bg-onsen-white border border-t-0 border-onsen/20 rounded-b-2xl px-6 py-8 shadow-sm">
          <OnsenQuizCard question={question} onAnswer={handleAnswer} />
        </div>
      </div>
    </main>
  )
}
