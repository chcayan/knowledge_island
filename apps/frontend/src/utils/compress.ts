import { ImageCompressOptions } from '@/types/compress'
import { CustomError } from './error'
import { GIF_SIZE_LIMIT } from '@/config/post-field'

export const getExt = (type: string) => {
  if (type.includes('webp')) return '.webp'
  if (type.includes('avif')) return '.avif'
  if (type.includes('png')) return '.png'
  return '.jpg'
}

const compressImageInMainThread = (
  file: File,
  options?: ImageCompressOptions
): Promise<File> => {
  const { quality = 0.8, type = 'image/webp', maxWidth = 1920 } = options || {}

  if (file.size < 128 * 1024) {
    return Promise.resolve(file)
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => {
      img.src = reader.result as string
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) return reject(new Error('Canvas not supported'))

      let { width, height } = img

      if (width > maxWidth) {
        height = (maxWidth / width) * height
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Compression failed'))

          const ext = getExt(type)

          resolve(new File([blob], file.name.replace(/\.\w+$/, ext), { type }))
        },
        type,
        quality
      )
    }

    img.onerror = reject
  })
}

const compressImageInWorker = (
  file: File,
  options?: ImageCompressOptions
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('../workers/image-worker.ts', import.meta.url),
      {
        type: 'module',
      }
    )

    worker.postMessage({ file, options })

    worker.onmessage = (e) => {
      const { success, file, error } = e.data

      if (success) {
        resolve(file)
      } else {
        reject(error)
      }

      worker.terminate()
    }

    worker.onerror = reject
  })
}

export const compressImage = async (
  file: File,
  options?: ImageCompressOptions
) => {
  if (!file) {
    console.error('请上传文件')
    return
  }

  if (file.type === 'image/gif') {
    if (file.size / 1024 / 1024 < GIF_SIZE_LIMIT) {
      return file
    } else {
      throw new CustomError(`gif 大小不超过 ${GIF_SIZE_LIMIT}M`, {
        type: 'GIF_SIZE_LIMIT',
      })
    }
  }

  const canUseWorker =
    typeof window !== 'undefined' &&
    'OffscreenCanvas' in window &&
    'createImageBitmap' in window

  if (canUseWorker) {
    try {
      return await compressImageInWorker(file, options)
    } catch (err) {
      console.warn('use worker failed, toggle to main thread', err)
      return await compressImageInMainThread(file, options)
    }
  }

  return await compressImageInMainThread(file, options)
}
