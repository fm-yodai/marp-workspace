import fs from 'fs/promises';
import path from 'path';

/**
 * 既存のcontextファイルを解析した結果
 */
export interface ParsedContext {
  background: {
    purpose: string;
    audience: string;
    keyMessages: string[];
    constraints: string;
    tone: string;
  };
  notes: {
    todos: Array<{ text: string; checked: boolean }>;
    ideas: string[];
    references: string[];
    questions: string[];
  };
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
 * Markdownの見出しでセクションを分割
 */
export function parseMarkdownSections(content: string): Record<string, string> {
  const sections: Record<string, string> = {};

  // ## 見出しで分割（全角/半角対応）
  const lines = content.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.+)$/);

    if (headingMatch) {
      // 前のセクションを保存
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n').trim();
      }

      // 新しいセクション開始
      currentSection = headingMatch[1].trim();
      currentContent = [];
    } else if (currentSection) {
      // 現在のセクションに内容を追加
      currentContent.push(line);
    }
  }

  // 最後のセクションを保存
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n').trim();
  }

  return sections;
}

/**
 * TODOリストをパース（チェックボックス状態を含む）
 */
export function parseTodoList(content: string): Array<{ text: string; checked: boolean }> {
  const todos: Array<{ text: string; checked: boolean }> = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // - [ ] または - [x] のパターン
    const uncheckedMatch = line.match(/^-\s+\[\s*\]\s+(.+)$/);
    const checkedMatch = line.match(/^-\s+\[x\]\s+(.+)$/i);

    if (uncheckedMatch) {
      todos.push({ text: uncheckedMatch[1].trim(), checked: false });
    } else if (checkedMatch) {
      todos.push({ text: checkedMatch[1].trim(), checked: true });
    }
  }

  return todos;
}

/**
 * リスト項目をパース
 */
export function parseListItems(content: string): string[] {
  const items: string[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const match = line.match(/^-\s+(.+)$/);
    if (match) {
      items.push(match[1].trim());
    }
  }

  return items;
}

/**
 * 既存のcontextファイルを解析して構造化データに変換
 */
export async function parseExistingContext(deckPath: string): Promise<ParsedContext | null> {
  const backgroundPath = path.join(deckPath, 'context', 'background.md');
  const notesPath = path.join(deckPath, 'context', 'notes.md');

  // 両方のファイルが存在するかチェック
  const hasBackground = await fileExists(backgroundPath);
  const hasNotes = await fileExists(notesPath);

  if (!hasBackground && !hasNotes) {
    return null;
  }

  const result: ParsedContext = {
    background: {
      purpose: '',
      audience: '',
      keyMessages: [],
      constraints: '',
      tone: '',
    },
    notes: {
      todos: [],
      ideas: [],
      references: [],
      questions: [],
    },
  };

  // background.md を解析
  if (hasBackground) {
    const backgroundContent = await fs.readFile(backgroundPath, 'utf-8');
    const sections = parseMarkdownSections(backgroundContent);

    result.background.purpose = sections['目的'] || '';
    result.background.audience = sections['対象聴衆'] || sections['対象者'] || '';
    result.background.keyMessages = parseListItems(sections['主要メッセージ'] || sections['キーメッセージ'] || '');
    result.background.constraints = sections['制約条件'] || '';
    result.background.tone = sections['トーン・スタイル'] || sections['トーン'] || '';
  }

  // notes.md を解析
  if (hasNotes) {
    const notesContent = await fs.readFile(notesPath, 'utf-8');
    const sections = parseMarkdownSections(notesContent);

    result.notes.todos = parseTodoList(sections['TODO'] || sections['やること'] || '');
    result.notes.ideas = parseListItems(sections['アイデア'] || sections['Ideas'] || '');
    result.notes.references = parseListItems(sections['参考資料'] || sections['リファレンス'] || '');
    result.notes.questions = parseListItems(sections['質問・検討事項'] || sections['質問'] || '');
  }

  return result;
}
