<script setup lang="ts">
useHead({ title: '궁합 결과 · 냥상가' })

const router = useRouter()
const { photoA, photoB, reset } = usePhotos()

type Tier = 'low' | 'mid' | 'high'

const RESULT_DATA: Record<Tier, {
  score: number
  stars: number
  summary: string
  oneLine: string
  free: { emoji: string; title: string; body: string; rating?: number }[]
}> = {
  low: {
    score: 52,
    stars: 2,
    summary: '노력이 필요한 궁합이에요 🌱',
    oneLine: '성격 상성은 주의, 대화로 풀어갈 여지 있음',
    free: [
      { emoji: '👤', title: '얼굴형 상성', body: '두 분의 얼굴형은 살짝 엇갈리는 면이 있어요. 서로의 리듬이 다르지만, 그만큼 배우는 점도 많은 조합이에요.' },
      { emoji: '💰', title: '재물 시너지', body: '각자의 페이스를 존중할 때 재물운이 따라와요. 공동 지출은 초반엔 천천히, 신뢰가 쌓이고 나서 합쳐도 늦지 않아요.', rating: 3 },
      { emoji: '✨', title: '전반적 기운', body: '서로 다른 방향을 보는 기운이지만, 그 차이가 결혼 후 성장의 원동력이 될 수 있어요.' }
    ]
  },
  mid: {
    score: 73,
    stars: 4,
    summary: '잘 어울리는 궁합이에요 💗',
    oneLine: '재물·가정운은 좋음, 고부관계는 약간 주의',
    free: [
      { emoji: '👤', title: '얼굴형 상성', body: '두 분은 서로 부족한 부분을 자연스럽게 채워주는 얼굴형 조합이에요. 안정과 활력이 공존하는 관계예요.' },
      { emoji: '💰', title: '재물 시너지', body: '결혼 후 3년 이내에 의미 있는 자산 형성이 기대되는 조합이에요. 부동산보다는 공동 투자에 강한 편.', rating: 4 },
      { emoji: '✨', title: '전반적 기운', body: '햇살 같은 A님의 기운과 달빛 같은 B님의 기운이 서로를 돋보이게 해요.' }
    ]
  },
  high: {
    score: 92,
    stars: 5,
    summary: '천생연분이에요 💕',
    oneLine: '재물운은 최고, 성격 상성은 조금 주의',
    free: [
      { emoji: '👤', title: '얼굴형 상성', body: '두 분은 둥근 형과 달걀형이 만나 부드럽고 안정적인 가정 기운을 만들어요. 서로의 모난 부분을 자연스럽게 덮어줄 수 있는 최상의 조합이에요.' },
      { emoji: '💰', title: '재물 시너지', body: '재물운이 서로 상승 작용을 일으키는 조합이에요. 결혼 후 맞벌이를 유지한다면 5년 내 의미 있는 자산 형성이 기대돼요.', rating: 5 },
      { emoji: '✨', title: '전반적 기운', body: '햇살 같은 A님의 기운과 달빛 같은 B님의 기운이 하루를 온전히 채워줘요. 만난 것 자체가 복이에요.' }
    ]
  }
}

const LOCKED_SECTIONS = [
  { emoji: '💬', title: '성격 상성', teaser: '두 분의 성격은 활발함과 차분함의 조화로, 서로 다른 리듬이 관계에 활력을 더해줘요...' },
  { emoji: '👨‍👩‍👧', title: '고부관계 예측', teaser: '시어머님과의 관계는 초반 약간의 거리감이 있을 수 있지만...' },
  { emoji: '👶', title: '자녀운', teaser: '자녀는 두 분의 장점을 골고루 물려받을 가능성이 높아요...' },
  { emoji: '💪', title: '건강 궁합', teaser: '두 분 모두 꾸준한 생활 리듬을 유지하는 편이라...' },
  { emoji: '📆', title: '결혼 후 3년 예측', teaser: '1년차는 서로 적응하는 시기, 2년차는 안정기, 3년차에는...' },
  { emoji: '⚠️', title: '주의할 점 3가지', teaser: '가치관이 달라 잦은 대화가 필요해요...' },
  { emoji: '💚', title: '좋은 점 3가지', teaser: '서로의 부족한 부분을 자연스럽게 채워주는 조합이에요...' }
]

