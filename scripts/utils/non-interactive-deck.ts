/**
 * Non-interactive mode utilities for create-deck
 */

import fs from 'fs/promises';
import path from 'path';
import { validateDeckName } from './validation.js';
import {
  loadJsonConfig,
  validateDeckConfig,
  DeckConfig,
} from './config-loader.js';

/**
 * CLI引数の型定義
 */
export interface DeckCliArgs {
  name?: string;
  config?: string;
  title?: string;
  template?: string;
  inheritScripts?: boolean;
  yes?: boolean;
}

/**
 * JSON設定ファイルからDeck設定を構築
 */
export async function loadDeckFromConfig(configPath: string): Promise<DeckConfig> {
  const config = await loadJsonConfig<DeckConfig>(configPath);

  // バリデーション
  if (!validateDeckConfig(config)) {
    throw new Error('設定ファイルのバリデーションに失敗しました');
  }

  return config;
}

/**
 * コマンドライン引数からDeck設定を構築
 */
export function parseDeckFromArgs(args: DeckCliArgs): DeckConfig {
  // 必須フィールドのバリデーション
  if (!args.name) {
    throw new Error('--name は必須です');
  }

  const nameValidation = validateDeckName(args.name);
  if (nameValidation !== true) {
    throw new Error(`--name: ${nameValidation}`);
  }

  if (!args.title) {
    throw new Error('--title は必須です');
  }

  if (args.title.trim().length === 0) {
    throw new Error('--title: タイトルを入力してください');
  }

  return {
    name: args.name,
    title: args.title,
    template: args.template || 'default',
    inheritScripts: args.inheritScripts || false,
  };
}

/**
 * デッキの重複確認
 */
export async function validateDeckNotExists(deckName: string): Promise<void> {
  const deckPath = path.join(process.cwd(), 'decks', deckName);

  try {
    await fs.access(deckPath);
    throw new Error(`デッキ "${deckName}" は既に存在します`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // デッキが存在しない（OK）
      return;
    }
    throw error;
  }
}

/**
 * テンプレートの存在確認
 */
export async function validateTemplateExists(
  templateSource: string
): Promise<string> {
  if (templateSource === 'default') {
    const templatePath = path.join(process.cwd(), 'templates', 'default');
    try {
      const stat = await fs.stat(templatePath);
      if (!stat.isDirectory()) {
        throw new Error('デフォルトテンプレートが見つかりません');
      }
      return templatePath;
    } catch (error) {
      throw new Error('デフォルトテンプレートが見つかりません');
    }
  }

  // 既存デッキをテンプレートとして使用
  const deckPath = path.join(process.cwd(), 'decks', templateSource);
  try {
    const stat = await fs.stat(deckPath);
    if (!stat.isDirectory()) {
      throw new Error(`テンプレート "${templateSource}" が見つかりません`);
    }
    return deckPath;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`テンプレート "${templateSource}" が見つかりません`);
    }
    throw error;
  }
}

/**
 * エラーメッセージをフォーマット
 */
export function formatDeckErrorMessage(error: Error, isConfigMode: boolean): string {
  let message = `\n❌ エラー: ${error.message}\n`;

  if (isConfigMode) {
    message += '\n設定ファイルの内容を確認してください。\n';
    message += 'サンプル: examples/deck-config.json\n';
  } else {
    message += '\n使用方法:\n';
    message += '  npm run create-deck -- --name <デッキ名> --title <タイトル>\n';
    message += '\nまたは設定ファイルを使用:\n';
    message += '  npm run create-deck -- --config ./deck-config.json\n';
    message += '\nヘルプを表示:\n';
    message += '  npm run create-deck -- --help\n';
  }

  return message;
}

/**
 * 成功メッセージをフォーマット
 */
export function formatDeckSuccessMessage(deckName: string): string {
  let message = '\n✅ デッキを作成しました!\n';
  message += '\n次のステップ:\n';
  message += `  cd decks/${deckName}\n`;
  message += `  npm run dev           # プレビューを開始\n`;
  message += `  npm run build:all     # 全フォーマットでビルド\n`;
  message += '\nまたはワークスペースルートから:\n';
  message += `  npm run build:deck -- ${deckName}\n`;
  return message;
}
