---
skill: create-deck
description: 新しいMarpデッキを対話形式または自動で作成。テンプレート選択、スクリプト継承、contextディレクトリの自動生成をサポート。
tags: [marp, deck, template, presentation]
---

# Deck Generator - Marpデッキ作成ツール

新しいMarpデッキを作成するスキルです。対話形式での作成と、AIエージェント向けの自動作成に対応しています。

## 機能

- **対話的なデッキ作成**: 段階的なプロンプトでデッキを作成
- **テンプレート選択**:
  - デフォルトテンプレート
  - 既存デッキをテンプレートとして使用
- **スクリプト継承**: テンプレートのpackage.jsonスクリプトを継承可能
- **自動生成**:
  - package.json (workspace対応)
  - .marprc (テーマ設定)
  - deck.md (プレゼンテーション本体)
  - context/ (AI協働用コンテキスト)
  - assets/ (画像などのリソース)
- **日本語インターフェース**: 完全日本語対応
- **npm workspaces対応**: 共有node_modulesで効率的

## 使用方法

### インタラクティブモード（対話形式）

**Claude Codeから実行**:
```
/create-deck
```

**npm scriptから実行**:
```bash
npm run create-deck
```

### 非インタラクティブモード（自動実行）

AIエージェントやスクリプトから、コマンドライン引数またはJSON設定ファイルで完全自動実行できます。

**基本的な使用**:
```bash
npm run create-deck -- \
  --name 2026-03_product-launch \
  --title "新製品発表会" \
  --yes
```

**テンプレート指定**:
```bash
npm run create-deck -- \
  --name 2026-03_product-launch \
  --title "新製品発表会" \
  --template 2026-01_sample \
  --inherit-scripts \
  --yes
```

**JSON設定ファイル使用**:
```bash
npm run create-deck -- --config ./examples/deck-config.json --yes
```

詳細は後述の「非インタラクティブモード」セクションを参照してください。

## デッキ名形式

デッキ名は `YYYY-MM_description` 形式で指定します。

**正しい例**:
- `2026-01_quarterly-review`
- `2026-03_product-launch`
- `2026-06_team-offsite`

**間違った例**:
- `quarterly-review` (日付がない)
- `2026_01_quarterly-review` (ハイフンの位置が違う)
- `2026-1_quarterly-review` (月が1桁)

この形式により、ファイルシステムで時系列順に自動ソートされます。

## プロンプトフロー（インタラクティブモード）

```
1. デッキ名入力 (YYYY-MM_description形式)
   ↓
2. テンプレートソース選択
   ├─ Default template
   └─ 既存デッキ (2026-01_sample, 2026-02_my-project...)
   ↓
3. プレゼンテーションタイトル入力
   ↓
4. スクリプト継承の選択 (テンプレートが既存デッキの場合)
   ↓
5. デッキ作成
```

## 生成されるファイル

### ディレクトリ構造
```
decks/2026-01_my-deck/
├── package.json          # npm workspaces対応のパッケージ定義
├── .marprc              # Marp設定（テーマパス等）
├── .gitignore           # Git除外設定
├── deck.md              # プレゼンテーション本体
├── assets/              # 画像・リソース
│   └── README.md
├── context/             # AI協働用コンテキスト
│   ├── README.md
│   ├── background.md
│   └── notes.md
└── dist/                # ビルド出力（gitignore）
```

### package.json
```json
{
  "name": "@marp-workspace/2026-01_my-deck",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "marp -p -w deck.md",
    "build": "marp deck.md -o dist/deck.html",
    "build:pdf": "marp deck.md --pdf -o dist/deck.pdf",
    "build:pptx": "marp deck.md --pptx -o dist/deck.pptx",
    "build:all": "npm run build && npm run build:pdf && npm run build:pptx"
  }
}
```

### .marprc
```yaml
themeSet:
  - ../../shared/themes    # Workspace共有テーマ
  - ./themes               # デッキ固有テーマ（オプション）
allowLocalFiles: true
```

