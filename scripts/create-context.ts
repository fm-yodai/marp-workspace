#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { parseExistingContext } from './utils/context-parser.js';
import { generateContextFiles, ContextData } from './utils/context-generator.js';
import {
  promptDeckSelection,
  promptMode,
  promptUpdateStrategy,
  promptQuickBackground,
  promptQuickNotes,
  promptDetailedBackground,
  promptDetailedNotes,
  promptConfirmation,
} from './utils/context-prompts.js';
import {
  createContextCommand,
  parseArgs,
  isNonInteractiveMode,
} from './utils/cli-parser.js';
import {
  ContextCliArgs,
  loadContextFromConfig,
  parseContextFromArgs,
  mergeExistingContext,
  validateDeckExists,
  formatErrorMessage,
  formatSuccessMessage,
} from './utils/non-interactive-context.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * デッキリストを取得
 */
async function getDecks(): Promise<string[]> {
  const decksDir = path.join(__dirname, '..', 'decks');

  try {
    const entries = await fs.readdir(decksDir, { withFileTypes: true });
    const decks = entries
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
      .map((entry) => entry.name)
      .sort();

    return decks;
  } catch (error) {
    console.error('❌ decksディレクトリの読み込みに失敗しました:', error);
    process.exit(1);
  }
}

/**
 * デッキのパスを取得
 */
function getDeckPath(deckName: string): string {
  return path.join(__dirname, '..', 'decks', deckName);
}

/**
 * contextディレクトリの存在確認
 */
