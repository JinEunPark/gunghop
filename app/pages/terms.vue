<script setup lang="ts">
useHead({ title: '이용약관 · 냥상가' })

const router = useRouter()
function back() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

const sections = [
  {
    h: '제1조 (목적)',
    p: '본 약관은 "냥상가"(이하 "서비스")의 이용 조건과 운영자·이용자 간 권리·의무를 규정하기 위한 것이에요. 본 서비스는 AI 기반 결혼 관상 궁합 엔터테인먼트 콘텐츠를 제공해요.'
  },
  {
    h: '제2조 (서비스의 성격)',
    p: '본 서비스가 제공하는 분석 결과는 AI가 생성한 엔터테인먼트 콘텐츠예요. 과학적·의학적·법률적 근거를 갖는 정보가 아니며, 재미로 봐주세요.'
  },
  {
    h: '제3조 (이용자의 의무)',
    items: [
      '본인 또는 동의를 받은 타인의 사진만 업로드해야 해요.',
      '저작권이 있는 타인의 사진을 무단으로 사용할 수 없어요.',
      '본 서비스를 타인의 명예훼손·모욕·차별 등 부정한 목적으로 사용할 수 없어요.',
      '자동화된 수단(크롤러·봇 등)으로 서비스에 과도한 부하를 주는 행위를 금지해요.'
    ]
  },
  {
    h: '제4조 (지적재산권)',
    items: [
      'AI가 생성한 분석 결과는 이용자의 개인적·비상업적 용도로만 사용할 수 있어요.',
      '상업적 이용이 필요한 경우 운영자에게 사전에 문의해주세요.',
      '서비스의 브랜드·디자인·코드 등 운영자가 제작한 저작물의 무단 복제·배포를 금지해요.'
    ]
  },
  {
    h: '제5조 (면책 조항)',
    items: [
      '본 서비스는 엔터테인먼트 목적이며, 분석 결과는 참고용이에요.',
      '결혼·의료·법률·재정 등 중요한 의사결정은 반드시 전문가와 상담하세요.',
      '운영자는 서비스 이용으로 발생한 직·간접적 피해에 대해 책임을 지지 않아요.',
      '천재지변·서비스 장애 등 운영자가 통제할 수 없는 사유로 인한 서비스 중단에 대해 책임을 지지 않아요.'
    ]
  },
  {
    h: '제6조 (광고)',
    p: '본 서비스는 Google AdSense 등 제3자 광고 네트워크의 광고를 게재하고, 일부 콘텐츠에 제휴(affiliate) 링크를 포함할 수 있어요. 광고로 연결되는 외부 사이트의 내용·품질·거래에 대해서는 운영자가 책임지지 않아요.'
  },
  {
    h: '제7조 (서비스의 변경 및 중단)',
    p: '운영자는 서비스의 운영상·기술상 필요에 따라 사전 공지 없이 서비스의 전부 또는 일부를 변경하거나 중단할 수 있어요.'
  },
  {
    h: '제8조 (약관의 개정)',
    p: '본 약관이 변경될 경우 변경 내용을 본 페이지에 공지해요. 이용자가 변경된 약관에 동의하지 않는 경우 서비스 이용을 중단할 수 있어요.'
  },
  {
    h: '제9조 (준거법 및 관할)',
    p: '본 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련한 분쟁은 민사소송법상 관할 법원을 따라요.'
  },
  {
    h: '제10조 (문의)',
    p: '서비스 이용과 관련한 문의는 아래 이메일로 연락주세요.\nhello@example.com'
  }
]
</script>

<template>
  <div class="screen fade-in" style="background:#fff">
    <AppHeader title="이용약관" show-back @back="back" />

    <div class="legal">
      <h1 class="legal-title">이용약관</h1>
      <div class="legal-meta">최종 수정일 · 2026년 4월 21일</div>

      <section v-for="s in sections" :key="s.h" class="legal-section">
        <h2 class="legal-h">{{ s.h }}</h2>
        <p v-if="s.p" class="legal-p">{{ s.p }}</p>
        <ul v-if="s.items" class="legal-list">
          <li v-for="(it, i) in s.items" :key="i">{{ it }}</li>
        </ul>
      </section>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
.legal {
  padding: 8px 20px 24px;
  color: var(--gray-700);
  line-height: 1.7;
}
.legal-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--gray-900);
  letter-spacing: -0.02em;
  margin-top: 8px;
}
.legal-meta {
  font-size: 11px;
  color: var(--gray-500);
  font-weight: 600;
  margin-top: 6px;
  margin-bottom: 20px;
}
.legal-section + .legal-section { margin-top: 18px; }
.legal-h {
  font-size: 14px;
  font-weight: 800;
  color: var(--gray-900);
  letter-spacing: -0.01em;
  margin: 0 0 6px;
}
.legal-p {
  font-size: 13px;
  color: var(--gray-700);
  line-height: 1.7;
  margin: 0;
  white-space: pre-line;
}
.legal-list {
  padding-left: 18px;
  margin: 2px 0 0;
  font-size: 13px;
}
.legal-list li {
  margin-top: 4px;
  line-height: 1.7;
  color: var(--gray-700);
}
</style>
