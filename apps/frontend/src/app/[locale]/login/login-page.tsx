'use client'
import LogoIcon from '@/components/icon/logo-icon'
import styles from './login.module.scss'
import { SubmitEvent, useState } from 'react'

const themeColor = 'var(--theme-font-color)'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(
    null
  )

  const handleLogin = (e: SubmitEvent) => {
    e.preventDefault()
    console.log('submit')
  }

  return (
    <>
      <div className={styles.login}>
        <div className={styles.left}>
          <LogoIcon width={500} height={500} />
        </div>
        <div className={styles.right}>
          <form onSubmit={handleLogin} className={styles['form-wrapper']}>
            <div className={styles.logo}>{'✦'}</div>
            <h1 className={styles.title}>欢迎回来</h1>
            <p className={styles.subtitle}>Hi~ o(*￣▽￣*)ブ</p>
            <div className={styles['input-group']}>
              <label className={styles.label}>邮箱</label>
              <div className={styles['input-wrapper']}>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
                <div
                  className={styles['focus-line']}
                  style={{
                    width: focusedField === 'email' ? '100%' : '0%',
                    backgroundColor: themeColor,
                  }}
                />
              </div>
            </div>
            <div className={styles['input-group']}>
              <label className={styles.label}>密码</label>
              <div className={styles['input-wrapper']}>
                <div className={styles['password-container']}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={'请输入密码'}
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    minLength={6}
                    maxLength={7}
                  />
                  <p
                    className={styles['eye-icon']}
                    style={{
                      color: showPassword ? themeColor : '#999',
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? '隐藏密码' : '显示密码'}
                  >
                    {showPassword ? '( •̀ ω •́ )' : '( -_- )'}
                  </p>
                </div>
                <div
                  className={styles['focus-line']}
                  style={{
                    width: focusedField === 'password' ? '100%' : '0%',
                    backgroundColor: themeColor,
                  }}
                />
              </div>
            </div>
            <button className={styles['login-btn']}>登录</button>
          </form>
        </div>
      </div>
    </>
  )
}
