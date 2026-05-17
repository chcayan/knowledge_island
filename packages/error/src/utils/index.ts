export function defineErrorCode<T extends Record<string, number>>(obj: T): T {
  const values = Object.values(obj)

  const duplicated = values.find((v, i) => values.indexOf(v) !== i)

  if (duplicated) {
    throw new Error(`Duplicate error code: ${duplicated}`)
  }

  return obj
}
