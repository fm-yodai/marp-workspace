# Marp Directives - コーディングエージェント向けガイド

## ディレクティブとは

ディレクティブは、スライドの動作や外観を制御するための特殊な設定値です。Marpでは3種類のディレクティブがあります：

1. **グローバルディレクティブ** - スライドデッキ全体に適用
2. **ローカルディレクティブ** - 現在および以降のスライドに適用
3. **スポットディレクティブ** - 現在のスライドのみに適用

## ディレクティブの構文

### Front-matter構文（YAML）

Markdownファイルの**最初**に配置する必要があります。

```markdown
---
marp: true
theme: default
paginate: true
backgroundColor: white
---

# 最初のスライド
```

### HTMLコメント構文

スライド内の任意の場所に配置できます。

```markdown
<!-- theme: gaia -->
<!-- paginate: true -->

# スライドタイトル
```

または複数行で：

```markdown
<!--
theme: gaia
paginate: true
backgroundColor: #f0f0f0
-->

# スライドタイトル
```

## グローバルディレクティブ

グローバルディレクティブは**スライドデッキ全体**に適用されます。同じディレクティブが複数回設定された場合、**最後の値**が使用されます。

### 主要なグローバルディレクティブ

#### `marp`
Marp機能を有効化します（必須）。

```markdown
---
marp: true
---
```

#### `theme`
使用するテーマを指定します。

```markdown
---
theme: default
---

# または

---
theme: gaia
---

# または

---
theme: uncover
---

# カスタムテーマ
---
theme: my-custom-theme
---
```

#### `size`
スライドのサイズ（アスペクト比）を指定します。

```markdown
---
size: 16:9
---

# または

---
size: 4:3
---
```

テーマがカスタムサイズプリセットを定義している場合：

```markdown
---
theme: custom-theme
size: 4K
---
```

#### `math`
数式レンダリングライブラリを指定します。

```markdown
---
math: katex
---

# または

---
math: mathjax
---
```

## ローカルディレクティブ

ローカルディレクティブは**現在のスライドと以降の全スライド**に適用されます。スライドは、明示的に上書きされない限り、直前のスライドの設定を継承します。

### 主要なローカルディレクティブ

#### `paginate`
ページ番号の表示/非表示を制御します。

```markdown
---
marp: true
---

# スライド1（ページ番号なし）

---

<!-- paginate: true -->

# スライド2（ページ番号あり）

---

# スライド3（ページ番号あり - 継承）

---

<!-- paginate: false -->

# スライド4（ページ番号なし）
```

特定のスライドをスキップ：

```markdown
<!-- paginate: skip -->
```

#### `header`
全スライドにヘッダーを追加します。

```markdown
<!-- header: 'プレゼンテーションタイトル' -->

# スライド

以降のスライドにヘッダーが表示されます
```

#### `footer`
全スライドにフッターを追加します。

```markdown
<!-- footer: '著者名 | 2024-01-28' -->

# スライド

以降のスライドにフッターが表示されます
```

#### `class`
スライドにCSSクラスを適用します。

```markdown
<!-- class: invert -->

# このスライドは反転色になります
```

一般的なクラス：
- `invert` - テキストと背景を反転
- `lead` - 中央揃えの大きなテキスト（テーマによる）

#### `backgroundColor`
背景色を設定します。

```markdown
<!-- backgroundColor: #f0f0f0 -->

# グレー背景のスライド

---

<!-- backgroundColor: aqua -->

# アクア背景のスライド
```

#### `color`
テキスト色を設定します。

```markdown
<!-- color: #333333 -->

# ダークグレーのテキスト
```

#### `backgroundImage`
背景画像をCSSとして設定します。

```markdown
<!-- backgroundImage: url('./images/bg.jpg') -->

# 背景画像付きスライド

---

<!-- backgroundImage: linear-gradient(to bottom, #67b26f, #4ca2cd) -->

# グラデーション背景
```

#### `backgroundSize`
背景画像のサイズを制御します。

```markdown
<!--
backgroundImage: url('./images/bg.jpg')
backgroundSize: cover
-->

# スライド

---

<!--
backgroundImage: url('./images/bg.jpg')
backgroundSize: contain
-->

# スライド
```

#### `backgroundPosition`
背景画像の位置を制御します。

```markdown
<!--
backgroundImage: url('./images/bg.jpg')
backgroundPosition: center
-->
```

#### `backgroundRepeat`
背景画像の繰り返しを制御します。

```markdown
<!--
backgroundImage: url('./images/pattern.png')
backgroundRepeat: repeat
-->
```

## スポットディレクティブ

スポットディレクティブは**現在のスライドのみ**に適用されます。ディレクティブ名の前にアンダースコア（`_`）を付けます。

### スポットディレクティブの構文

```markdown
---
marp: true
paginate: true
---

# スライド1（ページ番号あり）

---

# スライド2（ページ番号あり）

---

<!-- _paginate: false -->

# スライド3（ページ番号なし、このスライドのみ）

---

# スライド4（ページ番号あり - 元の設定に戻る）
```

### 実践例

