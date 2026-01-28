# Marpワークスペースセットアップガイド

Marpプレゼンテーションワークスペースをゼロからセットアップするためのステップバイステップガイドです。Node.jsとnpmに慣れている方は、[README.md](README.md#セットアップ)のクイックセットアップをご覧ください。

## 概要

このガイドでは以下を支援します：
- 必要なソフトウェアのインストール（Node.js v18以上、npm）
- リポジトリをコンピュータに取得
- npm workspaces環境のセットアップ
- テストプレゼンテーションでインストールを確認
- 新規デッキの作成ワークフロー
- ワークフロー強化のためのオプションツールのセットアップ

所要時間：初回セットアップで10〜15分。

## npm Workspaces について

このワークスペースはnpm workspaces型アーキテクチャを使用しています：

- **ワークスペースルート**で一度`npm install`すれば、全デッキで使用可能
- 各デッキは独立したビルドスクリプトを持つが、`node_modules/`は共有
- ディスク容量を最小化（~177MBのみ、デッキ数に関係なく）
- 全デッキで同じMarp CLIバージョンを使用し、一貫性を確保

## 前提条件の確認

始める前に、既にインストールされているものを確認しましょう。

### 必要なソフトウェア

#### 1. Node.js（v18以上）

Node.jsにはnpm（Node Package Manager）が含まれており、Marpのインストールに使用します。

**既にインストールされているか確認：**

```bash
node --version
npm --version
```

バージョン番号が表示された場合（例：Node.jsで`v20.x.x`、npmで`10.x.x`）、準備完了です。表示されない場合は、以下のインストール手順に進んでください。

#### 2. Git（リポジトリのクローン用）

**既にインストールされているか確認：**

```bash
git --version
```

バージョン番号が表示された場合、Gitがインストールされています。

#### 3. ChromiumまたはChrome

これは通常、ほとんどのシステムにプリインストールされています。MarpはこれをPDFおよびPowerPointエクスポートに使用します。今確認する必要はありません - テスト手順で動作を確認します。

## インストール手順

### ステップ1：Node.jsのインストール

お使いのオペレーティングシステムを選択：

#### Windows

1. [nodejs.org](https://nodejs.org/)にアクセス
2. 「LTS」（Long Term Support）版インストーラーをダウンロード
3. インストーラーを実行
4. デフォルトを受け入れる（「Add to PATH」を含む）
5. ターミナル/コマンドプロンプトを再起動

**確認：**
```bash
node --version
npm --version
```

#### macOS

**オプションA：公式インストーラー（初心者に推奨）**

1. [nodejs.org](https://nodejs.org/)にアクセス
2. 「LTS」版インストーラーをダウンロード
3. `.pkg`ファイルを実行
4. インストールプロンプトに従う
5. ターミナルを再起動

**オプションB：Homebrewを使用（Homebrewがある場合）**

```bash
brew install node
```

**確認：**
```bash
node --version
npm --version
```

#### Linux

**Debian/Ubuntu：**

```bash
# Node.js 20.x（LTS）をインストール
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# インストールを確認
node --version
npm --version
```

**RHEL/CentOS/Fedora：**

```bash
# Node.js 20.x（LTS）をインストール
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs

# インストールを確認
node --version
npm --version
```

**その他のディストリビューション：** [Node.jsパッケージマネージャーの手順](https://nodejs.org/en/download/package-manager/)を参照

### ステップ2：リポジトリの取得

2つのオプションがあります：

#### オプションA：Gitでクローン（推奨）

Gitがインストールされている場合：

```bash
# プロジェクトを配置したい場所に移動
cd ~/Documents  # または任意のディレクトリ

# リポジトリをクローン
git clone <repository-url>

# ディレクトリに入る
cd marp-workspace
```

#### オプションB：ZIPをダウンロード

1. リポジトリホスティングプラットフォームからZIPファイルをダウンロード
2. 希望の場所に解凍
3. そのディレクトリでターミナル/コマンドプロンプトを開く

### ステップ3：依存関係のインストール

Marp CLIとその依存関係をインストールします：

```bash
# marp-workspaceディレクトリにいることを確認
cd marp-workspace  # まだそこにいない場合

# 依存関係をインストール
npm install
```

**予想される動作：**
- npmがパッケージをダウンロードする際の進捗メッセージが表示されます
- Marp CLIと依存関係を含む`node_modules/`ディレクトリが作成されます
- ビルド出力用の`dist/`ディレクトリも作成されます
- インターネット接続によって30〜60秒かかります

**成功した場合の出力例：**
```
added 250 packages, and audited 251 packages in 30s
found 0 vulnerabilities
```

**エラーが表示された場合：**
- 正しいディレクトリにいることを確認（`package.json`が含まれているはず）
- Node.jsが正しくインストールされているか確認：`node --version`
- Linuxでは、プロジェクトディレクトリで`sudo`を使用しない
- 特定のエラーについては[README.mdのトラブルシューティングセクション](README.md#トラブルシューティング)を参照

### ステップ4：インストールの確認

Marp CLIが動作していることを確認しましょう：

```bash
# marp-cliのバージョンを確認
npx marp --version
```

`@marp-team/marp-cli v3.x.x`のようなバージョン番号が表示されるはずです

**ディレクトリ構造を確認：**

```bash
# Linux/macOS
ls -la

# Windows
dir
```

以下が表示されるはずです：
- `node_modules/`ディレクトリ
- `dist/`ディレクトリ
- `decks/`ディレクトリ
- `package.json`ファイル
- `README.md`ファイル

### ステップ5：npm Workspaces の確認

ワークスペースが正しくセットアップされたことを確認：

```bash
npm ls --workspaces
```

**予想される出力：**
```
marp-workspace@1.0.0 /path/to/marp-workspace
├── @marp-workspace/000_template@1.0.0
├── @marp-workspace/2026-01_sample@1.0.0
└── @marp-workspace/2026-02_my-project@1.0.0
```

これにより、全デッキがワークスペースとして認識されていることが確認できます。

### ステップ6：サンプルデッキでテスト（Per-Deck方式）

デッキディレクトリ内から直接プレビュー：

```bash
cd decks/2026-01_sample
npm run dev
```

**予想される動作：**
1. ターミナルに表示：`Watching for changes...`
2. デフォルトのブラウザが自動的に開きます
3. サンプルコンテンツを含むスライドプレゼンテーションが表示されます
4. ワークスペースルートの `node_modules/` を自動参照

**編集を試す：**
1. プレビューを実行したままにする
2. テキストエディタで`deck.md`を開く
3. 小さな変更を加える（例：見出しを編集）
4. ファイルを保存
5. ブラウザが自動的に変更内容で更新されます

**プレビューを停止するには：** ターミナルで`Ctrl+C`を押す

**ワークスペースルートに戻る：**
```bash
cd ../..
```

**これが動作すれば、インストールは完了です！** 🎉

### ステップ7：テストエクスポートのビルド

デッキ内でPDFビルドを試す：

```bash
cd decks/2026-01_sample
npm run build:pdf
```

**予想される動作：**
- ターミナルにビルド進捗が表示されます
- `dist/deck.pdf`にファイルが作成されます
- エラーメッセージなし

**出力を確認：**

```bash
# Linux/macOS
ls -lh dist/

# Windows
dir dist
```

`deck.pdf`が適切なファイルサイズ（コンテンツによって通常100KB〜2MB）で表示されるはずです。

**ワークスペースルートからのビルドも試す：**

```bash
cd ../..
npm run build:deck -- 2026-01_sample html
```

これにより、ワークスペースルートから特定デッキをビルドできることが確認できます。

**PDF生成が失敗した場合：**
- システムにChromium/Chromeがインストールされていることを確認
- [README.mdのトラブルシューティング - ビルドの問題](README.md#ビルドの問題)を参照

## オプションのセットアップ

### VS Code統合

Visual Studio Codeを使用している場合、Marp拡張機能でエディタ内プレビューが可能になります：

1. **VS Codeをインストール**（まだインストールしていない場合）[code.visualstudio.com](https://code.visualstudio.com/)から

2. **Marp拡張機能をインストール：**
   - VS Codeを開く
   - 拡張機能に移動（Ctrl+Shift+X / Cmd+Shift+X）
   - 「Marp for VS Code」を検索
   - Marp Teamの拡張機能でインストールをクリック

3. **拡張機能は自動的に：**
   - ワークスペース設定を検出（既に`.vscode/settings.json`で設定済み）
   - `shared/themes/`のカスタムテーマを使用
   - エディタ内プレビューとエクスポートコマンドを有効化

4. **拡張機能の使用：**
   - `decks/`ディレクトリから任意の`.md`ファイルを開く
   - 「Open Preview」ボタンをクリック（右上隅）
   - またはコマンドパレット（Ctrl+Shift+P / Cmd+Shift+P）→「Marp: Export slide deck」を使用

### LibreOffice（編集可能なPPTX用）

**注意：** これは、テキストや要素を自由に変更できる「編集可能な」PowerPointファイルをエクスポートしたい場合にのみ必要です。標準のPPTXエクスポートはLibreOfficeなしで動作します。

詳細なLibreOfficeインストール手順については、[README.md - LibreOffice Impressのセットアップ](README.md#libreoffice-impressのセットアップ)を参照してください。

**クイックサマリー：**
- **Linux：** `sudo apt install libreoffice-impress`（Debian/Ubuntu）
- **macOS：** `brew install --cask libreoffice`またはlibreoffice.orgからダウンロード
- **Windows：** [libreoffice.org/download](https://www.libreoffice.org/download/)からインストーラーをダウンロード

**確認：** `soffice --version`

**編集可能なPPTXを使用する場合：**
- PowerPointでプレゼンテーションを大幅に変更する必要がある
- エクスポート後にテキストを自由に変更したい
- 元のデザインからのレイアウト/スタイリングの違いを受け入れられる

**標準PPTXを使用する場合：**
- レイアウトの忠実度が必要
- PowerPointで小さな編集のみが必要
- LibreOfficeをインストールしたくない

## 新規デッキの作成

セットアップが完了したら、新規デッキを作成してみましょう：

### 方法1：デッキジェネレーター（推奨）

インタラクティブなTUIを使用：

```bash
npm run create-deck
```

**プロンプトの内容：**

1. **Deck name**: `YYYY-MM_description` 形式で入力（例：`2026-02_quarterly-review`）
2. **Template source**: デフォルトテンプレートまたは既存デッキから選択
3. **Presentation title**: プレゼンテーションのタイトル
4. **Inherit scripts**: 既存デッキ選択時、package.jsonスクリプトを継承するか

**完了後：**

```bash
cd decks/2026-02_quarterly-review
npm run dev
```

すぐにプレビューが開始されます。

### 方法2：手動作成（非推奨）

特別な理由がある場合のみ：

```bash
# テンプレートをコピー
cp -r templates/default decks/2026-02_my-deck

# デッキ内で package.json の名前を変更
cd decks/2026-02_my-deck
# package.json 内の {{DECK_NAME}} を実際のデッキ名に置換

# deck.md を編集
# {{DECK_TITLE}} と {{DATE}} を実際の値に置換

# プレビュー
npm run dev
```

### デッキの構造

作成されたデッキには以下が含まれます：

```
decks/2026-02_my-deck/
├── package.json      # ビルドスクリプト
├── .marprc           # Marp設定（テーマパスなど）
├── .gitignore        # dist/ などを除外
├── deck.md           # プレゼンテーション本体
├── assets/           # 画像などのリソース
│   └── README.md     # アセット使用ガイド
├── context/          # AIコンテキスト
│   ├── README.md     # コンテキストディレクトリの説明
│   ├── background.md # プレゼンの背景情報
│   └── notes.md      # メモ・アイデア
└── dist/             # ビルド出力（gitignore）
```

### AIコンテキストの活用

`context/` ディレクトリを活用してAIと効果的に協働：

1. **background.md** を編集：
   - プレゼンの目的
   - 対象聴衆
   - 主要メッセージ
   - 制約条件（時間、枚数など）

2. **notes.md** を編集：
   - アイデア
   - TODO
   - 参考資料

3. AIにスライド作成を依頼する際、これらのファイルを参照させる

### ワークフロー例

```bash
# 1. 新規デッキ作成
npm run create-deck
# → 2026-02_product-launch を作成

# 2. コンテキスト情報を記入
cd decks/2026-02_product-launch
# context/background.md と notes.md を編集

# 3. 開発開始
npm run dev
# → ブラウザでプレビュー

# 4. deck.md を編集
# → 保存するとブラウザが自動更新

# 5. ビルド
npm run build:all
# → dist/ に全形式が出力

# 6. 確認
ls -la dist/
```

## 次のステップ

セットアップと最初のデッキ作成が完了したら：

### 1. 基本を学ぶ

[README.md](README.md)のセクションを読む：
- [使い方](README.md#使い方) - npmコマンドを学ぶ
- [新しいデッキの作成](README.md#新しいデッキの作成) - 最初のプレゼンテーションを作成
- [テーマの操作](README.md#テーマの操作) - 外観をカスタマイズ

### 2. 最初のプレゼンテーションを作成

```bash
# テンプレートをコピー
cp -r decks/000_template decks/2026-02_my-first-deck

# デッキを編集
# エディタでdecks/2026-02_my-first-deck/deck.mdを開く

# プレビュー
npm run preview decks/2026-02_my-first-deck/deck.md
```

### 3. 企業テーマをカスタマイズ

ブランドに合わせて`shared/themes/company.css`を編集：
- `:root`セクションで色を変更
- フォントを調整
- スペーシングを変更

詳細は[README.md - テーマの操作](README.md#テーマの操作)を参照。

### 4. Marpドキュメントを読む

- **Marp Markdown構文：** [marpit.marp.app/markdown](https://marpit.marp.app/markdown)
- **テーマカスタマイズ：** [marpit.marp.app/theme-css](https://marpit.marp.app/theme-css)
- **全Marp機能：** [marp.app](https://marp.app/)

## クイックリファレンス

### 一般的なコマンド

```bash
# 自動リロード付きライブプレビュー（ウォッチモード）
npm run preview decks/your-deck/deck.md

# PDFにビルド
npm run build -- --pdf decks/your-deck/deck.md

# PowerPointにビルド
npm run build -- --pptx decks/your-deck/deck.md

# 編集可能なPowerPointにビルド（LibreOfficeが必要）
npm run build:pptx:editable decks/your-deck/deck.md

# 全デッキを全フォーマットにビルド
npm run build:all
```

### プロジェクト構造

```
marp-workspace/
├── decks/              # プレゼンテーションをここに配置
│   ├── 000_template/   # これをコピーして新しいデッキを開始
│   └── 2026-01_sample/ # サンプルデッキ
├── shared/
│   └── themes/         # カスタムテーマ（company.css）
├── dist/               # ビルド出力（自動作成）
└── package.json        # npm設定
```

## トラブルシューティングクイックリンク

問題が発生した場合：

- **インストールエラー：** [README.md - インストールの問題](README.md#インストールの問題)
- **ビルド/エクスポートエラー：** [README.md - ビルドの問題](README.md#ビルドの問題)
- **テーマが適用されない：** [README.md - テーマの問題](README.md#テーマの問題)
- **LibreOfficeの問題：** [README.md - 編集可能なPPTXの問題](README.md#編集可能なppTxの問題)
- **プレビューが動作しない：** [README.md - プレビューの問題](README.md#プレビューの問題)
- **プラットフォーム固有の問題：** [README.md - プラットフォーム固有の問題](README.md#プラットフォーム固有の問題)

## ヘルプの入手

1. **READMEを確認：** 一般的な問題のほとんどは[README.mdのトラブルシューティング](README.md#トラブルシューティング)でカバーされています
2. **Marpドキュメント：** [marp.app](https://marp.app/)および[github.com/marp-team/marp-cli](https://github.com/marp-team/marp-cli)
3. **プロジェクトの問題：** プロジェクトリポジトリの課題トラッカーを確認
4. **Marpコミュニティ：** [GitHubディスカッション](https://github.com/marp-team/marp/discussions)

## サマリーチェックリスト

プレゼンテーションの作成を開始する前に確認：

- [ ] Node.js v18以上がインストールされている（`node --version`）
- [ ] npmがインストールされている（`npm --version`）
- [ ] リポジトリがダウンロードされて解凍されている
- [ ] 依存関係がインストールされている（`npm install`が完了）
- [ ] Marp CLIが動作している（`npx marp --version`でバージョンが表示される）
- [ ] サンプルデッキのプレビューが動作する（`npm run preview decks/2026-01_sample/deck.md`）
- [ ] PDFエクスポートが動作する（`npm run build -- --pdf decks/2026-01_sample/deck.md`）
- [ ] （オプション）VS Code拡張機能がインストールされている
- [ ] （オプション）編集可能なPPTX用にLibreOfficeがインストールされている

すべての項目がチェックされていれば、プレゼンテーション作成の準備完了です！🚀
