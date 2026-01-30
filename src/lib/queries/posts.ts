import { createClient } from '@/lib/supabase/server'
import { GetPostsOptions, Post } from '@/types/post'

export async function getPosts(options: GetPostsOptions = {}) {
  const { status, tag, search, page = 1, limit = 12 } = options
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return {
      posts: [],
      pagination: { total: 0, page, limit, hasMore: false },
    }
  }

  // Supabaseの型推論の制限により、型アサーション使用
  let query = (supabase
    .from('posts'))
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  if (tag) {
    query = query.contains('tags', [tag])
  }

  if (search) {
    // 大文字小文字無視の部分一致(タイトル、コンテンツ、カテゴリー）
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,category.ilike.%${search}%`)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) throw error

  return {
    posts: data as Post[],
    pagination: {
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > page * limit,
    },
  }
}

export async function getPostBySlug(slug: string) {
  const supabase = await createClient()

  // URLデコード: %E3%83%86... → テスト3
  // Next.jsのparamsは自動的にURLエンコードされているため、デコードが必要
  const decodedSlug = decodeURIComponent(slug)

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  console.log('[getPostBySlug] original slug:', slug)
  console.log('[getPostBySlug] decoded slug:', decodedSlug)
  console.log('[getPostBySlug] user:', user?.id)
  console.log('[getPostBySlug] userError:', userError)

  if (!user) {
    console.log('[getPostBySlug] No user found')
    return null
  }

  const { data, error } = await (supabase
    .from('posts'))
    .select('*')
    .eq('slug', decodedSlug)  // デコードしたslugを使用
    .eq('user_id', user.id)
    .is('deleted_at', null)
    .maybeSingle()

  console.log('[getPostBySlug] data:', data)
  console.log('[getPostBySlug] error:', error)

  if (error) {
    console.error('getPostBySlug error:', error)
    return null
  }

  return data as Post | null
}

export async function getAllTags(): Promise<string[]> {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  // Supabaseの型推論の制限により、型アサーション使用
  const { data, error } = await (supabase
    .from('posts'))
    .select('tags')
    .eq('user_id', user.id)
    .is('deleted_at', null)

  if (error) {
    console.error('getAllTags error:', error)
    return []
  }

  const allTags = (data).flatMap((post: any) => post.tags || [])
  const uniqueTags = Array.from(new Set(allTags))

  return uniqueTags.sort() as string[]
}
