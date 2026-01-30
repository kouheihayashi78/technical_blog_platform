# Tech Blog Platform

個人の技術的知見やポエムを自由にアウトプットできるプライベートブログプラットフォーム。

## 特徴

- **プライベートファースト**: デフォルトは非公開、自分だけが閲覧可能
- **選択的公開**: 公開したい記事のみを外部プラットフォーム（Qiita等）へ共有
- **Markdownエディタ**: タブ切替式のプレビュー付きエディタ
- **バージョン管理**: 記事の編集履歴を自動保存・復元可能
- **タグ・カテゴリ管理**: 記事の整理と検索が簡単

## 技術スタック

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Markdown**: react-markdown, remark-gfm, rehype-highlight
- **Deployment**: Vercel

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Supabaseプロジェクトの作成

[Supabase](https://supabase.com)でプロジェクトを作成し、以下の情報を取得:

- Project URL
- Anon/Public Key
- Service Role Key (Server-side only)

### 3. 環境変数の設定

`.env.local.example`をコピーして`.env.local`を作成:

```bash
cp .env.local.example .env.local
```

取得したSupabaseの情報を`.env.local`に設定:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. データベースのセットアップ

Supabaseのマイグレーションを実行:

```bash
# ローカルSupabaseを起動（オプション）
npx supabase start

# マイグレーションを実行
npx supabase db push
```

または、Supabaseダッシュボードから`supabase/migrations/20250101000000_initial_schema.sql`の内容を実行。

### 5. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)にアクセスしてアプリケーションを確認。

## プロジェクト構造

```
src/
├── app/
│   ├── (auth)/          # 認証ページ
│   ├── (dashboard)/     # ダッシュボード（保護されたページ）
│   └── api/             # APIルート
├── components/
│   ├── ui/              # shadcn/uiコンポーネント
│   ├── editor/          # Markdownエディタ
│   ├── posts/           # 記事関連コンポーネント
│   └── layout/          # レイアウトコンポーネント
├── lib/
│   ├── supabase/        # Supabaseクライアント設定
│   ├── auth/            # 認証ヘルパー
│   ├── queries/         # データベースクエリ
│   └── utils/           # ユーティリティ関数
└── types/               # TypeScript型定義
```

## 主な機能

### 認証
- Email/Password認証（Supabase Auth）
- 自動プロファイル作成

### 記事管理
- 記事の作成・編集・削除（論理削除）
- ステータス管理（下書き・非公開・公開可）
- タグ・カテゴリによる分類
- 全文検索

### エディタ
- タブ切替式（編集/プレビュー）
- シンタックスハイライト
- GitHub Flavored Markdown対応

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# Lint
npm run lint

# Supabase型定義生成
npx supabase gen types typescript --project-id <PROJECT_ID> > src/types/database.ts
```

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. [Vercel](https://vercel.com)でプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

## 今後の実装予定

- [ ] Markdownエディタの改善（画像アップロード対応）
- [ ] 記事詳細ページ
- [ ] 記事作成・編集ページ
- [ ] バージョン履歴機能
- [ ] Qiita連携機能
- [ ] ダークモード対応
- [ ] エクスポート機能

## ライセンス

MIT

## 参考ドキュメント

- `REQUIREMENTS.md` - 詳細な要件定義
- `IMPLEMENTATION_GUIDE.md` - 実装ガイド
- `CLAUDE.md` - Claude Code向けガイド
