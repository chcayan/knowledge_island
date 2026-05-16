import { BASE_URL } from '@/config/request'

export const getImgUrl = (url: string) => {
  if (url && url.indexOf('http') == -1) {
    return BASE_URL + url
  } else {
    return url
  }
}
