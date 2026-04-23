<script setup lang="ts">
usePageSeo({
  title: '사진 업로드 · 냥상가',
  description: '두 분의 얼굴 사진을 업로드하면 AI가 결혼 관상 궁합을 분석해드려요.'
})

const router = useRouter()
const { photoA, photoB } = usePhotos()
const c1 = ref(false)
const c2 = ref(false)

const ready = computed(() => !!photoA.value && !!photoB.value && c1.value && c2.value)

const ctaLabel = computed(() => {
  if (ready.value) return '분석 시작하기'
  if (photoA.value && photoB.value) return '동의하고 시작하기'
  return '사진 2장을 올려주세요'
})

function start() {
  if (!ready.value) return
  router.push('/analyzing')
}

function back() {
  router.push('/')
}
</script>

<template>
  <div class="screen fade-in" style="background:#fff">
    <AppHeader title="궁합 분석" show-back @back="back" />
    <StepProgress :step="1" label="사진 업로드" />

    <div class="content">
      <h1 class="title">두 분의 사진을<br>올려주세냥 🐱</h1>
      <div class="subtitle">
        정면·밝은 곳·안경 없는 사진이 가장 잘 보여요
      </div>

      <div class="slots">
        <PhotoSlot v-model="photoA" label="내 사진" />
        <PhotoSlot v-model="photoB" label="상대방 사진" />
      </div>

      <div class="tip">
        <img src="/assets/main_logo_char.webp" alt="냥상가" width="36" height="36" />
        <div class="tip-body">
          <div class="tip-title">잘 나오는 사진 TIP</div>
          정면 · 밝은 조명 · 무표정 or 살짝 미소<br>선글라스·마스크는 피해주세냥
        </div>
      </div>

      <div class="privacy-wrap">
        <PrivacyBox />
      </div>

      <div class="consents">
        <ConsentRow v-model="c1">
          <a>이용약관</a>과 <a>개인정보처리방침</a>에 동의해요
        </ConsentRow>
        <ConsentRow v-model="c2">
          본인 또는 동의받은 타인의 사진이에요
        </ConsentRow>
      </div>
    </div>

    <div class="floating-cta">
      <button class="primary-btn" :disabled="!ready" @click="start">
        {{ ctaLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.content { padding: 4px 20px 20px; flex: 1; }
.title { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
.subtitle {
  font-size: 12px;
  color: var(--gray-500);
  margin-top: 6px;
  line-height: 1.55;
}
.slots {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}
.tip {
  margin-top: 18px;
  background: var(--brand-50);
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.tip-body {
  flex: 1;
  font-size: 11px;
  color: var(--gray-700);
  line-height: 1.55;
}
.tip img { flex-shrink: 0; object-fit: contain; }
.tip-title { font-weight: 700; color: var(--brand-700); margin-bottom: 2px; }
.privacy-wrap { margin-top: 16px; }
.consents { margin-top: 14px; display: flex; flex-direction: column; gap: 6px; }
</style>
