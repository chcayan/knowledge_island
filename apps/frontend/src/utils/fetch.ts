'use server'

import { BASE_URL } from '@/config/request'
import { cookies } from 'next/headers'

function isEmptyObject(obj: unknown) {
  return (
    obj != null &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    Object.keys(obj).length === 0
  )
}

interface FetchOptions {
  revalidate?: number | false
  cache?: 'force-cache' | 'no-store' | undefined
}

export async function fetchData(
  url: string,
  {
    params = {},
    options = { revalidate: 60, cache: undefined },
  }: {
    params?: object
    options?: FetchOptions
  } = {}
) {
  let res

  const fetchOptions = {
    cache: options.cache,
    next: {
      revalidate: options.revalidate,
    },
    headers: {
      Cookie: (await cookies()).toString(),
    },
  }

  if (isEmptyObject(params)) {
    res = await fetch(`${BASE_URL + url}`, fetchOptions)
  } else {
    const _params = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    )
    res = await fetch(`${BASE_URL + url}?${_params}`, fetchOptions)
  }

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || '请求失败')
  }

  const { data } = await res.json()
  return data
}
