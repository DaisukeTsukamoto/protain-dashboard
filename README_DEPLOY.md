# Vercelデプロイガイド

このDjangoアプリケーションをVercelにデプロイする手順です。

## 必要なファイル

以下のファイルがプロジェクトに含まれている必要があります：

- `vercel.json` - Vercel設定ファイル
- `api/index.py` - サーバーレス関数エントリーポイント
- `requirements.txt` - Python依存関係

## デプロイ手順

### 1. Vercel CLIのインストール

```bash
npm i -g vercel
```

### 2. Vercelにログイン

```bash
vercel login
```

### 3. プロジェクトをデプロイ

```bash
vercel
```

初回デプロイ時は、いくつかの質問に答える必要があります。

### 4. 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定してください：

- `DEBUG`: `False` (本番環境)
- `SECRET_KEY`: Djangoのシークレットキー（本番用に変更）
- `ALLOWED_HOSTS`: Vercelのドメイン（例: `your-app.vercel.app`）
- `DB_ENGINE`: データベースエンジン（例: `django.db.backends.postgresql`）
- `DB_NAME`: データベース名
- `DB_USER`: データベースユーザー名
- `DB_PASSWORD`: データベースパスワード
- `DB_HOST`: データベースホスト
- `DB_PORT`: データベースポート

### 5. データベースマイグレーション

Vercelのダッシュボードから「Functions」タブで、`api/index.py`を選択し、「Run」ボタンで以下のコマンドを実行：

```bash
python manage.py migrate
```

または、Vercel CLIを使用：

```bash
vercel env pull .env.local
python manage.py migrate
```

### 6. 静的ファイルの収集

静的ファイルを収集するには、ビルドコマンドを追加するか、手動で実行：

```bash
python manage.py collectstatic --noinput
```

## 注意事項

1. **データベース**: Vercelはサーバーレス環境のため、SQLiteは使用できません。PostgreSQLなどの外部データベースが必要です。

2. **静的ファイル**: 静的ファイルはVercelのCDNで配信されます。`collectstatic`を実行して静的ファイルを収集してください。

3. **セッション**: サーバーレス環境では、セッションストレージにデータベースを使用することを推奨します。

4. **シークレットキー**: 本番環境では必ず強力なシークレットキーを設定してください。

## トラブルシューティング

### デプロイエラーが発生する場合

1. `requirements.txt`に必要なパッケージがすべて含まれているか確認
2. `vercel.json`の設定が正しいか確認
3. 環境変数が正しく設定されているか確認

### アプリケーションが動作しない場合

1. Vercelのログを確認
2. `DEBUG=True`に設定してエラーメッセージを確認（本番環境では`False`に戻す）
3. データベース接続を確認
