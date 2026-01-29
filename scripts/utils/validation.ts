/**
 * Validation utilities for create-context and create-deck
 */

/**
 * バリデーション: 必須フィールド
 */
export function validateRequired(input: string): boolean | string {
  if (!input || input.trim().length === 0) {
    return 'この項目は必須です';
  }
  return true;
}

/**
 * バリデーション: 最小文字数
 */
export function validateMinLength(min: number) {
  return (input: string): boolean | string => {
    if (input.trim().length < min) {
      return `${min}文字以上入力してください`;
    }
    return true;
  };
}

/**
 * バリデーション: デッキ名形式（YYYY-MM_description）
 */
export function validateDeckName(deckName: string): boolean | string {
  if (!/^\d{4}-\d{2}_[\w-]+$/.test(deckName)) {
    return 'デッキ名は YYYY-MM_description 形式で指定してください（例: 2026-01_my-deck）';
  }
  return true;
}

/**
 * バリデーション: トーンの値
 */
export function validateTone(tone: string): boolean | string {
  const validTones = [
    'formal', 'casual', 'technical', 'business',
    'フォーマル', 'カジュアル', '技術的', 'ビジネス'
  ];

  if (!validTones.includes(tone)) {
    return `トーンは次のいずれかを指定してください: ${validTones.join(', ')}`;
  }
  return true;
}

/**
 * バリデーション: 更新モード
 */
export function validateUpdateMode(mode: string): boolean | string {
  const validModes = ['update', 'overwrite', 'skip'];

  if (!validModes.includes(mode)) {
    return `更新モードは次のいずれかを指定してください: ${validModes.join(', ')}`;
  }
  return true;
}

/**
 * トーンを英語に正規化
 */
export function normalizeTone(tone: string): string {
  const toneMap: Record<string, string> = {
    'フォーマル': 'フォーマル',
    'formal': 'フォーマル',
    'カジュアル': 'カジュアル',
    'casual': 'カジュアル',
    '技術的': '技術的',
    'technical': '技術的',
    'ビジネス': 'ビジネス',
    'business': 'ビジネス',
  };

  return toneMap[tone] || tone;
}
