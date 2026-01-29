import inquirer from 'inquirer';
import { ParsedContext } from './context-parser.js';
import { ContextData } from './context-generator.js';
import { validateRequired, validateMinLength } from './validation.js';
import { parseSeparatedList, parseLines } from './array-parser.js';

/**
 * プロンプトモード
 */
export type PromptMode = 'quick' | 'detailed';

/**
 * 更新戦略
 */
export type UpdateStrategy = 'update' | 'overwrite' | 'skip';

/**
 * トーンのオプション
 */
const toneOptions = [
  { name: 'フォーマル（公式・正式）', value: 'フォーマル' },
  { name: 'カジュアル（くだけた・親しみやすい）', value: 'カジュアル' },
  { name: '技術的（専門的・詳細）', value: '技術的' },
  { name: 'ビジネス（実務的・効率的）', value: 'ビジネス' },
];

/**
 * デッキ選択プロンプト
 */
export async function promptDeckSelection(decks: string[]): Promise<string> {
  const { deck } = await inquirer.prompt<{ deck: string }>([
    {
      type: 'list',
      name: 'deck',
      message: 'contextを作成するデッキを選択してください:',
      choices: decks,
      pageSize: 15,
    },
  ]);

  return deck;
}

/**
 * モード選択プロンプト
 */
export async function promptMode(): Promise<PromptMode> {
  const { mode } = await inquirer.prompt<{ mode: PromptMode }>([
    {
      type: 'list',
      name: 'mode',
      message: '入力モードを選択してください:',
      choices: [
        {
          name: 'Quick Mode - 素早く基本的な情報を入力',
          value: 'quick',
        },
        {
          name: 'Detailed Mode - エディタで詳細な情報を入力',
          value: 'detailed',
        },
      ],
    },
  ]);

  return mode;
}

/**
 * 更新戦略選択プロンプト
 */
export async function promptUpdateStrategy(existing: ParsedContext): Promise<UpdateStrategy> {
  console.log('\n📋 既存のcontextファイルが見つかりました\n');
  console.log('【現在の内容】');
  console.log(`目的: ${existing.background.purpose.substring(0, 50)}${existing.background.purpose.length > 50 ? '...' : ''}`);
  console.log(`対象聴衆: ${existing.background.audience.substring(0, 50)}${existing.background.audience.length > 50 ? '...' : ''}`);
  console.log(`TODOアイテム: ${existing.notes.todos.length}件`);
  console.log(`アイデア: ${existing.notes.ideas.length}件\n`);

  const { strategy } = await inquirer.prompt<{ strategy: UpdateStrategy }>([
    {
      type: 'list',
      name: 'strategy',
      message: '更新方法を選択してください:',
      choices: [
        {
          name: 'Update - 既存の内容に新しい情報を追加（マージ）',
          value: 'update',
        },
        {
          name: 'Overwrite - 既存の内容を完全に置き換える',
          value: 'overwrite',
        },
        {
          name: 'Skip - キャンセルして終了',
          value: 'skip',
        },
      ],
    },
  ]);

  return strategy;
}

/**
 * Quick Mode: Background情報のプロンプト
 */
export async function promptQuickBackground(): Promise<Partial<ContextData>> {
  const answers = await inquirer.prompt<{
    purpose: string;
    audience: string;
    keyMessages: string;
    timeConstraint: string;
    tone: string;
  }>([
    {
      type: 'input',
      name: 'purpose',
      message: 'プレゼンテーションの目的を入力してください:',
      validate: (input) => {
        const required = validateRequired(input);
        if (required !== true) return required;
        return validateMinLength(10)(input);
      },
    },
    {
      type: 'input',
      name: 'audience',
      message: '対象聴衆を入力してください（例: 経営陣、技術チーム、新入社員）:',
      validate: validateRequired,
    },
    {
      type: 'input',
      name: 'keyMessages',
      message: '主要メッセージを入力してください（カンマ区切り）:',
      validate: validateRequired,
    },
    {
      type: 'input',
      name: 'timeConstraint',
      message: '時間制限を入力してください（任意、例: 30分）:',
    },
    {
      type: 'list',
      name: 'tone',
      message: 'トーン・スタイルを選択してください:',
      choices: toneOptions,
    },
  ]);

  // カンマ区切りの文字列を配列に変換
  const keyMessages = answers.keyMessages
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);

  // 制約条件を構築
  const constraints = answers.timeConstraint
    ? `時間制限: ${answers.timeConstraint}`
    : '';

  return {
    purpose: answers.purpose,
    audience: answers.audience,
    keyMessages,
    constraints,
    tone: answers.tone,
  };
}

/**
 * Quick Mode: Notes情報のプロンプト
 */
