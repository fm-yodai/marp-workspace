# Marp マルチデッキプレゼンテーションワークスペース

[Marp](https://marp.app/)（Markdown Presentation Ecosystem）を使用して、複数のプレゼンテーションデッキを作成・管理するための完全なワークスペースです。

## 機能

- **テンプレートシステム** - 主要機能のサンプルを含む再利用可能なテンプレートデッキ
- **カスタムテーマ** - CSS変数による簡単なカスタマイズが可能なプロフェッショナルな企業テーマ
- **自動ビルド** - HTML、PDF、PowerPointエクスポート用のnpmスクリプト
- **整理された構造** - 各プレゼンテーションは独自のディレクトリとアセットを持つ
- **ライブプレビュー** - 自動リロード付きウォッチモードで高速開発
- **バージョン管理** - プレーンなMarkdownファイルはgitと完璧に連携

## クイックスタート

**このワークスペースは初めてですか？** 詳細なステップバイステップのインストール手順については、[セットアップガイド（SETUP.md）](SETUP.md)をご覧ください。

**既にセットアップ済みですか？** プレゼンテーション作成を始めるには、[使い方](#使い方)にジャンプしてください。

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

## 使い方

### 単一デッキコマンド（主なワークフロー）

| コマンド | 説明 |
|---------|------|
| `npm run preview <path>` | 自動リロード付きライブプレビュー |
| `npm run build -- <format> <path>` | 指定フォーマットでビルド |

**例：**

```bash
# 自動リロード付きプレビュー
npm run preview decks/2026-01_sample/deck.md

# PDFにビルド
npm run build -- --pdf decks/2026-01_sample/deck.md

# PowerPointにビルド
npm run build -- --pptx decks/2026-01_sample/deck.md

# 編集可能なPowerPointにビルド（LibreOfficeが必要）
npm run build -- --pptx --pptx-editable decks/2026-01_sample/deck.md

# カスタム出力でHTMLにビルド
npm run build -- --html decks/2026-01_sample/deck.md -o dist/custom.html
```

### 全デッキコマンド

| コマンド | 説明 |
|---------|------|
| `npm run build:all:html` | 全デッキをHTMLにエクスポート |
| `npm run build:all:pdf` | 全デッキをPDFにエクスポート |
| `npm run build:all:pptx` | 全デッキをPowerPointにエクスポート |
| `npm run build:all:pptx:editable` | 全デッキを編集可能なPPTXにエクスポート |
| `npm run build:all` | 全デッキをHTML + PDF + PPTXにビルド |

**例：**

```bash
# 全デッキをPDFにビルド
npm run build:all:pdf

# 全デッキを全標準フォーマットにビルド
npm run build:all
```

### ユーティリティコマンド

| コマンド | 説明 |
|---------|------|
| `npm run clean` | dist/とnode_modules/を削除 |

## 新しいデッキの作成

### ステップバイステップワークフロー

```bash
# 1. テンプレートディレクトリをコピー
cp -r decks/000_template decks/2026-02_my-project

# 2. デッキを編集
# エディタでdecks/2026-02_my-project/deck.mdを開く

# 3. アセットを追加
# 画像をdecks/2026-02_my-project/assets/に配置

# 4. 自動リロード付きでプレビュー
npm run preview decks/2026-02_my-project/deck.md

# 5. お好みのフォーマットでビルド
npm run build -- --pdf decks/2026-02_my-project/deck.md
```

### 命名規則

フォーマット：`YYYY-MM_説明的な名前`

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
│   └── settings.json           # VS Code Marp設定
├── package.json                # npmスクリプトと依存関係
├── README.md                   # このファイル
├── CLAUDE.md                   # AIアシスタント指示
├── decks/                      # 全プレゼンテーションデッキ
│   ├── 000_template/           # 再利用可能なテンプレート
│   │   ├── deck.md            # 例付きテンプレート
│   │   └── assets/            # テンプレートアセット
│   └── 2026-01_sample/        # サンプルデッキ
│       ├── deck.md            # サンプルプレゼンテーション
│       └── assets/            # サンプルアセット
├── shared/                     # 共有リソース
│   ├── themes/                # カスタムテーマ
│   │   └── company.css        # 企業テーマ
│   └── assets/                # 共有アセット（ロゴなど）
└── dist/                       # ビルド出力（gitignoreされています）
    ├── html/                  # HTMLエクスポート
    ├── pdf/                   # PDFエクスポート
    ├── pptx/                  # PowerPointエクスポート
    └── pptx-editable/         # 編集可能なPPTXエクスポート
```

## リソース

- **Marp公式サイト：** [marp.app](https://marp.app/)
- **Marp CLIドキュメント：** [github.com/marp-team/marp-cli](https://github.com/marp-team/marp-cli)
- **Marpit Markdown：** [marpit.marp.app/markdown](https://marpit.marp.app/markdown)
- **テーマCSSガイド：** [marpit.marp.app/theme-css](https://marpit.marp.app/theme-css)
- **Marp for VS Code：** [marketplace.visualstudio.com](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)
- **LibreOfficeダウンロード：** [libreoffice.org/download](https://www.libreoffice.org/download/download/)

## ライセンス

このワークスペースはプレゼンテーション作成のためにそのまま提供されます。このワークスペースで作成された個々のプレゼンテーションは、それぞれの作成者が所有します。
