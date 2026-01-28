# Marp Overview - コーディングエージェント向けガイド

## Marpとは

Marp (Markdown Presentation Ecosystem) は、Markdownから美しいスライドデッキを作成するためのツールセットです。MarpはMarpit（コアフレームワーク）を基盤とし、開発者がコードでプレゼンテーションを管理できるようにします。

公式サイト: https://marp.app/

## エコシステムの構造

Marpエコシステムは以下の主要コンポーネントで構成されています：

### 1. Marpit (Framework)
- **目的**: MarkdownとCSSをHTMLスライドに変換する軽量フレームワーク
- **特徴**:
  - 最小限のアセット出力
  - Markdown拡張構文（ディレクティブ、スライド背景など）
  - 純粋なCSSベースのテーマシステム
  - Inline SVGレンダリング（実験的機能）
- **リポジトリ**: https://github.com/marp-team/marpit
- **ドキュメント**: https://marpit.marp.app/

### 2. Marp Core (Converter)
- **目的**: Marpの中核変換エンジン、Marpitを拡張して実用的な機能を追加
- **特徴**:
  - 3つの公式テーマ（Default、Gaia、Uncover）
  - 自動スケーリング機能（ヘッダーフィット、コードブロック縮小）
  - 数式レンダリング（MathJax/KaTeX対応）
  - 絵文字サポート（Twemoji）
  - 強化されたMarkdown構文（テーブル、取り消し線など）
- **リポジトリ**: https://github.com/marp-team/marp-core

### 3. Marp CLI (Command-Line Tool)
- **目的**: スライド変換とプレビューのためのコマンドラインツール
- **特徴**:
  - 複数フォーマット出力（HTML、PDF、PPTX、PNG/JPEG）
  - ウォッチモード（自動変換）
  - サーバーモード（HTTPベースの変換）
  - プレビューモード（即座の結果確認）
- **リポジトリ**: https://github.com/marp-team/marp-cli

## コーディングエージェントの役割

コーディングエージェントがMarp環境で果たす役割：

1. **Markdownファイルの作成・編集**
   - スライド内容の生成
   - ディレクティブの適切な配置
   - 画像・メディアの統合

2. **テーマCSSのカスタマイズ**
   - 既存テーマの拡張
   - 新規テーマの作成
   - ブランディング要素の適用

3. **ビルドプロセスの実行**
   - Marp CLIコマンドの実行
   - 複数フォーマットへの変換
   - 自動化ワークフローの構築

4. **品質管理**
   - スライドの一貫性チェック
   - レイアウトの検証
   - アクセシビリティの確保

## 基本的なワークフロー

```bash
# 1. Markdownファイルの作成
# slides.md を作成

# 2. HTML変換
marp slides.md

# 3. 開発中のプレビュー
marp -p -w slides.md

# 4. 最終出力
marp slides.md --pdf -o presentation.pdf
```

## ディレクトリ構造の推奨パターン

```
project/
├── decks/              # プレゼンテーションディレクトリ
│   ├── meeting-2024/
│   │   ├── slides.md
│   │   └── images/
│   └── workshop/
│       ├── slides.md
│       └── assets/
├── shared/             # 共有リソース
│   ├── themes/         # カスタムテーマCSS
│   │   ├── corporate.css
│   │   └── technical.css
│   └── assets/         # 共有画像・ロゴ
├── docs/               # ドキュメント
└── dist/               # ビルド出力
```

## 技術仕様

- **言語**: Node.js (v18以上推奨)
- **Markdown パーサー**: markdown-it (GitHub Flavored Markdown拡張)
- **CSS エンジン**: 標準CSS3（プリプロセッサ不要）
- **出力形式**: HTML5、PDF、PPTX、PNG、JPEG
- **ブラウザ要件**: Chrome、Edge、またはFirefox（PDF/PPTX/画像変換時）

## 次のステップ

このドキュメントシリーズの他のガイドを参照してください：

- `02_marp_cli_usage.md` - CLI の詳細な使用方法
- `03_markdown_syntax.md` - Marp固有のMarkdown構文
- `04_directives.md` - ディレクティブシステムの完全ガイド
- `05_theme_development.md` - テーマCSSのカスタマイズ
- `06_practical_examples.md` - 実践的なサンプルとパターン

## 参考リソース

- [Marp公式サイト](https://marp.app/)
- [Marpit ドキュメント](https://marpit.marp.app/)
- [Marp CLI GitHub](https://github.com/marp-team/marp-cli)
- [Marp Core GitHub](https://github.com/marp-team/marp-core)
