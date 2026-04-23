<script setup lang="ts">
usePageSeo({
  title: '냥상가 · 결혼 관상 AI 궁합',
  description: '얼굴 사진 2장으로 AI가 결혼 관상 궁합을 분석해드려요. 재물·가정·자녀·건강운까지 3분 만에 무료로 확인하세요.'
})

const steps = [
  { n: '01', t: '사진 2장 업로드', d: '내 사진과 상대방 사진을 올려주세요', g: '📷' },
  { n: '02', t: 'AI가 30초 분석', d: 'Gemini 2.5가 얼굴 관상을 분석해요', g: '🔍' },
  { n: '03', t: '결과 바로 확인', d: '궁합 점수 + 10가지 해석', g: '💕' }
]

const faqs = [
  { q: '사진은 어떻게 되나요?', a: '분석 직후 즉시 폐기돼요. 서버에 저장하지 않아요.' },
  { q: '정확도는 어느 정도인가요?', a: 'AI 기반 엔터테인먼트 콘텐츠예요. 재미로 봐주세요.' },
  { q: '정말 무료인가요?', a: '네, 광고를 보시면 모든 기능이 무료예요.' }
]

const sampleStats = [
  { l: '재물운', v: 92, c: '#EC4899' },
  { l: '성격 상성', v: 78, c: '#8B5CF6' },
  { l: '가정 기운', v: 85, c: '#F472B6' }
]
</script>

