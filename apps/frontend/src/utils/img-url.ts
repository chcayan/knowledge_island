import { baseURL } from './request'

export const getImgUrl = (url: string) => {
  if (url && url.indexOf('http') == -1) {
    return baseURL + url
  } else {
    return url
  }
}
