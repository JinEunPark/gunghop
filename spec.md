# 결혼 관상 AI 앱 — 프로젝트 스펙 V2

> **이 문서를 읽는 AI 에이전트에게**: 이 문서는 프로젝트의 단일 진실 공급원입니다. 구현 시 반드시 이 문서의 기술 스택·화면 구조·API 스펙을 따르세요. 문서에 명시되지 않은 결정이 필요하면 "MVP는 최대한 단순하게"를 기본 원칙으로 따르세요.

---

## 0. TL;DR (빠른 요약)

- **무엇**: 두 사람의 얼굴 사진 분석 → AI 결혼 궁합 결과 제공하는 웹앱
- **왜**: 결혼 앞둔 2030 여성이 상견례·결혼 결정 전에 "재미로" 확인하는 용도
- **어떻게 돈 버나**: Google AdSense 광고 + 결혼정보회사 제휴 링크
- **기술**: Nuxt 3 + Gemini 2.5 Flash API + Cloudflare Pages
- **저장**: **아무것도 저장 안 함** (DB·Storage·Auth 전부 없음)
- **개발 기간 목표**: 5~7일
- **화면 수**: 4개 (랜딩 / 업로드 / 로딩 / 결과)
- **API 라우트**: 1개 (`POST /api/analyze`)

---

## 1. 핵심 원칙 (무엇을 하지 말 것인가)

이 원칙에서 벗어나는 코드는 작성하지 마세요.

1. **저장 금지**: 이미지·결과·유저 정보 어떤 것도 서버에 저장하지 않습니다.
2. **DB 금지**: Supabase·PlanetScale·Firebase 등 DB 연결 금지.
3. **로그인 금지**: 카카오·구글 로그인 포함 모든 인증 기능 제외.
4. **결제 금지**: 토스페이먼츠·인앱결제 구현 안 함.
5. **과도한 기능 금지**: 히스토리·즐겨찾기·랭킹·커뮤니티 기능 전부 제외.
6. **복잡한 상태관리 금지**: Pinia 같은 전역 상태관리 도입 금지. Vue의 `ref`와 sessionStorage만 사용.

---

## 2. 기술 스택 (확정)

| 영역           | 선택                                           | 비고                                         |
| -------------- | ---------------------------------------------- | -------------------------------------------- |
| 프레임워크     | **Nuxt 3**                                     | Composition API + `<script setup>` 문법 필수 |
| 스타일링       | **Tailwind CSS**                               | `@nuxtjs/tailwindcss` 모듈                   |
| UI 라이브러리  | **Nuxt UI**                                    | `@nuxt/ui` 모듈                              |
| AI API         | **Google Gemini 2.5 Flash**                    | `@google/generative-ai` npm 패키지           |
| 이미지 처리    | **browser-image-compression**                  | 클라이언트 리사이징                          |
| 결과 카드 생성 | **html-to-image**                              | DOM → 이미지 변환                            |
| 카카오 공유    | **Kakao JavaScript SDK v2**                    | script 태그로 로드                           |
| 광고           | **Google AdSense**                             | script 태그로 로드                           |
| 분석           | **Google Analytics 4** + **Microsoft Clarity** | 둘 다 script 태그                            |
| 배포           | **Cloudflare Pages**                           | `nitro preset: cloudflare-pages`             |
| 도메인         | 가비아 등에서 별도 구매                        | `.com` 또는 `.kr`                            |

**환경 변수** (`.env`):

```
GEMINI_API_KEY=...
NUXT_PUBLIC_ADSENSE_CLIENT=ca-pub-...
NUXT_PUBLIC_GA_ID=G-...
NUXT_PUBLIC_KAKAO_APP_KEY=...
NUXT_PUBLIC_SITE_URL=https://example.com
```

---

## 3. 프로젝트 구조

```
/
├── nuxt.config.ts
├── app.vue
├── package.json
├── tsconfig.json
├── .env
├── .env.example
├── tailwind.config.ts
├── assets/
│   └── css/
│       └── main.css
├── components/
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── LegalDisclaimer.vue    # "엔터테인먼트 목적" 문구
│   ├── AdBanner.vue            # AdSense 배너 래퍼
│   ├── AdInterstitial.vue      # 전면 광고 래퍼
│   ├── PhotoUploader.vue       # 사진 1장 업로드 컴포넌트
│   ├── LoadingAnalyzer.vue     # 로딩 애니메이션
│   ├── ResultScore.vue         # 궁합 점수 표시
│   ├── ResultSection.vue       # 결과 아코디언 섹션
│   ├── ResultLocked.vue        # 자물쇠 UI
│   ├── ShareCard.vue           # 다운로드용 카드 (html-to-image 대상)
│   └── AffiliateLinks.vue      # 제휴 마케팅 링크 모음
├── composables/
│   ├── useAnalyze.ts           # 분석 API 호출
│   ├── useImageCompress.ts     # 이미지 리사이징
│   ├── useCardDownload.ts      # 결과 카드 이미지 생성
│   └── useKakaoShare.ts        # 카카오톡 공유
├── pages/
│   ├── index.vue               # 랜딩 /
│   ├── upload.vue              # 업로드 /upload
│   ├── analyzing.vue           # 로딩 /analyzing
│   ├── result.vue              # 결과 /result
│   ├── terms.vue               # 이용약관 /terms
│   └── privacy.vue             # 개인정보처리방침 /privacy
├── server/
│   └── api/
│       └── analyze.post.ts     # Gemini 호출
├── utils/
│   ├── prompts.ts              # LLM 프롬프트 문자열
│   └── validateResult.ts       # Gemini 응답 JSON 검증
├── types/
│   └── analysis.ts             # AnalysisResult 타입
└── public/
    ├── favicon.ico
    ├── og-image.png            # SNS 공유용 OG 이미지
    └── sample-result.png       # 랜딩에 쓸 예시 결과 이미지
```

