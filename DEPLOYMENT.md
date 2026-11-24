# 本番環境の起動

Docker Compose、PostgreSQL、Caddyを使い、CaddyがLet's EncryptのHTTPS証明書を自動取得・更新します。

1. サーバーにDocker Composeを用意し、このリポジトリを配置します。
2. ドメインのDNS `A`/`AAAA` レコードをサーバーに向け、外部からTCPポート80/443（任意でUDP 443）へ接続できるようにします。
3. `JyobiKen/` で `.env.example` を `.env` にコピーし、`DOMAIN` を実際のドメイン、`APP_UID`/`APP_GID` を秘密ファイルを作成するデプロイユーザーの `id -u`/`id -g` の値に変更します。アプリはその非rootユーザーで起動します。

   ```sh
   cp .env.example .env
   ```
4. `JyobiKen/secrets/` にDB管理者とアプリ用DBユーザーのパスワードファイルを作ります。2つは別々の強いランダム値にしてください。

   ```sh
   cd JyobiKen
   mkdir -p secrets
   umask 077
   openssl rand -hex 32 > secrets/postgres_password.txt
   openssl rand -hex 32 > secrets/app_db_password.txt
   ```

   `.env` とパスワードファイルはデプロイユーザーだけが読める権限（`chmod 600 .env secrets/*.txt`）にしてください。
   初回起動時に `INITIAL_ADMIN_EMAIL` を `.env` に設定し、初期管理者パスワードを一時ファイルに設定します。

   ```sh
   openssl rand -hex 32 > secrets/initial_admin_password.txt
   chmod 600 secrets/initial_admin_password.txt
   ```

   アプリは管理者アカウントがまだない場合だけ初期管理者を作成します。ログイン確認後はパスワードファイルを不要なランダム値に置き換えてください。以降の管理者アカウント発行は管理者専用APIから行います。

5. リポジトリのルートから起動します。

   ```sh
   docker compose -f JyobiKen/docker-compose.yml up --build -d
   docker compose -f JyobiKen/docker-compose.yml ps
   ```

アプリのHTTPポートとPostgreSQLポートはホストへ公開せず、Caddyのみ80/443を公開します。DBパスワードはGit管理外のCompose secretとして渡します。`application-prod.properties` はHTTPSプロキシ用のセキュアCookieを有効にするため、Caddyを通さず直接公開しないでください。

PostgreSQLのデータは `postgres_data` named volume に保存されます。DBの初回作成時に `db/create-app-user.sh` がアプリ専用ロールを作成し、アプリ起動時に `schema.sql` が `app_user` テーブルを作成します。開発用H2のデータはPostgreSQLへ自動移行されないため、既存ユーザーを引き継ぐ場合は公開前に別途データ移行が必要です。永続データは定期的に暗号化して別ストレージへバックアップしてください。例:

```sh
umask 077
docker compose -f JyobiKen/docker-compose.yml exec -T db \
  pg_dump -U jyobiken_admin jyobiken \
  | gpg --symmetric --cipher-algo AES256 --output jyobiken-backup.sql.gpg
```

`.env` と `secrets/*.txt` は公開・コミットせず、バックアップも暗号化して保管してください。秘密情報を更新する際はPostgreSQL側のロールパスワードも合わせて変更します。
