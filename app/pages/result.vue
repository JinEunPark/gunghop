<script setup lang="ts">
import type { AnalysisResult } from '~~/shared/types/analysis'

useHead({ title: '궁합 결과 · 냥상가' })

const router = useRouter()
const { photoA, photoB, reset } = usePhotos()

const storedResult = ref<AnalysisResult | null>(null)

onMounted(() => {
  storedResult.value = getStoredAnalysisResult()
  if (storedResult.value) startCountUp()
})

const hasResult = computed(() => storedResult.value !== null)

const FREE_META = [
  { emoji: '👤', title: '얼굴형 상성' },
  { emoji: '💰', title: '재물 시너지' },
  { emoji: '✨', title: '전반적 기운' }
] as const

const LOCKED_META = [
  { emoji: '💬', title: '성격 상성' },
  { emoji: '👨‍👩‍👧', title: '고부관계 예측' },
  { emoji: '👶', title: '자녀운' },
  { emoji: '💪', title: '건강 궁합' },
  { emoji: '📆', title: '결혼 후 3년 예측' },
  { emoji: '⚠️', title: '주의할 점 3가지' },
  { emoji: '💚', title: '좋은 점 3가지' }
] as const

function bullets(arr: string[]): string {
  return arr.map((x) => `• ${x}`).join('\n')
}

const data = computed(() => {
  const r = storedResult.value
  const scoreVal = r?.overall_score ?? 0
  const animal = getAnimalByScore(scoreVal)
  return {
    score: scoreVal,
    stars: Math.max(1, Math.min(5, Math.ceil(scoreVal / 20))),
    summary: animal.summary,
    oneLine: animal.oneLine,
    free: r
      ? [
          { emoji: FREE_META[0].emoji, title: FREE_META[0].title, body: r.face_shape_compatibility },
          {
            emoji: FREE_META[1].emoji,
            title: FREE_META[1].title,
            body: r.wealth_synergy.description,
            rating: r.wealth_synergy.rating
          },
          { emoji: FREE_META[2].emoji, title: FREE_META[2].title, body: r.overall_vibe }
        ]
      : []
  }
})

const lockedSections = computed(() => {
  const r = storedResult.value
  if (!r) return []
  return [
    { ...LOCKED_META[0], body: r.personality_compatibility },
    { ...LOCKED_META[1], body: r.in_law_relationship },
    { ...LOCKED_META[2], body: r.children_fortune },
    { ...LOCKED_META[3], body: r.health_compatibility },
    { ...LOCKED_META[4], body: r.three_year_prediction },
    { ...LOCKED_META[5], body: bullets(r.warnings) },
    { ...LOCKED_META[6], body: bullets(r.positives) }
  ]
})

const unlocked = ref(false)
const score = ref(0)

const config = useRuntimeConfig()
const siteUrl = computed(() => {
  const envUrl = (config.public.siteUrl as string) || ''
  if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
    return import.meta.client ? window.location.origin : 'nyangsang.love'
  }
  return envUrl
})
const shareCardRef = ref<HTMLElement | null>(null)

const shareDate = computed(() => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
})

const shareSections = computed(() => [
  ...data.value.free.map((f) => ({
    emoji: f.emoji,
    title: f.title,
    body: f.body,
    rating: 'rating' in f ? (f.rating as number | undefined) : undefined
  })),
  ...lockedSections.value.map((l) => ({
    emoji: l.emoji,
    title: l.title,
    body: l.body,
    rating: undefined as number | undefined
  }))
])

const shareAnimal = computed(() => getAnimalByScore(data.value.score))
const { sharing, shareCardImage } = useKakaoShare()
const { downloading, downloadCard } = useCardDownload()

function getInnerCardEl(): HTMLElement | null {
  const wrapper = shareCardRef.value
  if (!wrapper) return null
  return wrapper.querySelector('.share-card') as HTMLElement | null
}

async function onKakaoShare() {
  const cardEl = getInnerCardEl()
  if (!cardEl || sharing.value) return
  try {
    await shareCardImage({
      cardEl,
      score: data.value.score,
      summary: data.value.summary
    })
  } catch {
    // error.value는 useKakaoShare 안에서 세팅됨. 폴백까지 실패했을 때만 도달.
  }
}

