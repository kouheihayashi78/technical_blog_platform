import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Post } from '@/types/post'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { extractExcerpt } from '@/lib/utils/slug'
import { FileText, Calendar, ExternalLink } from 'lucide-react'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
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
    <Link href={`/posts/${post.slug}`} className="group">
      <Card className="h-full hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer bg-gradient-to-br from-card to-card/50">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-1">
              <FileText className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
              <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </div>
            <Badge variant="outline" className={`${config.color} border flex-shrink-0`}>
              <span className="mr-1">{config.icon}</span>
              {config.label}
            </Badge>
          </div>
          {post.category && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">📂</span>
              <span className="font-medium text-primary">{post.category}</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {extractExcerpt(post.content, 150)}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 border-t pt-4">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-medium">
                  #{tag}
                </Badge>
              ))}
              {post.tags.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{post.tags.length - 4}
                </Badge>
              )}
            </div>
          )}
          <div className="flex items-center justify-between w-full text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                  locale: ja,
                })}
              </span>
            </div>
            {post.qiita_url && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                <ExternalLink className="h-3 w-3" />
                <span>Qiita</span>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