### deck.md (デフォルトテンプレート)
```markdown
---
marp: true
theme: default
paginate: true
header: ''
footer: ''
---

# タイトルスライド

---

## スライド1

コンテンツ
```

## 非インタラクティブモード

AIエージェントがユーザーから情報を収集し、自動的にデッキを作成するためのモードです。

### コマンドライン引数

| オプション | 短縮形 | 型 | 必須 | 説明 |
|-----------|--------|-----|------|------|
| `--name <name>` | `-n` | string | ✓ | デッキ名（YYYY-MM_description形式） |
| `--config <path>` | `-c` | string | - | JSON設定ファイルパス |
| `--title <text>` | `-t` | string | ✓* | プレゼンテーションタイトル |
| `--template <source>` | - | string | - | テンプレートソース（default または既存デッキ名） |
| `--inherit-scripts` | - | boolean | - | package.jsonスクリプトを継承 |
| `--yes` | `-y` | boolean | - | 確認プロンプトをスキップ |

*注: `--config`使用時は不要

### JSON設定ファイルスキーマ

**サンプル** (`examples/deck-config.json`):
```json
{
  "name": "2026-03_product-launch",
  "title": "新製品発表会 - 革新的なソリューションの紹介",
  "template": "default",
  "inheritScripts": false
}
```

### バリデーションルール

- **name**: 必須、`YYYY-MM_description` 形式
- **title**: 必須、空でない文字列
- **template**: デフォルトは `default`、既存デッキ名も指定可能
- **inheritScripts**: デフォルトは `false`

### エラーメッセージ

**デッキ名形式エラー**:
```
❌ エラー: --name: デッキ名は YYYY-MM_description 形式で指定してください（例: 2026-01_my-deck）

使用方法:
  npm run create-deck -- --name <デッキ名> --title <タイトル>

または設定ファイルを使用:
  npm run create-deck -- --config ./deck-config.json

ヘルプを表示:
  npm run create-deck -- --help
```

**重複デッキ名エラー**:
```
❌ エラー: デッキ "2026-01_sample" は既に存在します
```

**存在しないテンプレート**:
```
❌ エラー: テンプレート "2026-99_nonexistent" が見つかりません
```

### AIエージェント向けベストプラクティス

1. **情報収集フロー**:
   ```
   ユーザーに質問 → 回答を収集 → コマンド実行
   ```

2. **基本的な質問**:
   ```
   1. デッキ名を教えてください（YYYY-MM_description形式）
   2. プレゼンテーションのタイトルは何ですか？
   3. テンプレートは既存のデッキを使いますか？それともデフォルトですか？
   ```

3. **確認と実行**:
   ```
   収集した情報を表示 → ユーザーに確認 → コマンド実行
   ```

4. **次のステップを案内**:
   ```
   デッキ作成後、contextファイルの作成を提案
   → /create-context を実行
   ```

### 使用例

**AIエージェントの対話例**:
```
AI: 新しいMarpデッキを作成します。いくつか質問させてください。

AI: 1. デッキ名を教えてください（YYYY-MM_description形式、例: 2026-03_product-launch）
User: 2026-03_product-launch

AI: 2. プレゼンテーションのタイトルは何ですか？
User: 新製品発表会

AI: 3. テンプレートはデフォルトを使いますか？それとも既存のデッキをベースにしますか？
User: デフォルトで

AI: 収集した情報を確認します:
    - デッキ名: 2026-03_product-launch
    - タイトル: 新製品発表会
    - テンプレート: default

AI: この内容でデッキを作成しますか？
User: はい

AI: [コマンド実行]
npm run create-deck -- \
  --name 2026-03_product-launch \
  --title "新製品発表会" \
  --yes

AI: ✅ デッキを作成しました！

    次のステップとして、contextファイルを作成しますか？
    contextファイルを作成すると、プレゼンテーションの目的や対象聴衆を整理できます。

User: はい

AI: [create-contextを実行]
```

## テンプレート機能

