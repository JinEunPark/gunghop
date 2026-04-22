<script setup lang="ts">
import type { AnimalRarity } from '~/utils/animal'
import { RARITY_LABEL_KR } from '~/utils/animal'

defineProps<{
  score: number
  summary: string
  oneLine: string
  siteUrl: string
  date: string
  animal: {
    src: string
    name: string
    emoji: string
    rarity: AnimalRarity
    caption: string
  }
  sections: { emoji: string; title: string; body: string; rating?: number }[]
}>()

</script>

<template>
  <div class="share-card" :data-rarity="animal.rarity">
    <div class="sc-petal sc-p1">🌸</div>
    <div class="sc-petal sc-p2">🌸</div>
    <div class="sc-petal sc-p3">✨</div>
    <div class="sc-petal sc-p4">💕</div>
    <div class="sc-petal sc-p5">✨</div>

    <div class="sc-top">
      <div class="sc-brand">
        <img src="/assets/main_logo_char.webp" alt="냥상가" class="sc-logo" />
        <div class="sc-brand-t">
          <div class="sc-brand-name">냥상가</div>
          <div class="sc-brand-sub">결혼 관상 궁합 리포트</div>
        </div>
      </div>
      <div class="sc-date">{{ date }}</div>
    </div>

    <div class="sc-reveal">
      <div class="sc-animal-wrap">
        <div class="sc-animal-glow" />
        <div class="sc-animal-halo" />
        <img :src="animal.src" alt="궁합 동물" class="sc-animal" />
      </div>
      <div class="sc-animal-name">
        <span class="sc-animal-emoji">{{ animal.emoji }}</span>
        <span class="sc-animal-label">{{ animal.name }}</span>
      </div>
      <div class="sc-rarity-row">
        <span class="sc-rarity-badge">
          <span v-if="animal.rarity === 'LEGENDARY'" class="sc-rarity-spark">✨</span>
          <span class="sc-rarity-text">{{ RARITY_LABEL_KR[animal.rarity] }}</span>
          <span v-if="animal.rarity === 'LEGENDARY'" class="sc-rarity-spark">✨</span>
        </span>
      </div>
      <div class="sc-caption">
        <span class="sc-caption-quote">“</span>
        {{ animal.caption }}
        <span class="sc-caption-quote sc-caption-quote-end">”</span>
      </div>
    </div>

    <div class="sc-score-row">
      <div class="sc-score-main">
        <span class="sc-score-val">{{ score }}</span><span class="sc-score-out">점</span>
      </div>
      <div class="sc-score-summary">{{ summary }}</div>
    </div>
    <div class="sc-oneline">{{ oneLine }}</div>

    <div class="sc-report-head">
      <div class="sc-report-rule" />
      <div class="sc-report-title">관상 궁합 리포트 · {{ sections.length }}개 항목</div>
      <div class="sc-report-rule" />
    </div>

    <div class="sc-sections">
      <div v-for="(s, i) in sections" :key="s.title" class="sc-sec">
        <div class="sc-sec-head">
          <span class="sc-sec-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="sc-sec-emoji">{{ s.emoji }}</span>
          <span class="sc-sec-title">{{ s.title }}</span>
          <span v-if="s.rating" class="sc-sec-rating">{{ '★'.repeat(s.rating) }}</span>
        </div>
        <div class="sc-sec-body">{{ s.body }}</div>
      </div>
    </div>

    <div class="sc-sign">
      <img src="/assets/main_logo_char.webp" alt="냥상가" class="sc-sign-mascot" />
      <div class="sc-sign-text">
        <div class="sc-sign-label">냥상가 한마디</div>
        <div class="sc-sign-body">
          두 분, 오늘 궁합 봐줘서 고맙다냥 🐾<br />
          이 결과는 재미로만 봐주고, 진짜 선택은<br />
          두 분 마음이 제일 정확하냥.
        </div>
      </div>
    </div>

    <div class="sc-bottom">
      <div class="sc-url">{{ siteUrl.replace(/^https?:\/\//, '') }}</div>
      <div class="sc-cta">나도 뽑아보기 →</div>
    </div>
  </div>
</template>

<style scoped>
.share-card {
  width: 720px;
  min-height: 1280px;
  padding: 52px 48px 44px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #FDF2F8 0%, #FCE7F3 30%, #EDE9FE 100%);
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
  overflow: hidden;
  font-family: 'Pretendard Variable', 'Pretendard', -apple-system, sans-serif;
  color: #111827;
}

.sc-petal {
  position: absolute;
  opacity: 0.45;
  z-index: 0;
  pointer-events: none;
}
.sc-p1 { top: 140px; right: 40px; font-size: 60px; }
.sc-p2 { top: 800px; left: 24px; font-size: 56px; }
.sc-p3 { top: 1400px; right: 30px; font-size: 38px; }
.sc-p4 { top: 2000px; left: 40px; font-size: 46px; }
.sc-p5 { bottom: 140px; right: 40px; font-size: 36px; }

/* === HEADER === */
.sc-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}
.sc-brand { display: flex; align-items: center; gap: 18px; }
.sc-logo {
  width: 104px;
  height: 104px;
  object-fit: contain;
  filter: drop-shadow(0 6px 14px rgba(236, 72, 153, 0.22));
}
.sc-brand-name { font-size: 40px; font-weight: 900; line-height: 1.05; letter-spacing: -0.03em; }
.sc-brand-sub { font-size: 19px; font-weight: 700; color: #DB2777; margin-top: 6px; letter-spacing: 0.02em; }
.sc-date { font-size: 17px; font-weight: 700; color: #6B7280; }

/* === REVEAL === */
.sc-reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  position: relative;
  z-index: 2;
  margin-top: 8px;
}
.sc-caption {
  margin-top: 14px;
  padding: 22px 28px;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 10px 28px rgba(236, 72, 153, 0.16);
  font-size: 26px;
  font-weight: 800;
  color: #111827;
  line-height: 1.5;
  letter-spacing: -0.02em;
  text-align: center;
  position: relative;
  max-width: 600px;
}
.sc-caption-quote {
  color: #EC4899;
  font-size: 32px;
  font-weight: 900;
  margin-right: 4px;
  vertical-align: -2px;
}
.sc-caption-quote-end {
  margin-left: 4px;
  margin-right: 0;
}
.sc-animal-wrap {
  position: relative;
  width: 460px;
  height: 460px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sc-animal-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(236, 72, 153, 0.32) 0%,
    rgba(236, 72, 153, 0.14) 42%,
    transparent 70%
  );
  border-radius: 50%;
  filter: blur(12px);
}
.sc-animal-halo {
  position: absolute;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  background: radial-gradient(circle at 50% 45%, #fff 0%, rgba(255,255,255,0.4) 45%, transparent 70%);
}
.sc-animal {
  position: relative;
  width: 420px;
  height: 420px;
  object-fit: contain;
  filter: drop-shadow(0 18px 32px rgba(139, 92, 246, 0.28));
}
.sc-animal-name {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 6px;
}
.sc-animal-emoji {
  font-size: 56px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.08));
}
.sc-animal-label {
  font-size: 56px;
  font-weight: 900;
  color: #111827;
  letter-spacing: -0.03em;
}

.sc-rarity-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 10px;
}
.sc-rarity-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0.16em;
  padding: 10px 24px;
  border-radius: 9999px;
  color: #fff;
  background: #9CA3AF;
  box-shadow: 0 6px 16px rgba(0,0,0,0.18);
}
.sc-rarity-text { line-height: 1; }
.sc-rarity-spark {
  font-size: 24px;
  line-height: 1;
  filter: drop-shadow(0 0 8px rgba(255, 236, 130, 0.9));
}

