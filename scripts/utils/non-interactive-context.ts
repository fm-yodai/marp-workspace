/**
 * Non-interactive mode utilities for create-context
 */

import fs from 'fs/promises';
import path from 'path';
import { ContextData } from './context-generator.js';
import { ParsedContext } from './context-parser.js';
import {
  validateRequired,
  validateMinLength,
  validateTone,
  validateUpdateMode,
  normalizeTone,
} from './validation.js';
import { parseCommaSeparated } from './array-parser.js';
import {
  loadJsonConfig,
  validateContextConfig,
  mergeConfig,
  ContextConfig,
} from './config-loader.js';

/**
 * CLI引数の型定義
 */
export interface ContextCliArgs {
  deck?: string;
  config?: string;
  purpose?: string;
  audience?: string;
  keyMessages?: string;
  timeConstraint?: string;
  tone?: string;
  todos?: string;
  ideas?: string;
  references?: string;
  questions?: string;
  updateMode?: string;
  yes?: boolean;
}

/**
 * JSON設定ファイルからContextDataを構築
 */
export async function loadContextFromConfig(configPath: string): Promise<{
  data: ContextData;
  deck?: string;
  updateMode?: 'update' | 'overwrite' | 'skip';
}> {
  const config = await loadJsonConfig<ContextConfig>(configPath);

  // バリデーション
  if (!validateContextConfig(config)) {
    throw new Error('設定ファイルのバリデーションに失敗しました');
  }

  // ContextDataを構築
  const data: ContextData = {
    purpose: config.background.purpose,
    audience: config.background.audience,
    keyMessages: config.background.keyMessages,
    constraints: config.background.timeConstraint
      ? `時間制限: ${config.background.timeConstraint}`
      : '',
    tone: config.background.tone ? normalizeTone(config.background.tone) : '',
    todos: config.notes?.todos || [],
    ideas: config.notes?.ideas || [],
    references: config.notes?.references || [],
    questions: config.notes?.questions || [],
  };

  return {
    data,
    deck: config.deck,
    updateMode: config.updateMode,
  };
}

/**
 * コマンドライン引数からContextDataを構築
 */
export function parseContextFromArgs(args: ContextCliArgs): ContextData {
  // 必須フィールドのバリデーション
  if (!args.purpose) {
    throw new Error('--purpose は必須です');
  }

  const purposeValidation = validateRequired(args.purpose);
  if (purposeValidation !== true) {
    throw new Error(`--purpose: ${purposeValidation}`);
  }

  const purposeLengthValidation = validateMinLength(10)(args.purpose);
  if (purposeLengthValidation !== true) {
    throw new Error(`--purpose: ${purposeLengthValidation}`);
  }

  if (!args.audience) {
    throw new Error('--audience は必須です');
  }

  const audienceValidation = validateRequired(args.audience);
  if (audienceValidation !== true) {
    throw new Error(`--audience: ${audienceValidation}`);
  }

  if (!args.keyMessages) {
    throw new Error('--key-messages は必須です');
  }

  const keyMessages = parseCommaSeparated(args.keyMessages);
  if (keyMessages.length === 0) {
    throw new Error('--key-messages: 1つ以上のメッセージを指定してください');
  }

  // オプショナルフィールドのバリデーション
  if (args.tone) {
    const toneValidation = validateTone(args.tone);
    if (toneValidation !== true) {
      throw new Error(`--tone: ${toneValidation}`);
    }
  }

  if (args.updateMode) {
    const updateModeValidation = validateUpdateMode(args.updateMode);
    if (updateModeValidation !== true) {
      throw new Error(`--update-mode: ${updateModeValidation}`);
    }
  }

  // ContextDataを構築
  const data: ContextData = {
    purpose: args.purpose,
    audience: args.audience,
    keyMessages,
    constraints: args.timeConstraint ? `時間制限: ${args.timeConstraint}` : '',
    tone: args.tone ? normalizeTone(args.tone) : '',
    todos: args.todos ? parseCommaSeparated(args.todos) : [],
    ideas: args.ideas ? parseCommaSeparated(args.ideas) : [],
    references: args.references ? parseCommaSeparated(args.references) : [],
    questions: args.questions ? parseCommaSeparated(args.questions) : [],
  };

  return data;
}

/**
 * 既存コンテキストとマージ（update モードの場合）
 */
export function mergeExistingContext(
  newData: ContextData,
  existing: ParsedContext
): ContextData {
  return {
    // backgroundは新しい値で上書き
    purpose: newData.purpose || existing.background.purpose,
    audience: newData.audience || existing.background.audience,
    keyMessages:
      newData.keyMessages.length > 0
        ? newData.keyMessages
        : existing.background.keyMessages,
    constraints: newData.constraints || existing.background.constraints,
    tone: newData.tone || existing.background.tone,

    // notesは配列を結合（重複を除去）
    todos: mergeArrays(existing.notes.todos, newData.todos),
    ideas: mergeArrays(existing.notes.ideas, newData.ideas),
    references: mergeArrays(existing.notes.references, newData.references),
    questions: mergeArrays(existing.notes.questions, newData.questions),
  };
}

/**
 * 配列をマージ（重複を除去）
 */
function mergeArrays(existing: string[], newItems: string[]): string[] {
  const combined = [...existing, ...newItems];
  return Array.from(new Set(combined));
}

/**
 * デッキの存在確認
 */
export async function validateDeckExists(deckName: string): Promise<string> {
  const deckPath = path.join(process.cwd(), 'decks', deckName);

  try {
    const stat = await fs.stat(deckPath);
    if (!stat.isDirectory()) {
      throw new Error(`"${deckName}" はディレクトリではありません`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`デッキ "${deckName}" が見つかりません`);
    }
    throw error;
  }

  // contextディレクトリの存在確認
  const contextDir = path.join(deckPath, 'context');
  try {
    const stat = await fs.stat(contextDir);
    if (!stat.isDirectory()) {
      throw new Error(`デッキ "${deckName}" にcontextディレクトリが見つかりません`);
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw new Error(`デッキ "${deckName}" にcontextディレクトリが見つかりません`);
    }
    throw error;
  }

  return deckPath;
}

/**
 * エラーメッセージをフォーマット
 */
export function formatErrorMessage(error: Error, isConfigMode: boolean): string {
  let message = `\n❌ エラー: ${error.message}\n`;

  if (isConfigMode) {
    message += '\n設定ファイルの内容を確認してください。\n';
    message += 'サンプル: examples/context-config.json\n';
  } else {
    message += '\n使用方法:\n';
    message += '  npm run create-context -- --deck <デッキ名> --purpose <目的> --audience <対象者> --key-messages <メッセージ>\n';
    message += '\nまたは設定ファイルを使用:\n';
    message += '  npm run create-context -- --config ./context-config.json\n';
    message += '\nヘルプを表示:\n';
    message += '  npm run create-context -- --help\n';
  }

  return message;
}

/**
 * 成功メッセージをフォーマット
 */
export function formatSuccessMessage(deckName: string, deckPath: string): string {
  let message = '\n✅ contextファイルを作成しました!\n';
  message += '\n生成されたファイル:\n';
  message += `  - ${path.join(deckPath, 'context', 'background.md')}\n`;
  message += `  - ${path.join(deckPath, 'context', 'notes.md')}\n`;
  message += '\n次のステップ:\n';
  message += '  1. 生成されたファイルを確認・編集\n';
  message += '  2. Claude Codeでデッキを開き、contextを参照しながらスライドを作成\n';
  message += `  3. デッキのプレビュー: cd decks/${deckName} && npm run dev\n`;
  return message;
}
