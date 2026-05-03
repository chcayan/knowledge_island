'use client'

import dynamic from 'next/dynamic'

const PublishPage = dynamic(() => import('./publish-page'), {
  ssr: false,
})

export default function Publish() {
  return <PublishPage />
}
