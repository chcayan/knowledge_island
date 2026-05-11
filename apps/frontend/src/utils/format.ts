export function formatCount(num: number): string {
  if (num >= 10000) {
    return `${removeTrailingZero(num / 10000)}w`
  }

  if (num >= 1000) {
    return `${removeTrailingZero(num / 1000)}k`
  }

  return String(num)
}

function removeTrailingZero(num: number): string {
  return Number(num.toFixed(1)).toString()
}
