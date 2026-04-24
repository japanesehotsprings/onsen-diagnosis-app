# 温泉診断アプリ 実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 7問の診断クイズでT/B/S/Kの4タイプを判定し、タイプ別おすすめ温泉地3件とアフィリエイトリンク・記事リンクを表示するNext.jsアプリを構築する。

**Architecture:** diagnosis-appと同じNext.js 16 App Router + Tailwind CSS v4構成で新規アプリを作成。スコアリングは各回答がT/B/S/Kのいずれかに3点を付与する単純加算。quiz → /result?type=X への直接遷移（previewページなし）。

**Tech Stack:** Next.js 16.2.4, React 19, TypeScript, Tailwind CSS v4 (@tailwindcss/postcss), Jest + ts-jest

**重要:** 実装前に `node_modules/next/dist/docs/` を必ず確認すること（AGENTS.md参照）。Next.js 15以降、`searchParams` はPromise型になっている。

---

## ファイル構成

| ファイル | 役割 |
|---|---|
| `app/globals.css` | Tailwind v4 @theme でonsenカラー定義 |
| `app/layout.tsx` | メタデータ + html/body |
| `app/page.tsx` | TOPページ |
| `app/quiz/page.tsx` | クイズページ（7問・client component） |
| `app/result/page.tsx` | 結果ページ（async server component） |
| `components/ProgressBar.tsx` | プログレスバー |
| `components/OnsenQuizCard.tsx` | 質問カード（シナリオ + 4択） |
| `components/OnsenResultCard.tsx` | 結果カード（タイプ + 温泉地3件） |
| `lib/questions.ts` | 7問の質問データ |
| `lib/onsenData.ts` | タイプ定義 + 温泉地データ（12件） |
| `lib/scoring.ts` | スコア計算ロジック |
| `__tests__/scoring.test.ts` | scoring.tsのユニットテスト |
| `AGENTS.md` | Next.js注意書き |
| `CLAUDE.md` | @AGENTS.md |
| `.env.local` | アフィリエイトURL等の環境変数 |

---

### Task 1: プロジェクトセットアップ

**Files:**
- Create: `TechVillage/onsen-diagnosis-app/` 全体（Next.jsスキャフォールド）

- [ ] **Step 1: create-next-appを実行**

```bash
cd /Users/nozaki/Desktop/CEO/TechVillage/onsen-diagnosis-app
npx create-next-app@16.2.4 . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-src-dir \
  --import-alias "@/*"
```

プロンプトが出た場合は全てデフォルト（Enter）で進める。

Expected: `package.json`, `app/`, `components/` 等が生成される。

- [ ] **Step 2: Jestをインストール**

```bash
npm install -D jest @types/jest ts-jest
```

Expected: インストール完了。

- [ ] **Step 3: jest.config.tsを作成**

Create: `jest.config.ts`

```ts
// jest.config.ts
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {}],
  },
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default config
```

- [ ] **Step 4: package.jsonにtestスクリプトを確認・追加**

`package.json` の `scripts` に `"test": "jest"` が存在するか確認。なければ追加する。

- [ ] **Step 5: AGENTS.mdとCLAUDE.mdを作成**

Create: `AGENTS.md`

```markdown
<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
```

Create: `CLAUDE.md`

```markdown
@AGENTS.md
```

- [ ] **Step 6: .env.localを作成**

Create: `.env.local`

