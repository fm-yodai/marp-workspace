# Marp Theme Development - コーディングエージェント向けガイド

## テーマの基本

Marpのテーマは純粋なCSSファイルです。プリプロセッサ（SCSS、Less等）は不要ですが、使用することも可能です。

## テーマファイルの構造

### 最小限のテーマ

```css
/* @theme my-theme */

section {
  width: 1280px;
  height: 720px;
  font-family: 'Arial', sans-serif;
  background-color: white;
  color: black;
}
```

### 完全なテーマのテンプレート

```css
/**
 * @theme my-custom-theme
 * @author Your Name
 * @size 16:9 1280px 720px
 * @size 4:3 960px 720px
 * @auto-scaling true
 */

@import 'default';  /* 既存テーマから継承（オプション） */

/* === ベーススタイル === */
section {
  width: 1280px;
  height: 720px;
  padding: 70px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 28px;
  line-height: 1.6;
  background-color: #ffffff;
  color: #333333;
}

/* === 見出し === */
h1 {
  font-size: 60px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 0.5em;
}

h2 {
  font-size: 48px;
  font-weight: bold;
  color: #2a2a2a;
  margin-top: 1em;
  margin-bottom: 0.5em;
  border-bottom: 3px solid #007acc;
}

h3 {
  font-size: 36px;
  color: #3a3a3a;
}

h4, h5, h6 {
  font-size: 28px;
  color: #4a4a4a;
}

/* === テキスト要素 === */
p {
  margin-bottom: 1em;
}

strong {
  font-weight: bold;
  color: #007acc;
}

em {
  font-style: italic;
}

/* === リスト === */
ul, ol {
  margin: 1em 0;
  padding-left: 1.5em;
}

li {
  margin-bottom: 0.5em;
}

/* === コードブロック === */
code {
  font-family: 'Fira Code', 'Courier New', monospace;
  background-color: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

pre {
  background-color: #1e1e1e;
  color: #d4d4d4;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1em 0;
}

pre code {
  background-color: transparent;
  padding: 0;
  font-size: 0.8em;
}

/* === テーブル === */
table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

th {
  background-color: #007acc;
  color: white;
  padding: 12px;
  text-align: left;
  font-weight: bold;
}

td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

tr:hover {
  background-color: #f5f5f5;
}

/* === 引用 === */
blockquote {
  border-left: 5px solid #007acc;
  padding-left: 20px;
  margin: 1em 0;
  font-style: italic;
  color: #555;
}

/* === リンク === */
a {
  color: #007acc;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* === 画像 === */
img {
  max-width: 100%;
  height: auto;
}

/* === ヘッダー/フッター === */
header {
  position: absolute;
  top: 30px;
  left: 70px;
  right: 70px;
  font-size: 18px;
  color: #666;
}

footer {
  position: absolute;
  bottom: 30px;
  left: 70px;
  right: 70px;
  font-size: 18px;
  color: #666;
}

/* === ページ番号 === */
section::after {
  position: absolute;
  bottom: 30px;
  right: 70px;
  font-size: 24px;
  color: #666;
}

/* === カスタムクラス === */
section.invert {
  background-color: #1a1a1a;
  color: #ffffff;
}

section.invert h1,
section.invert h2,
section.invert h3 {
  color: #ffffff;
}

section.lead {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

section.lead h1 {
  font-size: 80px;
}
```

## テーマメタデータ

### @theme
テーマの名前を定義します（必須）。

```css
/* @theme my-theme-name */
```

または複数行コメント：

```css
/**
 * @theme my-theme-name
 */
```

### @size
カスタムサイズプリセットを定義します。

```css
/**
 * @theme my-theme
 * @size 16:9 1280px 720px
 * @size 4:3 960px 720px
 * @size 4K 3840px 2160px
 */
```

使用方法：

```markdown
---
theme: my-theme
size: 4K
---
```