### デフォルトテンプレート
- `templates/default/` にあるベーステンプレート
- 最小限の設定と構造
- すべてのデッキで利用可能

### 既存デッキをテンプレートに
既存デッキをテンプレートとして使用すると:
- **Front-matter継承**: テーマ、ページ設定など
- **スクリプト継承**: npm scriptsをそのまま使用（オプション）
- **カスタムテーマコピー**: `themes/` ディレクトリがあればコピー
- **アセットコピー**: `assets/` ディレクトリがあればコピー

**使用例**:
```bash
# 会社用テンプレートとして 2026-01_company-template を使用
npm run create-deck -- \
  --name 2026-03_new-presentation \
  --title "新しいプレゼン" \
  --template 2026-01_company-template \
  --inherit-scripts \
  --yes
```

## npm Workspaces統合

このプロジェクトは npm workspaces を使用しており、各デッキは:
- ワークスペースルートの `node_modules/` を共有
- 独立した `package.json` (依存関係なし、スクリプトのみ)
- 個別に開発・ビルド可能

**メリット**:
- ディスク使用量が最小（~177MBを全デッキで共有）
- バージョン一貫性（全デッキで同じMarp CLIバージョン）
- 個別開発可能（各デッキで `npm run dev` 実行可能）

## デッキ開発の流れ

### 1. デッキ作成
```bash
npm run create-deck
# または
/create-deck
```

### 2. Context作成
```bash
cd decks/2026-01_my-deck
npm run create-context
# または
/create-context
```

### 3. プレビュー開始
```bash
cd decks/2026-01_my-deck
npm run dev
```

### 4. スライド編集
- `deck.md` を編集
- ブラウザで自動リロード

### 5. ビルド
```bash
npm run build:all    # HTML, PDF, PPTX すべて生成
```

## ベストプラクティス

### 1. デッキ名は時系列順に
```
2026-01_quarterly-review
2026-02_team-offsite
2026-03_product-launch
```

### 2. 会社用テンプレートを作成
```
# 一度だけ、会社用テンプレートを作成
2026-00_company-template

# 以降、このテンプレートを使う
npm run create-deck -- \
  --template 2026-00_company-template \
  --inherit-scripts
```

### 3. テーマは shared/ に配置
デッキ固有でないテーマは `shared/themes/` に配置すると、すべてのデッキで利用可能。

### 4. assets/ にはデッキ固有のリソースのみ
共有リソースは `shared/assets/` に配置。

### 5. contextを必ず作成
AIとの協働を最大化するため、デッキ作成後すぐに `/create-context` を実行。

## トラブルシューティング

### デッキ名のバリデーションエラー
**症状**: "デッキ名は YYYY-MM_description 形式で..."

**原因**: デッキ名の形式が正しくない

**解決策**:
- 年は4桁: `2026`
- 月は2桁: `01`, `12`
- 区切りはハイフン: `2026-01`
- アンダースコア後に説明: `2026-01_my-deck`

### 重複デッキ名エラー
**症状**: "デッキ '...' は既に存在します"

**原因**: 同名のディレクトリが既に存在

**解決策**:
- 異なるデッキ名を使用
- または既存デッキを削除/リネーム

### テンプレートが見つからない
**症状**: "テンプレート '...' が見つかりません"

**原因**: 指定したデッキが存在しない

**解決策**:
```bash
# 既存デッキを確認
ls decks/
```

### npm run dev が動かない
**症状**: コマンドが見つからない

**原因**: ワークスペースルートで `npm install` していない

**解決策**:
```bash
# ワークスペースルートで
npm install
```

## 関連情報

- **Context Creator**: `/create-context` - contextファイル作成
- **Marpスキル**: `/marp` - Marpの包括的なサポート
- **プロジェクトドキュメント**: `docs/marp/README.md`
- **Marp公式ドキュメント**: https://marpit.marp.app/
- **サンプル設定ファイル**: `examples/deck-config.json`

## フィードバック

問題や改善提案がある場合は、GitHubのIssuesでお知らせください。
