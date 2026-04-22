# 냥상가 TODO

## Phase 1: 핵심 백엔드 (배포 차단 항목)

- [x] `shared/types/analysis.ts` — AnalysisResult 타입 정의 (summary/one_liner 제외, B-1 옵션)
- [x] `server/utils/prompts.ts` — Gemini 시스템/유저 프롬프트 작성
- [x] `server/utils/validateResult.ts` — Gemini 응답 JSON 스키마 검증
- [x] `server/api/analyze.post.ts` — Gemini 2.5 Flash API 호출 엔드포인트
  - 요청 검증, IP 기반 rate limiting(24시간 10회), base64 이미지 처리, 재시도 1회
- [x] `app/composables/useAnalyze.ts` — API 호출 래퍼 (로딩/에러 상태 관리)
- [x] `analyzing.vue` 실제 API 연동 — 목업 제거, NO_FACE/RATE_LIMIT/AI_ERROR 에러 UI 포함

## Phase 2: 결과 페이지 실데이터 연동

- [x] `result.vue` 하드코딩된 RESULT_DATA 제거, sessionStorage에서 실제 분석 결과 로드
- [x] 분석 결과 없을 때 에러 UI ("분석 결과가 없어요") 표시
- [x] NO_FACE 등 Gemini 에러 케이스 핸들링 (analyzing.vue에서 처리)

## Phase 3: 유틸리티 composable

- [x] `app/composables/useImageCompress.ts` — browser-image-compression 활용 (512x512, JPEG 0.8), PhotoSlot에 연결
- [x] `app/composables/useCardDownload.ts` — html-to-image로 결과 카드 PNG 저장
- [x] `app/composables/useKakaoShare.ts` — 카카오톡 공유 기능 (uploadImage → sendDefault, 폴백: sendScrap)

## Phase 4: 설정 & SEO

- [ ] `nuxt.config.ts` SEO 메타태그 추가 (og:image, description, twitter:card)
- [ ] Google Analytics 4 스크립트 연동
- [ ] Microsoft Clarity 스크립트 연동
- [ ] Kakao SDK 스크립트 로드 (`app.head`)
- [ ] canonical URL 설정

## Phase 5: 수익화

### 완료
- [x] AdSense 로더 스크립트 `<head>` 주입 (nuxt.config.ts, 조건부 로드)
- [x] `<AdUnit>` 컴포넌트 생성 (slot 비어있으면 placeholder, 채워지면 실광고)
- [x] `AdPlaceholder` → `AdUnit` 교체 완료 (result.vue 3곳, analyzing.vue 1곳)
- [x] `?noads=1` 쿼리 파라미터로 광고 전체 비활성화
- [x] 해금 CTA 카피에서 "광고 보고" 제거 (AdSense 정책 위반 해소)
- [x] 제휴 카드 마크업: `<a rel="sponsored nofollow noopener">` + 쿠팡 고지 문구

### 🔔 [본인 작업] Google AdSense 승인 메일 도착 시 할 일
- [ ] https://www.google.com/adsense/ 대시보드 접속 → 승인 상태 확인
- [ ] 사이트 설정에서 **ads.txt 파일 다운로드** → `public/ads.txt`에 업로드 후 배포
  - 파일 위치: `https://gunghop.vercel.app/ads.txt` 에서 접근 가능해야 함
- [ ] 광고 → 광고 단위 기준 → **디스플레이 광고** 4개 생성:
  - `result-top` — 결과 페이지 상단 배너
  - `result-native` — 결과 페이지 네이티브 (fluid)
  - `result-middle` — 결과 섹션 사이 배너
  - `analyzing-fullscreen` — 분석 페이지 전면
- [ ] 각 광고 단위 생성 시 **data-ad-slot** 숫자 10자리 복사
- [ ] 알려주시면 `<AdUnit slot="...">` 의 `slot=""` 4곳을 바로 교체 드림
- [ ] 자동 광고는 OFF 유지 (UI 흐름 보존)
- [ ] 승인 후 **카카오 공유 전 전면광고**는 추후 Phase 5-2에서 고려

### 🔔 [본인 작업] 쿠팡 파트너스 가입 및 딥링크
- [ ] https://partners.coupang.com 가입 신청 (승인 1-2일)
- [ ] 승인 후 상품 검색 → 딥링크 생성 (3개):
  - "커플링" / "예물 반지" 검색 → 인기 상품 또는 검색 결과 페이지 딥링크
  - "결혼선물" / "양가 선물" 검색 → 딥링크
  - "궁합 책" / "사주 책" 검색 → 딥링크
- [ ] 알려주시면 `result.vue` 의 `href="#"` 3곳을 바로 교체 드림
- [ ] (참고) 쿠팡 딥링크 쿠키는 24시간 — 방문자가 쿠팡에서 다른 상품 사도 수수료 발생

## Phase 6: 법적 페이지

- [x] `app/pages/terms.vue` — 이용약관
- [x] `app/pages/privacy.vue` — 개인정보처리방침

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
