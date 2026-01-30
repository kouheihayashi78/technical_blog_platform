import { getPosts, getAllTags } from '@/lib/queries/posts'
import { PostCard } from '@/components/posts/PostCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { PenSquare, Search } from 'lucide-react'

interface PostsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams
  const status = typeof params.status === 'string' ? params.status : undefined
  const tag = typeof params.tag === 'string' ? params.tag : undefined
  const search = typeof params.search === 'string' ? params.search : undefined

  const { posts, pagination } = await getPosts({ status, tag, search })
  const allTags = await getAllTags()

  const filterButtons = [
    { label: 'すべて', value: undefined },
    { label: '下書き', value: 'draft' },
    { label: '非公開', value: 'private' },
    { label: '公開可', value: 'shareable' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 border">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              記事一覧
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              📚 全{pagination.total}件の記事
            </p>
          </div>
          <Link href="/posts/new">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <PenSquare className="mr-2 h-5 w-5" />
              新規作成
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <form className="flex-1" action="/posts" method="get">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="search"
              placeholder="記事を検索..."
              className="pl-10"
              defaultValue={search}
            />
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex gap-2">
          {filterButtons.map((filter) => (
            <Link
              key={filter.label}
              href={filter.value ? `/posts?status=${filter.value}` : '/posts'}
            >
              <Button
                variant={status === filter.value || (!status && !filter.value) ? 'default' : 'outline'}
                size="sm"
              >
                {filter.label}
              </Button>
            </Link>
          ))}
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground mr-2">タグ:</span>
            {allTags.slice(0, 10).map((t: string) => (
              <Link key={t as string} href={`/posts?tag=${t}`}>
                <Badge
                  variant={tag === t ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                >
                  {t}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            記事がまだありません
          </p>
          <Link href="/posts/new">
            <Button>
              <PenSquare className="mr-2 h-4 w-4" />
              最初の記事を作成
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
