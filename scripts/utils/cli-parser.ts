/**
 * CLI argument parsing utilities using Commander.js
 */

import { Command } from 'commander';

/**
 * create-context用のコマンド定義
 */
export function createContextCommand(): Command {
  const program = new Command();

  program
    .name('create-context')
    .description('Marpデッキのcontextファイルを作成または更新')
    .option('-d, --deck <name>', '対象デッキ名')
    .option('-c, --config <path>', 'JSON設定ファイルパス')
    .option('--purpose <text>', 'プレゼンテーションの目的（10文字以上）')
    .option('--audience <text>', '対象聴衆')
    .option('-m, --key-messages <items>', '主要メッセージ（カンマ区切り）')
    .option('--time-constraint <text>', '時間制限')
    .option('--tone <type>', 'トーン（formal/casual/technical/business または 日本語）')
    .option('--todos <items>', 'TODOリスト（カンマ区切り）')
    .option('--ideas <items>', 'アイデア（カンマ区切り）')
    .option('--references <items>', '参考資料（カンマ区切り）')
    .option('--questions <items>', '質問・検討事項（カンマ区切り）')
    .option('-u, --update-mode <mode>', '更新方法（update/overwrite/skip）')
    .option('-y, --yes', '確認プロンプトをスキップ')
    .helpOption('-h, --help', 'ヘルプを表示');

  return program;
}

/**
 * create-deck用のコマンド定義
 */
export function createDeckCommand(): Command {
  const program = new Command();

  program
    .name('create-deck')
    .description('新しいMarpデッキを作成')
    .option('-n, --name <name>', 'デッキ名（YYYY-MM_description形式）')
    .option('-c, --config <path>', 'JSON設定ファイルパス')
    .option('-t, --title <text>', 'プレゼンテーションタイトル')
    .option('--template <source>', 'テンプレートソース（default または既存デッキ名）')
    .option('--inherit-scripts', 'package.jsonスクリプトを継承')
    .option('-y, --yes', '確認プロンプトをスキップ')
    .helpOption('-h, --help', 'ヘルプを表示');

  return program;
}

/**
 * コマンドライン引数をパース
 */
export function parseArgs(command: Command, args: string[] = process.argv): any {
  command.parse(args);
  return command.opts();
}

/**
 * 非インタラクティブモードかどうかを判定
 *
 * 以下の条件のいずれかを満たす場合、非インタラクティブモードと判定:
 * - --config オプションが指定されている
 * - 必須オプションが全て指定されている（コマンドごとに異なる）
 */
export function isNonInteractiveMode(opts: any, requiredFields: string[]): boolean {
  // --config が指定されている場合は非インタラクティブモード
  if (opts.config) {
    return true;
  }

  // 必須フィールドが全て指定されている場合は非インタラクティブモード
  const hasAllRequired = requiredFields.every(field => {
    const value = opts[field];
    return value !== undefined && value !== null && value !== '';
  });

  return hasAllRequired;
}
