/**
 * Array parsing utilities for command-line arguments
 */

/**
 * カンマ区切り文字列を配列に変換
 * 空白をトリミングし、空要素を除去
 *
 * 例:
 * - "a,b,c" → ["a", "b", "c"]
 * - "a, b , c" → ["a", "b", "c"]
 * - "a,,b" → ["a", "b"]
 * - "" → []
 */
export function parseCommaSeparated(input: string): string[] {
  if (!input || input.trim().length === 0) {
    return [];
  }

  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * 改行またはカンマ区切りの文字列を配列に変換
 * 空白をトリミングし、空要素を除去
 *
 * 例:
 * - "a\nb\nc" → ["a", "b", "c"]
 * - "a,b,c" → ["a", "b", "c"]
 * - "a\nb,c" → ["a", "b", "c"]
 */
export function parseSeparatedList(input: string): string[] {
  if (!input || input.trim().length === 0) {
    return [];
  }

  return input
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * 改行区切りの文字列を配列に変換
 * 空白をトリミングし、空行を除去
 *
 * 例:
 * - "a\nb\nc" → ["a", "b", "c"]
 * - "a\n\nb" → ["a", "b"]
 */
export function parseLines(input: string): string[] {
  if (!input || input.trim().length === 0) {
    return [];
  }

  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
