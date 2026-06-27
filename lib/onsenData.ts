// lib/onsenData.ts

import type { OnsenType, TravelTier } from './questions'

export type OnsenSpot = {
  name: string
  prefecture: string
  tier: TravelTier // 都内からの距離帯（1=近い 〜 4=最遠）
  description: string
  affiliateUrl: string
  articleUrl: string
}

export type OnsenTypeData = {
  key: OnsenType
  name: string
  catchPhrase: string
  description: string
  spots: OnsenSpot[] // 各タイプとも都内近場〜遠方を含むよう配置（距離フィルタ用）
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
        tier: 1,
        description: '日本三名泉。強酸性の湯で疲れをごっそり抜く。都心から行ける名湯',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_KUSATSU ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_KUSATSU ?? '#',
      },
      {
        name: '那須温泉',
        prefecture: '栃木県',
        tier: 1,
        description: '鹿の湯の硫黄泉。都内から約2時間で本格的な湯治気分',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_NASU ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_NASU ?? '#',
      },
      {
        name: '蔵王温泉',
        prefecture: '山形県',
        tier: 2,
        description: '強酸性の硫黄泉。濃い白濁の湯で体を芯から温める',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_ZAO ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_ZAO ?? '#',
      },
      {
        name: '別府温泉',
        prefecture: '大分県',
        tier: 4,
        description: '日本一の湧出量。多彩な泉質でじっくり癒される',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_BEPPU ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_BEPPU ?? '#',
      },
      {
        name: '指宿温泉',
        prefecture: '鹿児島県',
        tier: 4,
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
        name: '伊香保温泉',
        prefecture: '群馬県',
        tier: 1,
        description: '黄金の湯と石段街。湯上がりしっとり、街散策も楽しい',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_IKAHO ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_IKAHO ?? '#',
      },
      {
        name: '四万温泉',
        prefecture: '群馬県',
        tier: 1,
        description: 'すべすべの美肌湯。物語の里でのんびり過ごす',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_SHIMA ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_SHIMA ?? '#',
      },
      {
        name: '玉造温泉',
        prefecture: '島根県',
        tier: 3,
        description: '日本最古の美肌の湯。ぬるっとしたアルカリ性単純泉',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_TAMATSUKURI ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_TAMATSUKURI ?? '#',
      },
      {
        name: '嬉野温泉',
        prefecture: '佐賀県',
        tier: 4,
        description: 'とろとろ感日本一と称される美肌湯。温泉豆腐も名物',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_URESHINO ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_URESHINO ?? '#',
      },
      {
        name: '湯布院温泉',
        prefecture: '大分県',
        tier: 4,
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
        name: '奥日光湯元温泉',
        prefecture: '栃木県',
        tier: 2,
        description: '標高1500mの硫黄泉。都内から行ける山の秘湯',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_OKUNIKKO ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_OKUNIKKO ?? '#',
      },
      {
        name: '白骨温泉',
        prefecture: '長野県',
        tier: 2,
        description: '乳白色の湯と「泡の湯」で知られる山あいの秘湯',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_SHIRAHONE ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_SHIRAHONE ?? '#',
      },
      {
        name: '乳頭温泉郷',
        prefecture: '秋田県',
        tier: 4,
        description: '7つの宿が点在する秘湯の聖地。乳白色の湯が幻想的',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_NYUTO ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_NYUTO ?? '#',
      },
      {
        name: '黒川温泉',
        prefecture: '熊本県',
        tier: 4,
        description: '山間の露天風呂めぐりが体験できる隠れ里',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_KUROKAWA ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_KUROKAWA ?? '#',
      },
      {
        name: '登別温泉',
        prefecture: '北海道',
        tier: 4,
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
        name: '熱海温泉',
        prefecture: '静岡県',
        tier: 1,
        description: '新幹線で都内から約40分。賑やかな温泉街で気軽にリセット',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_ATAMI ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_ATAMI ?? '#',
      },
      {
        name: '鬼怒川温泉',
        prefecture: '栃木県',
        tier: 1,
        description: '渓谷沿いの温泉街。アクセスが良く週末旅にぴったり',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_KINUGAWA ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_KINUGAWA ?? '#',
      },
      {
        name: '下呂温泉',
        prefecture: '岐阜県',
        tier: 2,
        description: '日本三名泉。肌あたりの柔らかい重曹泉で体をリフレッシュ',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_GERO ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_GERO ?? '#',
      },
      {
        name: '有馬温泉',
        prefecture: '兵庫県',
        tier: 3,
        description: '日本最古の温泉。金泉・銀泉の二種類の泉質でリセット',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_ARIMA ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_ARIMA ?? '#',
      },
      {
        name: '道後温泉',
        prefecture: '愛媛県',
        tier: 4,
        description: '日本書紀にも登場。歴史と現代が交差する活力の湯',
        affiliateUrl: process.env.NEXT_PUBLIC_AFFILIATE_DOGO ?? '#',
        articleUrl: process.env.NEXT_PUBLIC_ARTICLE_DOGO ?? '#',
      },
    ],
  },
}

export const VALID_TYPES: OnsenType[] = ['T', 'B', 'S', 'K']
