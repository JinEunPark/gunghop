import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'
import type { AnalysisResult, AnalyzeErrorBody } from '../../shared/types/analysis'
import { SYSTEM_PROMPT, USER_PROMPT } from '../utils/prompts'
import { validateResult } from '../utils/validateResult'

type BodyIn = { image_a?: unknown; image_b?: unknown }

type RateState = { count: number; resetAt: number }
const RATE_WINDOW_MS = 24 * 60 * 60 * 1000
const RATE_LIMIT = 10
const ipHits = new Map<string, RateState>()

const DATA_URL_RE = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/
const MAX_BYTES = 2 * 1024 * 1024

function parseDataUrl(dataUrl: string): { mimeType: string; data: string; bytes: number } | null {
  const match = dataUrl.match(DATA_URL_RE)
  if (!match) return null
  const mimeType = match[1]!
  const data = match[2]!
  const bytes = Math.floor((data.length * 3) / 4)
  return { mimeType, data, bytes }
}

function errJson(
  event: Parameters<typeof setResponseStatus>[0],
  status: number,
  body: AnalyzeErrorBody
) {
  setResponseStatus(event, status)
  return body
}

function sweepExpired(now: number) {
  if (ipHits.size < 500) return
  for (const [k, v] of ipHits) {
    if (v.resetAt <= now) ipHits.delete(k)
  }
}

function checkRateLimit(ip: string): { ok: boolean; retryAtMs?: number } {
  const now = Date.now()
  sweepExpired(now)
  const state = ipHits.get(ip)
  if (!state || state.resetAt <= now) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return { ok: true }
  }
  if (state.count >= RATE_LIMIT) return { ok: false, retryAtMs: state.resetAt }
  state.count += 1
  return { ok: true }
}

async function callGemini(
  apiKey: string,
  modelName: string,
  imageA: { mimeType: string; data: string },
  imageB: { mimeType: string; data: string }
): Promise<unknown> {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH }
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      maxOutputTokens: 5120,
      temperature: 0.75
    }
  })

  const result = await model.generateContent([
    { text: USER_PROMPT },
    { inlineData: { mimeType: imageA.mimeType, data: imageA.data } },
    { inlineData: { mimeType: imageB.mimeType, data: imageB.data } }
  ])

  const text = result.response.text()
  console.log('[analyze] Gemini raw response (first 500 chars):', text.slice(0, 500))

  try {
    return JSON.parse(text)
  } catch (e) {
    console.error('[analyze] JSON parse failed. Full text:', text)
    throw e
  }
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const apiKey = config.geminiApiKey
  const modelName = config.geminiModel
  if (!apiKey) {
    return errJson(event, 500, {
      error: 'AI_ERROR',
      message: 'API 키가 설정되지 않았어요. 관리자에게 문의해주세요.'
    })
  }

  const body = (await readBody<BodyIn>(event)) ?? {}
  const imageA = typeof body.image_a === 'string' ? body.image_a : ''
  const imageB = typeof body.image_b === 'string' ? body.image_b : ''

  const parsedA = parseDataUrl(imageA)
  const parsedB = parseDataUrl(imageB)
  if (!parsedA || !parsedB) {
    return errJson(event, 400, {
      error: 'BAD_REQUEST',
      message: '이미지 형식이 올바르지 않아요. (JPEG/PNG/WEBP만 지원)'
    })
  }
  if (parsedA.bytes > MAX_BYTES || parsedB.bytes > MAX_BYTES) {
    return errJson(event, 400, {
      error: 'BAD_REQUEST',
      message: '이미지 크기가 너무 커요. 다시 업로드해주세요.'
    })
  }

  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const rl = checkRateLimit(ip)
  if (!rl.ok) {
    return errJson(event, 429, {
      error: 'RATE_LIMIT',
      message: '오늘 사용 한도를 초과했어요. 내일 다시 시도해주세요.'
    })
  }

  let raw: unknown = null
  let callError: string | null = null
  const MAX_ATTEMPTS = 3
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      raw = await callGemini(apiKey, modelName, parsedA, parsedB)
      callError = null
      break
    } catch (e) {
      callError = e instanceof Error ? e.message : String(e)
      console.error(`[analyze] Gemini call failed (attempt ${attempt + 1}/${MAX_ATTEMPTS})`, callError)
      if (attempt < MAX_ATTEMPTS - 1) {
        const delayMs = 800 * Math.pow(2, attempt)
        await new Promise((r) => setTimeout(r, delayMs))
      }
    }
  }

  if (callError !== null) {
    return errJson(event, 502, {
      error: 'AI_ERROR',
      message: '분석에 실패했어요. 잠시 후 다시 시도해주세요.'
    })
  }

  const check = validateResult(raw)
  if (check.valid) {
    return check.data satisfies AnalysisResult
  }
  if (check.error === 'NO_FACE') {
    return errJson(event, 422, {
      error: 'NO_FACE',
      message: '사진에서 얼굴을 찾을 수 없어요. 정면 사진으로 다시 시도해주세요.'
    })
  }

  console.error('[analyze] validation failed', {
    error: check.error,
    rawPreview: typeof raw === 'object' ? JSON.stringify(raw).slice(0, 400) : raw
  })
  return errJson(event, 502, {
    error: 'AI_ERROR',
    message: '분석에 실패했어요. 잠시 후 다시 시도해주세요.'
  })
})
