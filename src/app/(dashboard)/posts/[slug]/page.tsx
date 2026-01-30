import { getPostBySlug } from '@/lib/queries/posts'
import { MarkdownPreview } from '@/components/editor/MarkdownPreview'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { DeletePostButton } from '@/components/posts/DeletePostButton'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  console.log(post)

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold mb-4">記事が見つかりません</h1>
        <Link href="/posts">
          <Button>記事一覧に戻る</Button>
        </Link>
      </div>
    )
  }

  const statusColors = {
    draft: 'bg-gray-500',
    private: 'bg-blue-500',
    shareable: 'bg-green-500',
  }

  const statusLabels = {
    draft: '下書き',
    private: '非公開',
    shareable: '公開可',
  }

  const statusConfig = {
    draft: {
      color: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700',
      label: '下書き',
      icon: '📝'
    },
    private: {
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      label: '非公開',
      icon: '🔒'
    },
    shareable: {
      color: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700',
      label: '公開可',
      icon: '✨'
    },
  }

  const config = statusConfig[post.status]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-16 z-40 bg-background/80 backdrop-blur-sm py-4 border-b">
        <Link href="/posts">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">一覧に戻る</span>
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/posts/${post.slug}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              編集
            </Button>
          </Link>
          <DeletePostButton postId={post.id} />
        </div>
      </div>

      {/* Article Header */}
      <Card className="border-2">
        <CardHeader className="space-y-6 pb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className={`${config.color} border`}>
              <span className="mr-1">{config.icon}</span>
              {config.label}
            </Badge>
            {post.qiita_url && (
              <a
                href={post.qiita_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 hover:underline font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Qiitaで見る
              </a>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.category && (
              <span className="font-medium">{post.category}</span>
            )}
            <span>
              作成:{' '}
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
                locale: ja,
              })}
            </span>
            {post.updated_at !== post.created_at && (
              <span>
                更新:{' '}
                {formatDistanceToNow(new Date(post.updated_at), {
                  addSuffix: true,
                  locale: ja,
                })}
              </span>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Article Content */}
      <Card>
        <CardContent className="pt-6">
          <MarkdownPreview content={post.content} />
        </CardContent>
      </Card>
    </div>
  )
}
