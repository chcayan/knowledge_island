import { Request } from 'express'

export interface AuthRequest extends Request {
  user: {
    id: string
    role: 'user' | 'admin'
  }
  cookies: {
    access_token: string
    refresh_token: string
  }
}