```
# 各温泉地のアフィリエイトURL（楽天トラベル・じゃらんのURLに差し替え）
NEXT_PUBLIC_AFFILIATE_KUSATSU=#
NEXT_PUBLIC_AFFILIATE_BEPPU=#
NEXT_PUBLIC_AFFILIATE_IBUSUKI=#
NEXT_PUBLIC_AFFILIATE_TAMATSUKURI=#
NEXT_PUBLIC_AFFILIATE_URESHINO=#
NEXT_PUBLIC_AFFILIATE_YUFUIN=#
NEXT_PUBLIC_AFFILIATE_NYUTO=#
NEXT_PUBLIC_AFFILIATE_KUROKAWA=#
NEXT_PUBLIC_AFFILIATE_NOBORIBETSU=#
NEXT_PUBLIC_AFFILIATE_ARIMA=#
NEXT_PUBLIC_AFFILIATE_DOGO=#
NEXT_PUBLIC_AFFILIATE_GERO=#

# 自社記事URL（日本温泉Webメディア）
NEXT_PUBLIC_ARTICLE_KUSATSU=#
NEXT_PUBLIC_ARTICLE_BEPPU=#
NEXT_PUBLIC_ARTICLE_IBUSUKI=#
NEXT_PUBLIC_ARTICLE_TAMATSUKURI=#
NEXT_PUBLIC_ARTICLE_URESHINO=#
NEXT_PUBLIC_ARTICLE_YUFUIN=#
NEXT_PUBLIC_ARTICLE_NYUTO=#
NEXT_PUBLIC_ARTICLE_KUROKAWA=#
NEXT_PUBLIC_ARTICLE_NOBORIBETSU=#
NEXT_PUBLIC_ARTICLE_ARIMA=#
NEXT_PUBLIC_ARTICLE_DOGO=#
NEXT_PUBLIC_ARTICLE_GERO=#

# SNSシェア用ベースURL（Vercelデプロイ後に差し替え）
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- [ ] **Step 7: .gitignoreに.env.localが含まれることを確認**

```bash
grep "\.env\.local" .gitignore
```

Expected: `.env.local` が表示される。なければ追記する。

- [ ] **Step 8: dev serverが起動することを確認**

```bash
npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
kill %1
```

Expected: `200`

- [ ] **Step 9: コミット**

```bash
git add -A
git commit -m "chore: scaffold onsen-diagnosis-app with Next.js + Jest"
```

---

### Task 2: カラーテーマ + layout.tsx

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: globals.cssをonsenテーマに差し替え**

`app/globals.css` を以下の内容で上書きする：

```css
@import "tailwindcss";

