// components/OnsenQuizCard.tsx

import type { Question, OnsenType } from '@/lib/questions'

type Props = {
  question: Question
  onAnswer: (type: OnsenType) => void
}

export default function OnsenQuizCard({ question, onAnswer }: Props) {
  return (
    <div className="w-full">
      {/* シナリオラベル */}
      <p className="text-xs text-onsen font-bold tracking-widest uppercase mb-2">
        ♨ {question.scenario}
      </p>
      {/* 質問文 */}
      <p className="text-onsen-dark font-bold text-base leading-relaxed mb-6">
        {question.text}
      </p>
      {/* 選択肢 */}
      <div className="flex flex-col gap-3">
        {question.options.map((option) => (
          <button
            key={option.type}
            onClick={() => onAnswer(option.type)}
            className="w-full text-left px-4 py-3 rounded-lg border-2 border-onsen/30 text-gray-700 bg-onsen-white hover:border-onsen hover:bg-onsen-light hover:text-onsen-dark font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-onsen focus:ring-offset-2"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
