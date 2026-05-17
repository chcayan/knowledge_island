'use client'
import LogoIcon from '@/components/icon/logo-icon'
import styles from './login.module.scss'
import { SubmitEvent, useState } from 'react'
import { loginAPI } from '@/api'
import { Toast } from '@/utils/toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

const themeColor = 'var(--theme-font-color)'

export default function LoginPage() {
  const t = useTranslations('Login')

  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(
    null
  )

  async function login() {
    await loginAPI({
      email,
      password,
    })
    Toast.show({
      msg: t('event.success'),
      type: 'success',
    })

    const redirect = searchParams.get('redirect')
    router.replace(redirect || '/')
  }

  const handleLogin = (e: SubmitEvent) => {
    e.preventDefault()
    login()
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
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>Hi~ o(*￣▽￣*)ブ</p>
            <div className={styles['input-group']}>
              <label className={styles.label}>{t('form.email')}</label>
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
              <label className={styles.label}>{t('form.password')}</label>
              <div className={styles['input-wrapper']}>
                <div className={styles['password-container']}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('form.pwdInputHint')}
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    minLength={6}
                    maxLength={20}
                  />
                  <p
                    className={styles['eye-icon']}
                    style={{
                      color: showPassword ? themeColor : '#999',
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                    title={
                      showPassword
                        ? t('form.hidePwdHint')
                        : t('form.displayPwdHint')
                    }
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
            <button className={styles['login-btn']}>{t('form.login')}</button>
          </form>
        </div>
      </div>
    </>
  )
}
