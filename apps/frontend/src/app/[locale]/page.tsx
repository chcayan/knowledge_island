// import { useTranslations } from 'next-intl'
// import styles from './page.module.scss'
import { Search } from '@/components/common/search'

export default function Home() {
  // const t = useTranslations('HomePage')

  return (
    <>
      <span></span>
      {/* TODO: 取消意外的自动聚焦 */}
      <Search />
    </>
  )
}
