'use client'
import LogoIcon from '@/components/icon/logo-icon'
import styles from './login.module.scss'
import { SubmitEvent, useState } from 'react'
import { loginAPI, registerAPI } from '@/api'
import { Toast } from '@/utils/toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
  USER_PASSWORD_REGEX_FOR_INPUT_ELEMENT,
} from '@knowledge_island/schemas'
import LoadingButton from '@/components/common/loading-button/loading-button'
import { useUserStore } from '@/stores'

const themeColor = 'var(--theme-font-color)'

export default function LoginPage() {
  const t = useTranslations('Login')

  const [type, setType] = useState<'login' | 'register'>('login')

  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(
    null
  )

  const setUserId = useUserStore.getState().setUserId

  async function login() {
    setLoading(true)

    try {
      const { id } = await loginAPI({
        email,
        password,
      })

      Toast.show({
        msg: t('event.loginSuccess'),
        type: 'success',
      })

      setUserId(id)
      setEmail('')
      setPassword('')

      const redirect = searchParams.get('redirect')
      router.replace(redirect || '/')
    } catch {
      /* empty */
    } finally {
      setLoading(false)
    }
  }

  async function register() {
    setLoading(true)

    try {
      await registerAPI({
        email,
        password,
      })

      Toast.show({
        msg: t('event.registerSuccess'),
        type: 'success',
      })

      setEmail('')
      setPassword('')
      setType('login')
    } catch {
      /* empty */
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (e: SubmitEvent) => {
    e.preventDefault()
    if (type === 'login') {
      login()
    } else {
      register()
    }
  }

  const checkEmail = (e: React.InputEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    if (input.validity.valueMissing) {
      input.setCustomValidity(`${t('form.emailEmptyHint')} w(ﾟДﾟ)w`)
    } else if (input.validity.typeMismatch) {
      input.setCustomValidity(`${t('form.emailInvalidHint')} ( •̀ .̫ •́ )✧`)
    } else {
      input.setCustomValidity('')
    }
  }

  const checkPassword = (e: React.InputEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    if (input.validity.valueMissing) {
      input.setCustomValidity(`${t('form.pwdEmptyHint')} w(ﾟДﾟ)w`)
    } else if (input.validity.patternMismatch) {
      input.setCustomValidity(`${t('form.pwdInvalidHint')} ( •̀ .̫ •́ )✧`)
    } else {
      input.setCustomValidity('')
    }
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
            <h1 className={styles.title}>
              {type === 'login' ? t('title.login') : t('title.register')}
            </h1>
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
                  onInvalid={checkEmail}
                  onInput={checkEmail}
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
                    minLength={USER_PASSWORD_MIN_LENGTH}
                    maxLength={USER_PASSWORD_MAX_LENGTH}
                    pattern={USER_PASSWORD_REGEX_FOR_INPUT_ELEMENT}
                    onInput={checkPassword}
                    onInvalid={checkPassword}
                  />
                  <button
                    type={'button'}
                    className={`${styles['eye-icon']} tab-focus`}
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
                  </button>
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
            <LoadingButton
              text={type === 'login' ? t('form.login') : t('form.register')}
              loading={loading}
              disabled={loading}
              style={{
                width: '100%',
                height: '55px',
                backgroundColor: 'var(--theme-secondary-color)',
                fontWeight: 'bold',
                fontSize: '16px',
              }}
              type={'submit'}
            />
            {type === 'login' ? (
              <div className={styles.type}>
                <p>{t('form.registerHint')}</p>
                <button
                  disabled={loading}
                  className="tab-focus"
                  onClick={() => setType('register')}
                  type={'button'}
                  style={{
                    cursor: loading ? 'not-allowed' : '',
                  }}
                >
                  {t('form.registerType')}
                </button>
              </div>
            ) : (
              <div className={styles.type}>
                <p>{t('form.loginHint')}</p>
                <button
                  disabled={loading}
                  className="tab-focus"
                  onClick={() => setType('login')}
                  type={'button'}
                  style={{
                    cursor: loading ? 'not-allowed' : '',
                  }}
                >
                  {t('form.loginType')}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  )
}