#### 特定のスライドのみ背景色を変更

```markdown
---
marp: true
---

# 通常の背景

---

<!-- _backgroundColor: black -->
<!-- _color: white -->

# このスライドのみ黒背景

---

# 再び通常の背景に戻る
```

#### タイトルスライドのみカスタマイズ

```markdown
---
marp: true
paginate: true
---

<!-- _paginate: false -->
<!-- _class: invert -->

# タイトルスライド

ページ番号なし、反転色

---

# 通常のスライド

ページ番号あり、通常の色
```

## ディレクティブの優先順位

ディレクティブは以下の順序で適用されます（後の方が優先）：

1. テーマのデフォルト値
2. グローバルディレクティブ
3. ローカルディレクティブ（前のスライドから継承）
4. 現在のスライドのローカルディレクティブ
5. スポットディレクティブ

## 実践的なパターン

### パターン1: 一貫したヘッダー/フッター

```markdown
---
marp: true
theme: default
paginate: true
header: 'プレゼンテーションタイトル'
footer: '© 2024 Company Name'
---

<!-- _paginate: false -->
<!-- _header: '' -->
<!-- _footer: '' -->

# タイトルスライド

タイトルスライドにはヘッダー/フッター/ページ番号なし

---

# 通常のスライド

ヘッダー/フッター/ページ番号あり
```

### パターン2: セクション区切りスライド

```markdown
---
marp: true
theme: default
paginate: true
---

# セクション1

通常のスライド

---

<!-- _class: invert -->
<!-- _paginate: false -->

# セクション2

セクション区切りは反転色、ページ番号なし

---

# セクション2の内容

通常の設定に戻る
```

### パターン3: 複数の背景設定

```markdown
---
marp: true
---

<!--
_backgroundImage: url('./images/bg1.jpg')
_backgroundSize: cover
_backgroundPosition: center
_color: white
-->

# 特別な背景のスライド

---

# 通常の背景に戻る
```

### パターン4: 動的なページ番号制御

```markdown
---
marp: true
paginate: true
---

<!-- _paginate: false -->

# 表紙

---

<!-- _paginate: skip -->

# 目次

---

# スライド1

ここからページ番号がカウント開始

---

# スライド2
```

## 利用可能なディレクティブ一覧

### グローバル専用

| ディレクティブ | 型 | 説明 | 例 |
|--------------|-----|------|-----|
| `marp` | boolean | Marp機能の有効化 | `true` |
| `theme` | string | テーマ名 | `default`, `gaia`, `uncover` |
| `size` | string | スライドサイズ | `16:9`, `4:3` |
| `math` | string | 数式ライブラリ | `katex`, `mathjax` |

### ローカル/スポット対応

| ディレクティブ | 型 | 説明 | 例 |
|--------------|-----|------|-----|
| `paginate` | boolean/string | ページ番号 | `true`, `false`, `skip` |
| `header` | string | ヘッダーテキスト | `'My Header'` |
| `footer` | string | フッターテキスト | `'My Footer'` |
| `class` | string | CSSクラス | `invert`, `lead` |
| `backgroundColor` | string | 背景色 | `#ffffff`, `aqua` |
| `backgroundImage` | string | 背景画像 | `url('./bg.jpg')` |
| `backgroundSize` | string | 背景サイズ | `cover`, `contain` |
| `backgroundPosition` | string | 背景位置 | `center`, `top left` |
| `backgroundRepeat` | string | 背景繰り返し | `no-repeat`, `repeat` |
| `color` | string | テキスト色 | `#000000`, `red` |

## コーディングエージェントのためのベストプラクティス

1. **Front-matterを優先**: グローバル設定にはFront-matterを使用
2. **スポットディレクティブを活用**: 特定のスライドのみ変更する場合
3. **一貫性を保つ**: 同じ目的には同じディレクティブパターンを使用
4. **コメントを追加**: 複雑なディレクティブの組み合わせには説明を追加
5. **継承を理解**: ローカルディレクティブの継承動作を把握する

## デバッグのヒント

### ディレクティブが効かない場合

1. **構文チェック**: YAML構文が正しいか確認
2. **スコープ確認**: グローバル/ローカル/スポットの使い分け
3. **継承確認**: 前のスライドから意図しない設定を継承していないか
4. **テーマサポート**: 使用中のテーマがそのディレクティブをサポートしているか

### 一般的な間違い

```markdown
<!-- ❌ 間違い: スペースなし -->
<!--paginate:true-->

<!-- ✅ 正しい: 適切なスペース -->
<!-- paginate: true -->

<!-- ❌ 間違い: Front-matterの位置 -->
# タイトル

---
marp: true
---

<!-- ✅ 正しい: ファイルの最初 -->
---
marp: true
---

# タイトル
```

## 参考リソース

- [Marpit Directives](https://marpit.marp.app/directives)
- [Marp Guide: Directives](https://github.com/marp-team/marp/blob/main/website/docs/guide/directives.md)
- [DeepWiki: Directives and Syntax](https://deepwiki.com/marp-team/marp/3.1-directives-and-syntax)
