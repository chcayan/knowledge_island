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

export function htmlToDescription(html: string) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 150)
}

export function getFirstText(html: string): string {
  const matches = html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/gi) ?? []

  for (const p of matches) {
    const text = p
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()

    if (text) return text
  }

  return ''
}
