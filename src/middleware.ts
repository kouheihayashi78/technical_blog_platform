/**
 * Middleware - すべてのリクエストの最初に実行される
 *
 * 【処理フロー】
 * 1. ユーザーがURL入力/リンククリック
 * 2. Next.jsサーバーがリクエスト受信
 * 3. ★このMiddlewareが最初に実行される★
 * 4. 認証チェック・リダイレクト処理
 * 5. layout.tsx → page.tsx の順に実行
 *
 * 【役割】
 * - Cookieから認証情報（セッション）を取得
 * - 認証が必要なページへのアクセスをチェック
 * - 未ログインの場合は /login へリダイレクト
 * - ログイン済みの場合はセッション更新して次へ進む
 *
 * 【実行タイミング】
 * - すべてのページ表示前
 * - すべてのAPI呼び出し前
 * - ただし、静的ファイル（画像、CSS等）は除外
 */

import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Middleware関数
 *
 * @param request - HTTPリクエスト情報
 * @returns HTTPレスポンス（リダイレクトまたは続行）
 */
export async function middleware(request: NextRequest) {
  // lib/supabase/middleware.ts の updateSession を呼び出す
  // ここで認証チェックとセッション更新を行う
  return await updateSession(request)
}

/**
 * Middlewareの設定
 *
 * matcher: どのパスでMiddlewareを実行するか指定
 *
 * 【除外されるパス】
 * - _next/static/* : Next.jsの静的ファイル
 * - _next/image/* : Next.jsの画像最適化
 * - favicon.ico : ファビコン
 * - *.svg, *.png, *.jpg等 : 画像ファイル
 *
 * 【実行されるパス】
 * - / : ホームページ
 * - /login : ログインページ
 * - /posts/* : 記事ページすべて
 * - /api/* : APIエンドポイントすべて
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