---

## 4. 데이터 흐름 (반드시 이해하고 구현)

**저장을 안 하므로, 유저의 브라우저 세션 안에서만 데이터가 흐릅니다.**

```
[1] /upload
    ↓ 사진 2장 업로드 + 리사이징
    ↓ sessionStorage에 photoA, photoB (base64) 저장
    ↓ /analyzing 이동

[2] /analyzing
    ↓ sessionStorage에서 photoA, photoB 읽기
    ↓ POST /api/analyze 호출
    ↓ 응답받은 결과 JSON을 sessionStorage의 analysisResult 키에 저장
    ↓ /result 이동

[3] /result
    ↓ sessionStorage에서 analysisResult 읽어서 화면에 표시
    ↓ 유저가 페이지를 떠나면 sessionStorage 유지 (같은 탭 내에선 재접근 가능)
    ↓ 탭 닫으면 완전 삭제

[4] "다시 분석하기" 클릭 시
    ↓ sessionStorage 초기화 (photoA, photoB, analysisResult 삭제)
    ↓ /upload 이동
```

**중요**:

- 서버는 어떤 데이터도 보관하지 않음
- 결과를 공유하고 싶으면 **결과 카드 이미지를 다운로드**해서 공유
- URL 공유 기능 없음 (결과 URL은 본인 세션에서만 유효)
- 새로고침 시 sessionStorage는 유지되므로 결과 페이지 새로고침 가능
- 탭 닫으면 모든 데이터 소멸

---

## 5. 화면 명세 (4개)

### 5.1 랜딩 `/` (`pages/index.vue`)

**목적**: 3초 내 "이게 뭐고 왜 해볼 만한지" 전달 + CTA 클릭.

**섹션 순서**:

1. **히어로**
   - 헤드라인: `AI가 봐주는 결혼 관상 궁합`
   - 서브: `상견례 전에, 결혼 결정 전에 두 분의 궁합을 확인해보세요`
   - CTA 버튼: `지금 무료로 궁합 보기` → `/upload`
   - 배경: 파스텔 핑크/라벤더 그라데이션
2. **작동 방식** (3스텝)
   - ① 사진 2장 업로드 → ② AI가 30초 분석 → ③ 결과 바로 확인
3. **예시 결과 카드 미리보기**
   - `public/sample-result.png` 표시
4. **FAQ** (accordion)
   - Q: 사진은 어떻게 되나요? → A: 분석 직후 즉시 폐기됩니다. 서버에 저장하지 않아요.
   - Q: 정확도는 어느 정도인가요? → A: AI 기반 엔터테인먼트 콘텐츠입니다. 재미로 봐주세요.
   - Q: 정말 무료인가요? → A: 네, 광고 보시면 모든 기능 무료입니다.
5. **푸터** (`AppFooter.vue`)
   - 이용약관 / 개인정보처리방침 / 문의 이메일
   - `LegalDisclaimer` 컴포넌트 포함

**광고**: ❌ 없음.

---

### 5.2 업로드 `/upload` (`pages/upload.vue`)

**목적**: 마찰 최소화하여 업로드 완료율 극대화.

**UI 요소**:

- 상단: 진행 인디케이터 `1/3 사진 업로드`
- `PhotoUploader` 2개 사용:
  - 레이블 1: `내 사진`
  - 레이블 2: `상대방 사진`
- 업로드 가이드 텍스트:
  - `정면, 밝은 곳, 안경 없는 사진이 가장 정확해요`
  - `얼굴이 크게 나온 사진을 사용하세요`
- 프라이버시 강조 박스 (`bg-green-50`, 눈에 띄게):
  - 🔒 `사진은 분석 직후 즉시 폐기되며 서버에 저장되지 않습니다`
- 동의 체크박스 (필수):
  - `이용약관과 개인정보처리방침에 동의합니다`
- CTA: `분석 시작하기`
  - 비활성 조건: 사진 둘 중 하나라도 없거나 동의 안 함

**동작**:

1. 사진 2장 업로드 + 동의 → CTA 활성화
2. CTA 클릭 시:
   - 두 이미지를 `useImageCompress`로 512×512 JPEG(품질 0.8) 리사이징
   - sessionStorage에 base64로 임시 저장 (키: `photoA`, `photoB`)
   - `/analyzing`으로 이동

**`PhotoUploader` 컴포넌트 동작**:

- 드래그&드롭 + 클릭 둘 다 지원
- 업로드 직후 미리보기 썸네일 표시
- 삭제 버튼으로 재업로드 가능
- `props`: `label: string`, `modelValue: File | null`
- `emits`: `update:modelValue`

**광고**: ❌ 없음.

---

