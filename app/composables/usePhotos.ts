import type { AnalysisResult } from '~~/shared/types/analysis'

const PHOTO_A_KEY = 'photoA'
const PHOTO_B_KEY = 'photoB'
const RESULT_KEY = 'analysisResult'

function read(key: string): string | null {
  if (import.meta.server) return null
  return sessionStorage.getItem(key)
}

function write(key: string, value: string | null) {
  if (import.meta.server) return
  if (value === null) sessionStorage.removeItem(key)
  else sessionStorage.setItem(key, value)
}

export function usePhotos() {
  const photoA = ref<string | null>(null)
  const photoB = ref<string | null>(null)

  onMounted(() => {
    photoA.value = read(PHOTO_A_KEY)
    photoB.value = read(PHOTO_B_KEY)
  })

  watch(photoA, (v) => write(PHOTO_A_KEY, v))
  watch(photoB, (v) => write(PHOTO_B_KEY, v))

  function reset() {
    photoA.value = null
    photoB.value = null
    write(RESULT_KEY, null)
  }

  return { photoA, photoB, reset }
}

export function getStoredPhotos() {
  return {
    photoA: read(PHOTO_A_KEY),
    photoB: read(PHOTO_B_KEY)
  }
}

export function saveAnalysisResult(result: AnalysisResult) {
  write(RESULT_KEY, JSON.stringify(result))
}

export function getStoredAnalysisResult(): AnalysisResult | null {
  const raw = read(RESULT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AnalysisResult
  } catch {
    return null
  }
}

export function clearAnalysisResult() {
  write(RESULT_KEY, null)
}
