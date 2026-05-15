'use client'

import { useEffect } from 'react'

export default function ScrollRestoration() {
  useEffect(() => {
    // 恢复滚动位置
    const savedPosition = sessionStorage.getItem('home-scroll-pos')
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition, 10))
    }

    // 监听滚动位置
    let timeoutId: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        sessionStorage.setItem('home-scroll-pos', window.scrollY.toString())
      }, 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(timeoutId)
    }
  }, [])

  return null
}
