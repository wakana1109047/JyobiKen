## Reactについて
### 各ファイル
- **App.css** : 全体のレイアウト。ボタンや文字の大きさなど。システム全体のレイアウト。基本、いじらない。
- **page.css** : ページごとのレイアウト。ページのレイアウトを変更する際はこちらを修正
- **App.jsx** : SpringBootのControllerに近い役割。URLに応じて、画面を切り替える。目次的存在。
- **main.jsx** : SpringBootのmainメソッドに近い役割。Reactアプリを起動し、HTMLに人ようなデータを流し込む。
- **各ページ**(.jsx) : SpringBootのHTML / Thymeleaf テンプレート的存在。

### 起動方法
1. `cd frontend`で移動
2. node.jsがインストール前なら、`npm install`
3. `npm run dev`でReact起動

### Reactの役割
- 画面を作ること
- API(バックエンド)からJSON形式のデータをもらい、HTMLの可変部分にデータをはめ込む
- ユーザが入力したデータをJSON形式に変換し、APIへ送る