@theme {
  --color-onsen-dark:  #7b4f2e;
  --color-onsen:       #c8956c;
  --color-onsen-light: #f5ead8;
  --color-onsen-white: #fffdf7;
}
```

- [ ] **Step 2: layout.tsxをonsen用メタデータに差し替え**

`app/layout.tsx` を以下の内容で上書きする：

```tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '温泉診断 | あなたにぴったりの温泉地を見つけよう',
  description:
    '7問に答えるだけ。あなたの温泉スタイルタイプを診断して、ぴったりの温泉地を提案します。',
  openGraph: {
    title: '温泉診断 | あなたにぴったりの温泉地を見つけよう',
    description: '7問・約1分でわかる、あなたの温泉スタイル診断。',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-onsen-light font-sans">{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: dev serverで背景色がベージュになることを確認**

```bash
npm run dev &
sleep 5
curl -s http://localhost:3000 | grep "bg-onsen-light"
kill %1
```

Expected: `bg-onsen-light` がHTMLに含まれる。

- [ ] **Step 4: コミット**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add onsen color theme and layout metadata"
```

---

### Task 3: 質問データ定義 (lib/questions.ts)

**Files:**
- Create: `lib/questions.ts`

- [ ] **Step 1: lib/questions.tsを作成**

```ts
// lib/questions.ts

export type OnsenType = 'T' | 'B' | 'S' | 'K'

export type AnswerOption = {
  label: string
  type: OnsenType
}

export type Question = {
  id: number
  scenario: string
  text: string
  options: AnswerOption[]
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    scenario: '体の声を聞いてみよう',
    text: '旅の前日夜、あなたの体はどんなサインを出していますか？',
    options: [
      { label: '肩も腰もガチガチ。とにかく休みたい', type: 'T' },
      { label: '最近、肌の乾燥やくすみが気になる', type: 'B' },
      { label: '元気なのに、なぜかもっと活力が欲しい', type: 'K' },
      { label: '毎日同じ景色に飽き飽きしている', type: 'S' },
    ],
  },
  {
    id: 2,
    scenario: '温泉に何を求める？',
    text: 'あの湯船に浸かったとき、何を感じたいですか？',
    options: [
      { label: '疲れが溶けていくような、深い脱力感', type: 'T' },
      { label: '湯上がりに鏡を見てうれしくなる肌', type: 'B' },
      { label: '体の内側から元気が沸いてくる感覚', type: 'K' },
      { label: '「こんな場所があったのか」という感動', type: 'S' },
    ],
  },
  {
    id: 3,
    scenario: '好きな泉質は？',
    text: '湯の個性で選ぶなら、どれに心が動く？',
    options: [
      { label: '硫黄の香りがする、力強い白濁の湯', type: 'T' },
      { label: 'とろとろ・すべすべの美肌系アルカリ泉', type: 'B' },
      { label: '炭酸・塩化物系のパワフルな効能泉', type: 'K' },
      { label: '透明でクリアな源泉かけ流し', type: 'S' },
    ],
  },
  {
    id: 4,
    scenario: '旅のスタイルは？',
    text: '温泉旅行中、あなたはどう過ごしたい？',
    options: [
      { label: '宿でひたすらのんびり。何もしないが最高', type: 'T' },
      { label: '温泉地の街をぶらぶら、お土産・スイーツも楽しむ', type: 'B' },
      { label: '早起きして朝風呂、体を整えて一日をスタート', type: 'K' },
      { label: '秘湯や絶景を求めて積極的に動き回りたい', type: 'S' },
    ],
  },
  {
    id: 5,
    scenario: '誰と行く？',
    text: '旅の相手が、温泉の楽しみ方を変える。',
    options: [
      { label: '一人でじっくり、自分だけの時間', type: 'T' },
      { label: 'パートナーと二人、特別な時間を共有', type: 'B' },
      { label: '友人と賑やかに、笑いながら', type: 'K' },
      { label: '家族みんなで、思い出をつくりに', type: 'S' },
    ],
  },
  {
    id: 6,
    scenario: 'どんな宿に泊まりたい？',
    text: '宿のタイプも、温泉旅の大事な要素。',
    options: [
      { label: '老舗の高級旅館。おもてなしと料理を堪能', type: 'T' },
      { label: '露天風呂付き客室で、誰にも気兼ねなく', type: 'B' },
      { label: '活気ある温泉街の中の宿。街ごと楽しむ', type: 'K' },
      { label: '山奥のこぢんまりした宿。電波も届かない', type: 'S' },
    ],
  },
  {
    id: 7,
    scenario: 'どのくらい遠くまで行ける？',
    text: '旅の距離感で、向かえる温泉地が変わる。',
    options: [
      { label: '2〜4時間。少し遠くまで行ける', type: 'T' },
      { label: '日帰りでも十分。サクッと行きたい', type: 'B' },
      { label: '近場（2時間以内）でいい', type: 'K' },
      { label: 'どこでもOK。遠ければ遠いほどいい', type: 'S' },
    ],
  },
]
```

- [ ] **Step 2: QUESTIONSが7件であることを確認**

```bash
node -e "const q = require('./lib/questions'); console.log(q.QUESTIONS.length)"
```

Expected: `7`（TypeScriptの場合は `npx ts-node -e "..."` でも可）

- [ ] **Step 3: コミット**

```bash
git add lib/questions.ts
git commit -m "feat: add quiz questions data (7 questions, 4 types)"
```

---

### Task 4: 温泉データ定義 (lib/onsenData.ts)

**Files:**
- Create: `lib/onsenData.ts`

- [ ] **Step 1: lib/onsenData.tsを作成**

```ts
// lib/onsenData.ts

import type { OnsenType } from './questions'

export type OnsenSpot = {
  name: string
  prefecture: string
  description: string
  affiliateUrl: string
  articleUrl: string
}

