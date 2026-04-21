# 냥상가 TODO

## Phase 1: 핵심 백엔드 (배포 차단 항목)

- [ ] `shared/types/analysis.ts` — AnalysisResult 타입 정의
- [ ] `server/utils/prompts.ts` — Gemini 시스템/유저 프롬프트 작성
- [ ] `server/utils/validateResult.ts` — Gemini 응답 JSON 스키마 검증
- [ ] `server/api/analyze.post.ts` — Gemini 2.5 Flash API 호출 엔드포인트
  - 요청 검증, IP 기반 rate limiting, base64 이미지 처리
- [ ] `app/composables/useAnalyze.ts` — API 호출 래퍼 (로딩/에러 상태 관리)
- [ ] `analyzing.vue` 실제 API 연동 — 현재 9.1초 대기 후 자동 이동하는 목업 제거

## Phase 2: 결과 페이지 실데이터 연동

- [ ] `result.vue` 하드코딩된 RESULT_DATA 제거, sessionStorage에서 실제 분석 결과 로드
- [ ] 분석 결과 없을 때 에러 UI ("분석 결과가 없어요") 표시
- [ ] NO_FACE 등 Gemini 에러 케이스 핸들링

## Phase 3: 유틸리티 composable

- [ ] `app/composables/useImageCompress.ts` — browser-image-compression 활용 (512x512, JPEG 0.8)
- [ ] `app/composables/useCardDownload.ts` — html-to-image로 결과 카드 PNG 저장
- [ ] `app/composables/useKakaoShare.ts` — 카카오톡 공유 기능

## Phase 4: 설정 & SEO

- [ ] `nuxt.config.ts` SEO 메타태그 추가 (og:image, description, twitter:card)
- [ ] Google Analytics 4 스크립트 연동
- [ ] Microsoft Clarity 스크립트 연동
- [ ] Kakao SDK 스크립트 로드 (`app.head`)
- [ ] canonical URL 설정

## Phase 5: 수익화

- [ ] AdSense 스크립트 로드 및 실제 광고 슬롯 교체 (AdPlaceholder → 실 배너)
  - 결과 페이지 배너 3개, analyzing 진입 시 전면광고, 카카오 공유 전 전면광고
- [ ] `?noads=1` 쿼리 파라미터로 광고 비활성화 지원

## Phase 6: 법적 페이지

- [ ] `app/pages/terms.vue` — 이용약관
- [ ] `app/pages/privacy.vue` — 개인정보처리방침

## Phase 7: 에러 처리 & 안정성

- [ ] `error.vue` — 글로벌 에러 바운더리
- [ ] 404 페이지
- [ ] 네트워크 에러 / API 타임아웃 UI
- [ ] rate limit 초과 시 사용자 안내 메시지

## Phase 8: 이미지 정리

- [ ] `analyzing.vue`, `result.vue`의 FaceA/FaceB SVG 폴백을 냥선생 이미지(crop_face_a/b.webp)로 교체 검토
- [ ] Nyangsang.vue 컴포넌트 사용처 점검 — 더 이상 쓰이지 않으면 삭제

## 참고

- spec.md에 전체 기획 상세 스펙 있음
- 현재 UI/CSS 디자인 시스템은 완성 상태
- 패키지 설치 완료: `@google/generative-ai`, `browser-image-compression`, `html-to-image`
