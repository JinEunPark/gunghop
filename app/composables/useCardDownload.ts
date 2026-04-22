import { captureCardBlob } from './useCardCapture'

export function useCardDownload() {
  const downloading = ref(false)
  const error = ref<string | null>(null)

  async function downloadCard(el: HTMLElement, filename = 'nyangsang-result.png') {
    downloading.value = true
    error.value = null
    try {
      const blob = await captureCardBlob(el)
      const file = new File([blob], filename, { type: 'image/png' })

      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({ files: [file] })
          return
        } catch (e) {
          if (e instanceof Error && e.name === 'AbortError') return
        }
      }

      const url = URL.createObjectURL(blob)
      try {
        const link = document.createElement('a')
        link.download = filename
        link.href = url
        link.click()
      } finally {
        setTimeout(() => URL.revokeObjectURL(url), 1000)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'DOWNLOAD_FAILED'
      throw e
    } finally {
      downloading.value = false
    }
  }

  return { downloading, error, downloadCard }
}
