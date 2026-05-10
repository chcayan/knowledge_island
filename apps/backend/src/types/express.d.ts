import 'express'

declare module 'express' {
  interface Request {
    user?: { id: string; role: 'user' | 'admin' } | null
    cookies?: { userRefreshToken: string; adminRefreshToken: string } | null
  }
}