<template>
  <div class="screen fade-in">
    <div class="hero-bg hero">
      <div class="hero-top">
        <Logo :size="24" />
        <div class="version">v1.0 · 재미로 보는 궁합</div>
      </div>

      <div class="mascot-wrap">
        <div class="mascot-shadow" />
        <div class="sparkle s1">✨</div>
        <div class="sparkle s2">💕</div>
        <div class="sparkle s3">✨</div>
        <div class="sparkle s4">🌸</div>

        <div class="speech">
          안녕하냥 🐾<br>
          <span class="speech-sub">관상 30년 경력 냥상가야</span>
        </div>

        <div class="mascot-center">
          <img src="/assets/main_logo_char.webp" alt="냥상가" class="mascot-img" />
        </div>
      </div>

      <h1 class="hero-title">
        냥상가가 봐주는<br>결혼 관상 궁합
      </h1>
      <div class="hero-sub">
        상견례 전에, 결혼 결정 전에<br>두 분 사진을 보여주세냥 🐱
      </div>

      <NuxtLink to="/upload" class="primary-btn cta">
        지금 무료로 궁합 보기
      </NuxtLink>
      <div class="cta-note">
        30초면 결과 완성 · 로그인 불필요
      </div>
    </div>

    <div class="home-ad">
      <AdUnit slot="" label="배너 광고" />
    </div>

    <div class="section">
      <div class="eyebrow">작동 방식</div>
      <h2 class="h2">3단계로 끝나요</h2>
      <div class="step-list">
        <div
          v-for="(s, i) in steps"
          :key="s.n"
          class="step-card stagger-in"
          :style="{ animationDelay: `${i * 60}ms` }"
        >
          <div class="step-ico">{{ s.g }}</div>
          <div class="step-text">
            <div class="step-num">{{ s.n }}</div>
            <div class="step-title">{{ s.t }}</div>
            <div class="step-desc">{{ s.d }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="eyebrow">예시 결과</div>
      <h2 class="h2">이런 카드를 받게 돼요</h2>
      <div class="sample-card">
        <div class="sample-sparkle">✨</div>
        <div class="sample-petal">🌸</div>
        <div class="sample-head">
          <div class="sample-eyebrow">관상 · 결혼 궁합</div>
          <div class="sample-badge">냥상가 ♥</div>
        </div>

        <div class="sample-faces">
          <div class="sample-face face-girl"><img src="/assets/crop_face_a.webp" alt="냥선생 여" loading="lazy" /></div>
          <div class="sample-heart">💕</div>
          <div class="sample-face face-boy"><img src="/assets/crop_face_b.webp" alt="냥선생 남" loading="lazy" /></div>
        </div>
        <div class="sample-face-labels">
          <div class="face-label label-girl">내 사진</div>
          <div class="face-label-gap" />
          <div class="face-label label-boy">상대방 사진</div>
        </div>

        <div class="sample-score-block">
          <div class="sample-stars">★★★★★</div>
          <div class="sample-score">87<span class="sample-score-out">/100</span></div>
          <div class="sample-summary">천생연분이에요 💕</div>
        </div>

        <div class="sample-stats">
          <div v-for="s in sampleStats" :key="s.l" class="stat-row">
            <div class="stat-label">{{ s.l }}</div>
            <div class="stat-track">
              <div class="stat-fill" :style="{ width: `${s.v}%`, background: s.c }" />
            </div>
            <div class="stat-value">{{ s.v }}</div>
          </div>
        </div>

        <div class="sample-quote">
          <span class="sample-quote-label">냥상가 한마디</span> · 햇살 같은 기운과 달빛 같은 기운이 잘 어우러진 조합이다냥 🐾
        </div>

        <div class="sample-footer">
          <span>nyangsang.love</span>
          <span>2026.04.21</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="h2">자주 묻는 질문</h2>
      <div class="faq-list">
        <details v-for="(f, i) in faqs" :key="i" class="faq-item">
          <summary class="faq-summary">
            {{ f.q }}<span class="faq-chevron">⌄</span>
          </summary>
          <div class="faq-answer">{{ f.a }}</div>
        </details>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
.hero { padding: 12px 20px 32px; position: relative; }
.hero-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.version { font-size: 11px; color: var(--gray-500); font-weight: 600; }

.mascot-wrap {
  position: relative;
  height: 220px;
  margin-bottom: 4px;
}
.mascot-shadow {
  position: absolute;
  left: 50%;
  bottom: 8px;
  transform: translateX(-50%);
  width: 200px;
  height: 36px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(236, 72, 153, 0.25), transparent 70%);
}
.sparkle { position: absolute; animation: nyFloat 3s ease-in-out infinite; }
.s1 { top: 10px; left: 10%; font-size: 18px; animation-duration: 3.2s; }
.s2 { top: 36px; right: 12%; font-size: 14px; animation-duration: 2.6s; animation-delay: 0.4s; }
.s3 { top: 74px; left: 4%; font-size: 11px; animation-duration: 3.8s; animation-delay: 0.8s; }
.s4 { top: 110px; right: 4%; font-size: 13px; animation-duration: 3s; animation-delay: 1.2s; }

.speech {
  position: absolute;
  top: 0;
  right: 2%;
  background: #fff;
  border-radius: 16px 16px 16px 4px;
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 700;
  color: var(--gray-900);
  box-shadow: var(--shadow-soft-lg);
  max-width: 160px;
  line-height: 1.4;
  z-index: 2;
}
.speech-sub { font-weight: 500; color: var(--gray-700); font-size: 10px; }

.mascot-center {
  position: absolute;
  left: 50%;
  bottom: 0;
  animation: mascotBob 3.4s ease-in-out infinite;
}
.mascot-img {
  width: 170px;
  height: 170px;
  object-fit: contain;
}
@keyframes mascotBob {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, -8px); }
}

.hero-title {
  font-size: 28px;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--gray-900);
  text-align: center;
}
.hero-sub {
  font-size: 13px;
  color: var(--gray-700);
  margin-top: 10px;
  line-height: 1.6;
  text-align: center;
}
.cta { margin-top: 22px; display: flex; align-items: center; justify-content: center; text-decoration: none; }
.cta-note { font-size: 10px; color: var(--gray-500); text-align: center; margin-top: 8px; }

