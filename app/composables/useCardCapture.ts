import { toBlob, toPng } from 'html-to-image'

const CAPTURE_OPTIONS = {
  pixelRatio: 1,
  cacheBust: true,
  backgroundColor: '#FDF2F8',
  skipFonts: false
} as const

async function waitForCardReady(el: HTMLElement): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    try {
      await document.fonts.ready
    } catch {
      // ignore font load failures and proceed
    }
  }

  const imgs = Array.from(el.querySelectorAll('img'))
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) return resolve()
          const done = () => resolve()
          img.addEventListener('load', done, { once: true })
          img.addEventListener('error', done, { once: true })
          setTimeout(done, 3000)
        })
    )
  )

  await new Promise((r) => requestAnimationFrame(() => r(null)))
}

function dimensions(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  return { width: Math.round(rect.width), height: Math.round(rect.height) }
}

export async function captureCardBlob(el: HTMLElement): Promise<Blob> {
  await waitForCardReady(el)
  const blob = await toBlob(el, { ...CAPTURE_OPTIONS, ...dimensions(el) })
  if (!blob) throw new Error('BLOB_FAILED')
  return blob
}

export async function captureCardDataUrl(el: HTMLElement): Promise<string> {
  await waitForCardReady(el)
  return toPng(el, { ...CAPTURE_OPTIONS, ...dimensions(el) })
}

export { waitForCardReady }
