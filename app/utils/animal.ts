export type AnimalRarity = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'

export type AnimalInfo = {
  file: string
  name: string
  emoji: string
  rarity: AnimalRarity
  caption: string
  summary: string
  oneLine: string
}

const ANIMALS: AnimalInfo[] = [
  {
    file: 'real_squarrer',
    name: '다람쥐',
    emoji: '🐿️',
    rarity: 'COMMON',
    caption: '다람쥐 부부처럼 소소한 행복을 차곡차곡 모으는 부부시군요!',
    summary: '소소한 행복이 열쇠예요 🌰',
    oneLine: '서로의 속도 맞추기가 숙제'
  },
  {
    file: 'squarrer',
    name: '햄스터',
    emoji: '🐹',
    rarity: 'COMMON',
    caption: '햄스터 부부 같은 쫀득쫀득 아기자기한 정을 나누는 부부시군요!',
    summary: '아기자기한 궁합이에요 🏡',
    oneLine: '아늑한 둥지 만들기에 시간 필요'
  },
  {
    file: 'panguin',
    name: '펭귄',
    emoji: '🐧',
    rarity: 'COMMON',
    caption: '펭귄 부부처럼 평생 한 사람만 바라보는 일편단심 부부시군요!',
    summary: '일편단심 궁합이에요 🧊',
    oneLine: '느리지만 진심이면 꼭 통해요'
  },
  {
    file: 'polarbare',
    name: '북극곰',
    emoji: '🐻‍❄️',
    rarity: 'UNCOMMON',
    caption: '북극곰 부부 같이 조용하지만 든든하게 지켜주는 부부시군요!',
    summary: '묵직한 신뢰가 자라요 ❄️',
    oneLine: '말보다 행동으로 이어지는 관계'
  },
  {
    file: 'elepant',
    name: '코끼리',
    emoji: '🐘',
    rarity: 'UNCOMMON',
    caption: '코끼리 부부처럼 의리가 깊고 서로를 오래 기억해주는 부부시군요!',
    summary: '의리로 단단해지는 궁합이에요 🌿',
    oneLine: '기억이 오래 쌓이는 편안한 사이'
  },
  {
    file: 'rabbit',
    name: '토끼',
    emoji: '🐰',
    rarity: 'RARE',
    caption: '토끼 부부 같은 폭신폭신 다정함이 뿜어져 나오는 부부시군요!',
    summary: '폭신한 다정함이 있어요 🌸',
    oneLine: '부드러움 속 작은 자극이 필요'
  },
  {
    file: 'cat',
    name: '고양이',
    emoji: '🐱',
    rarity: 'RARE',
    caption: '고양이 부부처럼 서로의 자유를 존중하는 우아한 부부시군요!',
    summary: '잘 어울리는 궁합이에요 💗',
    oneLine: '독립과 애정의 균형이 핵심'
  },
  {
    file: 'dog',
    name: '강아지',
    emoji: '🐶',
    rarity: 'EPIC',
    caption: '강아지 부부처럼 매일이 설레고 발랄한 부부시군요!',
    summary: '매일이 설레는 궁합이에요 🐾',
    oneLine: '신나는 하루가 쌓이는 관계'
  },
  {
    file: 'fox',
    name: '여우',
    emoji: '🦊',
    rarity: 'EPIC',
    caption: '여우 부부 같이 센스 넘치고 호흡이 척척 맞는 부부시군요!',
    summary: '눈치 척척 맞는 궁합이에요 🌟',
    oneLine: '센스와 배려가 시너지를 만드는 사이'
  },
  {
    file: 'lion',
    name: '사자',
    emoji: '🦁',
    rarity: 'LEGENDARY',
    caption: '사자 부부처럼 끈끈하고 당당한 부부시군요!',
    summary: '천생연분이에요 💕',
    oneLine: '재물·가정운 두루 좋은 환상의 조합'
  }
]

export const ANIMAL_COUNT = ANIMALS.length

export const RARITY_LABEL_KR: Record<AnimalRarity, string> = {
  COMMON: '커먼',
  UNCOMMON: '언커먼',
  RARE: '레어',
  EPIC: '에픽',
  LEGENDARY: '레전더리'
}

export function getAnimalByScore(score: number): AnimalInfo & { src: string } {
  const clamped = Math.max(0, Math.min(99, Math.floor(score)))
  const idx = Math.floor(clamped / 10)
  const info = ANIMALS[idx]
  return { ...info, src: `/assets/animal/${info.file}.png` }
}
