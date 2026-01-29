/**
 * JSON configuration file loader
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Context設定ファイルのスキーマ
 */
export interface ContextConfig {
  deck?: string;
  updateMode?: 'update' | 'overwrite' | 'skip';
  background: {
    purpose: string;
    audience: string;
    keyMessages: string[];
    timeConstraint?: string;
    tone?: string;
  };
  notes?: {
    todos?: string[];
    ideas?: string[];
    references?: string[];
    questions?: string[];
  };
}

/**
 * Deck設定ファイルのスキーマ
 */
export interface DeckConfig {
  name: string;
  title: string;
  template?: string;
  inheritScripts?: boolean;
}

/**
 * JSON設定ファイルを読み込み
 */
export async function loadJsonConfig<T>(configPath: string): Promise<T> {
  try {
    const absolutePath = path.resolve(configPath);
    const content = await fs.readFile(absolutePath, 'utf-8');
    const config = JSON.parse(content);
    return config as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`設定ファイルが見つかりません: ${configPath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`設定ファイルのJSON形式が不正です: ${configPath}\n${error.message}`);
    }
    throw error;
  }
}

/**
 * Context設定ファイルをバリデーション
 */
export function validateContextConfig(config: any): config is ContextConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('設定ファイルの形式が不正です');
  }

  if (!config.background || typeof config.background !== 'object') {
    throw new Error('設定ファイルに background セクションがありません');
  }

  const { background } = config;

  if (!background.purpose || typeof background.purpose !== 'string') {
    throw new Error('background.purpose は必須です');
  }

  if (background.purpose.length < 10) {
    throw new Error('background.purpose は10文字以上である必要があります');
  }

  if (!background.audience || typeof background.audience !== 'string') {
    throw new Error('background.audience は必須です');
  }

  if (!Array.isArray(background.keyMessages) || background.keyMessages.length === 0) {
    throw new Error('background.keyMessages は1つ以上の配列である必要があります');
  }

  // オプショナルフィールドのバリデーション
  if (background.timeConstraint !== undefined && typeof background.timeConstraint !== 'string') {
    throw new Error('background.timeConstraint は文字列である必要があります');
  }

  if (background.tone !== undefined && typeof background.tone !== 'string') {
    throw new Error('background.tone は文字列である必要があります');
  }

  // notes セクションのバリデーション（オプショナル）
  if (config.notes !== undefined) {
    const { notes } = config;

    if (notes.todos !== undefined && !Array.isArray(notes.todos)) {
      throw new Error('notes.todos は配列である必要があります');
    }

    if (notes.ideas !== undefined && !Array.isArray(notes.ideas)) {
      throw new Error('notes.ideas は配列である必要があります');
    }

    if (notes.references !== undefined && !Array.isArray(notes.references)) {
      throw new Error('notes.references は配列である必要があります');
    }

    if (notes.questions !== undefined && !Array.isArray(notes.questions)) {
      throw new Error('notes.questions は配列である必要があります');
    }
  }

  // updateMode のバリデーション（オプショナル）
  if (config.updateMode !== undefined) {
    const validModes = ['update', 'overwrite', 'skip'];
    if (!validModes.includes(config.updateMode)) {
      throw new Error(`updateMode は次のいずれかである必要があります: ${validModes.join(', ')}`);
    }
  }

  return true;
}

/**
 * Deck設定ファイルをバリデーション
 */
export function validateDeckConfig(config: any): config is DeckConfig {
  if (!config || typeof config !== 'object') {
    throw new Error('設定ファイルの形式が不正です');
  }

  if (!config.name || typeof config.name !== 'string') {
    throw new Error('name は必須です');
  }

  if (!/^\d{4}-\d{2}_[\w-]+$/.test(config.name)) {
    throw new Error('name は YYYY-MM_description 形式である必要があります（例: 2026-01_my-deck）');
  }

  if (!config.title || typeof config.title !== 'string') {
    throw new Error('title は必須です');
  }

  // オプショナルフィールドのバリデーション
  if (config.template !== undefined && typeof config.template !== 'string') {
    throw new Error('template は文字列である必要があります');
  }

  if (config.inheritScripts !== undefined && typeof config.inheritScripts !== 'boolean') {
    throw new Error('inheritScripts はブール値である必要があります');
  }

  return true;
}

/**
 * コマンドライン引数と設定ファイルをマージ
 * コマンドライン引数が優先される
 */
export function mergeConfig<T extends Record<string, any>>(
  cliArgs: Partial<T>,
  fileConfig: Partial<T>
): T {
  const merged = { ...fileConfig };

  // CLI引数で指定された値で上書き（undefinedでない値のみ）
  for (const [key, value] of Object.entries(cliArgs)) {
    if (value !== undefined && value !== null) {
      merged[key as keyof T] = value as any;
    }
  }

  return merged as T;
}
