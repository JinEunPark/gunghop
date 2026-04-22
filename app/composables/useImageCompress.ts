import imageCompression from 'browser-image-compression'

export function useImageCompress() {
  async function compressToDataUrl(file: File): Promise<string> {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 384,
      useWebWorker: true,
      fileType: 'image/jpeg',
      initialQuality: 0.8
    })
    return await imageCompression.getDataUrlFromFile(compressed)
  }

  return { compressToDataUrl }
}