### 5.3 분석 로딩 `/analyzing` (`pages/analyzing.vue`)

**목적**: 5~15초 대기 시간 채우기 + 광고 수익 핵심 노출.

**UI 요소**:

- 중앙 로딩 애니메이션 (Nuxt UI의 `UIcon` + 회전 애니메이션)
- 순차 전환되는 진행 텍스트 (2초마다 변경):
  ```
  '얼굴형을 분석 중이에요... 🔍'
  '눈·코·입 형태를 살펴보고 있어요... 👀'
  '두 분의 기운을 맞춰보는 중이에요... ✨'
  '궁합 지표를 계산 중이에요... 💕'
  '결혼 후 3년을 예측 중이에요... 📆'
  'AI 관상가가 해석을 완성 중이에요... 🧙‍♀️'
  '결과를 예쁘게 정리하고 있어요... 🎀'
  ```
- 하단: 관상 상식 박스 (로딩 중 읽을거리)

**동작** (`onMounted`):

1. sessionStorage에서 `photoA`, `photoB` 읽기
2. 없으면 `/upload`로 리다이렉트
3. `useAnalyze`로 API 호출
4. 성공 → sessionStorage에 `analysisResult` JSON 저장 → `/result`로 이동
5. 실패 → 에러 메시지 표시 + "다시 시도" 버튼 (→ `/upload`)

**광고**: ✅ 페이지 진입 시 `AdInterstitial` 1회 실행.

---

### 5.4 결과 `/result` (`pages/result.vue`)

**목적**: 즉각 만족 + 광고 시청 유도 + 바이럴 공유.

**진입 시 처리**:

- sessionStorage에서 `analysisResult`와 `photoA`, `photoB` 읽기
- 데이터 없으면 "분석 결과가 없어요" 메시지 + `/upload` CTA

**섹션 구조**:

#### A. 상단 — 무료 공개

- 두 얼굴 사진 나란히 (sessionStorage의 photoA, photoB 표시)
- 궁합 점수 큼직하게: `87점 / 100점` (`ResultScore.vue`)
- 감성 요약: `천생연분이에요 💕`
- 핵심 한 줄: `재물운은 최고, 성격 상성은 조금 주의 필요`
- 별 5개 시각화

#### B. 중간 — 3개 무료, 7개 자물쇠

**무료 공개** (`ResultSection`):

- ✅ 얼굴형 상성 (`face_shape_compatibility`)
- ✅ 재물 시너지 (`wealth_synergy`)
- ✅ 전반적 기운 (`overall_vibe`)

**자물쇠 UI** (`ResultLocked`, 7개):

- 🔒 성격 상성
- 🔒 고부관계 예측
- 🔒 자녀운
- 🔒 건강 궁합
- 🔒 결혼 후 3년 예측
- 🔒 주의할 점 3가지
- 🔒 좋은 점 3가지

**해금 버튼** (큼직하게):

- `🎁 광고 보고 전체 결과 확인하기`
- 클릭 시:
  - AdSense 전면 광고 재생 (또는 별도 광고 네트워크의 보상형)
  - 광고 완료 후 `unlocked = ref(true)` 상태 변경
  - 7개 섹션 `v-if="unlocked"`로 노출
  - 광고 해금 상태는 컴포넌트 메모리에만 존재 (새로고침 시 다시 봐야 함, 의도된 동작)

#### C. 하단 — 바이럴 엔진

- `결과 카드 이미지 저장하기` 버튼 → `useCardDownload` 실행
- `카카오톡으로 공유하기` 버튼 → `useKakaoShare` 실행 (공유 전 전면 광고 1회)
- `다시 분석하기` 버튼 → sessionStorage 초기화 후 `/upload`

#### D. 숨겨진 `ShareCard` 요소

- `v-show="false"` 또는 화면 밖에 위치시킴
- 다운로드/공유 시 이 요소를 이미지로 변환
- 9:16 비율 (인스타 스토리 최적화)
- 포함 내용: 궁합 점수, 감성 요약, QR 코드, 앱 URL, 브랜드 로고

#### E. 최하단 — 제휴 마케팅 (`AffiliateLinks.vue`)

- 🎁 `이 궁합이라면 어울리는 결혼정보회사` — 듀오/가연 링크
- 💒 `두 분에게 어울리는 웨딩홀` — 웨딩홀 제휴
- 💍 `예물은 여기서` — 주얼리 제휴
- ⚠️ 각 링크에 `[광고]` 배지 필수

**광고 배치**:

- 상단 영역 아래: `AdBanner` (디스플레이 광고)
- 무료/자물쇠 섹션 사이: `AdBanner` (네이티브 형태)
- 해금 후 섹션 사이: `AdBanner` 2개 자연스럽게
- 카카오 공유 버튼 클릭 직전: `AdInterstitial` 1회

---

## 6. API 라우트 (유일)

### 6.1 `POST /api/analyze`

**파일 위치**: `server/api/analyze.post.ts`

**요청 본문**:

```typescript
{
  image_a: string; // base64 data URL (예: "data:image/jpeg;base64,...")
  image_b: string; // base64 data URL
}
```

**처리 순서**:

1. 요청 본문 유효성 검사
   - 두 이미지 모두 base64 data URL 형식인지
   - JPEG 또는 PNG인지
   - 각 이미지 2MB 이하인지 (리사이징 후이므로 이보다 훨씬 작아야 정상)
