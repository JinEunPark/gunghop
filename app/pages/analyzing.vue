<script setup lang="ts">
useHead({ title: '분석 중 · 냥상가' })

const router = useRouter()
const { photoA, photoB } = usePhotos()

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

let interval: ReturnType<typeof setInterval> | null = null
let timeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  const stored = getStoredPhotos()
  if (!stored.photoA || !stored.photoB) {
    router.replace('/upload')
    return
  }

  interval = setInterval(() => {
    i.value += 1
  }, 1300)
  timeout = setTimeout(() => {
    router.push('/result')
  }, LOADING_STEPS.length * 1300 - 100)
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
  if (timeout) clearTimeout(timeout)
})
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
    </div>
    <div class="ad-wrap">
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
.mascot-stage {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spinner-big { position: absolute; width: 120px; height: 120px; }
.wiggle { animation: nyWiggle 1.8s ease-in-out infinite; }
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
</style>
