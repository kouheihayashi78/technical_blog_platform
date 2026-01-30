export type PostStatus = 'draft' | 'private' | 'shareable'

export interface Post {
  id: string
  user_id: string
  title: string
  content: string
  slug: string
  status: PostStatus
  tags: string[]
  category: string | null
  thumbnail_url: string | null
  qiita_url: string | null
  qiita_article_id: string | null
  qiita_synced_at: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface GetPostsOptions {
  status?: string
  tag?: string
  search?: string
  page?: number
  limit?: number
}

export interface PostVersion {
  id: string
  post_id: string
  title: string
  content: string
  version_number: number
  created_at: string
}

export interface CreatePostInput {
  title: string
  content: string
  status?: PostStatus
  tags?: string[]
  category?: string
}

export interface UpdatePostInput {
  title?: string
  content?: string
  status?: PostStatus
  tags?: string[]
  category?: string
}

export interface PostListItem extends Post {
  excerpt?: string
}
