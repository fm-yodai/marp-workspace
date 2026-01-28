# Marp CLI Usage - コーディングエージェント向けガイド

## インストール方法

### プロジェクトローカル（推奨）
```bash
npm install --save-dev @marp-team/marp-cli
```

### グローバルインストール
```bash
npm install -g @marp-team/marp-cli
```

### パッケージマネージャー経由
```bash
# macOS/Linux
brew install marp-cli

# Windows
scoop install marp
```

### Docker
```bash
docker pull marpteam/marp-cli
```

### npx（インストール不要）
```bash
npx @marp-team/marp-cli@latest slide-deck.md
```

## 基本的な変換コマンド

### HTML変換（デフォルト）
```bash
# デフォルト出力（同名の.htmlファイル）
marp slides.md

# 出力ファイル指定
marp slides.md -o output.html

# 複数ファイルを一括変換
marp *.md
```

### PDF変換
```bash
# PDFとして出力
marp --pdf slides.md

# 出力ファイル名指定
marp slides.md -o presentation.pdf

# プレゼンターノート付き
marp --pdf --pdf-notes slides.md

# PDFアウトライン（ブックマーク）付き
marp --pdf --pdf-outlines slides.md
```

### PowerPoint (PPTX) 変換
```bash
# PPTX形式で出力
marp --pptx slides.md

# 編集可能なPPTX（実験的、LibreOffice Impress必須）
marp --pptx --pptx-editable slides.md
```

### 画像変換
```bash
# 全スライドをPNG画像として出力
marp --images png slides.md

# タイトルスライドのみ
marp --image png slides.md

# JPEG形式
marp --images jpeg slides.md

# 高解像度（2倍スケール）
marp --images png --image-scale 2 slides.md
```

### プレゼンターノート抽出
```bash
# ノートをテキストファイルとして抽出
marp --notes slides.md
```

## 開発モード

### ウォッチモード
ファイルの変更を監視し、自動的に再変換します。

```bash
# 基本的なウォッチモード
marp -w slides.md

# PDF出力のウォッチ
marp -w --pdf slides.md
```

### サーバーモード
HTTPサーバーを起動し、オンデマンド変換を提供します。

```bash
# デフォルトポート（8080）でサーバー起動
marp -s ./slides

# カスタムポート
PORT=5000 marp -s ./slides

# クエリパラメータで変換形式指定
# http://localhost:8080/deck.md?pdf → PDF出力
# http://localhost:8080/deck.md?png → PNG画像
```

**サーバーモードの特徴**:
- `index.md` または `PITCHME.md` が自動的にホームページになる
- ファイル一覧の提供
- ブラウザリフレッシュ対応

### プレビューモード
専用ウィンドウで即座に結果を確認できます。

```bash
# プレビューウィンドウを開く（自動的にウォッチモード有効）
marp -p slides.md

# プレビュー + PDF出力
marp -p --pdf slides.md
```

## 重要なCLIオプション

### 入出力制御

| オプション | 説明 | 例 |
|-----------|------|-----|
| `-o, --output <path>` | 出力ファイル/ディレクトリ指定 | `marp slides.md -o dist/` |
| `-I, --input-dir <dir>` | 入力ディレクトリ（構造を保持） | `marp -I decks/ -o dist/` |

### メタデータ設定

| オプション | 説明 | 例 |
|-----------|------|-----|
| `--title <text>` | プレゼンテーションタイトル | `--title "My Presentation"` |
| `--description <text>` | 説明文 | `--description "Project Overview"` |
| `--author <name>` | 著者名 | `--author "John Doe"` |
| `--keywords <keywords>` | キーワード（カンマ区切り） | `--keywords "tech,marp,slides"` |
| `--url <url>` | カノニカルURL | `--url "https://example.com"` |
| `--og-image <url>` | OGP画像URL | `--og-image "https://example.com/og.jpg"` |

### テーマとテンプレート

| オプション | 説明 | 例 |
|-----------|------|-----|
| `--theme <file>` | カスタムテーマCSS指定 | `--theme custom-theme.css` |
| `--template <type>` | テンプレート選択（bespoke/bare） | `--template bespoke` |

### ブラウザ設定

PDF、PPTX、画像変換にはブラウザが必要です。