.home-ad { padding: 20px 20px 0; }
.section { padding: 28px 20px 0; }
.eyebrow {
  font-size: 10px;
  font-weight: 700;
  color: var(--brand-600);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.h2 { margin-top: 4px; font-size: 20px; }

.step-list { display: flex; flex-direction: column; gap: 10px; margin-top: 14px; }
.step-card {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: #fff;
  border: 1px solid var(--gray-100);
  border-radius: 14px;
  box-shadow: var(--shadow-soft);
}
.step-ico {
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  background: var(--brand-50);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}
.step-text { flex: 1; min-width: 0; }
.step-num { font-size: 10px; font-weight: 700; color: var(--brand-600); }
.step-title { font-size: 14px; font-weight: 700; color: var(--gray-900); }
.step-desc { font-size: 11px; color: var(--gray-500); margin-top: 1px; }

.sample-card {
  margin-top: 12px;
  background: var(--gradient-hero);
  border-radius: 22px;
  padding: 18px;
  box-shadow: var(--shadow-soft-xl);
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  overflow: hidden;
}
.sample-sparkle { position: absolute; top: 10px; right: 12px; font-size: 22px; opacity: 0.6; }
.sample-petal { position: absolute; top: 40px; right: 20px; font-size: 14px; opacity: 0.5; }
.sample-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sample-eyebrow {
  font-size: 10px;
  font-weight: 700;
  color: var(--brand-600);
  letter-spacing: 0.06em;
}
.sample-badge {
  font-size: 9px;
  font-weight: 600;
  color: var(--gray-500);
  background: rgba(255, 255, 255, 0.7);
  padding: 2px 8px;
  border-radius: 99px;
}

.sample-faces {
  display: flex;
  gap: 8px;
  margin-top: 2px;
  align-items: center;
}
.sample-face {
  flex: 1;
  aspect-ratio: 1;
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid #fff;
}
.sample-face img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.face-girl { box-shadow: 0 4px 12px rgba(236, 72, 153, 0.2); }
.face-boy { box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
.sample-heart { font-size: 22px; flex-shrink: 0; }

.sample-face-labels { display: flex; gap: 8px; }
.face-label {
  flex: 1;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
}
.label-girl { color: var(--brand-600); }
.label-boy { color: #2563EB; }
.face-label-gap { width: 22px; flex-shrink: 0; }

.sample-score-block { text-align: center; margin-top: 4px; }
.sample-stars { color: #F59E0B; font-size: 14px; letter-spacing: 2px; }
.sample-score {
  font-size: 52px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-top: 2px;
  background: linear-gradient(180deg, #EC4899, #8B5CF6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.sample-score-out {
  font-size: 16px;
  color: var(--gray-500);
  -webkit-text-fill-color: var(--gray-500);
}
.sample-summary {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--gray-900);
  margin-top: 4px;
}

.sample-stats {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 2px;
}
.stat-row { display: flex; align-items: center; gap: 8px; }
.stat-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--gray-700);
  width: 52px;
  flex-shrink: 0;
}
.stat-track {
  flex: 1;
  height: 5px;
  border-radius: 99px;
  background: rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.stat-fill { height: 100%; border-radius: 99px; }
.stat-value {
  font-size: 10px;
  font-weight: 700;
  color: var(--gray-900);
  width: 24px;
  text-align: right;
}

.sample-quote {
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 11px;
  color: var(--gray-700);
  line-height: 1.5;
  box-shadow: var(--shadow-soft);
}
.sample-quote-label { color: var(--brand-600); font-weight: 700; }

.sample-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 9px;
  color: var(--gray-500);
  font-weight: 600;
  margin-top: 2px;
}

.faq-list { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.faq-item {
  border: 1px solid var(--gray-200);
  border-radius: 14px;
  padding: 12px 14px;
  background: #fff;
}
.faq-summary {
  font-size: 13px;
  font-weight: 700;
  color: var(--gray-900);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  list-style: none;
}
.faq-summary::-webkit-details-marker { display: none; }
.faq-chevron { color: var(--gray-400); }
.faq-answer {
  font-size: 12px;
  color: var(--gray-700);
  margin-top: 8px;
  line-height: 1.55;
}
</style>
