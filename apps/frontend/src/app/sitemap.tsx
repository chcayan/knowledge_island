import { fetchData } from '@/utils'
import { MetadataRoute } from 'next'

const locales = ['en', 'zh']

type Post = {
  id: string
  updatedAt: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchData('/post/all')

  const posts: Post[] = data.list

  return locales.flatMap((locale) => [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`,
      lastModified: new Date(),
    },
    ...posts.map((post) => ({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/post/${post.id}`,
      lastModified: post.updatedAt,
    })),
  ])
}
