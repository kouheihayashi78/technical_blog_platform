'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignIn(formData: FormData) {
    setIsLoading(true)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signIn(email, password)

    if (result?.error) {
      toast.error(result.error)
      setIsLoading(false)
    }
    // 成功時はredirect()が呼ばれるので、ここには到達しない
  }

  async function handleSignUp(formData: FormData) {
    setIsLoading(true)
    try {
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const displayName = formData.get('displayName') as string

      const result = await signUp(email, password, displayName)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success('アカウントを作成しました。メールを確認してください。')
      }
    } catch (error) {
      toast.error('アカウント作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login" className="text-base">ログイン</TabsTrigger>
        <TabsTrigger value="signup" className="text-base">新規登録</TabsTrigger>
      </TabsList>

      <TabsContent value="login">
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl">ログイン</CardTitle>
            <CardDescription className="text-base">
              メールアドレスとパスワードでログインしてください
            </CardDescription>
          </CardHeader>
          <form action={handleSignIn}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">メールアドレス</Label>
                <Input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">パスワード</Label>
                <Input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-11 text-base shadow-lg" disabled={isLoading}>
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="signup">
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-3 pb-6">
            <CardTitle className="text-2xl">新規登録</CardTitle>
            <CardDescription className="text-base">
              新しいアカウントを作成してください
            </CardDescription>
          </CardHeader>
          <form action={handleSignUp}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-displayName">表示名</Label>
                <Input
                  id="signup-displayName"
                  name="displayName"
                  type="text"
                  placeholder="山田太郎"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">メールアドレス</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">パスワード</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <p className="text-sm text-muted-foreground">
                  6文字以上で入力してください
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full h-11 text-base shadow-lg" disabled={isLoading}>
                {isLoading ? 'アカウント作成中...' : 'アカウント作成'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