export type OnsenTypeData = {
  key: OnsenType
  name: string
  catchPhrase: string
  description: string
  spots: [OnsenSpot, OnsenSpot, OnsenSpot]
}

export const ONSEN_DATA: Record<OnsenType, OnsenTypeData> = {
  T: {
    key: 'T',
    name: 'とろける湯タイプ',
    catchPhrase: '疲れた体を芯から溶かす湯へ',
    description:
      '体の疲れを深いところから抜きたいあなた。効能の強い湯にじっくり浸かり、ただただ何もしない時間こそが最高のご褒美。老舗旅館のおもてなしと豪勢な料理も堪能しましょう。',
    spots: [
      {
        name: '草津温泉',
        prefecture: '群馬県',
        description: '日本三名泉。強酸性の湯で疲れをごっそり抜く',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_KUSATSU ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_KUSATSU ?? '#',
      },
      {
        name: '別府温泉',
        prefecture: '大分県',
        description: '日本一の湧出量。多彩な泉質でじっくり癒される',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_BEPPU ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_BEPPU ?? '#',
      },
      {
        name: '指宿温泉',
        prefecture: '鹿児島県',
        description: '砂むし温泉体験。体の芯まで温まる独自の文化',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_IBUSUKI ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_IBUSUKI ?? '#',
      },
    ],
  },
  B: {
    key: 'B',
    name: '美肌の湯タイプ',
    catchPhrase: '湯上がりの肌で、もう一度輝く',
    description:
      '温泉の美容効果にこだわりたいあなた。とろとろ・すべすべの美肌系泉質は、スキンケアとしても一級品。旅行後の肌の変化を楽しみながら、温泉地の街散策も満喫しましょう。',
    spots: [
      {
        name: '玉造温泉',
        prefecture: '島根県',
        description: '日本最古の美肌の湯。ぬるっとしたアルカリ性単純泉',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_TAMATSUKURI ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_TAMATSUKURI ?? '#',
      },
      {
        name: '嬉野温泉',
        prefecture: '佐賀県',
        description: 'とろとろ感日本一と称される美肌湯。温泉豆腐も名物',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_URESHINO ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_URESHINO ?? '#',
      },
      {
        name: '湯布院温泉',
        prefecture: '大分県',
        description: '由布岳の麓の上質な湯と洗練された街並み',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_YUFUIN ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_YUFUIN ?? '#',
      },
    ],
  },
  S: {
    key: 'S',
    name: '秘湯探訪タイプ',
    catchPhrase: '誰も知らない絶景の湯を探して',
    description:
      '温泉の先にある非日常を求めるあなた。絶景の露天風呂、山奥の秘湯、誰も知らない一軒宿。旅そのものが目的になる、温泉旅の醍醐味を知っています。',
    spots: [
      {
        name: '乳頭温泉郷',
        prefecture: '秋田県',
        description: '7つの宿が点在する秘湯の聖地。乳白色の湯が幻想的',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_NYUTO ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_NYUTO ?? '#',
      },
      {
        name: '黒川温泉',
        prefecture: '熊本県',
        description: '山間の露天風呂めぐりが体験できる隠れ里',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_KUROKAWA ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_KUROKAWA ?? '#',
      },
      {
        name: '登別温泉',
        prefecture: '北海道',
        description: '地獄谷の迫力と多彩な泉質。大自然の中の非日常',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_NOBORIBETSU ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_NOBORIBETSU ?? '#',
      },
    ],
  },
  K: {
    key: 'K',
    name: '活湯タイプ',
    catchPhrase: '温泉で体をリセット、明日へ走る',
    description:
      '温泉を体のメンテナンスとして使いこなすあなた。朝風呂で体を整え、活力を充填して帰る。歴史ある名湯の効能をフル活用する、実利派の温泉スタイルです。',
    spots: [
      {
        name: '有馬温泉',
        prefecture: '兵庫県',
        description: '日本最古の温泉。金泉・銀泉の二種類の泉質でリセット',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_ARIMA ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_ARIMA ?? '#',
      },
      {
        name: '道後温泉',
        prefecture: '愛媛県',
        description: '日本書紀にも登場。歴史と現代が交差する活力の湯',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_DOGO ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_DOGO ?? '#',
      },
      {
        name: '下呂温泉',
        prefecture: '岐阜県',
        description: '日本三名泉。肌あたりの柔らかい重曹泉で体をリフレッシュ',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_GERO ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_GERO ?? '#',
      },
    ],
  },
}