async function onDownload() {
  const cardEl = getInnerCardEl()
  if (!cardEl || downloading.value) return
  try {
    await downloadCard(cardEl, '냥상가_카드.png')
  } catch {
    // error.value는 useCardDownload 안에서 세팅됨
  }
}


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

    <div v-if="!hasResult" class="no-result">
      <div class="nr-emoji">🐾</div>
      <div class="nr-title">분석 결과가 없어요</div>
      <div class="nr-desc">사진을 먼저 올려주세냥</div>
      <button class="primary-btn nr-btn" @click="retry">사진 올리러 가기</button>
    </div>

    <template v-else>

    <div class="hero-bg top-hero">
      <div class="photos-row">
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

      <div class="result-animal">
        <div class="ra-wrap">
          <div class="ra-glow" />
          <div class="ra-halo" />
          <img :src="shareAnimal.src" alt="궁합 동물" class="ra-img" />
        </div>
        <div class="ra-name">
          <span class="ra-emoji">{{ shareAnimal.emoji }}</span>
          <span class="ra-label">{{ shareAnimal.name }}</span>
        </div>
        <span class="ra-badge" :data-rarity="shareAnimal.rarity">
          <span v-if="shareAnimal.rarity === 'LEGENDARY'" class="ra-spark">✨</span>
          {{ RARITY_LABEL_KR[shareAnimal.rarity] }}
          <span v-if="shareAnimal.rarity === 'LEGENDARY'" class="ra-spark">✨</span>
        </span>
        <div class="ra-caption">“{{ shareAnimal.caption }}”</div>
      </div>

      <div class="score-wrap">
        <div class="score-number">{{ score }}<span class="score-out">/100</span></div>
        <div class="score-summary">{{ data.summary }}</div>
        <div class="score-one">{{ data.oneLine }}</div>
      </div>
    </div>

    <div class="body-wrap">
      <AdUnit slot="" label="배너 광고" />

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

      <div class="ad-spacer"><AdUnit slot="" format="fluid" label="네이티브 광고" /></div>

      <template v-if="!unlocked">
        <div class="eyebrow eyebrow-lavender">자물쇠 · 7개</div>
        <div
          v-for="s in lockedSections.slice(0, 3)"
          :key="s.title"
          class="rsec locked-wrap"
        >
          <div class="blurred">
            <div class="head">
              <div class="title"><span class="emoji">{{ s.emoji }}</span>{{ s.title }}</div>
            </div>
            <div class="body">{{ s.body }}</div>
          </div>
          <div class="mask">
            <div class="mi">🔒</div>
            <div class="mt">해금하기</div>
          </div>
        </div>
        <div class="more-note">+ 4개 섹션이 더 있어요</div>

        <div class="cta-wrap">
          <button class="unlock-cta" @click="unlocked = true">🔓 전체 결과 확인하기</button>
          <div class="cta-sub">모든 섹션 한 번에 열기</div>
        </div>
      </template>

      <template v-else>
        <div class="eyebrow eyebrow-lavender">✨ 해금됨</div>
        <template v-for="(s, i) in lockedSections" :key="s.title">
          <div class="rsec stagger-in" :style="{ animationDelay: `${i * 50}ms` }">
            <div class="head">
              <div class="title"><span class="emoji">{{ s.emoji }}</span>{{ s.title }}</div>
              <div class="pill locked">UNLOCKED</div>
            </div>
            <div class="body" style="white-space: pre-line">{{ s.body }}</div>
          </div>
          <div v-if="i === 3" class="ad-spacer"><AdUnit slot="" label="배너 광고" /></div>
        </template>
      </template>

      <div class="share-wrap">
        <div class="eyebrow eyebrow-brand">공유</div>
        <div class="share-row">
          <button class="share-btn" :disabled="downloading" @click="onDownload">
            <div class="g">{{ downloading ? '⏳' : '💾' }}</div>
            <div class="t">{{ downloading ? '저장 중...' : '카드 저장하기' }}</div>
          </button>
          <button class="share-btn kakao-btn" :disabled="sharing" @click="onKakaoShare">
            <div class="g">
              <span v-if="sharing">⏳</span>
              <svg v-else class="kakao-ic" viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill="#3A1D1D" d="M12 3C6.48 3 2 6.58 2 11c0 2.74 1.77 5.15 4.44 6.55-.12 1.08-.42 3.44-.48 3.87-.07.54.3.82.76.6.36-.17 4.13-2.77 4.9-3.28.46.05.92.08 1.38.08 5.52 0 10-3.58 10-8S17.52 3 12 3z"/>
              </svg>
            </div>
            <div class="t">{{ sharing ? '준비 중...' : '카카오톡 공유' }}</div>
          </button>
        </div>
        <button class="secondary-btn retry-btn" @click="retry">다시 분석하기</button>
      </div>

      <div class="aff-wrap">
        <div class="eyebrow eyebrow-brand">두 분께 추천해요</div>
        <a class="aff-card" href="#" target="_blank" rel="sponsored nofollow noopener">
          <div class="ic">💍</div>
          <div class="aff-text">
            <div class="title">커플링 · 예물 반지 <span class="badge-ad">광고</span></div>
            <div class="sub">쿠팡 인기 커플링 모아보기</div>
          </div>
          <div class="arrow">→</div>
        </a>
        <a class="aff-card" href="#" target="_blank" rel="sponsored nofollow noopener">
          <div class="ic">🎁</div>
          <div class="aff-text">
            <div class="title">웨딩 · 결혼 선물 <span class="badge-ad">광고</span></div>
            <div class="sub">양가 부모님 선물 추천</div>
          </div>
          <div class="arrow">→</div>
        </a>
        <a class="aff-card" href="#" target="_blank" rel="sponsored nofollow noopener">
          <div class="ic">📖</div>
          <div class="aff-text">
            <div class="title">궁합 · 사주 책 <span class="badge-ad">광고</span></div>
            <div class="sub">더 깊이 알아보기</div>
          </div>
          <div class="arrow">→</div>
        </a>
        <div class="aff-disclosure">
          이 페이지는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
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

    </template>

    <AppFooter />

    <div v-if="hasResult" ref="shareCardRef" class="share-card-slot" aria-hidden="true">
      <ShareCard
        :score="data.score"
        :summary="data.summary"
        :one-line="data.oneLine"
        :site-url="siteUrl"
        :date="shareDate"
        :animal="shareAnimal"
        :sections="shareSections"
      />
    </div>
  </div>
