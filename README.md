## Reactについて
### 各ファイル
- **App.<mark style="background:magenta;">css</mark>** : 全体のレイアウト。ボタンや文字の大きさなど。システム全体のレイアウト。基本、いじらない。
- **page.<mark style="background:magenta;">css</mark>** : ページごとのレイアウト。ページのレイアウトを変更する際はこちらを修正
- **App.<mark>jsx</mark>** : SpringBootのControllerに近い役割。URLに応じて、画面を切り替える。目次的存在。**Reactファイル**。
- **main.<mark>jsx</mark>** : SpringBootのmainメソッドに近い役割。Reactアプリを起動し、HTMLに人ようなデータを流し込む。**Reactファイル**。
- **各ページ**(.jsx) : SpringBootのHTML / Thymeleaf テンプレート的存在。**Reactファイル**。

### 起動方法
1. `cd frontend`で移動
2. node.jsがインストール前なら、`npm install`
3. `npm run dev`でReact起動

### Reactの役割
- 画面を作ること
- API(バックエンド)からJSON形式のデータをもらい、HTMLの可変部分にデータをはめ込む
- ユーザが入力したデータをJSON形式に変換し、APIへ送る
- （一部のセキュリティ）※ 関所的役割

### 注意
- HTMLのタグや属性名がReactだと異なる物がある（aタグやクラスなど）
- コンポーネントというページの塊単位で開発する　※開発が進んでくるとコンポーネントの入れ子構造になる
- 再利用できるパーツ(CSS含む)は、共通化する