2. Rate limit 체크 (IP 기준, 하루 10회)
   - Nuxt의 `getRequestIP`로 IP 획득
   - 메모리 캐시(Map)로 처리. 서버리스 환경에서 인스턴스별 독립이지만 MVP엔 충분
3. base64 → Gemini API가 받는 형식(`{ inlineData: { data, mimeType } }`)으로 변환
4. `@google/generative-ai` 로 Gemini 2.5 Flash 호출
   - 모델 ID: `gemini-2.5-flash`
   - 시스템 프롬프트: `utils/prompts.ts`의 `SYSTEM_PROMPT`
   - 사용자 프롬프트: `USER_PROMPT`
   - 이미지 2장 첨부
   - `generationConfig`: `{ responseMimeType: "application/json", maxOutputTokens: 2000, temperature: 0.9 }`
5. 응답 JSON 파싱 + `validateResult`로 스키마 검증
6. 검증 실패 시 재시도 1회
7. 최종 결과 반환 (저장 없이 바로 반환)

**응답 본문** (AnalysisResult 타입):

```typescript
{
  overall_score: number;      // 0~100
  summary: string;             // "천생연분이에요 💕"
  one_liner: string;           // 핵심 한 줄
  face_shape_compatibility: string;
  wealth_synergy: {
    rating: number;            // 1~5
    description: string;
  };
  overall_vibe: string;        // 전반적 기운
  personality_compatibility: string;
  in_law_relationship: string;
  children_fortune: string;
  health_compatibility: string;
  three_year_prediction: string;
  warnings: string[];          // 정확히 3개
  positives: string[];         // 정확히 3개
  recommended_marriage_timing: string;
}
```

**에러 응답**:

```typescript
// 얼굴 인식 실패 (Gemini가 { error: "NO_FACE" }를 반환한 경우)
{ error: 'NO_FACE', message: '사진에서 얼굴을 찾을 수 없어요. 정면 사진으로 다시 시도해주세요.' }

// Rate limit 초과
{ error: 'RATE_LIMIT', message: '오늘 사용 한도를 초과했어요. 내일 다시 시도해주세요.' }

// Gemini API 실패 또는 JSON 파싱 실패
{ error: 'AI_ERROR', message: '분석에 실패했어요. 잠시 후 다시 시도해주세요.' }
```

**중요한 구현 디테일**:

- Rate limit은 전역 Map으로 구현: `const ipHits = new Map<string, { count: number; resetAt: number }>()`
- Cloudflare Pages 서버리스 환경에서는 Map이 인스턴스별로 초기화됨 (완벽하진 않지만 MVP엔 충분)
- 더 엄격한 rate limit이 필요하면 Cloudflare KV 사용 가능하지만 MVP엔 생략

---

## 7. LLM 프롬프트 (`utils/prompts.ts`)

### 7.1 시스템 프롬프트

```typescript
export const SYSTEM_PROMPT = `당신은 30년 경력의 한국 전통 관상가입니다.
두 사람의 얼굴 사진을 보고 결혼 궁합을 분석하는 것이 당신의 역할입니다.

# 분석 원칙
- 한국 전통 관상학 기반 (부부의 조화, 가정운, 자녀운 중시)
- 친근하고 이해하기 쉬운 한국어로 작성
- 전문 용어 최소화, 2030 여성이 읽기 편하게
- 부정적 결과도 솔직히 말하되, 해결책/희망을 함께 제시
- 점쟁이 톤 배제, 현대적·합리적 뉘앙스
- 각 항목은 2~3문장으로 간결하게

# 금지사항
- 의학적 진단이나 조언
- 차별적 표현 (성별·외모·나이·인종 등)
- "당신은 ~해야 한다" 식의 단정적 명령
- 비극적 예측 ("이혼할 것이다" 등)
- 특정 종교적 표현

# 출력 형식
반드시 JSON 형식으로만 응답하세요. 다른 텍스트나 설명을 추가하지 마세요.
JSON 외 텍스트 포함 시 시스템이 실패합니다.`;
```

### 7.2 사용자 프롬프트

```typescript
export const USER_PROMPT = `첨부된 두 장의 사진을 분석하여 결혼 궁합을 판단해주세요.

사진 1: 분석 대상자 A (본인)
사진 2: 분석 대상자 B (상대방)

아래 JSON 스키마에 맞게 응답하세요:

{
  "overall_score": 0~100 사이의 정수,
  "summary": "감성 한 줄 요약 (이모지 1개 포함, 예: '천생연분이에요 💕')",
  "one_liner": "핵심 포인트 한 줄 (20자 내외)",
  "face_shape_compatibility": "얼굴형 조합 분석 (2~3문장)",
  "wealth_synergy": {
    "rating": 1~5 사이의 정수,
    "description": "재물 시너지 설명 (2~3문장)"
  },
  "overall_vibe": "전반적 기운에 대한 짧은 설명 (1~2문장)",
  "personality_compatibility": "성격 상성 분석 (2~3문장, 충돌 가능성 포함)",
  "in_law_relationship": "시부모와의 관계 예측 (2~3문장)",
  "children_fortune": "자녀운 (2~3문장)",
  "health_compatibility": "건강 궁합 (2~3문장)",
  "three_year_prediction": "결혼 후 3년 예측 (2~3문장)",
  "warnings": ["주의할 점 1", "주의할 점 2", "주의할 점 3"],
  "positives": ["좋은 점 1", "좋은 점 2", "좋은 점 3"],
  "recommended_marriage_timing": "추천 혼인 시기 (1~2문장)"
}