</template>

<style scoped>
.top-hero {
  padding: 8px 0 28px;
  text-align: center;
}
.body-wrap { padding: 20px 20px 0; }

.top-hero :deep(.photos-row) {
  gap: 20px;
  padding: 4px 20px 4px;
  justify-content: center;
}
.top-hero :deep(.photos-row .ph) {
  width: 148px;
  height: 148px;
  border-radius: 26px;
  border-width: 3px;
}
.top-hero :deep(.photos-row .heart) {
  font-size: 40px;
}
.top-hero :deep(.score-wrap) {
  padding: 16px 20px 4px;
  align-items: center;
  text-align: center;
}

/* === Animal reveal (main result) === */
.result-animal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 20px 4px;
}
.ra-wrap {
  position: relative;
  width: 240px;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ra-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(236, 72, 153, 0.28) 0%,
    rgba(236, 72, 153, 0.12) 45%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(10px);
}
.ra-halo {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 45%, #fff 0%, rgba(255,255,255,0.4) 45%, transparent 70%);
}
.ra-img {
  position: relative;
  width: 220px;
  height: 220px;
  object-fit: contain;
  filter: drop-shadow(0 12px 22px rgba(139, 92, 246, 0.28));
}
.ra-name {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}
.ra-emoji { font-size: 26px; line-height: 1; }
.ra-label {
  font-size: 26px;
  font-weight: 900;
  color: var(--gray-900);
  letter-spacing: -0.02em;
}

.ra-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.14em;
  padding: 6px 14px;
  border-radius: 9999px;
  color: #fff;
  background: #9CA3AF;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
.ra-badge[data-rarity="COMMON"]   { background: #9CA3AF; }
.ra-badge[data-rarity="UNCOMMON"] { background: #10B981; }
.ra-badge[data-rarity="RARE"]     { background: #3B82F6; }
.ra-badge[data-rarity="EPIC"]     { background: #8B5CF6; }
.ra-badge[data-rarity="LEGENDARY"] {
  font-size: 14px;
  padding: 8px 18px;
  letter-spacing: 0.18em;
  background: linear-gradient(
    125deg,
    #FBBF24 0%, #F59E0B 18%, #EC4899 38%,
    #8B5CF6 55%, #3B82F6 72%, #F59E0B 92%, #FBBF24 100%
  );
  color: #fff;
  text-shadow: 0 1px 2px rgba(139, 92, 246, 0.35);
  box-shadow:
    0 0 0 3px rgba(255, 255, 255, 0.8),
    0 0 0 5px rgba(251, 191, 36, 0.5),
    0 8px 18px rgba(236, 72, 153, 0.4);
}
.ra-spark { font-size: 14px; filter: drop-shadow(0 0 6px rgba(255, 236, 130, 0.9)); }

.ra-caption {
  background: #fff;
  border-radius: 16px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 700;
  color: var(--gray-900);
  line-height: 1.5;
  letter-spacing: -0.01em;
  text-align: center;
  max-width: 360px;
  box-shadow: 0 8px 18px rgba(236, 72, 153, 0.14);
  margin-top: 4px;
}

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
a.aff-card { text-decoration: none; color: inherit; }
.aff-disclosure {
  margin-top: 12px;
  font-size: 10px;
  color: var(--gray-400);
  line-height: 1.5;
  padding: 0 4px;
}

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

.share-card-slot {
  position: fixed;
  top: 0;
  left: 0;
  width: 720px;
  height: auto;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
}

.share-btn[disabled] {
  opacity: 0.6;
  cursor: wait;
}

.share-btn.kakao-btn {
  background: #FEE500;
  border-color: #FEE500;
}
.share-btn.kakao-btn:hover:not([disabled]) {
  background: #FDDD00;
}
.share-btn.kakao-btn .t {
  color: #3A1D1D;
  font-weight: 800;
}
.share-btn.kakao-btn .kakao-ic {
  display: block;
}

.no-result {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 32px;
  text-align: center;
}
.nr-emoji { font-size: 54px; line-height: 1; }
.nr-title {
  font-size: 20px;
  font-weight: 800;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  margin-top: 4px;
}
.nr-desc {
  font-size: 13px;
  color: var(--gray-500);
  margin-top: 2px;
}
.nr-btn {
  margin-top: 18px;
  max-width: 280px;
  width: 100%;
}
</style>
