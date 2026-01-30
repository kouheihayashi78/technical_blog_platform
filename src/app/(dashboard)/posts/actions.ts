/**
 * Server Actions - サーバー側で実行されるデータ操作関数
 *
 * 【Server Actionsとは】
 * - フォーム送信やボタンクリックで実行される関数
 * - サーバー側で実行される（ブラウザでは実行されない）
 * - データベース操作やAPIコールが可能
 * - 'use server' ディレクティブが必須
 *
 * 【実行タイミング】
 * 1. Client Component (page.tsx) でフォーム送信
 * 2. formData が自動的に作成される
 * 3. この Server Action がサーバーで実行される
 * 4. データベース操作
 * 5. 結果をClient Componentに返す
 * 6. リダイレクトまたは画面更新
 *
 * 【使用例】
 * ```tsx
 * 'use client'
 * function NewPostPage() {
 *   async function handleSubmit(e) {
 *     e.preventDefault()
 *     const formData = new FormData(e.target)
 *     const result = await createPost(formData)  // ← Server Action呼び出し
 *
 *     if (result.success) {
 *       router.push(`/posts/${result.slug}`)
 *     }
 *   }
 *   return <form onSubmit={handleSubmit}>...</form>
 * }
 * ```
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/lib/utils/slug";
import { Database } from "@/types/database";

type PostInsert = Database["public"]["Tables"]["posts"]["Insert"];
type PostVersionInsert = Database["public"]["Tables"]["post_versions"]["Insert"];

/**
 * createPost - 新規記事作成
 *
 * 【処理フロー】
 * 1. FormDataから入力値を取得
 * 2. ユーザー認証チェック
 * 3. プロファイル存在確認（なければ自動作成）
 * 4. slugを生成（タイトル + タイムスタンプ）
 * 5. データベースに投稿を保存
 * 6. 初期バージョンを作成（履歴管理用）
 * 7. キャッシュをクリア（revalidatePath）
 * 8. 成功結果を返す（redirectはしない）
 *
 * @param formData - フォームから送信されたデータ
 * @returns { success: true, slug: string } または { error: string }
 */
export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const status = (formData.get("status") as string) || "draft";
  const category = (formData.get("category") as string) || null;
  const tagsString = formData.get("tags") as string;
  const tags = tagsString
    ? tagsString
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const { data: { user }, } = await supabase.auth.getUser();

  if (!user) {
    return { error: "認証が必要です" };
  }

  // 投稿作成前にプロファイルの存在を確認して自動作成
  await ensureProfileExists(supabase, user.id, user.email || "");

  const slug = generateSlug(title);

  const postData: PostInsert = {
    user_id: user.id,
    title,
    content,
    slug,
    status: status as "draft" | "private" | "shareable",
    tags,
    category,
    published_at: status !== "draft" ? new Date().toISOString() : null,
  };

  // Supabaseの型推論の制限により、insertのみ型アサーション使用
  const { data, error } = await (supabase.from("posts") as any)
    .insert([postData])
    .select();

  if (error) {
    console.error("Post creation error:", error);
    return { error: "記事の作成に失敗しました" };
  }

  if (!data || !data[0]) {
    return { error: "記事の作成に失敗しました" };
  }

  const createdPost = data[0];

  // 初期バージョンを作成
  await createVersion(createdPost.id, title, content);

  revalidatePath("/posts");
  return {
    success: true,
    slug: createdPost.slug,
  };
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "認証が必要です" };
  }

  // 投稿更新前にプロファイルの存在確認し、自動作成
  await ensureProfileExists(supabase, user.id, user.email || "");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const status = formData.get("status") as string;
  const category = (formData.get("category") as string) || null;
  const tagsString = formData.get("tags") as string;
  const tags = tagsString
    ? tagsString
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const updateData = {
    title,
    content,
    status: status as "draft" | "private" | "shareable",
    tags,
    category,
    updated_at: new Date().toISOString(),
    published_at: status !== "draft" ? new Date().toISOString() : null,
  };

  // Supabaseの型推論の制限により、updateのみ型アサーション使用
  const { data, error } = await (supabase.from("posts") as any)
    .update(updateData)
    .eq("id", postId)
    .select()
    .single();

  if (error) {
    console.error("Post update error:", error);
    return { error: "記事の更新に失敗しました" };
  }

  if (!data) {
    return { error: "記事の更新に失敗しました" };
  }

  // バージョンを作成
  await createVersion(postId, title, content);

  // 指定されたパスのキャッシュにデータを入れ直す
  revalidatePath("/posts");
  revalidatePath(`/posts/${data.slug}`);

  // redirect()の代わりに結果を返す（Client Componentでリダイレクト処理を行う）
  return {
    success: true,
    slug: data.slug,
  };
}

export async function deletePost(postId: string) {
  const supabase = await createClient();

  // Supabaseの型推論の制限により、updateのみ型アサーション使用
  const { error } = await (supabase.from("posts") as any)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", postId);

  if (error) {
    console.error("Post deletion error:", error);
    return { error: "記事の削除に失敗しました" };
  }

  revalidatePath("/posts");
  return { success: true };
}

async function createVersion(postId: string, title: string, content: string) {
  const supabase = await createClient();

  // 現在の最新バージョン番号を取得
  // Supabaseの型推論の制限により、型アサーション使用
  const { data: latestVersion } = await (supabase.from("post_versions") as any)
    .select("version_number")
    .eq("post_id", postId)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersionNumber = (latestVersion?.version_number ?? 0) + 1;

  // RPC関数を使ってバージョンを作成（RLSをバイパス）
  const { error } = await supabase.rpc("create_post_version", {
    p_post_id: postId,
    p_title: title,
    p_content: content,
    p_version_number: nextVersionNumber,
  });

  if (error) {
    console.error("Version creation error:", error);
  }
}

// Helper function to ensure profile exists for a user
async function ensureProfileExists(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  email: string
) {
  // プロファイルが存在するかチェック
  const { data: existingProfile, error: checkError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (checkError) {
    console.error("Profile check error:", checkError);
  }

  // 存在しない場合はRPCを使ってプロファイル作成（RLSをバイパス）
  if (!existingProfile) {
    console.log("Creating profile for user:", userId, email);
    const displayName = email.split("@")[0];

    const { error } = await supabase.rpc("create_profile_if_not_exists", {
      user_id: userId,
      user_email: email,
      user_display_name: displayName,
    });

    if (error) {
      console.error("Profile creation error:", error);
    } else {
      console.log("Profile created successfully");
    }
  }
}
