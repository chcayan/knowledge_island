import { useTranslations } from 'next-intl'
import styles from './page.module.scss'

export default function Home() {
  const t = useTranslations('HomePage')

  return (
    <>
      <h1 className={styles.h1}>{t('title')}</h1>
    </>
  )
}
