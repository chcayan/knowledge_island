'use client'

import { useRouter } from 'next/navigation'

export default function BackButton({ path }: { path?: string }) {
  const router = useRouter()

  const handleBack = () => {
    if (path) {
      router.push(path)
    } else {
      router.back()
    }
  }
  return (
    <button
      tabIndex={0}
      className="tab-focus"
      onClick={handleBack}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: 'var(--theme-secondary-color)',
        flexShrink: 0,
        fontWeight: 'bold',
        fontSize: '20px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <p
        style={{
          transform: 'translateY(-2px)',
        }}
      >
        {'<'}
      </p>
    </button>
  )
}
