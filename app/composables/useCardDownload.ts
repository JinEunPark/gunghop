import { captureCardDataUrl } from './useCardCapture'

export function useCardDownload() {
  const downloading = ref(false)
  const error = ref<string | null>(null)

  async function downloadCard(el: HTMLElement, filename = 'nyangsang-result.png') {
    downloading.value = true
    error.value = null
    try {
      const dataUrl = await captureCardDataUrl(el)
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      link.click()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'DOWNLOAD_FAILED'
      throw e
    } finally {
      downloading.value = false
    }
  }

  return { downloading, error, downloadCard }
}
