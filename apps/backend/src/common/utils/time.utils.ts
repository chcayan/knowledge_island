export function calculateRemainTime(time: Date | string | number) {
  const remainTime = new Date(time).getTime() - Date.now()

  if (remainTime <= 0) return 0

  return Math.floor(remainTime / 1000)
}