export const VALID_TYPES: OnsenType[] = ['T', 'B', 'S', 'K']
```

- [ ] **Step 2: ONSEN_DATAの全キーが揃っていることを確認**

`lib/onsenData.ts` を目視確認：T, B, S, K それぞれに `spots` が3件あること。

- [ ] **Step 3: コミット**

```bash
git add lib/onsenData.ts
git commit -m "feat: add onsen type data and spot definitions"
```

---

### Task 5: スコアリングロジック TDD (lib/scoring.ts)

**Files:**
- Create: `__tests__/scoring.test.ts`
- Create: `lib/scoring.ts`

- [ ] **Step 1: テストファイルを作成（失敗するテストを先に書く）**

Create: `__tests__/scoring.test.ts`

```ts
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
```

- [ ] **Step 2: テストが失敗することを確認**

```bash
npx jest __tests__/scoring.test.ts 2>&1 | tail -5
```

Expected: `Cannot find module '@/lib/scoring'` のようなエラーで失敗する。

- [ ] **Step 3: lib/scoring.tsを実装**

Create: `lib/scoring.ts`

```ts
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
```

- [ ] **Step 4: テストが全て通ることを確認**

```bash
npx jest __tests__/scoring.test.ts --verbose
```

Expected:
```
✓ calcTypeScores > 7問すべてT選択 → T=21, B=0, S=0, K=0
✓ calcTypeScores > 7問すべてB選択 → B=21, T=0, S=0, K=0
✓ calcTypeScores > T=2, B=2, S=2, K=1 → T=6, B=6, S=6, K=3
✓ determineType > T最高スコア → T
✓ determineType > K最高スコア → K
✓ determineType > 同点（T=9, B=9）→ T優先
✓ determineType > 同点（B=9, S=9）→ B優先
✓ determineType > 同点（S=9, K=9）→ S優先
✓ determineType > 全員同点（T=B=S=K=3）→ T優先

Tests: 9 passed
```

- [ ] **Step 5: コミット**

```bash
git add lib/scoring.ts __tests__/scoring.test.ts
git commit -m "feat: add scoring logic with TDD (calcTypeScores, determineType)"
```

---

### Task 6: ProgressBar コンポーネント

**Files:**
- Create: `components/ProgressBar.tsx`

- [ ] **Step 1: components/ProgressBar.tsxを作成**

diagnosis-appのProgressBarをonsenテーマ色に変更したバージョン。

```tsx
// components/ProgressBar.tsx

type Props = {
  current: number  // 1始まり（現在の問番号）
  total: number    // 全問数（7）
}