| オプション | 説明 | 例 |
|-----------|------|-----|
| `--browser <name>` | ブラウザ選択 | `--browser firefox` |
| `--browser-path <path>` | ブラウザ実行ファイルパス | `--browser-path /path/to/chrome` |
| `--browser-timeout <sec>` | タイムアウト（秒） | `--browser-timeout 60` |
| `--browser-protocol <type>` | 接続プロトコル（cdp/webdriverbidi） | `--browser-protocol cdp` |

**ブラウザ選択例**:
```bash
# Firefoxを優先、フォールバックでChrome
marp --browser firefox,chrome slides.md --pdf

# Microsoft Edge使用
marp --browser edge slides.md --pdf
```

### パフォーマンス制御

| オプション | 説明 | デフォルト |
|-----------|------|-----------|
| `--parallel <number>` | 並列処理数 | 5 |
| `--no-parallel` | 並列処理無効化 | - |

```bash
# 並列処理を10に増加
marp --parallel 10 *.md

# 並列処理を無効化（メモリ制約がある場合）
marp --no-parallel *.md
```

### セキュリティ

| オプション | 説明 | 注意 |
|-----------|------|-----|
| `--allow-local-files` | ローカルファイルアクセス許可 | ⚠️ 信頼できるコンテンツのみ |

```bash
# ローカルファイルへのアクセスを許可（注意して使用）
marp --allow-local-files slides.md
```

## 設定ファイル

### サポートされる設定ファイル形式

- `marp.config.js` (推奨)
- `marp.config.ts` (TypeScript)
- `.marprc` (JSON/YAML)
- `package.json` の `marp` セクション

### marp.config.js の例

```javascript
module.exports = {
  inputDir: './decks',
  output: './dist',
  themeSet: './shared/themes',
  html: true,
  pdf: true,
  engine: ({ marp }) => marp.use(require('custom-plugin'))
}
```

### TypeScript設定（型安全）

```typescript
// marp.config.ts
import { defineConfig } from '@marp-team/marp-cli'

export default defineConfig({
  inputDir: './decks',
  output: './dist',
  themeSet: './shared/themes',
  pdf: true
})
```

## カスタムエンジン

高度なカスタマイズのためにエンジンを拡張できます。

```javascript
// engine.mjs
export default ({ marp }) => {
  // プラグインの追加
  marp.use(require('markdown-it-custom-plugin'))

  // カスタムディレクティブの追加
  // その他のカスタマイズ

  return marp
}
```

使用方法:
```bash
marp --engine ./engine.mjs slides.md
```

## メタデータの設定方法

### Front-matter（YAML）による設定

```markdown
---
title: プレゼンテーションタイトル
description: プレゼンテーションの説明
author: 著者名
keywords: キーワード1, キーワード2
url: https://example.com/presentation
image: https://example.com/og-image.jpg
---

# 最初のスライド
```

### CLIオプションによる設定

```bash
marp slides.md \
  --title "プレゼンテーションタイトル" \
  --description "プレゼンテーションの説明" \
  --author "著者名" \
  --keywords "キーワード1,キーワード2" \
  --url "https://example.com/presentation" \
  --og-image "https://example.com/og-image.jpg"
```

## 実践的なワークフロー例

### 開発フェーズ
```bash
# プレビューしながら開発
marp -p -w slides.md
```

### ビルドフェーズ
```bash
# 複数フォーマットで出力
marp slides.md -o dist/slides.html
marp slides.md --pdf -o dist/slides.pdf
marp slides.md --pptx -o dist/slides.pptx
```

### CI/CD統合
```bash
# 全てのMarkdownファイルをHTMLとPDFに変換
marp -I ./decks -o ./dist --html
marp -I ./decks -o ./dist --pdf
```

## トラブルシューティング

### ブラウザが見つからない
```bash
# ブラウザパスを明示的に指定
marp --browser-path /usr/bin/google-chrome slides.md --pdf
```

### タイムアウトエラー
```bash
# タイムアウトを延長
marp --browser-timeout 120 slides.md --pdf
```

### メモリ不足
```bash
# 並列処理を減らす
marp --parallel 2 *.md
```

## 参考リソース

- [Marp CLI GitHub](https://github.com/marp-team/marp-cli)
- [Marp CLI README](https://raw.githubusercontent.com/marp-team/marp-cli/main/README.md)
