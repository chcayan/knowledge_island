import { locale } from '@/types/locale'
import styles from './page.module.scss'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getUserInfoServerAPI } from '@/api'
import { UserPostFilter } from '@knowledge_island/schemas'
import BackButton from '@/components/common/back-button'
import UserControl from '@/components/common/user-control/user-control'
import UserCard from '@/components/my/user-card/user-card'
import ToggleButton from '@/components/common/toggle-button-server/toggle-button-server'
import { Suspense } from 'react'
import CardListSkeleton from '@/components/common/card-list-skeleton/card-list-skeleton'
import PostList from '@/components/user/post-list/post-list'

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<{
    locale: locale
    id: string
  }>
}>): Promise<Metadata> {
  const { locale, id } = await params
  const t = await getTranslations({
    locale,
    namespace: 'Metadata.user',
  })

  const userInfo = await getUserInfoServerAPI(id).catch(() => {})

  return {
    title: t('title', {
      name: (userInfo && userInfo.name) || 'guest',
    }),
  }
}

export default async function UserPage(props: {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    page?: string
    filter?: UserPostFilter
  }>
}) {
  const t = await getTranslations('My')
  const searchParams = await props.searchParams
  const page = Number(searchParams?.page ?? 1)
  const filter = searchParams?.filter || UserPostFilter.PUBLISHED

  const params = await props.params

  return (
    <>
      <div className={styles.user}>
        <header className={styles.head}>
          <div className={styles['head-left']}>
            <BackButton />
            {/* <Search /> */}
          </div>
          <div className={styles['user-control']}>
            <UserControl />
          </div>
        </header>
        <main className={styles.main}>
          <div className={styles.user}>
            <UserCard userId={params.id} />
          </div>
          <aside className={styles.aside}>
            <div className={styles.toggle}>
              <ToggleButton
                value={filter}
                options={[
                  {
                    label: t('tab.published'),
                    value: UserPostFilter.PUBLISHED,
                  },
                  {
                    label: t('tab.collected'),
                    value: UserPostFilter.COLLECTION,
                  },
                ]}
              />
            </div>

            <Suspense key={page} fallback={<CardListSkeleton />}>
              <PostList userId={params.id} searchParams={props.searchParams} />
            </Suspense>
          </aside>
        </main>
      </div>
    </>
  )
}
