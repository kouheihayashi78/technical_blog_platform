"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createPost } from "../actions";
import { toast } from "sonner";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"draft" | "private" | "shareable">(
    "draft"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("タイトルを入力してください");
      return;
    }

    if (!content.trim()) {
      toast.error("本文を入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("status", status);
      formData.append("category", category);
      formData.append("tags", tags);

      const result = await createPost(formData);

      if (result?.error) {
        toast.error(result.error);
        setIsSubmitting(false);
      } else {
        toast.success("記事を作成しました");
        if (result?.slug) {
          router.push(`/posts/${result.slug}`);
        } else {
          router.push("/posts");
        }
      }
    } catch (error) {
      toast.error("記事の作成に失敗しました");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 border">
        <div className="flex items-center gap-4">
          <Link href="/posts">
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              新規記事作成
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Markdownで記事を書いて、あなたのアイデアを共有しましょう
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Metadata Card */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="bg-gradient-to-br from-card to-card/50">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              記事情報
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                タイトル <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="記事のタイトルを入力してください"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">カテゴリ</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="例: TypeScript, React"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">ステータス</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as typeof status)}
                >
                  <SelectTrigger id="status" disabled={isSubmitting}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">下書き</SelectItem>
                    <SelectItem value="private">非公開</SelectItem>
                    <SelectItem value="shareable">公開可</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">タグ</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="タグをカンマ区切りで入力（例: TypeScript, Next.js, React）"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                複数のタグを入力する場合は、カンマで区切ってください
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Editor Card */}
        <Card className="border-2 shadow-sm">
          <CardHeader className="bg-gradient-to-br from-card to-card/50">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">✍️</span>
              本文 <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Markdownで記事を書いてください..."
              minHeight="600px"
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 sticky bottom-4 z-40 bg-background/80 backdrop-blur-sm p-4 rounded-lg border shadow-lg">
          <Link href="/posts">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              キャンセル
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="shadow-lg"
          >
            <Save className="mr-2 h-5 w-5" />
            {isSubmitting ? "保存中..." : "保存"}
          </Button>
        </div>
      </form>
    </div>
  );
}