만약 사진에서 얼굴을 찾을 수 없다면 다음 JSON을 반환하세요:
{ "error": "NO_FACE" }`;
```

### 7.3 응답 검증 (`utils/validateResult.ts`)

```typescript
import type { AnalysisResult } from "~/types/analysis";

export function validateResult(raw: any): {
  valid: boolean;
  data?: AnalysisResult;
  error?: string;
} {
  if (!raw || typeof raw !== "object") {
    return { valid: false, error: "Not an object" };
  }

  // NO_FACE 특수 케이스
  if (raw.error === "NO_FACE") {
    return { valid: false, error: "NO_FACE" };
  }

  // 필수 필드 체크
  const requiredFields = [
    "overall_score",
    "summary",
    "one_liner",
    "face_shape_compatibility",
    "wealth_synergy",
    "overall_vibe",
    "personality_compatibility",
    "in_law_relationship",
    "children_fortune",
    "health_compatibility",
    "three_year_prediction",
    "warnings",
    "positives",
    "recommended_marriage_timing",
  ];

  for (const field of requiredFields) {
    if (!(field in raw)) {
      return { valid: false, error: `Missing field: ${field}` };
    }
  }

  // 타입 체크
  if (
    typeof raw.overall_score !== "number" ||
    raw.overall_score < 0 ||
    raw.overall_score > 100
  ) {
    return { valid: false, error: "Invalid overall_score" };
  }

  if (
    !raw.wealth_synergy ||
    typeof raw.wealth_synergy.rating !== "number" ||
    raw.wealth_synergy.rating < 1 ||
    raw.wealth_synergy.rating > 5
  ) {
    return { valid: false, error: "Invalid wealth_synergy.rating" };
  }

  if (!Array.isArray(raw.warnings) || raw.warnings.length < 1) {
    return { valid: false, error: "Invalid warnings array" };
  }

  if (!Array.isArray(raw.positives) || raw.positives.length < 1) {
    return { valid: false, error: "Invalid positives array" };
  }

  return { valid: true, data: raw as AnalysisResult };
}
```

### 7.4 타입 정의 (`types/analysis.ts`)

```typescript
export interface AnalysisResult {
  overall_score: number;
  summary: string;
  one_liner: string;
  face_shape_compatibility: string;
  wealth_synergy: {
    rating: number;
    description: string;
  };
  overall_vibe: string;
  personality_compatibility: string;
  in_law_relationship: string;
  children_fortune: string;
  health_compatibility: string;
  three_year_prediction: string;
  warnings: string[];
  positives: string[];
  recommended_marriage_timing: string;
}
```

---

## 8. 컴포저블 (composables)

### 8.1 `useAnalyze.ts`

```typescript
import type { AnalysisResult } from "~/types/analysis";

export const useAnalyze = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const analyze = async (
    imageA: string,
    imageB: string,
  ): Promise<AnalysisResult> => {
    loading.value = true;
    error.value = null;
    try {
      const result = await $fetch<AnalysisResult>("/api/analyze", {
        method: "POST",
        body: { image_a: imageA, image_b: imageB },
      });
      return result;
    } catch (e: any) {
      error.value = e.data?.message ?? "분석에 실패했어요";
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return { loading, error, analyze };
};
```

### 8.2 `useImageCompress.ts`

```typescript
import imageCompression from "browser-image-compression";

export const useImageCompress = () => {
  const compress = async (file: File): Promise<string> => {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 512,
      useWebWorker: true,
      fileType: "image/jpeg",
      initialQuality: 0.8,
    });
    return await imageCompression.getDataUrlFromFile(compressed);
  };

  return { compress };
};
```

### 8.3 `useCardDownload.ts`

```typescript
import { toPng } from "html-to-image";

export const useCardDownload = () => {
  const downloadCard = async (elementId: string, filename = "result.png") => {
    const node = document.getElementById(elementId);
    if (!node) throw new Error("Card element not found");

    const dataUrl = await toPng(node, {
      quality: 0.95,
      pixelRatio: 2,
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  return { downloadCard };
};
```

### 8.4 `useKakaoShare.ts`

