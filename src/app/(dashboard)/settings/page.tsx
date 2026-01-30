'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Save, User, Key } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    display_name: '',
    username: '',
    qiita_access_token: '',
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setProfile({
            display_name: data.display_name || '',
            username: data.username || '',
            qiita_access_token: data.qiita_access_token || '',
          })
        }
      } catch (error) {
        toast.error('プロファイルの読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  async function handleSave() {
    setSaving(true)

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        toast.success('設定を保存しました')
      } else {
        toast.error('設定の保存に失敗しました')
      }
    } catch (error) {
      toast.error('設定の保存に失敗しました')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">設定</h1>
        <p className="text-muted-foreground mt-2">
          プロファイルとアカウント設定を管理します
        </p>
      </div>

      {/* プロファイル設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            プロファイル
          </CardTitle>
          <CardDescription>
            公開される情報を設定します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">表示名</Label>
            <Input
              id="display_name"
              value={profile.display_name}
              onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
              placeholder="山田太郎"
              disabled={saving}
            />
            <p className="text-sm text-muted-foreground">
              記事に表示される名前です
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">ユーザー名</Label>
            <Input
              id="username"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              placeholder="yamada_taro"
              disabled={saving}
            />
            <p className="text-sm text-muted-foreground">
              URLに使用される一意のユーザー名です
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Qiita連携設定 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Qiita連携
          </CardTitle>
          <CardDescription>
            Qiitaアクセストークンを設定して記事を投稿できます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qiita_token">Qiitaアクセストークン</Label>
            <Input
              id="qiita_token"
              type="password"
              value={profile.qiita_access_token}
              onChange={(e) => setProfile({ ...profile, qiita_access_token: e.target.value })}
              placeholder="トークンを入力してください"
              disabled={saving}
            />
            <p className="text-sm text-muted-foreground">
              <a
                href="https://qiita.com/settings/tokens/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Qiitaの設定ページ
              </a>
              でアクセストークンを発行できます
            </p>
          </div>

          {profile.qiita_access_token && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✓ Qiitaトークンが設定されています
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                「公開可」ステータスの記事をQiitaに投稿できます
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 保存ボタン */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              保存
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
