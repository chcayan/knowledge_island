import Search from '@/components/common/search'
import ThemeToggle from '@/components/layout/theme-toggle'
import styles from './page.module.scss'
import { getPostAPI } from '@/api'
import { PostInfo } from '@knowledge_island/schemas'
import PostCard from '@/components/home/post-card'

export default async function Home() {
  // const t = useTranslations('HomePage')
  const { list, total } = await getPostAPI(1, 10)

  // const total: number = res.data.data.total
  // const list: PostInfo[] = res.data.data.list
  // console.log(list)

  return (
    <>
      <div className={styles.home}>
        <main className={styles.main}>
          <Search />
          <div className={styles['post-list']}>
            {list.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </main>
        <aside className={styles.aside}>
          <ThemeToggle />
        </aside>
      </div>
    </>
  )
}