```typescript
export const useKakaoShare = () => {
  const config = useRuntimeConfig();

  const initKakao = () => {
    if (typeof window === "undefined") return;
    // @ts-ignore
    if (window.Kakao && !window.Kakao.isInitialized()) {
      // @ts-ignore
      window.Kakao.init(config.public.kakaoAppKey);
    }
  };

  const shareResult = (score: number, summary: string, imageUrl: string) => {
    initKakao();
    // @ts-ignore
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${score}점 결혼 궁합 결과`,
        description: summary,
        imageUrl,
        link: {
          webUrl: config.public.siteUrl,
          mobileWebUrl: config.public.siteUrl,
        },
      },
      buttons: [
        {
          title: "나도 해보기",
          link: {
            webUrl: config.public.siteUrl,
            mobileWebUrl: config.public.siteUrl,
          },
        },
      ],
    });
  };

  return { shareResult };
};
```

---

## 9. 광고 배치 규칙

### 9.1 화면별 배치

| 화면   | 광고 유형 | 개수 | 위치                  |
| ------ | --------- | ---- | --------------------- |
| 랜딩   | ❌ 없음   | 0    | -                     |
| 업로드 | ❌ 없음   | 0    | -                     |
| 로딩   | 전면      | 1    | 페이지 진입 시        |
| 결과   | 배너      | 3    | 상단·중간·하단        |
| 결과   | 전면      | 1    | 해금 버튼 클릭 시     |
| 결과   | 전면      | 1    | 카카오 공유 클릭 직전 |

### 9.2 AdSense 정책 준수

- 랜딩·결과 페이지 footer에 반드시 다음 문구 포함:
  `본 앱은 엔터테인먼트 목적이며, 의학·법률·재정 조언이 아닙니다.`
- 각 광고 영역 상하에 최소 10px 여백
- 광고를 콘텐츠처럼 위장하지 않기 (구별 가능하게)
- 실수로 자기 광고 클릭 방지 위해 개발 중엔 `?noads=1` 쿼리스트링으로 광고 끄기 구현

### 9.3 `AdBanner.vue` 기본 구조

```vue
<script setup lang="ts">
const props = defineProps<{
  slot: string; // AdSense slot ID
  format?: string; // 'auto', 'horizontal', etc.
}>();

const config = useRuntimeConfig();
const route = useRoute();
const showAd = computed(() => route.query.noads !== "1");

onMounted(() => {
  if (!showAd.value) return;
  try {
    // @ts-ignore
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error("AdSense error:", e);
  }
});
</script>

<template>
  <div v-if="showAd" class="my-4">
    <ins
      class="adsbygoogle block"
      :data-ad-client="config.public.adsenseClient"
      :data-ad-slot="slot"
      :data-ad-format="format ?? 'auto'"
      data-full-width-responsive="true"
    />
  </div>
