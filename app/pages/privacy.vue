<script setup lang="ts">
usePageSeo({
  title: '개인정보처리방침 · 냥상가',
  description: '냥상가 개인정보처리방침 — 수집 항목과 보관 기간을 확인하세요.'
})

const router = useRouter()
function back() {
  if (window.history.length > 1) router.back()
  else router.push('/')
}

const sections = [
  {
    h: '1. 수집하는 정보',
    p: '본 서비스는 최소한의 정보만 수집해요.',
    items: [
      'IP 주소 — 부정 사용 방지 및 일일 이용 횟수 제한(rate limit) 목적',
      '쿠키 및 유사 기술 — 세션 관리, 서비스 개선, 트래픽 분석 목적'
    ]
  },
  {
    h: '2. 수집하지 않는 정보',
    p: '본 서비스는 아래 정보를 수집하지 않아요.',
    items: [
      '이름, 이메일, 전화번호 등 개인 식별 정보',
      '회원가입 정보 (회원가입 자체를 운영하지 않아요)',
      '결제 정보'
    ]
  },
  {
    h: '3. 업로드한 사진의 처리',
    items: [
      '이용자가 업로드한 사진은 브라우저에서 리사이징된 후 분석 요청 시에만 서버로 전송돼요.',
      '서버는 분석 요청을 처리한 직후 사진을 즉시 폐기하며, 어떤 형태로도 저장하지 않아요.',
      '분석 과정에서 사진은 Google Gemini API로 전송돼요. 이는 Google의 개인정보 처리 방침에 따라 처리돼요.',
      '이용자의 브라우저 sessionStorage에 임시 저장된 사진 데이터는 탭을 닫으면 완전히 삭제돼요.'
    ]
  },
  {
    h: '4. 제3자 서비스',
    p: '본 서비스는 아래 제3자 서비스를 사용하며, 각 서비스는 자체 쿠키·추적 기술을 사용할 수 있어요.',
    items: [
      'Google Gemini API — AI 기반 이미지 분석',
      'Google AdSense — 광고 게재',
      'Google Analytics 4 — 트래픽 분석',
      'Microsoft Clarity — 사용자 경험 분석(세션 리플레이·히트맵)',
      'Kakao — 카카오톡 공유 기능'
    ]
  },
  {
    h: '5. 개인정보의 보유 및 파기',
    items: [
      '업로드된 사진은 분석 직후 서버 메모리에서 파기해요.',
      'IP 주소는 부정 사용 방지 목적으로 일시적으로 메모리에 보관되며, 일정 시간 경과 후 자동 삭제돼요.',
      '제3자 서비스(Google Analytics 등)가 수집하는 쿠키·로그 데이터는 각 서비스의 정책에 따라 보관돼요.'
    ]
  },
  {
    h: '6. 이용자의 권리',
    items: [
      '이용자는 언제든지 브라우저 쿠키·저장소를 삭제하여 본 서비스와 관련된 모든 로컬 데이터를 삭제할 수 있어요.',
      '광고 쿠키는 브라우저 설정 또는 Google 광고 설정에서 비활성화할 수 있어요.',
      '개인정보 관련 문의·요청은 아래 이메일로 연락주세요.'
    ]
  },
  {
    h: '7. 개인정보 보호책임자',
    p: '개인정보 관련 문의는 아래로 연락주세요.\nhello@example.com'
  },
  {
    h: '8. 변경 사항',
    p: '본 방침이 변경될 경우 변경 내용을 본 페이지에 공지해요. 중요한 변경이 있을 경우 서비스 진입 시 별도로 안내해드려요.'
  }
]
</script>

<template>
  <div class="screen fade-in" style="background:#fff">
    <AppHeader title="개인정보처리방침" show-back @back="back" />

    <div class="legal">
      <h1 class="legal-title">개인정보처리방침</h1>
      <div class="legal-meta">최종 수정일 · 2026년 4월 21일</div>

      <div class="privacy-callout">
        <div class="pc-icon">🔒</div>
        <div class="pc-body">
          <div class="pc-t">사진은 저장되지 않아요</div>
          <div class="pc-d">업로드한 사진은 분석 직후 즉시 폐기돼요. 서버에 저장하지 않아요.</div>
        </div>
      </div>

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
  margin-bottom: 16px;
}

.privacy-callout {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: #ECFDF5;
  border: 1px solid #A7F3D0;
  border-radius: 16px;
  padding: 14px 16px;
  margin-bottom: 20px;
}
.pc-icon { font-size: 18px; line-height: 1; padding-top: 2px; }
.pc-body { flex: 1; min-width: 0; }
.pc-t { font-size: 13px; font-weight: 800; color: #065F46; }
.pc-d { font-size: 12px; color: #047857; margin-top: 4px; line-height: 1.55; }

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
  margin: 6px 0 0;
  font-size: 13px;
}
.legal-list li {
  margin-top: 4px;
  line-height: 1.7;
  color: var(--gray-700);
}
</style>
