import { BASE_URL } from '@/config/request'

export const getImgUrl = (url: string) => {
  if (url && url.indexOf('http') == -1) {
    return BASE_URL + url
  } else {
    return url
  }
}

export function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const dimensions = { width: img.naturalWidth, height: img.naturalHeight }
      URL.revokeObjectURL(url)
      resolve(dimensions)
    }

    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }

    img.src = url
  })
}
