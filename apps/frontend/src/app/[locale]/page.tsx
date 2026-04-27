// import { useTranslations } from 'next-intl'
// import styles from './page.module.scss'
import Search from '@/components/common/search'
import ThemeToggle from '@/components/layout/theme-toggle'
import styles from './page.module.scss'

export default function Home() {
  // const t = useTranslations('HomePage')

  return (
    <>
      <div className={styles.home}>
        <main className={styles.main}>
          <span></span>
          {/* TODO: 取消意外的自动聚焦 */}
          <Search />
        </main>
        <aside className={styles.aside}>
          <ThemeToggle />
        </aside>
      </div>
    </>
  )
}
