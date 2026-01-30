export function generateSlug(title: string): string {
  // 日本語対応のスラグ生成
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')           // スペースをハイフンに
    .replace(/[^\w\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\-]/g, '') // 英数字・日本語・ハイフン以外を除去
    .replace(/--+/g, '-')              // 連続ハイフンを単一に
    .replace(/^-+/, '')                // 先頭ハイフン除去
    .replace(/-+$/, '')                // 末尾ハイフン除去

  // ユニークにするためタイムスタンプ追加
  const timestamp = Date.now().toString(36)
  return `${slug}-${timestamp}`
}

export function extractExcerpt(content: string, maxLength: number = 150): string {
  // Markdownから見出しやコードブロックなどを除去してプレーンテキストを抽出
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // コードブロック除去
    .replace(/`[^`]+`/g, '')         // インラインコード除去
    .replace(/#{1,6}\s/g, '')        // 見出し記号除去
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // リンク→テキストのみ
    .replace(/[*_~]/g, '')           // 装飾記号除去
    .replace(/\n+/g, ' ')            // 改行をスペースに
    .trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  return plainText.slice(0, maxLength) + '...'
}
