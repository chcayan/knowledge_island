'use client'

import { useUserStore } from '@/stores'
import { useEffect } from 'react'

export default function StoreInitial() {
  useEffect(() => {
    useUserStore.getState().init()
  }, [])
  return null
}
