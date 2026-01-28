# Marp Markdown Syntax - コーディングエージェント向けガイド

## 基本構造

Marpは標準的なMarkdown構文を拡張し、プレゼンテーション特有の機能を追加しています。

### スライド区切り

スライドを分けるには `---` （水平線）を使用します。

```markdown
# 最初のスライド

これは最初のスライドの内容です。

---

# 2番目のスライド

これは2番目のスライドです。

---

# 3番目のスライド

内容が続きます...
```

## 標準Markdown要素

Marpは以下の標準Markdown構文をサポートしています：

### 見出し
```markdown
# H1 見出し
## H2 見出し
### H3 見出し
#### H4 見出し
##### H5 見出し
###### H6 見出し
```

### テキストフォーマット
```markdown
**太字**
*イタリック*
~~取り消し線~~
`インラインコード`
```

### リスト
```markdown
<!-- 箇条書き -->
- アイテム1
- アイテム2
  - ネストされたアイテム
  - もう1つ

<!-- 番号付きリスト -->
1. 最初のアイテム
2. 2番目のアイテム
3. 3番目のアイテム
```

### リンク
```markdown
[リンクテキスト](https://example.com)
```

### コードブロック
````markdown
```javascript
function hello() {
  console.log("Hello, Marp!");
}
```

```python
def greet():
    print("Hello, Marp!")
```
````

### テーブル
```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| A   | B   | C   |
| 1   | 2   | 3   |
```

### 引用
```markdown
> これは引用です。
> 複数行にわたることもできます。
```

## Marp固有の拡張構文

### 画像の配置

#### 基本的な画像挿入
```markdown
![代替テキスト](./images/picture.jpg)
```

#### 背景画像
```markdown
![bg](./images/background.jpg)
```

#### 背景画像のサイズ調整
```markdown
<!-- カバー（デフォルト） -->
![bg cover](./images/bg.jpg)

<!-- 含める -->
![bg contain](./images/bg.jpg)

<!-- フィット -->
![bg fit](./images/bg.jpg)

<!-- 自動 -->
![bg auto](./images/bg.jpg)

<!-- カスタムサイズ -->
![bg 80%](./images/bg.jpg)
![bg 200px](./images/bg.jpg)
```

#### 背景画像の位置
```markdown
<!-- 左 -->
![bg left](./images/bg.jpg)

<!-- 右 -->
![bg right](./images/bg.jpg)

<!-- 上下左右 -->
![bg top](./images/bg.jpg)
![bg bottom](./images/bg.jpg)

<!-- サイズと位置の組み合わせ -->
![bg right:40% fit](./images/bg.jpg)
```

#### 複数の背景画像
```markdown
![bg](./images/bg1.jpg)
![bg](./images/bg2.jpg)
![bg](./images/bg3.jpg)

<!-- 垂直分割 -->
![bg vertical](./images/bg1.jpg)
![bg](./images/bg2.jpg)
```

#### 背景フィルター
```markdown
<!-- ぼかし -->
![bg blur](./images/bg.jpg)
![bg blur:10px](./images/bg.jpg)

<!-- 明るさ -->
![bg brightness:0.5](./images/bg.jpg)

<!-- コントラスト -->
![bg contrast:1.5](./images/bg.jpg)

<!-- グレースケール -->
![bg grayscale](./images/bg.jpg)

<!-- セピア -->
![bg sepia](./images/bg.jpg)

<!-- 色相回転 -->
![bg hue-rotate:180deg](./images/bg.jpg)

<!-- 反転 -->
![bg invert](./images/bg.jpg)

<!-- 不透明度 -->
![bg opacity:0.3](./images/bg.jpg)

<!-- 彩度 -->
![bg saturate:2.0](./images/bg.jpg)

<!-- 複数フィルターの組み合わせ -->
![bg blur:3px brightness:0.8](./images/bg.jpg)
```

### フィットヘッダー

見出しをスライドに合わせて自動的に拡大します。

```markdown
# <!--fit--> 大きな見出し

この見出しは、スライドの幅に合わせて自動的にサイズ調整されます。
```

### 数式（Math）

