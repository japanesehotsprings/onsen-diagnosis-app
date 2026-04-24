// app/result/page.tsx
// searchParams から type=T|B|S|K を受け取り診断結果を表示するページ

import { ONSEN_DATA, VALID_TYPES } from '@/lib/onsenData'
import type { OnsenType } from '@/lib/questions'
import OnsenResultCard from '@/components/OnsenResultCard'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
const DEFAULT_TYPE: OnsenType = 'T'

type Props = {
  searchParams: Promise<{ type?: string }>
}

export default async function ResultPage({ searchParams }: Props) {
  // Next.js 15以降、searchParamsはPromiseのためawaitが必要
  const params = await searchParams
  const rawType = params.type?.toUpperCase()
  const type: OnsenType =
    rawType && (VALID_TYPES as string[]).includes(rawType)
      ? (rawType as OnsenType)
      : DEFAULT_TYPE

  const data = ONSEN_DATA[type]
  const shareUrl = `${BASE_URL}/result?type=${type}`

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ヘッダー */}
        <div className="bg-onsen-dark text-onsen-white rounded-t-2xl px-6 py-5 text-center">
          <p className="text-xs opacity-70 tracking-widest uppercase mb-1">日本温泉</p>
          <h1 className="text-lg font-bold">診断結果</h1>
        </div>

        {/* 結果カード */}
        <div className="bg-onsen-white border border-t-0 border-onsen/20 rounded-b-2xl px-6 py-8 shadow-sm">
          <OnsenResultCard data={data} shareUrl={shareUrl} />
        </div>
      </div>
    </main>
  )
}