</template>
```

---

## 10. 디자인 가이드

### 10.1 컬러 팔레트

`tailwind.config.ts`에 추가:

```typescript
theme: {
  extend: {
    colors: {
      brand: {
        50:  '#FDF2F8',
        100: '#FCE7F3',
        200: '#FBCFE8',
        300: '#F9A8D4',
        400: '#F472B6',
        500: '#EC4899',  // 메인 브랜드
        600: '#DB2777',  // 호버
        700: '#BE185D',
      },
      lavender: {
        100: '#EDE9FE',
        500: '#8B5CF6',
      },
    },
    fontFamily: {
      sans: ['Pretendard Variable', 'Pretendard', 'sans-serif'],
    },
  },
},
```

### 10.2 타이포그래피

- 본문 폰트: `Pretendard Variable`
  - `assets/css/main.css`에 import:
    ```css
    @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css");
    ```
- 제목: `font-bold` 또는 `font-extrabold`
- 본문: `font-normal` 또는 `font-medium`
- 이모지 적극 활용 (감성 강화)

### 10.3 디자인 금기

- ❌ 점집 느낌 (붉은색·먹색·한자)
- ❌ 과도한 그림자·네온
- ❌ 복잡한 그라데이션
- ✅ 미니멀·파스텔·둥근 모서리
- ✅ 여백 충분히

### 10.4 주요 버튼 스타일 (Tailwind 클래스)

```
primary:   bg-brand-500 text-white rounded-full px-6 py-3 font-bold shadow-lg hover:bg-brand-600 transition
secondary: bg-white text-brand-500 border-2 border-brand-500 rounded-full px-6 py-3 font-bold hover:bg-brand-50 transition
disabled:  bg-gray-200 text-gray-400 rounded-full px-6 py-3 font-bold cursor-not-allowed
```

---

## 11. 개발 순서 (5~7일 MVP)

### Day 1 — 셋업

- [ ] `npx nuxi@latest init marriage-face` 로 프로젝트 생성
- [ ] `@nuxtjs/tailwindcss`, `@nuxt/ui` 설치 및 `nuxt.config.ts`에 추가
- [ ] `tailwind.config.ts`에 컬러 팔레트·폰트 토큰 추가
- [ ] `assets/css/main.css`에 Pretendard 폰트 import
- [ ] `.env.example` 작성 + 로컬 `.env` 설정
- [ ] `nuxt.config.ts`에 `runtimeConfig` 설정
- [ ] GitHub 리포지토리 생성
- [ ] Cloudflare Pages 연결 + 빈 페이지 배포 테스트
- [ ] `types/analysis.ts` 타입 파일 생성

### Day 2 — 랜딩 + 업로드

- [ ] `AppHeader.vue`, `AppFooter.vue`, `LegalDisclaimer.vue` 작성
- [ ] `pages/index.vue` (랜딩) 작성 - 히어로, 3스텝, FAQ
- [ ] `PhotoUploader.vue` 컴포넌트 작성 (드래그&드롭 + 미리보기 + 삭제)
- [ ] `composables/useImageCompress.ts` 작성
- [ ] `pages/upload.vue` 작성 (2개 업로더 + 동의 체크 + CTA)
- [ ] sessionStorage 저장 로직 구현

### Day 3 — API + 분석

- [ ] Gemini API 키 발급 (Google AI Studio)
- [ ] `@google/generative-ai`, `browser-image-compression`, `html-to-image` 설치
- [ ] `utils/prompts.ts` 작성
- [ ] `utils/validateResult.ts` 작성
- [ ] `server/api/analyze.post.ts` 작성
  - 요청 검증
  - Rate limit (메모리 Map)
  - Gemini 호출
  - JSON 파싱 + 검증 + 재시도
- [ ] 수동 테스트: curl 또는 Thunder Client로 실제 호출
  - 본인 사진 2장으로 Gemini 응답 확인
  - 프롬프트 품질 튜닝

### Day 4 — 로딩 + 결과 화면

- [ ] `LoadingAnalyzer.vue` (순차 텍스트 전환)
- [ ] `composables/useAnalyze.ts`
- [ ] `pages/analyzing.vue` (API 호출 + 결과 sessionStorage 저장 + 리다이렉트)
- [ ] `ResultScore.vue`, `ResultSection.vue`, `ResultLocked.vue` 컴포넌트
- [ ] `pages/result.vue`
  - sessionStorage 읽기
  - 3개 무료 + 7개 자물쇠 구조
  - 해금 상태 관리 (`ref`)
  - 조건부 렌더링
  - "다시 분석하기" 버튼

### Day 5 — 광고 + 공유

- [ ] AdSense 계정 신청 (승인 1~2주 걸리므로 이날 꼭 신청)
- [ ] `AdBanner.vue`, `AdInterstitial.vue` 작성 (승인 대기 중엔 플레이스홀더로)
- [ ] 결과 페이지에 광고 플레이스홀더 3개 배치
- [ ] `ShareCard.vue` 작성 (html-to-image 대상, 9:16 비율)
- [ ] `composables/useCardDownload.ts` + 다운로드 버튼
- [ ] 카카오 디벨로퍼스 계정 + JavaScript 앱 키 발급
- [ ] 카카오 SDK script를 `nuxt.config.ts` head에 추가
- [ ] `composables/useKakaoShare.ts` + 카카오 공유 버튼
- [ ] `AffiliateLinks.vue` (초기엔 플레이스홀더 링크, 나중에 실제 교체)

### Day 6 — 법적 페이지 + SEO + 분석

- [ ] `pages/terms.vue`, `pages/privacy.vue` 작성
- [ ] GA4 계정 생성 + 태그 삽입 (nuxt.config.ts head)
- [ ] Microsoft Clarity 계정 생성 + 태그 삽입
- [ ] `nuxt.config.ts`에 SEO 메타 태그 추가
  - title, description, og:image, twitter:card 등
- [ ] `public/og-image.png` 제작 (1200×630)
- [ ] `public/sample-result.png` 제작 (랜딩용 예시 카드)
- [ ] `public/favicon.ico` 제작
- [ ] 모든 페이지 모바일 반응형 검증 (Chrome DevTools)

### Day 7 — QA + 출시

- [ ] 지인 3~5명에게 베타 링크 공유
- [ ] 다양한 사진(셀카·정면·측면·조명 어두움 등)으로 테스트
- [ ] 에러 케이스 확인:
  - 사진 업로드 없이 submit 시도
  - API 실패 시 에러 메시지
  - 얼굴 인식 안 됨 (NO_FACE)
  - sessionStorage 비운 상태로 /result 직접 접속
- [ ] 프롬프트 1~2회 최종 튜닝
- [ ] 도메인 DNS를 Cloudflare Pages에 연결
- [ ] 네이버 예비신부 카페에 베타 후기 글 1개 작성
- [ ] 정식 출시 🎉

---

## 12. 법적 페이지 내용

### 12.1 이용약관 (`pages/terms.vue`) 핵심 조항

```markdown
# 이용약관

## 제1조 (목적)

본 약관은 [앱 이름] (이하 "서비스")의 이용 조건을 규정합니다. 본 서비스는 AI 기반 엔터테인먼트 콘텐츠를 제공합니다.

## 제2조 (사용자 의무)

- 본인 또는 동의를 받은 타인의 사진만 업로드합니다.
- 저작권 있는 사진의 무단 사용을 금지합니다.
- 본 서비스를 타인의 명예훼손이나 차별 목적으로 사용하지 않습니다.

## 제3조 (지적재산권)

- AI가 생성한 분석 결과는 사용자 개인적 용도로만 사용 가능합니다.
- 상업적 이용 시 별도 문의가 필요합니다.

## 제4조 (면책 조항)

- 본 서비스는 엔터테인먼트 목적이며, 분석 결과는 참고용입니다.
- 결혼·의료·법률·재정 등 중요한 의사결정은 전문가와 상담하세요.
- 서비스 이용으로 인한 어떠한 피해에 대해서도 운영자는 책임지지 않습니다.

## 제5조 (서비스의 변경 및 중단)

- 운영자는 사전 공지 없이 서비스를 변경하거나 중단할 수 있습니다.

## 제6조 (문의)

- 이메일: [문의 이메일]
```

### 12.2 개인정보처리방침 (`pages/privacy.vue`) 핵심 조항

```markdown
# 개인정보처리방침

## 1. 수집하는 정보

본 서비스는 다음 정보만 수집합니다.

- IP 주소 (부정 사용 방지 목적)
- 쿠키 (세션 관리 및 분석 목적)

