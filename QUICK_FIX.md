# 緊急修正手順

## エラー: `permission denied for table users`

このエラーが発生している場合、以下を確認してください：

### 1. 実行が必要なマイグレーション

Supabase Dashboardで、以下の**3つのマイグレーション**のみを実行してください：

#### ① 初期スキーマ
```
supabase/migrations/20250101000000_initial_schema.sql
```

#### ② 既存ユーザーのプロファイル作成
```
supabase/migrations/20250101000001_create_missing_profiles.sql
```

#### ③ プロファイル作成関数
```
supabase/migrations/20250101000002_fix_profile_creation.sql
```

#### ④ バージョン作成関数
```
supabase/migrations/20250101000003_fix_post_versions_rls.sql
```

### ⚠️ 重要: マイグレーション20250101000004は実行しないでください

`20250101000004_fix_posts_rls_policies.sql`は**実行不要**です。
このファイルが原因でエラーが発生している可能性があります。

### 2. すでに実行してしまった場合の修正方法

Supabase Dashboardで以下のSQLを実行して、ポリシーを元に戻してください：

```sql
-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view own posts" ON posts;
DROP POLICY IF EXISTS "Users can insert own posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

-- Recreate the original policies
CREATE POLICY "Users can view own posts" ON posts
  FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. 動作確認

修正後、以下を確認してください：

1. ログインできるか
2. 記事を作成できるか
3. 作成した記事が表示されるか

### 4. それでもエラーが出る場合

ブラウザのコンソール（F12キーを押す）で、具体的なエラーメッセージを確認して教えてください。

以下の情報が必要です：
- エラーメッセージの全文
- どの操作でエラーが発生したか
- ターミナルに表示されているログ
