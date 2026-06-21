import styles from './page.module.scss'
import { redirect } from 'next/navigation'
import { POST_PAGE_SIZE } from '@/config/post-field'
import { getSearchResultAPI } from '@/api'
import { PostInfo, SearchType, UserPublic } from '@knowledge_island/schemas'
import Search from '@/components/common/search/search'
import UserControl from '@/components/common/user-control/user-control'
import BackButton from '@/components/common/back-button'
import PostCard from '@/components/home/post-card/post-card'
import Pagination from '@/components/common/pagination/pagination'
import ToggleButton from '@/components/common/toggle-button-server/toggle-button-server'

interface Props {
  searchParams: Promise<{
    result: string
    type?: SearchType
    page?: string
  }>
}

function checkFilterValid(type: SearchType | undefined) {
  const filterArr = [SearchType.POST, SearchType.TAG, SearchType.USER]

  if (!type) {
    return SearchType.POST
  }

  if (filterArr.includes(type)) {
    return type
  } else {
    redirect('/')
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams

  const page = Number(params?.page ?? 1)
  const pageSize = POST_PAGE_SIZE
  const type = checkFilterValid(params.type) || SearchType.POST

  const { list, total } = await getSearchResultAPI(
    params.result,
    type,
    page,
    pageSize
  )

  // if (total) {
  //   const totalPages = Math.ceil(total / pageSize)

  //   if (page > totalPages) {
  //     redirect('/')
  //   }

  //   return (
  //     <>
  //       <div className={styles['post-list']}>
  //         <ToggleButton
  //           value={type}
  //           options={[
  //             {
  //               label: 'post',
  //               value: SearchType.POST,
  //             },
  //             {
  //               label: 'tag',
  //               value: SearchType.TAG,
  //             },
  //             {
  //               label: 'user',
  //               value: SearchType.USER,
  //             },
  //           ]}
  //         />
  //         {type === SearchType.POST &&
  //           list.map((post: PostInfo) => (
  //             <PostCard key={post.id} post={post} />
  //           ))}
  //       </div>
  //       <Pagination currentPage={page} total={total} pageSize={pageSize} />
  //     </>
  //   )
  // } else {
  //   return (
  //     <>没有结果</>
  //     // <>
  //     //   <div
  //     //     style={{
  //     //       display: 'flex',
  //     //       flexDirection: 'column',
  //     //       alignItems: 'center',
  //     //     }}
  //     //   >
  //     //     <EmptyPostIcon />
  //     //     <p>
  //     //       {t('error.noPost')}
  //     //       <Link href={RoutePath.publish}>
  //     //         <span
  //     //           style={{
  //     //             fontSize: '16px',
  //     //             cursor: 'pointer',
  //     //             textDecorationLine: 'underline',
  //     //             fontWeight: 'bold',
  //     //             color: 'var(--theme-font-color)',
  //     //           }}
  //     //         >
  //     //           {t('event.publish')}
  //     //         </span>
  //     //       </Link>
  //     //     </p>
  //     //   </div>
  //     // </>
  //   )
  // }

  return (
    <div className={styles.search}>
      <header className={styles.head}>
        <div className={styles.left}>
          <BackButton />
          <Search />
        </div>
        <div className={styles['user-control']}>
          <UserControl />
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.toggle}>
            <ToggleButton
              value={type}
              options={[
                {
                  label: 'post',
                  value: SearchType.POST,
                },
                {
                  label: 'tag',
                  value: SearchType.TAG,
                },
                {
                  label: 'user',
                  value: SearchType.USER,
                },
              ]}
              searchParamName={'type'}
              searchParams={params}
            />
          </div>

          {type === SearchType.POST &&
            list.map((post: PostInfo) => (
              <PostCard key={`post-${post.id}`} post={post} />
            ))}
          {type === SearchType.TAG &&
            list.map((tag: { name: string }) => (
              <p key={`tag-${tag.name}`}>{tag.name}</p>
            ))}
          {type === SearchType.USER &&
            list.map((user: UserPublic) => (
              <p key={`user-${user.id}`}>{user.name}</p>
            ))}
          <Pagination currentPage={page} total={total} pageSize={pageSize} />
        </div>
        <aside className={styles.aside}></aside>
      </main>
    </div>
  )
}