## 2. 수집하지 않는 정보

본 서비스는 다음 정보를 수집하지 않습니다.

- 이름, 이메일, 전화번호
- 회원가입 정보 (회원가입 자체가 없음)

## 3. 업로드한 사진의 처리

- 사용자가 업로드한 사진은 **분석 즉시 폐기**되며 서버에 저장되지 않습니다.
- 분석 과정에서 Google Gemini API로 이미지가 전송됩니다. Google의 개인정보 처리 방침에 따라 처리됩니다.

## 4. 제3자 서비스

본 서비스는 다음 제3자 서비스를 사용합니다.

- Google Gemini API: AI 분석
- Google AdSense: 광고 게재
- Google Analytics: 트래픽 분석
- Microsoft Clarity: 사용자 경험 분석

각 서비스는 자체 쿠키를 사용할 수 있습니다.

## 5. 사용자의 권리

- 언제든지 브라우저 쿠키를 삭제하여 모든 데이터를 삭제할 수 있습니다.
- 문의: [이메일]

## 6. 변경 사항

본 방침이 변경될 경우 본 페이지에 공지합니다.

**최종 수정일**: [날짜]
```

---

## 13. `nuxt.config.ts` 완성본 예시

```typescript
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  nitro: {
    preset: "cloudflare-pages",
  },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      adsenseClient: process.env.NUXT_PUBLIC_ADSENSE_CLIENT,
      gaId: process.env.NUXT_PUBLIC_GA_ID,
      kakaoAppKey: process.env.NUXT_PUBLIC_KAKAO_APP_KEY,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
    },
  },
  app: {
    head: {
      title: "AI 결혼 관상 궁합",
      htmlAttrs: { lang: "ko" },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1",
        },
        {
          name: "description",
          content:
            "사진 2장으로 확인하는 AI 결혼 궁합. 상견례 전에 두 분의 궁합을 확인해보세요.",
        },
        { property: "og:title", content: "AI 결혼 관상 궁합" },
        { property: "og:description", content: "사진으로 보는 우리 궁합 점수" },
        { property: "og:image", content: "/og-image.png" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      link: [{ rel: "icon", href: "/favicon.ico" }],
      script: [
        // AdSense
        {
          src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NUXT_PUBLIC_ADSENSE_CLIENT}`,
          async: true,
          crossorigin: "anonymous",
        },
        // Kakao SDK
        {
          src: "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js",
          defer: true,
          integrity:
            "sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4",
          crossorigin: "anonymous",
        },
      ],
    },
  },
});
```

### Cloudflare Pages 설정

- 빌드 명령어: `npm run build`
- 출력 디렉토리: `.output/public`
- 환경 변수: `.env`의 모든 변수를 Cloudflare 대시보드에 등록
- Node.js 버전: 환경변수 `NODE_VERSION=20` 추가

---

## 14. Claude Code 작업 가이드

### 14.1 작업 순서 추천

이 문서를 컨텍스트로 주고 작업할 때 다음 순서를 따르세요:

1. `Day 1 체크리스트`부터 순서대로 진행
2. 한 번에 한 화면/기능만 작업
3. 각 작업 완료 후 브라우저에서 동작 확인
4. 막히면 이 문서의 해당 섹션을 다시 참조

### 14.2 코드 작성 원칙

- **Vue Composition API + `<script setup>` 필수**, Options API 사용 금지
- **TypeScript 사용**, `any` 최소화
- **함수형 컴포넌트 단순하게**, props 3개 이상이면 한 번 더 쪼갤지 고려
- **주석은 한국어** (이 프로젝트는 한국 서비스)
- **에러 처리는 유저에게 친절한 메시지**로

### 14.3 의존성 추가 시 규칙

- 핵심 기능(이미지 처리·카드 생성·카카오 공유·Gemini) 외 npm 패키지 추가 금지
- 디자인은 Tailwind + Nuxt UI 조합으로 해결
- 아이콘은 Nuxt UI에 포함된 Iconify 사용
- 상태관리 라이브러리 (Pinia 등) 도입 금지

### 14.4 테스트 금기

- 유닛테스트·통합테스트 작성 금지 (MVP 단계)
- 수동 테스트만으로 진행
- 타입 체크(`nuxi typecheck`) 정도면 충분

### 14.5 커밋 메시지 컨벤션

- `feat: [기능 설명]`
- `fix: [버그 수정]`
- `style: [디자인 변경]`
- `chore: [설정·의존성]`
- `docs: [문서 수정]`

---

## 15. 향후 확장 (MVP 이후, 참고용)

MVP 안정화 후 3~6개월 내 고려할 기능:

- 시부모 관상 분석 (사진 1장 추가 업로드)
- 상견례 체크리스트
- 결과 저장 기능 (이 시점에 Supabase 도입)
- 카카오 로그인
- Capacitor로 안드로이드 앱 패키징
- AdMob 연동 (앱 광고 eCPM 2~3배)

**주의**: 이 기능들은 MVP 성공(MAU 5,000+)을 확인한 후에만 진행. **미리 구현하지 말 것**.

---

**문서 버전**: 2.0 (저장 없는 단순 구조)  
**작성일**: 2026년 4월 21일  
**다음 업데이트**: MVP 출시 후 피드백 반영