継承したサイズを無効化：

```css
/**
 * @theme my-theme
 * @size 16:9 false
 */
```

### @auto-scaling
自動スケーリング機能を有効化します。

```css
/**
 * @theme my-theme
 * @auto-scaling true
 */
```

有効にすると：
- `<!--fit-->` ディレクティブで見出しを自動拡大
- コードブロックの自動縮小
- 数式ブロックのスケーリング

### @author
テーマ作成者を記録します（オプション）。

```css
/**
 * @theme my-theme
 * @author John Doe
 */
```

## テーマの継承

既存のテーマをベースにカスタマイズできます。

```css
/* @theme my-custom-default */

@import 'default';

/* デフォルトテーマを拡張 */
section {
  background-color: #f0f0f0;
}

h1 {
  color: #007acc;
}
```

利用可能な公式テーマ：
- `default` - クリーンでプロフェッショナル
- `gaia` - モダンで視覚的に印象的
- `uncover` - ミニマルで集中力を保つ

## セクションのスタイリング

### 基本セクション

```css
section {
  /* スライドの基本設定 */
  width: 1280px;
  height: 720px;
  padding: 70px;

  /* 背景 */
  background-color: white;
  background-image: url('./watermark.png');
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: 200px;

  /* テキスト */
  font-family: 'Arial', sans-serif;
  font-size: 28px;
  color: #333;

  /* レイアウト */
  display: block;  /* またはflex */
}
```

### カスタムクラス

#### .invert（反転色）

```css
section.invert {
  background-color: #000;
  color: #fff;
}

section.invert h1,
section.invert h2,
section.invert h3 {
  color: #fff;
}

section.invert a {
  color: #4fc3f7;
}

section.invert code {
  background-color: #333;
  color: #fff;
}
```

使用方法：

```markdown
<!-- class: invert -->

# 反転色のスライド
```

#### .lead（中央揃え）

```css
section.lead {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 100px;
}

section.lead h1 {
  font-size: 100px;
  line-height: 1.2;
}

section.lead p {
  font-size: 36px;
  margin-top: 0.5em;
}
```

使用方法：

```markdown
<!-- class: lead -->

# 大きなタイトル

中央に配置されたテキスト
```

## ヘッダーとフッターのスタイリング

```css
/* ヘッダー */
header {
  position: absolute;
  top: 30px;
  left: 70px;
  right: 70px;
  height: 40px;
  font-size: 18px;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

/* フッター */
footer {
  position: absolute;
  bottom: 30px;
  left: 70px;
  right: 70px;
  height: 40px;
  font-size: 16px;
  color: #999;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ヘッダー/フッターを持つスライドのコンテンツ領域調整 */
section:has(header) {
  padding-top: 120px;
}

section:has(footer) {
  padding-bottom: 120px;
}
```

## ページ番号のカスタマイズ

```css
/* ページ番号のデフォルトスタイル */
section::after {
  position: absolute;
  bottom: 30px;
  right: 70px;
  font-size: 24px;
  font-weight: bold;
  color: #007acc;
  content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
}

/* ページ番号を非表示（特定のクラス） */
section.no-page-number::after {
  content: none;
}

/* カスタムページ番号スタイル */
section::after {
  content: 'Page ' attr(data-marpit-pagination);
  background-color: #007acc;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
}
```

## 背景のスタイリング

### グラデーション背景

```css
section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
```

### パターン背景

```css
section {
  background-image:
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(0,0,0,.03) 10px,
      rgba(0,0,0,.03) 20px
    );
  background-color: #f5f5f5;
}
```

### 画像背景とオーバーレイ

```css
section {
  background-image: url('./background.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
```

## レスポンシブデザイン

```css
section {
  width: 1280px;
  height: 720px;
}

/* 4:3モード */
section[data-size="4:3"] {
  width: 960px;
  height: 720px;
}

/* カスタムサイズ */
section[data-size="4K"] {
  width: 3840px;
  height: 2160px;
  font-size: 84px;  /* 3倍のフォントサイズ */
}
```

