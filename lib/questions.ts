// lib/questions.ts

export type OnsenType = 'T' | 'B' | 'S' | 'K'

// 都内（東京）からの距離帯。1=近い 〜 4=最遠。診断結果の温泉地フィルタに使う。
export type TravelTier = 1 | 2 | 3 | 4

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

// 性格（温泉スタイル）を判定する6問。各回答は選んだタイプに加点される。
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
]

export type DistanceOption = {
  label: string
  tier: TravelTier
}

export type DistanceQuestion = {
  id: number
  scenario: string
  text: string
  options: DistanceOption[]
}

// 距離の質問（最終問）。性格スコアには加点せず、結果の温泉地を都内基準で絞り込むのに使う。
export const DISTANCE_QUESTION: DistanceQuestion = {
  id: 7,
  scenario: 'どこまで行ける？',
  text: '都内から、どのくらいの距離まで足を伸ばせますか？',
  options: [
    { label: '都内から2時間以内の近場でいい', tier: 1 },
    { label: '2〜4時間まで。少し足を伸ばせる', tier: 2 },
    { label: '泊まりでしっかり。半日かけてもいい', tier: 3 },
    { label: 'どこでもOK。遠くても絶景なら行く', tier: 4 },
  ],
}
