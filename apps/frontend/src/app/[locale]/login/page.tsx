'use client'

import dynamic from 'next/dynamic'

const LoginPage = dynamic(() => import('./login-page'), {
  ssr: false,
})

export default function LoginClientPage() {
  return <LoginPage />
}
