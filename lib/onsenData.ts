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

// 泉質はメディアDB準拠でタイプ分け（T=硫黄/酸性, B=美肌系, K=塩化物/温泉街, S=秘湯/絶景）
const aff = (k: string) => process.env[`NEXT_PUBLIC_AFFILIATE_${k}`] ?? '#'
const art = (k: string) => process.env[`NEXT_PUBLIC_ARTICLE_${k}`] ?? '#'
const spot = (
  name: string,
  prefecture: string,
  tier: TravelTier,
  key: string,
  description: string,
): OnsenSpot => ({ name, prefecture, tier, description, affiliateUrl: aff(key), articleUrl: art(key) })

export const ONSEN_DATA: Record<OnsenType, OnsenTypeData> = {
  T: {
    key: 'T',
    name: 'とろける湯タイプ',
    catchPhrase: '疲れた体を芯から溶かす湯へ',
    description:
      '体の疲れを深いところから抜きたいあなた。効能の強い湯にじっくり浸かり、ただただ何もしない時間こそが最高のご褒美。老舗旅館のおもてなしと豪勢な料理も堪能しましょう。',
    spots: [
      spot('草津温泉', '群馬県', 1, 'KUSATSU', '日本三名泉。強酸性の湯で疲れをごっそり抜く'),
      spot('那須温泉', '栃木県', 1, 'NASU', '鹿の湯の硫黄泉。都内から約2時間で本格的な湯治気分'),
      spot('万座温泉', '群馬県', 2, 'MANZA', '標高2000m超の乳白色硫黄泉。濃い湯で芯から癒される'),
      spot('蔵王温泉', '山形県', 2, 'ZAO', '強酸性の硫黄泉。濃い白濁の湯で体を芯から温める'),
      spot('高湯温泉', '福島県', 2, 'TAKAYU', '吾妻連峰の乳白色硫黄泉。源泉かけ流しの名湯'),
      spot('鳴子温泉郷', '宮城県', 3, 'NARUKO', '東北屈指の名湯。9種の泉質と白濁の硫黄泉が魅力'),
      spot('別府温泉', '大分県', 4, 'BEPPU', '日本一の湧出量。多彩な泉質でじっくり癒される'),
      spot('酸ヶ湯温泉', '青森県', 4, 'SUKAYU', '八甲田の一軒宿。ヒバ千人風呂の強酸性硫黄泉'),
    ],
  },
  B: {
    key: 'B',
    name: '美肌の湯タイプ',
    catchPhrase: '湯上がりの肌で、もう一度輝く',
    description:
      '温泉の美容効果にこだわりたいあなた。とろとろ・すべすべの美肌系泉質は、スキンケアとしても一級品。旅行後の肌の変化を楽しみながら、温泉地の街散策も満喫しましょう。',
    spots: [
      spot('伊香保温泉', '群馬県', 1, 'IKAHO', '黄金の湯と石段街。湯上がりしっとり、街散策も楽しい'),
      spot('四万温泉', '群馬県', 1, 'SHIMA', 'すべすべの美肌湯。物語の里でのんびり過ごす'),
      spot('磐梯熱海温泉', '福島県', 2, 'BANDAIATAMI', '美肌の重曹泉。郡山の奥座敷と称される上質な湯'),
      spot('土湯温泉', '福島県', 2, 'TSUCHIYU', '荒川渓谷沿いの湯。やわらかな泉質で肌しっとり'),
      spot('山中温泉', '石川県', 3, 'YAMANAKA', '鶴仙渓沿いの美肌名湯。芭蕉も讃えた北陸の名湯'),
      spot('玉造温泉', '島根県', 4, 'TAMATSUKURI', '日本最古の美肌の湯。ぬるっとしたアルカリ性単純泉'),
      spot('嬉野温泉', '佐賀県', 4, 'URESHINO', 'とろとろ感日本一と称される美肌湯。温泉豆腐も名物'),
      spot('湯布院温泉', '大分県', 4, 'YUFUIN', '由布岳の麓の上質な湯と洗練された街並み'),
    ],
  },
  S: {
    key: 'S',
    name: '秘湯探訪タイプ',
    catchPhrase: '誰も知らない絶景の湯を探して',
    description:
      '温泉の先にある非日常を求めるあなた。絶景の露天風呂、山奥の秘湯、誰も知らない一軒宿。旅そのものが目的になる、温泉旅の醍醐味を知っています。',
    spots: [
      spot('塩原温泉郷', '栃木県', 1, 'SHIOBARA', '箒川の渓谷に11の湯が連なる温泉郷。秘湯気分の露天も'),
      spot('奥日光湯元温泉', '栃木県', 2, 'OKUNIKKO', '標高1500mの硫黄泉。都内から行ける山の秘湯'),
      spot('白骨温泉', '長野県', 2, 'SHIRAHONE', '乳白色の湯と「泡の湯」で知られる山あいの秘湯'),
      spot('乳頭温泉郷', '秋田県', 4, 'NYUTO', '7つの宿が点在する秘湯の聖地。乳白色の湯が幻想的'),
      spot('黒川温泉', '熊本県', 4, 'KUROKAWA', '山間の露天風呂めぐりが体験できる隠れ里'),
      spot('登別温泉', '北海道', 4, 'NOBORIBETSU', '地獄谷の迫力と多彩な泉質。大自然の中の非日常'),
    ],
  },
  K: {
    key: 'K',
    name: '活湯タイプ',
    catchPhrase: '温泉で体をリセット、明日へ走る',
    description:
      '温泉を体のメンテナンスとして使いこなすあなた。朝風呂で体を整え、活力を充填して帰る。歴史ある名湯の効能をフル活用する、実利派の温泉スタイルです。',
    spots: [
      spot('熱海温泉', '静岡県', 1, 'ATAMI', '新幹線で都内から約40分。賑やかな温泉街で気軽にリセット'),
      spot('鬼怒川温泉', '栃木県', 1, 'KINUGAWA', '渓谷沿いの温泉街。アクセスが良く週末旅にぴったり'),
      spot('下呂温泉', '岐阜県', 2, 'GERO', '日本三名泉。肌あたりの柔らかい重曹泉で体をリフレッシュ'),
      spot('銀山温泉', '山形県', 2, 'GINZAN', '大正ロマンのガス灯と木造旅館。レトロな温泉街歩き'),
      spot('越後湯沢温泉', '新潟県', 2, 'ECHIGOYUZAWA', '「雪国」の舞台。新幹線で気軽に行ける温泉街'),
      spot('有馬温泉', '兵庫県', 3, 'ARIMA', '日本最古の温泉。金泉・銀泉の二種類の泉質でリセット'),
      spot('和倉温泉', '石川県', 3, 'WAKURA', '能登の海辺に湧く塩化物泉。日本有数の名旅館が並ぶ'),
      spot('指宿温泉', '鹿児島県', 4, 'IBUSUKI', '砂むし温泉体験。体の芯まで温まる独自の文化'),
      spot('道後温泉', '愛媛県', 4, 'DOGO', '日本書紀にも登場。歴史と現代が交差する活力の湯'),
    ],
  },
}

export const VALID_TYPES: OnsenType[] = ['T', 'B', 'S', 'K']