## 実践的なテーマ例

### コーポレートテーマ

```css
/**
 * @theme corporate
 * @author Company Name
 * @size 16:9 1280px 720px
 */

:root {
  --primary-color: #003d82;
  --secondary-color: #00a0dc;
  --text-color: #333333;
  --background-color: #ffffff;
}

section {
  width: 1280px;
  height: 720px;
  padding: 80px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

h1 {
  color: var(--primary-color);
  font-size: 60px;
  font-weight: 700;
  border-bottom: 4px solid var(--secondary-color);
  padding-bottom: 20px;
}

h2 {
  color: var(--primary-color);
  font-size: 44px;
  margin-top: 1em;
}

strong {
  color: var(--secondary-color);
}

header {
  background-color: var(--primary-color);
  color: white;
  padding: 15px 80px;
  left: 0;
  right: 0;
  top: 0;
}

footer {
  background-color: #f5f5f5;
  padding: 15px 80px;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: 2px solid var(--secondary-color);
}
```

### テクニカルテーマ

```css
/**
 * @theme technical
 * @auto-scaling true
 */

@import url('https://fonts.googleapis.com/css2?family=Fira+Code&family=Roboto:wght@400;700&display=swap');

section {
  width: 1280px;
  height: 720px;
  padding: 60px;
  font-family: 'Roboto', sans-serif;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: #ffffff;
}

h1, h2, h3 {
  color: #00ffff;
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

code {
  font-family: 'Fira Code', monospace;
  background-color: rgba(0, 0, 0, 0.3);
  color: #00ff00;
  padding: 3px 8px;
  border-radius: 4px;
}

pre {
  background-color: #1a1a1a;
  border: 1px solid #00ffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

pre code {
  background-color: transparent;
  color: #00ff00;
}
```

## テーマのテスト

テーマをテストするためのサンプルMarkdownファイル：

```markdown
---
marp: true
theme: your-theme-name
paginate: true
header: 'Header Text'
footer: 'Footer Text'
---

# H1 Heading

## H2 Heading

### H3 Heading

Regular text with **bold** and *italic*.

---

## Lists

- Bullet point 1
- Bullet point 2
  - Nested item

1. Numbered item 1
2. Numbered item 2

---

## Code

Inline `code` example.

```javascript
function hello() {
  console.log("Hello, World!");
}
```

---

## Table

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| A        | B        | C        |
| 1        | 2        | 3        |

---

<!-- class: invert -->

# Inverted Slide

This slide uses the invert class.

---

<!-- class: lead -->

# Lead Slide

Centered content
```

## テーマの配布

### ファイル配置

```
shared/
└── themes/
    ├── corporate.css
    ├── technical.css
    └── minimal.css
```

### 使用方法

```bash
# CLIでテーマ指定
marp --theme shared/themes/corporate.css slides.md

# または設定ファイル
# marp.config.js
module.exports = {
  themeSet: './shared/themes'
}
```

```markdown
---
marp: true
theme: corporate
---
```

## ベストプラクティス

1. **CSS変数を活用**: 色やサイズを変数で管理
2. **継承を使う**: 既存テーマをベースに拡張
3. **モジュール化**: 複数ファイルに分割して `@import`
4. **アクセシビリティ**: 十分なコントラスト比を確保
5. **テスト**: 様々なコンテンツタイプでテスト
6. **ドキュメント**: テーマの使い方をREADMEに記載

## 参考リソース

- [Marpit Theme CSS](https://marpit.marp.app/theme-css)
- [Marp Core Themes](https://github.com/marp-team/marp-core/tree/main/themes)
- [Theme Examples](https://github.com/rnd195/my-marp-themes)
- [Creating Themes Discussion](https://github.com/orgs/marp-team/discussions/115)
