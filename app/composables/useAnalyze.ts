import type { AnalysisResult, AnalyzeErrorCode } from '~~/shared/types/analysis'

export type AnalyzeError = {
  code: AnalyzeErrorCode
  message: string
}

export function useAnalyze() {
  const loading = ref(false)
  const error = ref<AnalyzeError | null>(null)

  async function analyze(imageA: string, imageB: string): Promise<AnalysisResult> {
    loading.value = true
    error.value = null
    try {
      const result = await $fetch<AnalysisResult>('/api/analyze', {
        method: 'POST',
        body: { image_a: imageA, image_b: imageB }
      })
      return result
    } catch (e: unknown) {
      const fe = e as { data?: { error?: AnalyzeErrorCode; message?: string } }
      const code = fe.data?.error ?? 'AI_ERROR'
      const message = fe.data?.message ?? '분석에 실패했어요. 잠시 후 다시 시도해주세요.'
      error.value = { code, message }
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return { loading, error, analyze }
}
