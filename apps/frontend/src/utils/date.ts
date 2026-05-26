/**
 * 格式化时间 根据年份是否显示年份信息
 * @param {string | Date} dateString
 * @returns
 */
export const formatDateByYear = function (dateString: string | Date): string {
  if (dateString === '') {
    return '2077-07-07 07:07:07'
  }
  const date = new Date(dateString)
  const now = new Date()

  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')

  if (date.getFullYear() === now.getFullYear()) {
    return `${month}-${day} ${hours}:${minutes}:${seconds}`
  } else {
    const year = date.getFullYear()
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
}

interface TimeUnitI18n {
  second: string
  minute: string
  hour: string
  day: string
}

export function formatRemainTimeWithText(
  remainSeconds: number,
  timeUnitI18n: TimeUnitI18n
) {
  if (remainSeconds <= 0) return `0 ${timeUnitI18n.second}`

  const day = Math.floor(remainSeconds / (60 * 60 * 24))
  const hour = Math.floor((remainSeconds % (60 * 60 * 24)) / (60 * 60))
  const minute = Math.floor((remainSeconds % (60 * 60)) / 60)
  const second = Math.floor(remainSeconds % 60)

  const result: string[] = []

  if (day > 0) result.push(`${day} ${timeUnitI18n.day}`)
  if (hour > 0) result.push(`${hour} ${timeUnitI18n.hour}`)
  if (minute > 0) result.push(`${minute} ${timeUnitI18n.minute}`)

  if (day === 0 && hour === 0 && minute === 0) {
    result.push(`${second} ${timeUnitI18n.second}`)
  }

  return result.join(' ')
}
