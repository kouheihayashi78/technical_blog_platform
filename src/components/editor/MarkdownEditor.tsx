'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { MarkdownPreview } from './MarkdownPreview'
import { Edit, Eye } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Markdownで記事を書いてください...',
  minHeight = '500px',
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  return (
    <div className="w-full">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="edit" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            編集
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            プレビュー
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-0">
          <div className="border rounded-md overflow-hidden">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="font-mono text-sm resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{ minHeight }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            <p>Markdown記法がサポートされています。</p>
            <p className="mt-1">
              <span className="font-mono bg-muted px-1 rounded">**太字**</span>
              {' '}
              <span className="font-mono bg-muted px-1 rounded">*斜体*</span>
              {' '}
              <span className="font-mono bg-muted px-1 rounded">`コード`</span>
              {' '}
              <span className="font-mono bg-muted px-1 rounded">[リンク](URL)</span>
            </p>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div
            className="border rounded-md p-6 bg-background overflow-auto"
            style={{ minHeight }}
          >
            {value ? (
              <MarkdownPreview content={value} />
            ) : (
              <p className="text-muted-foreground text-center py-12">
                プレビューするコンテンツがありません
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