MarpはKaTeXとMathJaxをサポートしています。

#### インライン数式
```markdown
The formula $E = mc^2$ is famous.
```

#### ブロック数式
```markdown
$$
\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}
$$
```

#### 数式ライブラリの指定
```markdown
---
math: katex
---
# スライド

$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
```

### 絵文字

#### ショートコード
```markdown
:smile: :heart: :+1:
```

#### Unicode絵文字
```markdown
😀 ❤️ 👍
```

Marp Coreはこれらを高解像度SVG（Twemoji）に自動変換します。

### HTMLの使用

Marpは限定的なHTMLをサポートしています。

```markdown
<div style="text-align: center; color: red;">
  中央揃えの赤いテキスト
</div>
```

**注意**: セキュリティ上の理由から、一部のHTML要素は制限されています。

## プレゼンターノート

スライドにはプレゼンター用のメモを追加できます。

```markdown
# スライドタイトル

スライドの内容

<!--
これはプレゼンターノートです。
発表者のみが見ることができます。
複数行書くこともできます。
-->
```

## ページ番号

ページ番号はディレクティブで有効にできます。

```markdown
---
paginate: true
---

# スライド1

以降のスライドにページ番号が表示されます
```

## ヘッダーとフッター

```markdown
---
header: 'プレゼンテーションタイトル'
footer: '著者名 | 日付'
---

# 最初のスライド

全スライドにヘッダーとフッターが表示されます
```

## 実践的な例

### シンプルなプレゼンテーション

```markdown
---
marp: true
theme: default
paginate: true
---

# タイトルスライド

**サブタイトル**

著者名
日付

---

## アジェンダ

1. イントロダクション
2. 主要ポイント
3. デモンストレーション
4. まとめ

---

## イントロダクション

- ポイント1
- ポイント2
- ポイント3

---

## コード例

```python
def hello_world():
    print("Hello, World!")
```

---

## 画像を含むスライド

![width:600px](./images/diagram.png)

図の説明テキスト

---

## 背景画像付きスライド

![bg right:40%](./images/photo.jpg)

### ポイント

- 左側にテキスト
- 右側に画像
- バランスの取れたレイアウト

---

# まとめ

- 要点1
- 要点2
- 要点3

**ありがとうございました！**
```

### 2列レイアウト

```markdown
---

<div style="display: flex;">
<div style="flex: 1; padding-right: 20px;">

## 左側

- ポイント1
- ポイント2
- ポイント3

</div>
<div style="flex: 1; padding-left: 20px;">

## 右側

- ポイントA
- ポイントB
- ポイントC

</div>
</div>

---
```

### フルスクリーン背景画像

```markdown
---

![bg](./images/fullscreen-bg.jpg)

# 背景画像上のテキスト

テキストが背景画像の上に表示されます

---
```

### 数式を含むスライド

```markdown
---
math: katex
---

## 数式の例

インライン数式: $E = mc^2$

ブロック数式:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

---
```

## よくあるパターン

### タイトルスライド
```markdown
---
marp: true
theme: default
---

<div style="text-align: center;">

# プレゼンテーションタイトル

## サブタイトル

著者名
組織名
日付

</div>
```

### セクション区切りスライド
```markdown
---
class: invert
---

<div style="text-align: center; padding-top: 200px;">

# セクション名

</div>
```

### 箇条書き + 画像
```markdown
---

![bg right:40% fit](./images/diagram.png)

## トピック

- ポイント1
- ポイント2
- ポイント3

右側に図表を配置
```

## ベストプラクティス

1. **一貫性のある構造**: 各スライドの構造を統一する
2. **適切な画像サイズ**: パフォーマンスのため、画像を最適化する
3. **フォントサイズ**: 読みやすいサイズを維持する
4. **色のコントラスト**: 背景とテキストのコントラストを確保する
5. **シンプルさ**: 1スライドに詰め込みすぎない

## 参考リソース

- [Marpit Markdown](https://marpit.marp.app/markdown)
- [Image syntax guide](https://marpit.marp.app/image-syntax)
- [Marp Core Features](https://github.com/marp-team/marp-core)
