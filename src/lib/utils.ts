import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Tailwind CSSのクラス名を効率的に結合・管理するユーティリティ関数でshadcn/uiで標準的に使われる関数
 * - clsx → 条件付きクラス名の結合（clsx('btn', 'primary')  // → 'btn primary'）
 * - twMerge → Tailwindクラスの競合解決（twMerge('p-4 p-8')  // → 'p-8' (p-4を上書き)）
 * @param inputs 
 * @returns 
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
