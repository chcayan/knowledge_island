'use client'

import { useTheme } from '@wrksz/themes/client'

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()

  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <div>
      <p>当前主题：{currentTheme}</p>

      <button onClick={() => setTheme('light')}>浅色</button>
      <button onClick={() => setTheme('dark')}>深色</button>
      <button onClick={() => setTheme('system')}>跟随系统</button>
    </div>
  )
}
