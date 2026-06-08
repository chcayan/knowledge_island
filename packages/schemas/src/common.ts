import z from 'zod'

export const AuthorSchema = z.object({
  author: z.object({
    id: z.uuid(),
    name: z.string(),
    avatar: z.string(),
  }),
})
