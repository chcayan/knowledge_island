import Search from '@/components/common/search'
import ThemeToggle from '@/components/layout/theme-toggle'
import styles from './page.module.scss'
import { getPostAPI } from '@/api'
import { PostInfo } from '@knowledge_island/schemas'

export default async function Home() {
  // const t = useTranslations('HomePage')
  const res = await getPostAPI(1, 10)
  const total: number = res.data.data.total
  const list: PostInfo[] = res.data.data.list
  // console.log(list)

  return (
    <>
      <div className={styles.home}>
        <main className={styles.main}>
          <Search />
          <div className={styles['post-list']}>
            {list.map((post) => (
              <div
                style={{
                  margin: '20px 0',
                  backgroundColor: '#eee',
                  padding: '10px',
                }}
                key={post.id}
              >
                <p>{post.title}</p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.contentHtml,
                  }}
                  style={{
                    fontSize: '15px',
                  }}
                />
              </div>
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
