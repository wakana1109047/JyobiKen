# 既存DBの更新手順

プロジェクトのルートで、PowerShellから順に実行する。エラーが出たら次へ進まない。

以下は `users` が作成済みのローカルDB向け。`docker-compose.local.yml` はGit管理外なので、他の環境ではComposeファイル・DB名・接続ユーザーを読み替える。

## 1. DB起動・バックアップ

Docker Desktopを起動してから実行する。

```powershell
docker compose -f docker-compose.local.yml up -d --wait db
New-Item -ItemType Directory -Force .local-archives
$backupName = "before-migration-$(Get-Date -Format 'yyyyMMdd-HHmmss').dump"
docker compose -f docker-compose.local.yml exec db pg_dump -U jyobiken -d jyobiken -Fc -f "/tmp/$backupName"
docker compose -f docker-compose.local.yml cp "db:/tmp/$backupName" ".local-archives/$backupName"
```

バックアップはGitへ追加しない。

## 2. SQL適用

各SQLで `COMMIT` が表示されたことを確認してから、次を実行する。

```powershell
Get-Content -Raw db/migration/update_users.sql | docker compose -f docker-compose.local.yml exec -T db psql -U jyobiken -d jyobiken -v ON_ERROR_STOP=1
Get-Content -Raw db/migration/create_production_enrollments.sql | docker compose -f docker-compose.local.yml exec -T db psql -U jyobiken -d jyobiken -v ON_ERROR_STOP=1
```

## 3. 確認

```powershell
docker compose -f docker-compose.local.yml exec db psql -P pager=off -U jyobiken -d jyobiken -c "\d users"
docker compose -f docker-compose.local.yml exec db psql -P pager=off -U jyobiken -d jyobiken -c "\d production_enrollments"
```

`users` に追加4カラムがあり、学科がNULL許可になっていること、受講回答テーブルがあることを確認する。

※既存行の `created_at` はSQL適用時刻になる。SQLは手動適用で、APIの更新・テスト実行は別途必要。
