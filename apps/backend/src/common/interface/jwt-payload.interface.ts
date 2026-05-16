export interface JwtPayload {
  id: string
  role: 'user' | 'admin'
}
