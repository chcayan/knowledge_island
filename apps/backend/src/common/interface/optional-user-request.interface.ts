export interface OptionalUserRequest {
  user: {
    id: string
    role: 'user' | 'admin'
  } | null
  cookies: {
    access_token: string
    refresh_token: string
  }
}