export default function ProgressBar({ current, total }: Props) {
  const percentage = (current / total) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-onsen-white/70 mb-1">
        <span>Q{current} / {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-onsen-white/20 rounded-full h-2">
        <div
          className="bg-onsen-white h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: コミット**

```bash
git add components/ProgressBar.tsx
git commit -m "feat: add ProgressBar component with onsen theme"
```

---

### Task 7: OnsenQuizCard コンポーネント

**Files:**
- Create: `components/OnsenQuizCard.tsx`

- [ ] **Step 1: components/OnsenQuizCard.tsxを作成**

diagnosis-appのQuizCardと異なり、各質問が独自の4択（ラベル + タイプ）を持つ。

```tsx
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
```

- [ ] **Step 2: コミット**

```bash
git add components/OnsenQuizCard.tsx
git commit -m "feat: add OnsenQuizCard component"
```

---

### Task 8: OnsenResultCard コンポーネント

**Files:**
- Create: `components/OnsenResultCard.tsx`

- [ ] **Step 1: components/OnsenResultCard.tsxを作成**

```tsx
// components/OnsenResultCard.tsx

import type { OnsenTypeData } from '@/lib/onsenData'

type Props = {
  data: OnsenTypeData
  shareUrl: string
}

export default function OnsenResultCard({ data, shareUrl }: Props) {
  const xShareText = encodeURIComponent(
    `私は「${data.name}」でした！\nおすすめ：${data.spots[0].name}・${data.spots[1].name}・${data.spots[2].name}\n`,
  )
  const xShareUrl = `https://twitter.com/intent/tweet?text=${xShareText}&url=${encodeURIComponent(shareUrl)}`
  const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`

  return (
    <>
      {/* タイプバッジ */}
      <div className="text-center mb-5">
        <p className="text-xs text-gray-500 mb-2">あなたの温泉スタイル</p>
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-onsen-dark text-onsen-white text-4xl font-bold shadow-lg mb-3">
          {data.key}
        </div>
        <p className="text-lg font-bold text-onsen-dark">{data.name}</p>
        <p className="text-sm text-onsen mt-1">{data.catchPhrase}</p>
      </div>

      {/* 区切り */}
      <div className="border-t border-onsen/20 my-4" />

      {/* 説明文 */}
      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        {data.description}
      </p>

      {/* おすすめ温泉地 */}
      <p className="text-xs font-bold text-onsen-dark tracking-widest uppercase mb-3">
        ♨ あなたにおすすめの温泉地
      </p>
      <div className="flex flex-col gap-3 mb-6">
        {data.spots.map((spot) => (
          <div
            key={spot.name}
            className="bg-onsen-light rounded-xl p-4"
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-bold text-onsen-dark text-sm">{spot.name}</span>
              <span className="text-xs text-gray-500">{spot.prefecture}</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">{spot.description}</p>
            <div className="flex gap-2">
              <a
                href={spot.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${spot.name}の宿を予約する（外部リンク）`}
                className="flex-1 text-center py-2 rounded-lg text-xs font-bold text-onsen-white transition-all active:scale-95"
                style={{ backgroundColor: '#c8956c' }}
              >
                宿を予約する
              </a>
              <a
                href={spot.articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${spot.name}の記事を読む（外部リンク）`}
                className="flex-1 text-center py-2 rounded-lg text-xs font-bold text-onsen-dark border-2 border-onsen transition-all active:scale-95"
              >
                記事を読む
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* SNSシェア */}
      <div className="flex gap-3">
        <a
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Xでシェアする（外部リンク）"
          className="flex-1 text-center py-3 rounded-xl text-sm font-bold text-white active:scale-95 transition-all"
          style={{ backgroundColor: '#000000' }}
        >
          𝕏 でシェア
        </a>
        <a
          href={lineShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LINEでシェアする（外部リンク）"
          className="flex-1 text-center py-3 rounded-xl text-sm font-bold text-white active:scale-95 transition-all"
          style={{ backgroundColor: '#06c755' }}
        >
          LINEでシェア
        </a>
      </div>
    </>
  )
}
```

- [ ] **Step 2: コミット**

```bash
git add components/OnsenResultCard.tsx
git commit -m "feat: add OnsenResultCard with spots, affiliate links, and SNS share"
```

---

### Task 9: TOPページ (app/page.tsx)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: app/page.tsxをonsen用TOPページに差し替え**

`app/page.tsx` を以下の内容で上書きする：

```tsx
// app/page.tsx

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* ヘッダー */}
        <div className="bg-onsen-dark text-onsen-white rounded-t-2xl px-6 py-5 text-center">
          <p className="text-xs opacity-70 tracking-widest uppercase mb-1">日本温泉</p>
          <h1 className="text-xl font-bold leading-snug">
            あなたにぴったりの<br />温泉地を見つけよう
          </h1>
        </div>

        {/* ボディ */}
        <div className="bg-onsen-white border border-t-0 border-onsen/20 rounded-b-2xl px-6 py-8 shadow-sm">
          <p className="text-center text-gray-700 leading-relaxed mb-6">
            疲れ？美容？絶景？<br />
            <span className="font-bold text-onsen-dark">あなたの「温泉スタイル」</span>を診断して、<br />
            ぴったりの温泉地をご提案します。
            <span className="block text-sm text-gray-400 mt-1">7問・約1分で診断</span>
          </p>

          <ul className="space-y-2 text-sm text-gray-600 mb-8">
            <li className="flex items-start gap-2">
              <span className="text-onsen font-bold mt-0.5">♨</span>
              <span>4タイプの温泉スタイル診断</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-onsen font-bold mt-0.5">♨</span>
              <span>タイプ別おすすめ温泉地3選</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-onsen font-bold mt-0.5">♨</span>
              <span>宿の予約リンク・詳細記事へ直接アクセス</span>
            </li>
          </ul>

          <Link
            href="/quiz"
            className="block w-full bg-onsen-dark text-onsen-white text-center py-4 rounded-xl font-bold text-base hover:bg-onsen-dark/90 active:scale-95 transition-all"
          >
            診断スタート →
          </Link>

          <p className="text-center text-xs text-gray-400 mt-4">無料</p>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: dev serverでTOPページを確認**

```bash
npm run dev &
sleep 5
curl -s http://localhost:3000 | grep "診断スタート"
kill %1
```

Expected: `診断スタート` が含まれる。

- [ ] **Step 3: コミット**

```bash
git add app/page.tsx
git commit -m "feat: add onsen top page"
```

---

### Task 10: クイズページ (app/quiz/page.tsx)

**Files:**
- Create: `app/quiz/page.tsx`

- [ ] **Step 1: app/quiz/page.tsxを作成**

```tsx
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
```

- [ ] **Step 2: dev serverでクイズページにアクセスできることを確認**

```bash
npm run dev &
sleep 5
curl -s http://localhost:3000/quiz | grep "温泉スタイル診断"
kill %1
```

Expected: `温泉スタイル診断` が含まれる。

- [ ] **Step 3: コミット**

```bash
git add app/quiz/page.tsx
git commit -m "feat: add quiz page with 7-question flow"
```

---

### Task 11: 結果ページ (app/result/page.tsx)

**Files:**
- Create: `app/result/page.tsx`

- [ ] **Step 1: app/result/page.tsxを作成**

```tsx
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
```

- [ ] **Step 2: dev serverで各typeの結果ページが表示されることを確認**

```bash
npm run dev &
sleep 5
curl -s "http://localhost:3000/result?type=T" | grep "とろける湯タイプ"
curl -s "http://localhost:3000/result?type=B" | grep "美肌の湯タイプ"
curl -s "http://localhost:3000/result?type=S" | grep "秘湯探訪タイプ"
curl -s "http://localhost:3000/result?type=K" | grep "活湯タイプ"
kill %1
```

Expected: 各コマンドでタイプ名が含まれるHTMLが返る。

- [ ] **Step 3: 不正なtypeのフォールバックを確認**

```bash
npm run dev &
sleep 5
curl -s "http://localhost:3000/result?type=Z" | grep "とろける湯タイプ"
kill %1
```

Expected: `とろける湯タイプ`（T=デフォルト）が表示される。

- [ ] **Step 4: テストが全て通ることを確認**

```bash
npm test
```

Expected: `Tests: 9 passed, 0 failed`

- [ ] **Step 5: ビルドが通ることを確認**

```bash
npm run build 2>&1 | tail -10
```

Expected: `Route (app)` の一覧が表示され、エラーなし。

- [ ] **Step 6: コミット**

```bash
git add app/result/page.tsx
git commit -m "feat: add result page with onsen recommendations and SNS share"
```