async function validateContextDirectory(deckPath: string): Promise<boolean> {
  const contextDir = path.join(deckPath, 'context');

  try {
    const stat = await fs.stat(contextDir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * インタラクティブモードの実行
 */
async function runInteractive() {
  console.log('🎯 Context Creator - Marpデッキのcontextファイルを作成\n');

  // 1. デッキを選択
  const decks = await getDecks();

  if (decks.length === 0) {
    console.error('❌ デッキが見つかりません。先にデッキを作成してください。');
    process.exit(1);
  }

  const deckName = await promptDeckSelection(decks);
  const deckPath = getDeckPath(deckName);

  // contextディレクトリの存在確認
  if (!(await validateContextDirectory(deckPath))) {
    console.error(`❌ デッキ "${deckName}" にcontextディレクトリが見つかりません`);
    process.exit(1);
  }

  // 2. 既存contextファイルをチェック
  const spinner = ora('既存のcontextファイルを確認中...').start();
  const existingContext = await parseExistingContext(deckPath);
  spinner.stop();

  let updateMode: 'update' | 'overwrite' = 'overwrite';

  if (existingContext) {
    const strategy = await promptUpdateStrategy(existingContext);

    if (strategy === 'skip') {
      console.log('✨ キャンセルしました');
      process.exit(0);
    }

    updateMode = strategy;
  }

  // 3. モードを選択
  const mode = await promptMode();

  // 4. プロンプトを実行してデータを収集
  console.log('\n📝 情報を入力してください\n');

  let backgroundData: Partial<ContextData>;
  let notesData: Partial<ContextData>;

  if (mode === 'quick') {
    console.log('【Background情報】');
    backgroundData = await promptQuickBackground();

    console.log('\n【Notes情報】');
    notesData = await promptQuickNotes();
  } else {
    console.log('【Background情報】');
    backgroundData = await promptDetailedBackground();

    console.log('\n【Notes情報】');
    notesData = await promptDetailedNotes();
  }

  // データを結合
  const data: ContextData = {
    purpose: backgroundData.purpose || '',
    audience: backgroundData.audience || '',
    keyMessages: backgroundData.keyMessages || [],
    constraints: backgroundData.constraints || '',
    tone: backgroundData.tone || '',
    todos: notesData.todos || [],
    ideas: notesData.ideas || [],
    references: notesData.references || [],
    questions: notesData.questions || [],
  };

  // 5. 確認プロンプト
  const confirmed = await promptConfirmation(data);

  if (!confirmed) {
    console.log('✨ キャンセルしました');
    process.exit(0);
  }

  // 6. ファイルを生成
  const generateSpinner = ora('contextファイルを生成中...').start();

  try {
    await generateContextFiles(deckPath, data, {
      mode: updateMode,
      existing: existingContext || undefined,
    });

    generateSpinner.succeed('contextファイルを生成しました');
  } catch (error) {
    generateSpinner.fail('contextファイルの生成に失敗しました');
    console.error('\n❌ エラー:', error);
    process.exit(1);
  }

  // 7. 成功メッセージと次のステップ
  console.log('\n✅ 完了しました!\n');
  console.log('生成されたファイル:');
  console.log(`  - ${path.join(deckPath, 'context', 'background.md')}`);
  console.log(`  - ${path.join(deckPath, 'context', 'notes.md')}`);
  console.log('\n次のステップ:');
  console.log('  1. 生成されたファイルを確認・編集');
  console.log('  2. Claude Codeでデッキを開き、contextを参照しながらスライドを作成');
  console.log(`  3. デッキのプレビュー: cd decks/${deckName} && npm run dev\n`);
}

/**
 * 非インタラクティブモードの実行
 */
async function runNonInteractive(args: ContextCliArgs) {
  const isConfigMode = !!args.config;

  try {
    let data: ContextData;
    let deckName: string;
    let updateMode: 'update' | 'overwrite' = 'overwrite';

    // 設定ファイルまたはコマンドライン引数からデータを読み込み
    if (isConfigMode) {
      console.log(`📄 設定ファイルを読み込み中: ${args.config}\n`);
      const config = await loadContextFromConfig(args.config!);
      data = config.data;
      deckName = config.deck || args.deck || '';
      updateMode = config.updateMode || 'overwrite';

      if (!deckName) {
        throw new Error('設定ファイルまたは --deck オプションでデッキ名を指定してください');
      }
    } else {
      if (!args.deck) {
        throw new Error('--deck オプションは必須です');
      }
      deckName = args.deck;
      data = parseContextFromArgs(args);
      updateMode = (args.updateMode as 'update' | 'overwrite') || 'overwrite';
    }

    // デッキの存在確認
    const deckPath = await validateDeckExists(deckName);

    // 既存contextファイルをチェック
    const spinner = ora('既存のcontextファイルを確認中...').start();
    const existingContext = await parseExistingContext(deckPath);
    spinner.stop();

    // updateモードの場合は既存データとマージ
    if (existingContext && updateMode === 'update') {
      console.log('📝 既存のcontextに情報を追加します\n');
      data = mergeExistingContext(data, existingContext);
    } else if (existingContext && updateMode === 'overwrite') {
      console.log('📝 既存のcontextを上書きします\n');
    }

    // 確認プロンプト（--yes フラグがない場合）
    if (!args.yes) {
      const confirmed = await promptConfirmation(data);
      if (!confirmed) {
        console.log('✨ キャンセルしました');
        process.exit(0);
      }
    }

    // ファイルを生成
    const generateSpinner = ora('contextファイルを生成中...').start();

    try {
      await generateContextFiles(deckPath, data, {
        mode: updateMode,
        existing: existingContext || undefined,
      });

      generateSpinner.succeed('contextファイルを生成しました');
    } catch (error) {
      generateSpinner.fail('contextファイルの生成に失敗しました');
      throw error;
    }

    // 成功メッセージ
    console.log(formatSuccessMessage(deckName, deckPath));
  } catch (error) {
    console.error(formatErrorMessage(error as Error, isConfigMode));
    process.exit(1);
  }
}

/**
 * メイン処理
 */
async function main() {
  // コマンドライン引数をパース
  const command = createContextCommand();
  const args: ContextCliArgs = parseArgs(command);

  // 非インタラクティブモードかどうかを判定
  const requiredFields = ['deck', 'purpose', 'audience', 'keyMessages'];
  const nonInteractive = isNonInteractiveMode(args, requiredFields);

  if (nonInteractive) {
    await runNonInteractive(args);
  } else {
    await runInteractive();
  }
}

// エラーハンドリング
process.on('unhandledRejection', (error) => {
  console.error('\n❌ 予期しないエラーが発生しました:', error);
  process.exit(1);
});

// 実行
main();
