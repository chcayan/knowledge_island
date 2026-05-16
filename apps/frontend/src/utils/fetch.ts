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

export async function fetchData(
  url: string,
  { params = {} }: { params?: object } = {}
) {
  let res

  if (isEmptyObject(params)) {
    res = await fetch(`${BASE_URL + url}`, {
      next: {
        revalidate: 60,
      },
      headers: {
        Cookie: (await cookies()).toString(),
      },
    })
  } else {
    const _params = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    )
    res = await fetch(`${BASE_URL + url}?${_params}`, {
      next: {
        revalidate: 60,
      },
      headers: {
        Cookie: (await cookies()).toString(),
      },
    })
  }

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || '请求失败')
  }

  const { data } = await res.json()
  return data
}
