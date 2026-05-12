'use client'

/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from 'react'
import { $getNodeByKey, LexicalEditor } from 'lexical'
import { ImageNode } from '../nodes/image-node'

export default function ImageComponent({
  src,
  alt,
  width,
  nodeKey,
  editor,
}: {
  src: string
  alt: string
  width: number
  nodeKey: string
  editor: LexicalEditor
}) {
  const [hovered, setHovered] = useState(false)

  const [tempWidth, setTempWidth] = useState<number | null>(null)

  const currentWidthRef = useRef(width)

  const displayWidth = tempWidth ?? width

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault()

    const startX = e.clientX
    const startWidth = displayWidth

    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX

      const nextWidth = Math.min(100, Math.max(20, startWidth + delta / 5))

      currentWidthRef.current = nextWidth

      setTempWidth(nextWidth)
    }

    const onUp = () => {
      const finalWidth = currentWidthRef.current

      editor.update(
        () => {
          const node = $getNodeByKey(nodeKey)

          if (node instanceof ImageNode) {
            node.setWidth(finalWidth)
          }
        },
        {
          tag: 'resize-image',
        }
      )

      setTempWidth(null)

      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width: `${displayWidth}%`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        style={{
          width: '100%',
          display: 'block',
          borderRadius: '10px',
          userSelect: 'none',
          outline: hovered
            ? '3px solid var(--theme-toolbar-scrollbar-thumb-color)'
            : '2px solid transparent',
          transition: 'outline 0.15s ease',
          boxSizing: 'border-box',
        }}
      />
      <div
        onMouseDown={startResize}
        style={{
          position: 'absolute',
          right: -6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 12,
          height: 48,
          borderRadius: 999,
          background: hovered
            ? 'var(--theme-toolbar-scrollbar-thumb-color)'
            : 'transparent',
          cursor: 'ew-resize',
          opacity: hovered ? 1 : 0,
          transition: 'all 0.15s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 5,
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 12,
          padding: '2px 8px',
          borderRadius: 999,
          background: '#111827',
          color: '#fff',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.15s ease',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {Math.round(displayWidth)}%
      </div>
    </div>
  )
}
