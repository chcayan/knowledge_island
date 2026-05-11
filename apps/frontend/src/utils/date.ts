/**
 * 格式化时间 根据年份是否显示年份信息
 * @param {string} dateString
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
