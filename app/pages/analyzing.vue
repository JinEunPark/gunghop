<script setup lang="ts">
import type { AnalyzeError } from '~/composables/useAnalyze'
import type { AnalyzeErrorCode } from '~~/shared/types/analysis'

useHead({ title: '분석 중 · 냥상가' })

const FAILURE_META: Record<AnalyzeErrorCode, { emoji: string; title: string }> = {
  NO_FACE: { emoji: '😿', title: '얼굴을 못 찾았다냥' },
  RATE_LIMIT: { emoji: '🙏', title: '오늘은 한도 끝났어요' },
  AI_ERROR: { emoji: '⚠️', title: '분석이 실패했어요' },
  BAD_REQUEST: { emoji: '⚠️', title: '요청이 올바르지 않아요' }
}

const router = useRouter()
const { photoA, photoB } = usePhotos()
const { analyze } = useAnalyze()

const LOADING_STEPS = [
  { t: '얼굴형을 살펴보는 중이다냥...', e: '🔍' },
  { t: '눈·코·입을 하나씩 뜯어보고 있다냥...', e: '👀' },
  { t: '두 분의 기운을 맞춰보고 있냥...', e: '✨' },
  { t: '궁합 지표를 계산 중이에요...', e: '💕' },
  { t: '결혼 후 3년을 내다보는 중이다냥...', e: '📆' },
  { t: '수염을 쓰다듬으며 해석 중...', e: '🐾' },
  { t: '결과를 예쁘게 정리하고 있냥...', e: '🎀' }
]

const i = ref(0)
const cur = computed(() => Math.min(i.value, LOADING_STEPS.length - 1))
const curStep = computed(() => LOADING_STEPS[cur.value]!)
const progress = computed(() => ((cur.value + 1) / LOADING_STEPS.length) * 100)

const failure = ref<AnalyzeError | null>(null)
let interval: ReturnType<typeof setInterval> | null = null

function stopTicker() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

function goBack() {
  router.replace('/upload')
}

onMounted(async () => {
  const stored = getStoredPhotos()
  if (!stored.photoA || !stored.photoB) {
    router.replace('/upload')
    return
  }

  interval = setInterval(() => {
    i.value += 1
  }, 1300)

  try {
    const result = await analyze(stored.photoA, stored.photoB)
    saveAnalysisResult(result)
    stopTicker()
    router.replace('/result')
  } catch (e) {
    stopTicker()
    failure.value = e as AnalyzeError
  }
})

onBeforeUnmount(stopTicker)
</script>

<template>
  <div class="screen hero-bg fade-in" style="padding:0">
    <AppHeader translucent />
    <div class="center">
      <div class="photos-row" style="margin-bottom:8px">
        <div class="ph">
          <img v-if="photoA" :src="photoA">
          <FaceA v-else id="aa" />
        </div>
        <div class="heart">💕</div>
        <div class="ph">
          <img v-if="photoB" :src="photoB">
          <FaceB v-else id="ab" />
        </div>
      </div>

      <template v-if="!failure">
        <img class="cw-nyang" src="/assets/anal.webp" alt="냥선생" draggable="false">

        <div :key="cur" class="fade-in step-line">
          <span style="margin-right:4px">{{ curStep.e }}</span>{{ curStep.t }}
        </div>

        <div class="bar">
          <div class="bar-fill" :style="{ width: `${progress}%` }" />
        </div>
        <div class="bar-label">{{ cur + 1 }} / {{ LOADING_STEPS.length }} 단계</div>

        <div class="trivia">
          <strong>관상 상식</strong> · 눈썹 사이 인당(印堂)이 맑으면 판단력이 뛰어나다고 해요.
        </div>
      </template>

      <template v-else>
        <div class="fail-box">
          <div class="fail-emoji">{{ FAILURE_META[failure.code].emoji }}</div>
          <div class="fail-title">{{ FAILURE_META[failure.code].title }}</div>
          <div class="fail-desc">{{ failure.message }}</div>
          <button class="primary-btn fail-btn" @click="goBack">다시 업로드하기</button>
        </div>
      </template>
    </div>
    <div v-if="!failure" class="ad-wrap">
      <AdPlaceholder label="전면 광고 · AdSense" />
    </div>
  </div>
</template>

<style scoped>
.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
  padding: 0 20px;
}
.step-line {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-900);
  max-width: 280px;
  letter-spacing: -0.01em;
}
.bar {
  width: 220px;
  height: 6px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.6);
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: var(--gradient-unlock);
  transition: width 300ms var(--ease-out-quart);
}
.bar-label { font-size: 11px; color: var(--gray-500); font-weight: 600; }
.trivia {
  margin-top: 8px;
  background: #fff;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 11px;
  color: var(--gray-700);
  box-shadow: var(--shadow-soft);
  max-width: 300px;
  line-height: 1.55;
}
.trivia strong { color: var(--brand-600); }
.ad-wrap { padding: 12px 20px 20px; }

.fail-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: #fff;
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 12px 28px rgba(236, 72, 153, 0.12);
  max-width: 340px;
  margin-top: 8px;
}
.fail-emoji { font-size: 44px; line-height: 1; }
.fail-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--gray-900);
  letter-spacing: -0.02em;
}
.fail-desc {
  font-size: 13px;
  color: var(--gray-700);
  line-height: 1.6;
  margin-top: 2px;
}
.fail-btn { margin-top: 12px; width: 100%; }
</style>
