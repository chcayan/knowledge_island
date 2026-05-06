import { ImageCompressOptions } from '@/types/compress'
import { getExt } from '@/utils/compress'

self.onmessage = async (e: MessageEvent) => {
  const { file, options } = e.data

  try {
    const result = await compress(file, options)
    self.postMessage({ success: true, file: result })
  } catch (err) {
    self.postMessage({ success: false, error: err })
  }
}

const compress = async (
  file: File,
  options?: ImageCompressOptions
): Promise<File> => {
  const { quality = 0.8, type = 'image/webp', maxWidth = 1920 } = options || {}

  if (file.size < 128 * 1024) {
    return Promise.resolve(file)
  }

  const bitmap = await createImageBitmap(file)

  let { width, height } = bitmap

  if (width > maxWidth) {
    height = (maxWidth / width) * height
    width = maxWidth
  }

  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('Canvas not supported')

  ctx.drawImage(bitmap, 0, 0, width, height)

  const blob = await canvas.convertToBlob({
    type,
    quality,
  })

  const ext = getExt(type)

  return new File([blob], file.name.replace(/\.\w+$/, ext), { type })
}
