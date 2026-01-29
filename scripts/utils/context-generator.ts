import fs from 'fs/promises';
import path from 'path';
import { ParsedContext } from './context-parser.js';

/**
 * コンテキストデータの構造
 */
export interface ContextData {
  purpose: string;
  audience: string;
  keyMessages: string[];
  constraints: string;
  tone: string;
  todos: string[];
  ideas: string[];
  references: string[];
  questions: string[];
}

/**
 * 生成オプション
 */
export interface GenerationOptions {
  mode: 'update' | 'overwrite';
  existing?: ParsedContext;
}

/**
 * ファイルの存在確認
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 安全にファイルを書き込む（バックアップと復元機能付き）
 */
async function safeWriteFile(filePath: string, content: string): Promise<void> {
  const backupPath = `${filePath}.backup`;

  // 既存ファイルがあればバックアップ
  if (await fileExists(filePath)) {
    await fs.copyFile(filePath, backupPath);
  }

  try {
    await fs.writeFile(filePath, content, 'utf-8');

    // 成功したらバックアップ削除
    if (await fileExists(backupPath)) {
      await fs.unlink(backupPath);
    }
  } catch (error) {
    // 失敗したらバックアップから復元
    if (await fileExists(backupPath)) {
      await fs.copyFile(backupPath, filePath);
      await fs.unlink(backupPath);
    }
    throw error;
  }
}

/**
 * background.md を生成
 */
export function generateBackgroundMd(data: ContextData): string {
  const sections: string[] = [];

  sections.push('# プレゼンテーション背景\n');

  if (data.purpose) {
    sections.push('## 目的\n');
    sections.push(`${data.purpose}\n`);
  }

  if (data.audience) {
    sections.push('## 対象聴衆\n');
    sections.push(`${data.audience}\n`);
  }

  if (data.keyMessages.length > 0) {
    sections.push('## 主要メッセージ\n');
    sections.push(data.keyMessages.map((m) => `- ${m}`).join('\n'));
    sections.push('\n');
  }

  if (data.constraints) {
    sections.push('## 制約条件\n');
    sections.push(`${data.constraints}\n`);
  }

  if (data.tone) {
    sections.push('## トーン・スタイル\n');
    sections.push(`${data.tone}\n`);
  }

  return sections.join('\n');
}

/**
 * notes.md を生成
 */
export function generateNotesMd(data: ContextData): string {
  const sections: string[] = [];

  sections.push('# プレゼンテーションノート\n');

  if (data.todos.length > 0) {
    sections.push('## TODO\n');
    sections.push(data.todos.map((t) => `- [ ] ${t}`).join('\n'));
    sections.push('\n');
  }

  if (data.ideas.length > 0) {
    sections.push('## アイデア\n');
    sections.push(data.ideas.map((i) => `- ${i}`).join('\n'));
    sections.push('\n');
  }

  if (data.references.length > 0) {
    sections.push('## 参考資料\n');
    sections.push(data.references.map((r) => `- ${r}`).join('\n'));
    sections.push('\n');
  }

  if (data.questions.length > 0) {
    sections.push('## 質問・検討事項\n');
    sections.push(data.questions.map((q) => `- ${q}`).join('\n'));
    sections.push('\n');
  }

  return sections.join('\n');
}

/**
 * 既存コンテキストと新しいデータをマージ
 */
export function mergeContext(existing: ParsedContext, newData: ContextData): ContextData {
  return {
    // 目的と対象聴衆は新しいデータで置き換え（空でなければ）
    purpose: newData.purpose || existing.background.purpose,
    audience: newData.audience || existing.background.audience,

    // キーメッセージはマージ（重複除去）
    keyMessages: Array.from(
      new Set([...existing.background.keyMessages, ...newData.keyMessages])
    ).filter(Boolean),

    // 制約条件とトーンは新しいデータで置き換え（空でなければ）
    constraints: newData.constraints || existing.background.constraints,
    tone: newData.tone || existing.background.tone,

    // TODOリストはマージ（既存のチェック状態を保持）
    todos: [
      ...existing.notes.todos.map((t) => (t.checked ? `[x] ${t.text}` : t.text)),
      ...newData.todos,
    ].filter((t, i, arr) => arr.indexOf(t) === i), // 重複除去

    // アイデアと参考資料はマージ（重複除去）
    ideas: Array.from(new Set([...existing.notes.ideas, ...newData.ideas])).filter(Boolean),
    references: Array.from(new Set([...existing.notes.references, ...newData.references])).filter(
      Boolean
    ),

    // 質問・検討事項はマージ（重複除去）
    questions: Array.from(new Set([...existing.notes.questions, ...newData.questions])).filter(
      Boolean
    ),
  };
}

/**
 * contextファイルを生成または更新
 */
export async function generateContextFiles(
  deckPath: string,
  data: ContextData,
  options: GenerationOptions
): Promise<void> {
  const contextDir = path.join(deckPath, 'context');

  // contextディレクトリが存在するか確認
  try {
    await fs.access(contextDir);
  } catch {
    throw new Error(`context ディレクトリが見つかりません: ${contextDir}`);
  }

  // updateモードの場合はマージ
  let finalData = data;
  if (options.mode === 'update' && options.existing) {
    finalData = mergeContext(options.existing, data);
  }

  // background.md を生成
  const backgroundPath = path.join(contextDir, 'background.md');
  const backgroundContent = generateBackgroundMd(finalData);
  await safeWriteFile(backgroundPath, backgroundContent);

  // notes.md を生成
  const notesPath = path.join(contextDir, 'notes.md');
  const notesContent = generateNotesMd(finalData);
  await safeWriteFile(notesPath, notesContent);
}