export async function promptQuickNotes(): Promise<Partial<ContextData>> {
  const answers = await inquirer.prompt<{
    todos: string;
    ideas: string;
    references: string;
  }>([
    {
      type: 'input',
      name: 'todos',
      message: 'TODOリストを入力してください（改行またはカンマ区切り）:',
    },
    {
      type: 'input',
      name: 'ideas',
      message: 'アイデアを入力してください（任意、改行またはカンマ区切り）:',
    },
    {
      type: 'input',
      name: 'references',
      message: '参考資料を入力してください（任意、改行またはカンマ区切り）:',
    },
  ]);

  return {
    todos: parseSeparatedList(answers.todos),
    ideas: parseSeparatedList(answers.ideas),
    references: parseSeparatedList(answers.references),
    questions: [],
  };
}

/**
 * Detailed Mode: Background情報のプロンプト
 */
export async function promptDetailedBackground(): Promise<Partial<ContextData>> {
  console.log('\n📝 エディタが開きます。詳細な情報を入力してください。');
  console.log('   保存して閉じると次の項目に進みます。\n');

  const answers = await inquirer.prompt<{
    purposeDetail: string;
    audienceDetail: string;
    keyMessagesDetail: string;
    constraintsDetail: string;
    tone: string;
  }>([
    {
      type: 'editor',
      name: 'purposeDetail',
      message: 'プレゼンテーションの目的を入力してください:',
      validate: (input) => {
        const required = validateRequired(input);
        if (required !== true) return required;
        return validateMinLength(10)(input);
      },
    },
    {
      type: 'editor',
      name: 'audienceDetail',
      message: '対象聴衆について詳しく入力してください:',
      validate: validateRequired,
    },
    {
      type: 'editor',
      name: 'keyMessagesDetail',
      message: '主要メッセージを入力してください（1行1項目）:',
      validate: validateRequired,
    },
    {
      type: 'editor',
      name: 'constraintsDetail',
      message: '制約条件を入力してください（時間、予算、リソースなど）:',
    },
    {
      type: 'list',
      name: 'tone',
      message: 'トーン・スタイルを選択してください:',
      choices: toneOptions,
    },
  ]);

  // 改行区切りの文字列を配列に変換
  const keyMessages = answers.keyMessagesDetail
    .split('\n')
    .map((m) => m.trim())
    .filter(Boolean);

  return {
    purpose: answers.purposeDetail.trim(),
    audience: answers.audienceDetail.trim(),
    keyMessages,
    constraints: answers.constraintsDetail.trim(),
    tone: answers.tone,
  };
}

/**
 * Detailed Mode: Notes情報のプロンプト
 */
export async function promptDetailedNotes(): Promise<Partial<ContextData>> {
  console.log('\n📝 エディタが開きます。詳細な情報を入力してください。');
  console.log('   保存して閉じると次の項目に進みます。\n');

  const answers = await inquirer.prompt<{
    todosDetail: string;
    ideasDetail: string;
    referencesDetail: string;
    questionsDetail: string;
  }>([
    {
      type: 'editor',
      name: 'todosDetail',
      message: 'TODOリストを入力してください（1行1項目）:',
    },
    {
      type: 'editor',
      name: 'ideasDetail',
      message: 'アイデアを入力してください（1行1項目）:',
    },
    {
      type: 'editor',
      name: 'referencesDetail',
      message: '参考資料を入力してください（1行1項目）:',
    },
    {
      type: 'editor',
      name: 'questionsDetail',
      message: '質問・検討事項を入力してください（1行1項目）:',
    },
  ]);

  return {
    todos: parseLines(answers.todosDetail),
    ideas: parseLines(answers.ideasDetail),
    references: parseLines(answers.referencesDetail),
    questions: parseLines(answers.questionsDetail),
  };
}

/**
 * 確認プロンプト
 */
export async function promptConfirmation(data: ContextData): Promise<boolean> {
  console.log('\n📋 入力内容のプレビュー:\n');
  console.log('【Background】');
  console.log(`目的: ${data.purpose.substring(0, 100)}${data.purpose.length > 100 ? '...' : ''}`);
  console.log(`対象聴衆: ${data.audience.substring(0, 100)}${data.audience.length > 100 ? '...' : ''}`);
  console.log(`主要メッセージ: ${data.keyMessages.length}件`);
  if (data.constraints) {
    console.log(`制約条件: ${data.constraints.substring(0, 100)}${data.constraints.length > 100 ? '...' : ''}`);
  }
  console.log(`トーン: ${data.tone}`);

  console.log('\n【Notes】');
  console.log(`TODO: ${data.todos.length}件`);
  console.log(`アイデア: ${data.ideas.length}件`);
  console.log(`参考資料: ${data.references.length}件`);
  console.log(`質問・検討事項: ${data.questions.length}件\n`);

  const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'この内容でcontextファイルを作成しますか?',
      default: true,
    },
  ]);

  return confirm;
}