.share-card[data-rarity="COMMON"]     .sc-rarity-badge { background: #9CA3AF; }
.share-card[data-rarity="UNCOMMON"]   .sc-rarity-badge { background: #10B981; }
.share-card[data-rarity="RARE"]       .sc-rarity-badge { background: #3B82F6; }
.share-card[data-rarity="EPIC"]       .sc-rarity-badge { background: #8B5CF6; }

.share-card[data-rarity="LEGENDARY"] .sc-rarity-badge {
  font-size: 32px;
  padding: 14px 36px;
  letter-spacing: 0.2em;
  background:
    linear-gradient(
      125deg,
      #FBBF24 0%,
      #F59E0B 18%,
      #EC4899 38%,
      #8B5CF6 55%,
      #3B82F6 72%,
      #F59E0B 92%,
      #FBBF24 100%
    );
  color: #fff;
  text-shadow: 0 2px 4px rgba(139, 92, 246, 0.35);
  box-shadow:
    0 0 0 4px rgba(255, 255, 255, 0.75),
    0 0 0 6px rgba(251, 191, 36, 0.55),
    0 10px 28px rgba(236, 72, 153, 0.45),
    0 0 50px rgba(245, 158, 11, 0.45);
  position: relative;
}
.share-card[data-rarity="LEGENDARY"] .sc-rarity-spark {
  font-size: 32px;
}

/* === SCORE ROW === */
.sc-score-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  position: relative;
  z-index: 2;
  background: rgba(255,255,255,0.82);
  border-radius: 9999px;
  padding: 14px 28px;
  box-shadow: 0 8px 20px rgba(236,72,153,0.14);
  align-self: center;
}
.sc-score-main { display: flex; align-items: baseline; }
.sc-score-val {
  font-size: 62px;
  font-weight: 900;
  letter-spacing: -0.04em;
  background: linear-gradient(180deg, #EC4899, #8B5CF6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  line-height: 1;
}
.sc-score-out { font-size: 26px; font-weight: 800; color: #6B7280; margin-left: 3px; }
.sc-score-summary {
  font-size: 30px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}
.sc-oneline {
  font-size: 22px;
  font-weight: 700;
  color: #374151;
  text-align: center;
  line-height: 1.55;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

/* === REPORT HEADER === */
.sc-report-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 8px;
  position: relative;
  z-index: 2;
}
.sc-report-rule {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(139,92,246,0.35), transparent);
}
.sc-report-title {
  font-size: 21px;
  font-weight: 900;
  color: #7C3AED;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

/* === SECTIONS === */
.sc-sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 2;
}
.sc-sec {
  background: rgba(255,255,255,0.9);
  border-radius: 22px;
  padding: 24px 28px;
  box-shadow: 0 6px 18px rgba(236, 72, 153, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.sc-sec-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.sc-sec-num {
  font-size: 16px;
  font-weight: 900;
  color: #DB2777;
  letter-spacing: 0.06em;
  background: #FCE7F3;
  padding: 5px 12px;
  border-radius: 10px;
  min-width: 44px;
  text-align: center;
}
.sc-sec-emoji { font-size: 32px; line-height: 1; }
.sc-sec-title {
  flex: 1;
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  letter-spacing: -0.02em;
}
.sc-sec-rating {
  color: #F59E0B;
  font-size: 20px;
  letter-spacing: 1.5px;
}
.sc-sec-body {
  font-size: 20px;
  line-height: 1.75;
  color: #374151;
  letter-spacing: -0.005em;
  font-weight: 500;
  word-break: keep-all;
}

/* === SIGN-OFF === */
.sc-sign {
  display: flex;
  gap: 18px;
  align-items: center;
  background: #fff;
  border-radius: 22px;
  padding: 22px 26px;
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.12);
  position: relative;
  z-index: 2;
  margin-top: 6px;
}
.sc-sign-mascot { width: 84px; height: 84px; object-fit: contain; flex-shrink: 0; }
.sc-sign-label {
  font-size: 16px;
  font-weight: 900;
  color: #DB2777;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}
.sc-sign-body {
  font-size: 18px;
  color: #374151;
  line-height: 1.65;
  font-weight: 500;
}

/* === BOTTOM === */
.sc-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 2px solid rgba(17, 24, 39, 0.08);
  padding-top: 18px;
  margin-top: auto;
  position: relative;
  z-index: 2;
}
.sc-url { font-size: 19px; font-weight: 800; color: #6B7280; letter-spacing: -0.01em; }
.sc-cta { font-size: 26px; font-weight: 900; color: #EC4899; letter-spacing: -0.01em; }
</style>