const scoreTier = ref<Tier>('high')
const mascotPose = ref<'default' | 'thinking' | 'happy'>('happy')
const data = computed(() => RESULT_DATA[scoreTier.value])
const stars = computed(() => '★'.repeat(data.value.stars) + '☆'.repeat(5 - data.value.stars))
const unlocked = ref(false)
const score = ref(0)

let scoreInterval: ReturnType<typeof setInterval> | null = null

function startCountUp() {
  score.value = 0
  const target = data.value.score
  let i = 0
  if (scoreInterval) clearInterval(scoreInterval)
  scoreInterval = setInterval(() => {
    i += 3
    if (i >= target) {
      score.value = target
      if (scoreInterval) {
        clearInterval(scoreInterval)
        scoreInterval = null
      }
    } else {
      score.value = i
    }
  }, 28)
}

onMounted(startCountUp)
watch(() => data.value.score, startCountUp)
onBeforeUnmount(() => {
  if (scoreInterval) clearInterval(scoreInterval)
})

function back() {
  router.push('/')
}

function retry() {
  reset()
  router.push('/upload')
}
</script>

<template>
  <div class="screen fade-in">
    <AppHeader title="궁합 결과" show-back @back="back" />

    <div class="hero-bg top-hero">
      <div class="photos-row" style="padding-top:8px">
        <div class="ph">
          <img v-if="photoA" :src="photoA">
          <FaceA v-else id="ra" />
        </div>
        <div class="heart">💕</div>
        <div class="ph">
          <img v-if="photoB" :src="photoB">
          <FaceB v-else id="rb" />
        </div>
      </div>
      <div class="score-wrap">
        <div class="stars">{{ stars }}</div>
        <div class="score-number">{{ score }}<span class="score-out">/100</span></div>
        <div class="score-summary">{{ data.summary }}</div>
        <div class="score-one">{{ data.oneLine }}</div>
      </div>
    </div>

    <div class="body-wrap">
      <AdPlaceholder />

      <div class="eyebrow eyebrow-brand">무료 공개</div>
      <div
        v-for="(s, i) in data.free"
        :key="s.title"
        class="rsec stagger-in"
        :style="{ animationDelay: `${i * 80}ms` }"
      >
        <div class="head">
          <div class="title">
            <span class="emoji">{{ s.emoji }}</span>{{ s.title }}
            <span v-if="s.rating" class="rating">{{ '★'.repeat(s.rating) }}</span>
          </div>
          <div class="pill free">FREE</div>
        </div>
        <div class="body">{{ s.body }}</div>
      </div>

      <div class="ad-spacer"><AdPlaceholder label="네이티브 광고" /></div>

      <template v-if="!unlocked">
        <div class="eyebrow eyebrow-lavender">자물쇠 · 7개</div>
        <div
          v-for="s in LOCKED_SECTIONS.slice(0, 3)"
          :key="s.title"
          class="rsec locked-wrap"
        >
          <div class="blurred">
            <div class="head">
              <div class="title"><span class="emoji">{{ s.emoji }}</span>{{ s.title }}</div>
            </div>
            <div class="body">{{ s.teaser }}</div>
          </div>
          <div class="mask">
            <div class="mi">🔒</div>
            <div class="mt">해금하기</div>
          </div>
        </div>
        <div class="more-note">+ 4개 섹션이 더 있어요</div>

        <div class="cta-wrap">
          <button class="unlock-cta" @click="unlocked = true">🎁 광고 보고 전체 결과 확인하기</button>
          <div class="cta-sub">15초 광고 · 7개 섹션 모두 해금</div>
        </div>
      </template>

      <template v-else>
        <div class="eyebrow eyebrow-lavender">✨ 해금됨</div>
        <template v-for="(s, i) in LOCKED_SECTIONS" :key="s.title">
          <div class="rsec stagger-in" :style="{ animationDelay: `${i * 50}ms` }">
            <div class="head">
              <div class="title"><span class="emoji">{{ s.emoji }}</span>{{ s.title }}</div>
              <div class="pill locked">UNLOCKED</div>
            </div>
            <div class="body">{{ s.teaser }} 두 분은 서로의 다름을 이해하며 서서히 발맞춰가는 관계예요. 대화의 리듬만 맞춘다면 장기적으로 깊은 신뢰를 쌓을 수 있어요.</div>
          </div>
          <div v-if="i === 3" class="ad-spacer"><AdPlaceholder /></div>
        </template>
      </template>

      <div class="share-wrap">
        <div class="eyebrow eyebrow-brand">공유</div>
        <div class="share-row">
          <button class="share-btn"><div class="g">💾</div><div class="t">카드 저장하기</div></button>
          <button class="share-btn"><div class="g">💬</div><div class="t">카카오톡 공유</div></button>
        </div>
        <button class="secondary-btn retry-btn" @click="retry">다시 분석하기</button>
      </div>

      <div class="aff-wrap">
        <div class="eyebrow eyebrow-brand">두 분께 추천해요</div>
        <div class="aff-card">
          <div class="ic">🎁</div>
          <div class="aff-text">
            <div class="title">어울리는 결혼정보회사 <span class="badge-ad">광고</span></div>
            <div class="sub">듀오 · 가연 · 매칭 특가</div>
          </div>
          <div class="arrow">→</div>
        </div>
        <div class="aff-card">
          <div class="ic">💒</div>
          <div class="aff-text">
            <div class="title">어울리는 웨딩홀 <span class="badge-ad">광고</span></div>
            <div class="sub">서울·경기 예약 가능</div>
          </div>
          <div class="arrow">→</div>
        </div>
        <div class="aff-card">
          <div class="ic">💍</div>
          <div class="aff-text">
            <div class="title">예물은 여기서 <span class="badge-ad">광고</span></div>
            <div class="sub">커플링 최대 30% 할인</div>
          </div>
          <div class="arrow">→</div>
        </div>
      </div>

      <div class="signoff">
        <img src="/assets/main_logo_char.webp" alt="냥상가" width="56" height="56" class="signoff-img" />
        <div class="signoff-text">
          두 분, 오늘 궁합 봐줘서 고맙다냥 🐾<br>
          <span class="signoff-sub">이 결과는 재미로만 봐주고, 진짜 선택은 두 분 마음이 제일 정확하냥.</span>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
.top-hero { padding: 0 0 24px; }
.body-wrap { padding: 20px 20px 0; }

.eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.eyebrow-brand { color: var(--brand-600); }
.eyebrow-lavender { color: var(--lavender-500); }

.rating { color: #F59E0B; font-size: 11px; margin-left: 4px; }

.ad-spacer { margin: 12px 0; }
.cta-wrap { margin-top: 8px; }
.cta-sub {
  text-align: center;
  font-size: 10px;
  color: var(--gray-500);
  margin-top: 8px;
}
.more-note {
  font-size: 11px;
  color: var(--gray-500);
  text-align: center;
  margin: 10px 0 14px;
}

.share-wrap { margin-top: 24px; }
.retry-btn { margin-top: 10px; }

.aff-wrap { margin-top: 24px; }
.aff-text { flex: 1; min-width: 0; }
.arrow { color: var(--gray-400); }

.signoff {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: var(--brand-50);
  border-radius: 18px;
  padding: 14px;
}
.signoff-text {
  flex: 1;
  font-size: 12px;
  color: var(--gray-700);
  line-height: 1.6;
}
.signoff-img { flex-shrink: 0; object-fit: contain; }
.signoff-sub { color: var(--gray-500); font-size: 11px; }
</style>
