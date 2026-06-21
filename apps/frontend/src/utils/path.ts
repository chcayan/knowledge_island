export function buildHref(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  key?: string,
  value?: string,
  resetKeys?: string[]
) {
  if (!searchParams) return
  const params = new URLSearchParams(
    Object.entries(searchParams).reduce(
      (acc, [k, v]) => {
        if (typeof v === 'string') acc.push([k, v])
        return acc
      },
      [] as [string, string][]
    )
  )

  if (resetKeys && resetKeys.length > 0) {
    resetKeys.forEach((key) => params.delete(key))
  }

  if (!key || !value) {
    return params.toString()
  }

  params.set(key, value)

  return `?${params.toString()}`
}
