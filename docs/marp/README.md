# Marp Documentation for Coding Agents

このディレクトリには、コーディングエージェントがMarpを使ってスライドを作成・編集するための包括的なドキュメントが含まれています。

## ドキュメント一覧

### 1. [Marp Overview](./01_marp_overview.md)
Marpエコシステムの概要、構成要素、基本的なワークフローを説明しています。

**対象者**: Marpを初めて使用するエージェント

**内容**:
- Marpとは何か
- エコシステムの構造（Marpit、Marp Core、Marp CLI）
- コーディングエージェントの役割
- 推奨ディレクトリ構造

### 2. [Marp CLI Usage](./02_marp_cli_usage.md)
Marp CLIの詳細な使用方法、コマンドラインオプション、設定ファイルについて説明しています。

**対象者**: CLIツールを使ってスライドを変換・生成するエージェント

**内容**:
- インストール方法
- 基本的な変換コマンド（HTML、PDF、PPTX、画像）
- 開発モード（ウォッチ、サーバー、プレビュー）
- 設定ファイルとカスタマイズ

### 3. [Markdown Syntax](./03_markdown_syntax.md)
Marp固有のMarkdown拡張構文と標準Markdown要素の使用方法を説明しています。

**対象者**: Markdownファイルを作成・編集するエージェント

**内容**:
- スライド区切り
- 標準Markdown要素（見出し、リスト、コードブロックなど）
- 画像の配置と背景画像
- フィットヘッダー、数式、絵文字
- プレゼンターノート

### 4. [Directives](./04_directives.md)
Marpのディレクティブシステムの完全ガイドです。

**対象者**: スライドの動作や外観を細かく制御するエージェント

**内容**:
- ディレクティブの3つのタイプ（グローバル、ローカル、スポット）
- 構文（Front-matter、HTMLコメント）
- 利用可能なディレクティブ一覧
- 実践的なパターンとベストプラクティス

### 5. [Theme Development](./05_theme_development.md)
カスタムテーマの作成方法とCSSによるスタイリングを説明しています。

**対象者**: テーマCSSを作成・カスタマイズするエージェント

**内容**:
- テーマファイルの構造
- テーマメタデータ（@theme、@size、@auto-scaling）
- セクション、ヘッダー、フッターのスタイリング
- カスタムクラスの作成
- 実践的なテーマ例

### 6. [Practical Examples](./06_practical_examples.md)
完全なプレゼンテーション例と自動生成のためのテンプレートを提供しています。

**対象者**: 実際のスライド作成を行うエージェント

**内容**:
- ビジネスプレゼンテーション例
- 技術プレゼンテーション例
- 教育・トレーニング用プレゼンテーション例
- テンプレートと自動生成スクリプト
- CI/CD統合例

## クイックスタート

### 初めてMarpを使用する場合

1. [Marp Overview](./01_marp_overview.md) を読んでエコシステムを理解する
2. [Marp CLI Usage](./02_marp_cli_usage.md) でCLIツールの使い方を学ぶ
3. [Markdown Syntax](./03_markdown_syntax.md) でMarkdown構文を確認する
4. [Practical Examples](./06_practical_examples.md) でサンプルを見る

### スライドを作成する場合

1. [Markdown Syntax](./03_markdown_syntax.md) で構文を確認
2. [Directives](./04_directives.md) で設定方法を学ぶ
3. [Practical Examples](./06_practical_examples.md) からテンプレートを選ぶ
4. [Marp CLI Usage](./02_marp_cli_usage.md) でビルド・プレビューする

### テーマをカスタマイズする場合

1. [Theme Development](./05_theme_development.md) でテーマの構造を理解する
2. 既存テーマ（`shared/themes/`）を参考にする
3. カスタムCSSを作成・適用する
4. [Marp CLI Usage](./02_marp_cli_usage.md) でテーマを指定してビルドする

## ディレクトリ構造

推奨されるプロジェクト構造：

```
marp-workspace/
├── decks/              # プレゼンテーションディレクトリ
│   ├── meeting-2024/
│   │   ├── slides.md
│   │   └── images/
│   └── workshop/
│       └── slides.md
├── shared/             # 共有リソース
│   ├── themes/         # カスタムテーマCSS
│   │   ├── corporate.css
│   │   └── technical.css
│   └── assets/         # 共有画像・ロゴ
├── docs/               # このドキュメント
└── dist/               # ビルド出力
```

## よくある質問

### Q: HTMLとPDFのどちらを出力すべきか？

A: 用途に応じて選択してください：
- **HTML**: Webでの共有、インタラクティブな要素が必要な場合
- **PDF**: 印刷、配布、アーカイブに適している
- **PPTX**: PowerPointでの編集が必要な場合

### Q: テーマはどこに配置すべきか？

A: `shared/themes/` ディレクトリに配置することを推奨します。これにより、複数のプレゼンテーションで同じテーマを再利用できます。

### Q: プレゼンターノートはどうやって表示するか？

A: `marp --notes slides.md` でノートをテキストファイルとして抽出できます。HTML出力では、スピーカーノートとして埋め込まれます。

### Q: 数式が表示されない

A: Front-matterで数式ライブラリを指定してください：

```markdown
---
math: katex
---
```

### Q: カスタムフォントを使用したい

A: テーマCSSで `@import` を使用してWebフォントを読み込むか、ローカルフォントを指定します：

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

section {
  font-family: 'Roboto', sans-serif;
}
```

## トラブルシューティング

### 問題: スライドが正しく表示されない

1. Markdown構文が正しいか確認する
2. ディレクティブの構文（コロン、スペース）を確認する
3. テーマが正しく読み込まれているか確認する

### 問題: PDF変換が失敗する

1. ブラウザ（Chrome、Edge、Firefox）がインストールされているか確認する
2. `--browser-path` でブラウザパスを明示的に指定する
3. `--browser-timeout` でタイムアウトを延長する

### 問題: 画像が表示されない

1. 画像パスが正しいか確認する（相対パスを推奨）
2. 画像ファイルが存在するか確認する
3. `--allow-local-files` オプションが必要な場合がある（セキュリティに注意）

## 情報源

このドキュメントは以下の公式情報源から作成されています：

### 公式ドキュメント
- [Marp公式サイト](https://marp.app/)
- [Marpit ドキュメント](https://marpit.marp.app/)
- [Marpit Directives](https://marpit.marp.app/directives)
- [Marpit Theme CSS](https://marpit.marp.app/theme-css)

### GitHub リポジトリ
- [Marp CLI](https://github.com/marp-team/marp-cli)
- [Marp Core](https://github.com/marp-team/marp-core)
- [Marpit](https://github.com/marp-team/marpit)
- [Marp Guide](https://github.com/marp-team/marp/blob/main/website/docs/guide/directives.md)
- [Marp Core Themes](https://github.com/marp-team/marp-core/blob/main/themes/README.md)

### その他のリソース
- [DeepWiki: Directives and Syntax](https://deepwiki.com/marp-team/marp/3.1-directives-and-syntax)
- [Marp Next Example](https://gist.github.com/yhatt/a7d33a306a87ff634df7bb96aab058b5)
- [Glenn Matlin: Marp Cheat Sheet](https://glennmatlin.doctor/knowledgebase/cheatsheets/marp.html)

## 貢献

このドキュメントの改善提案や追加情報がある場合は、プロジェクトメンテナーに連絡してください。

## ライセンス

このドキュメントはMITライセンスの下で提供されています。Marp自体もMITライセンスです。

---

**最終更新**: 2024-01-28
**作成者**: コーディングエージェント向けドキュメント生成プロジェクト
