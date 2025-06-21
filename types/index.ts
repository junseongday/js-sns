export interface Post {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  authorId: string
  author: User
}

export interface User {
  id: string
  email: string
  username: string
  createdAt: string
  updatedAt: string
}

export interface PostsResponse {
  posts: Post[]
  nextCursor: string | null
  hasMore: boolean
}

export interface PostsRequest {
  cursor?: string
  limit?: number
}

// 인증 관련 타입들
export interface AuthRequest {
  email: string
  password: string
}

export interface RegisterRequest extends AuthRequest {
  username: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse extends AuthResponse {} 