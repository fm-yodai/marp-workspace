# Marp マルチデッキプレゼンテーションワークスペース

[Marp](https://marp.app/)（Markdown Presentation Ecosystem）を使用して、複数のプレゼンテーションデッキを作成・管理するための完全なワークスペースです。

## 機能

- **npm Workspaces アーキテクチャ** - 各デッキが独立したビルドスクリプトを持ちながら、node_modulesは共有してディスク容量を節約（~177MBのみ）
- **OCR変換ツール** - Mistral Vision/OCR APIを使用してPowerPointプレゼンテーションをMarp形式に変換
- **デッキジェネレーター** - インタラクティブなTUIで新規デッキを簡単作成、テンプレート継承にも対応
- **テンプレートシステム** - 主要機能のサンプルを含む再利用可能なテンプレートデッキ
- **カスタムテーマ** - CSS変数による簡単なカスタマイズが可能なプロフェッショナルな企業テーマ
- **Per-Deck 開発環境** - 各デッキ内で `npm run dev` によるプレビュー・ビルドが可能
- **AIコンテキスト対応** - 各デッキに `context/` ディレクトリを配置してAIと協働
- **整理された構造** - 各プレゼンテーションは独自のディレクトリとアセットを持つ
- **ライブプレビュー** - 自動リロード付きウォッチモードで高速開発
- **バージョン管理** - プレーンなMarkdownファイルはgitと完璧に連携

## クイックスタート

**このワークスペースは初めてですか？** 詳細なステップバイステップのインストール手順については、[セットアップガイド（SETUP.md）](SETUP.md)をご覧ください。

**既にセットアップ済みですか？** プレゼンテーション作成を始めるには、[使い方](#使い方)にジャンプしてください。

## AIアシスタント対応

このワークスペースは**Claude Code**と**GitHub Copilot**の両方に対応しています。

### Claude Code

- `.claude/skills/marp.md` にMarp専用スキルが含まれています
- `/marp` コマンドでスキルを呼び出せます
- スライド作成時に自動的にアクティベートされます

### GitHub Copilot

- `.github/skills/marp/SKILL.md` にAgent Skillが含まれています
- **セットアップ**: VS Code設定で以下を有効にしてください：
  ```json
  {
    "chat.useAgentSkills": true
  }
  ```
  （このワークスペースでは`.vscode/settings.json`に既に設定済み）
- スライド作成時にCopilotが自動的にこのスキルを使用します

### 詳細ドキュメント

包括的なMarpドキュメントは `docs/marp/` にあります：
- **README.md**: 概要とナビゲーション
- **01_marp_overview.md**: Marpエコシステム
- **02_marp_cli_usage.md**: CLI完全リファレンス
- **03_markdown_syntax.md**: Markdown拡張構文
- **04_directives.md**: ディレクティブガイド
- **05_theme_development.md**: テーマ開発
- **06_practical_examples.md**: 実践的な例とテンプレート

## 前提条件

### 必須

- **Node.js** v18以上（[ダウンロード](https://nodejs.org/)）
  - 確認方法：`node --version`
  - npm v8以上はNode.jsに含まれています
- **ChromiumまたはChrome**（PDF/PPTXエクスポートに必要）
  - ほとんどのシステムで通常は自動的にインストールされています

### オプション

- **LibreOffice Impress**（`--pptx-editable`オプションにのみ必要）
  - [LibreOffice Impressのセットアップ](#libreoffice-impressのセットアップ)セクションを参照
- **VS Code**と[Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)拡張機能
  - エディタ内でのプレビューとエクスポートが可能になります
  - GitHub Copilot Agent Skillsを使用する場合に推奨

## セットアップ

依存関係をインストールします：

```bash
npm install
```

これにより：
- `@marp-team/marp-cli`がインストールされます
- `dist/`出力ディレクトリが自動作成されます

### LibreOffice Impressのセットアップ

`--pptx-editable`オプションにはLibreOffice Impressが必要です。**これはオプションです** - 標準のPPTXエクスポートはこれなしで動作します。

#### Linux（Debian/Ubuntu）

```bash
sudo apt update
sudo apt install libreoffice-impress
```

#### Linux（RHEL/CentOS/Fedora）

```bash
sudo dnf install libreoffice-impress
# または古いシステムの場合
sudo yum install libreoffice-impress
```

#### macOS

```bash
# Homebrewを使用
brew install --cask libreoffice

# または公式ウェブサイトからダウンロード
# https://www.libreoffice.org/download/download/
```

#### Windows

1. https://www.libreoffice.org/download/download/ からLibreOfficeインストーラーをダウンロード
2. インストーラーを実行
3. 「LibreOffice Impress」コンポーネントが選択されていることを確認
4. インストールを完了し、プロンプトが表示されたら再起動

#### インストールの確認

```bash
# Linux/macOS
which libreoffice
soffice --version

# Windows（コマンドプロンプト）
where soffice
"C:\Program Files\LibreOffice\program\soffice.exe" --version
```

## npm Workspaces アーキテクチャ

このワークスペースはnpm workspaces型アーキテクチャを採用しています：

### メリット

- ✅ **ディスク容量最小化**: node_modulesはワークスペースルートのみ（~177MB）、デッキ数に関係なく
- ✅ **Per-Deck 開発**: 各デッキで `cd decks/my-deck && npm run dev` が可能
- ✅ **一元管理**: ルートで一度 `npm install` すれば全デッキ対応
- ✅ **バージョン統一**: 全デッキで同じMarp CLIバージョンを使用、一貫性確保
- ✅ **npm標準機能**: 追加ツール不要

### 仕組み

- ワークスペースルートの `package.json` に `"workspaces": ["decks/*"]` を定義
- 各デッキは独自の `package.json` を持つ（スクリプトのみ、依存関係なし）
- 全デッキがワークスペースルートの `node_modules/` を共有参照

## 使い方

### OCRでPowerPointを変換（新機能）

既存のPowerPointプレゼンテーションをMarp形式に変換：

```bash
# 1. Python依存関係のインストール
npm run ocr:install

# 2. Mistral APIキーの設定
export MISTRAL_API_KEY="your_api_key_here"

# 3. PPTXファイルの変換
npm run ocr:convert -- presentation.pptx -o 2026-01_converted

# 4. 結果のプレビュー
cd decks/2026-01_converted
npm run dev
```

**変換戦略：**
- `background`（デフォルト）- 完璧な視覚的忠実度、背景画像として保存
- `hybrid` - 背景画像 + 編集可能なテキストオーバーレイ
- `reconstruction` - 完全なMarkdown再構築、最大の編集可能性

詳細については、[OCR変換ドキュメント](docs/ocr-conversion/)を参照してください。

### 新規デッキの作成（推奨）

インタラクティブなTUIでデッキを作成：

```bash
npm run create-deck
```

プロンプトで以下を選択：
1. デッキ名（format: YYYY-MM_description）
2. テンプレートソース（デフォルトまたは既存デッキ）
3. プレゼンテーションタイトル
4. package.jsonスクリプトの継承（既存デッキ選択時）

作成後、すぐに開発開始可能。

### Per-Deck 開発ワークフロー

各デッキ内で独立して開発：

```bash
# デッキディレクトリに移動
cd decks/2026-01_sample

# プレビュー + 自動リロード
npm run dev

# ビルド
npm run build        # HTML
npm run build:pdf    # PDF
npm run build:pptx   # PowerPoint
npm run build:all    # 全形式
```

### ワークスペースルートからのビルド

```bash
# 特定デッキをビルド
npm run build:deck -- 2026-01_sample          # 全形式
npm run build:deck -- 2026-01_sample html     # HTML のみ
npm run build:deck -- 2026-01_sample pdf      # PDF のみ
npm run build:deck -- 2026-01_sample pptx     # PowerPoint のみ
npm run build:deck -- 2026-01_sample editable # 編集可能PPTX
```

### 利用可能なコマンド（ワークスペースルート）

| コマンド | 説明 |
|---------|------|
| `npm run create-deck` | 新規デッキを作成（TUI） |
| `npm run ocr:convert -- <pptx> -o <name>` | PPTXをMarpに変換 |
| `npm run ocr:install` | OCR用Python依存関係をインストール |
| `npm run build:deck -- <name> [format]` | 特定デッキをビルド |
| `npm run clean` | dist/とnode_modules/を削除 |

### 利用可能なコマンド（各デッキ内）

| コマンド | 説明 |
|---------|------|
| `npm run dev` | プレビュー + 自動リロード |
| `npm run preview` | devのエイリアス |
| `npm run serve` | HTTPサーバーでプレビュー |
| `npm run build` | HTMLにビルド |
| `npm run build:pdf` | PDFにビルド |
| `npm run build:pptx` | PowerPointにビルド |
| `npm run build:editable` | 編集可能なPowerPointにビルド |
| `npm run build:all` | 全形式にビルド |

## AIコンテキストディレクトリ

各デッキには `context/` ディレクトリがあり、AIエージェント（Claude等）と協働する際のコンテキスト情報を格納できます：

```
decks/my-deck/
├── context/
│   ├── README.md       # このディレクトリの使い方
│   ├── background.md   # プレゼンの背景・目的・聴衆
│   └── notes.md        # アイデア・TODO・メモ
├── deck.md
└── assets/
```

### 使い方

1. **background.md** にプレゼンテーションの目的、対象聴衆、主要メッセージを記述
2. **notes.md** にアイデア、TODO、参考資料を記録
3. AIにスライド作成を依頼する際、このコンテキストを参照させる

このディレクトリの内容はスライドには含まれませんが、AIがより適切なサポートを提供するための重要な情報源となります。

## 命名規則

デッキ名のフォーマット：`YYYY-MM_説明的な名前`

**例：**
- `2026-01_quarterly-review`
- `2026-03_product-launch`
- `2026-06_team-offsite`

これにより、デッキがファイルシステム内で時系列順にソートされます。

## テーマの操作

### 企業テーマの使用

カスタム`company`テーマは既にテンプレートで設定されています。使用するには、デッキのフロントマターに追加します：

```yaml
---
marp: true
theme: company
paginate: true
size: 16:9
---
```

### 色のカスタマイズ

`shared/themes/company.css`を編集し、`:root`のCSS変数を変更します：

```css
:root {
  --color-background: #ffffff;
  --color-foreground: #24292e;
  --color-highlight: #0366d6;
  --color-dimmed: #6a737d;
}
```

### 新しいテーマの追加

1. `shared/themes/mytheme.css`を作成
2. 先頭にテーマ識別子を追加：`/* @theme mytheme */`
3. スタイルを定義
4. デッキで使用：`theme: mytheme`

### ビルトインテーマ

Marpには以下のテーマが含まれています（CSSファイル不要）：
- `default` - クリーンでシンプル
- `gaia` - モダンでカラフル
- `uncover` - ミニマリストなリビールスタイル

## 出力フォーマットの比較

| フォーマット | 用途 | 長所 | 短所 |
|------------|------|------|------|
| **HTML** | Web共有、インタラクティブ | 最小ファイルサイズ、どこでも動作 | ブラウザが必要 |
| **PDF** | 印刷、アーカイブ | ユニバーサル、レイアウト保持 | 大きなファイルサイズ |
| **PPTX** | PowerPointでのさらなる編集 | Officeで編集可能 | レイアウトの違いあり |
| **PPTX（編集可能）** | 大幅な編集が必要 | より編集可能なレイヤー | LibreOfficeが必要、レイアウトの問題 |

### 編集可能なPPTXに関する注意

- システムにLibreOffice Impressがインストールされている必要があります
- `--pptx-editable`フラグを使用
- レイアウト/スタイリングの不一致がある場合があります
- PowerPointで大幅に変更する出発点として最適
- **ほとんどの用途には標準PPTXを推奨**

## Tips & ベストプラクティス

### 画像
- 追加前に最適化（各1MB未満を推奨）
- 相対パスを使用：`assets/image.png`
- サポートされているフォーマット：PNG、JPG、SVG、GIF

### アセット
- 移植性のためデッキごとに保持
- 説明的なファイル名を使用
- ライセンスのため画像ソースを記録

### バージョン管理
- ソースの`.md`ファイルをコミット
- `dist/`出力はコミットしない（既に`.gitignore`に含まれています）
- 意味のあるコミットメッセージを含める

### スライドデザイン
- 20分間のプレゼンテーションには10〜20スライドを目指す
- スライドごとに1つの主要なアイデア
- テキストをサポートするために視覚要素を使用
- スライドあたりテキストを6行に制限

### コードブロック
構文ハイライトを使用：

````markdown
```javascript
function example() {
  console.log('Hello, Marp!');
}
```
````

サポートされている言語：JavaScript、Python、Java、Go、Rustなど多数。

### 2カラムレイアウト

HTMLグリッドを使用：

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
<div>

左側のコンテンツ

</div>
<div>

右側のコンテンツ

</div>
</div>
```

### スピーカーノート

スライド区切りの後に追加（プレゼンテーションには表示されません）：

```markdown
---

# スライドタイトル

ここにコンテンツ

<!--
ここにスピーカーノート
- Xについて言及することを忘れずに
- Yを強調
-->
```

## トラブルシューティング

### インストールの問題

**エラー：Cannot find module '@marp-team/marp-cli'**

解決策：
```bash
npm install
```

### ビルドの問題

**エラー：PDF/PPTX生成が失敗**

解決策：
- ビルドスクリプトに`--allow-local-files`が含まれていることを確認（既に設定済み）
- アセットが相対パスを使用していることを確認：`assets/image.png`（`/assets/image.png`ではなく）
- Chromium/Chromeがインストールされていることを確認
- ファイルパスにタイプミスがないか確認

**画像がPDF/PPTXに表示されない**

解決策：
- deck.mdの場所からの相対パスを使用
- 指定されたパスに画像ファイルが存在することを確認
- `--allow-local-files`フラグが存在することを確認（既にスクリプトに含まれています）
- 最後の手段として絶対パスを試す

### テーマの問題

**テーマが適用されない**

解決策：
- テーマ名がCSSファイルの`/* @theme name */`と一致することを確認
- フロントマターに正しい`theme: name`があることを確認
- npmスクリプトに`--theme-set ./shared/themes`があることを確認（既に設定済み）
- プレビューを使用している場合はブラウザキャッシュをクリア

**カスタムスタイルが機能しない**

解決策：
- CSSは`shared/themes/`ディレクトリにある必要があります
- テーマファイルは`/* @theme themename */`で始まる必要があります
- CSSの構文エラーを確認
- CSS変更後にプレビューを再起動

### 編集可能なPPTXの問題

**エラー：「LibreOffice is required for editable PPTX」**

解決策：
- LibreOffice Impressをインストール（[セットアップ](#libreoffice-impressのセットアップ)参照）
- 確認：`soffice --version`
- LibreOfficeがシステムPATHにあることを確認

**エラー：「Cannot find LibreOffice」（インストール済みにもかかわらず）**

解決策：
- **Linux：** シンボリックリンクを作成：`sudo ln -s /usr/bin/libreoffice /usr/bin/soffice`
- **macOS：** PATHに追加：`export PATH="/Applications/LibreOffice.app/Contents/MacOS:$PATH"`
- **Windows：** システムPATHに追加：
  1. スタートメニューで「環境変数」を検索
  2. 「Path」変数を編集
  3. `C:\Program Files\LibreOffice\program\`を追加

**編集可能なPPTXにレイアウト/フォーマットの問題がある**

予想される動作：
- 編集可能なPPTXは忠実度よりも編集可能性を優先
- 複雑なCSSは完璧に変換されない場合があります
- より良いレイアウト保持には標準`--pptx`を使用
- 編集可能なPPTXはPowerPointでの大幅な変更に最適

**LibreOfficeプロセスが変換中にハング**

解決策：
- スタックしたプロセスを終了：
  - Linux/macOS：`pkill soffice`
  - Windows：タスクマネージャー → LibreOfficeプロセスを終了
- 再試行（時折のタイミングの問題）
- LibreOfficeが既に実行されていないことを確認

### プレビューの問題

**プレビューサーバーが自動リロードしない**

解決策：
- ファイルを保存してリロードをトリガー
- ターミナルでエラーメッセージを確認
- 再起動：`npm run preview decks/your-deck/deck.md`
- ブラウザキャッシュをクリア
- ハードリフレッシュを試す（Ctrl+Shift+RまたはCmd+Shift+R）

**プレビューが空白ページを表示**

解決策：
- ターミナルでエラーを確認
- Markdown構文を確認（フロントマターが欠けていませんか？）
- ファイルに`.md`拡張子があることを確認
- 詳細なエラーを確認するためHTMLへのビルドを試す

### プラットフォーム固有の問題

**Windows：コマンドのパスの問題**

解決策：
- npmスクリプトはフォワードスラッシュを使用（Windowsでも動作）
- コマンドでもフォワードスラッシュを使用
- バックスラッシュを避ける：`decks/myproject/deck.md`（`decks\myproject\deck.md`ではなく）

**Linux：Permission denied**

解決策：
- npmコマンドで`sudo`を使用しない
- npm権限を修正：https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally

## 高度な設定

### カスタムMarp設定

グローバル設定のためにルートに`.marprc.yml`を作成：

```yaml
options:
  allowLocalFiles: true
  themeSet: ./shared/themes
```

### PDFエクスポートオプション

品質設定を追加：

```bash
npm run build -- --pdf --pdf-options.preset=default decks/mydeck/deck.md
```

利用可能なプリセット：`default`、`screen`、`ebook`、`printer`、`prepress`

### カスタムスライドサイズ

フロントマターで：

```yaml
# 標準の縦横比
size: 4:3
size: 16:9

# カスタム寸法（ピクセル）
size: 1920x1080
```

### ローカルアセット付きHTML

既にスクリプトで`--html --allow-local-files`として設定されています。これにより以下が可能：
- ローカル画像参照
- カスタムフォント
- 埋め込みアセット

### 背景画像

スライドごとの背景：

```markdown
<!-- _backgroundImage: "url('assets/background.jpg')" -->

# 背景付きスライド
```

## ディレクトリ構造

```
marp-workspace/
├── .gitignore                   # Git除外ルール
├── .vscode/
│   └── settings.json           # VS Code設定（Copilot Agent Skills有効化済み）
├── .claude/
│   └── skills/
│       └── marp.md             # Claude Code用Marpスキル
├── .github/
│   ├── skills/
│   │   └── marp/
│   │       └── SKILL.md        # GitHub Copilot Agent Skill
│   └── copilot-instructions.md # Copilot グローバル指示
├── package.json                # Workspaces定義と共有依存関係
├── node_modules/               # 全デッキで共有（~177MB）
├── README.md                   # このファイル
├── CLAUDE.md                   # Claude Code指示
├── SETUP.md                    # セットアップガイド
├── scripts/                    # 管理スクリプト
│   ├── create-deck.ts         # デッキ生成スクリプト
│   ├── build-deck.ts          # デッキビルドスクリプト
│   ├── tsconfig.json          # TypeScript設定
│   └── utils/                 # ユーティリティモジュール
├── templates/                  # デッキ雛形
│   └── default/               # デフォルトテンプレート
│       ├── package.json       # スクリプト定義
│       ├── .marprc            # Marp設定
│       ├── deck.md            # テンプレートMarkdown
│       ├── assets/            # アセット
│       └── context/           # AIコンテキスト
├── docs/
│   ├── marp/                   # 包括的なMarpドキュメント
│   │   ├── README.md           # ドキュメント概要
│   │   ├── 01_marp_overview.md
│   │   ├── 02_marp_cli_usage.md
│   │   ├── 03_markdown_syntax.md
│   │   ├── 04_directives.md
│   │   ├── 05_theme_development.md
│   │   └── 06_practical_examples.md
│   └── ocr-conversion/         # OCR変換ドキュメント
│       ├── README.md           # 概要とクイックスタート
│       ├── installation.md     # セットアップ手順
│       ├── usage.md            # CLIリファレンス
│       ├── strategies.md       # 変換戦略の比較
│       └── troubleshooting.md  # トラブルシューティング
├── decks/                      # 全プレゼンテーションデッキ
│   ├── 000_template/           # 再利用可能なテンプレート
│   │   ├── package.json       # Per-deckスクリプト
│   │   ├── .marprc            # Marp設定
│   │   ├── deck.md            # 例付きテンプレート
│   │   ├── assets/            # テンプレートアセット
│   │   ├── context/           # AIコンテキスト
│   │   └── dist/              # ビルド出力
│   └── 2026-01_sample/        # サンプルデッキ
│       ├── package.json       # Per-deckスクリプト
│       ├── .marprc            # Marp設定
│       ├── deck.md            # サンプルプレゼンテーション
│       ├── assets/            # サンプルアセット
│       ├── context/           # AIコンテキスト
│       └── dist/              # ビルド出力
├── shared/                     # 共有リソース
│   ├── themes/                # カスタムテーマ
│   │   └── company.css        # 企業テーマ
│   └── assets/                # 共有アセット（ロゴなど）
└── dist/                       # ワークスペースレベルビルド出力（非推奨）
    ├── html/                  # HTMLエクスポート
    ├── pdf/                   # PDFエクスポート
    ├── pptx/                  # PowerPointエクスポート
    └── pptx-editable/         # 編集可能なPPTXエクスポート
```

## リソース

### Marp関連
- **Marp公式サイト：** [marp.app](https://marp.app/)
- **Marp CLIドキュメント：** [github.com/marp-team/marp-cli](https://github.com/marp-team/marp-cli)
- **Marpit Markdown：** [marpit.marp.app/markdown](https://marpit.marp.app/markdown)
- **テーマCSSガイド：** [marpit.marp.app/theme-css](https://marpit.marp.app/theme-css)
- **Marp for VS Code：** [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)

### OCR変換関連
- **Mistral AI Console：** [console.mistral.ai](https://console.mistral.ai)
- **OCR変換ドキュメント：** [docs/ocr-conversion/](docs/ocr-conversion/)
- **LibreOfficeダウンロード：** [libreoffice.org/download](https://www.libreoffice.org/download/download/)

## ライセンス

このワークスペースはプレゼンテーション作成のためにそのまま提供されます。このワークスペースで作成された個々のプレゼンテーションは、それぞれの作成者が所有します。
