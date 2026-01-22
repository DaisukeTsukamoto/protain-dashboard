# 個人開発向けデータベース選択ガイド

VercelではSQLiteが使用できないため、外部データベースが必要です。個人開発におすすめのデータベースサービスをまとめました。

## おすすめランキング

### 1. **Supabase** ⭐️ 最もおすすめ

**特徴:**
- PostgreSQLベース（Djangoと相性が良い）
- 無料プランあり（500MBストレージ、2GB転送量/月）
- 簡単なセットアップ（5分で開始可能）
- 認証機能、リアルタイム機能も利用可能
- 日本語ドキュメントあり

**料金:**
- 無料プラン: 500MBストレージ、2GB転送量/月
- Proプラン: $25/月（8GBストレージ、50GB転送量/月）

**セットアップ手順:**
1. [Supabase](https://supabase.com/)にアカウント作成
2. プロジェクト作成
3. 「Settings」→「Database」で接続情報を取得
4. Vercelの環境変数に設定

**接続情報の取得:**
- `DB_HOST`: `db.xxxxx.supabase.co`
- `DB_NAME`: `postgres`
- `DB_USER`: `postgres`
- `DB_PASSWORD`: TIiVKbjzKOFcF8Kg
- `DB_PORT`: `5432`

### 2. **Neon** ⭐️ サーバーレス対応

**特徴:**
- PostgreSQLベース
- サーバーレス対応（自動スケーリング）
- 無料プランあり（3GBストレージ）
- ブランチ機能（Gitのようにデータベースをブランチ化可能）

**料金:**
- 無料プラン: 3GBストレージ
- Launchプラン: $19/月（10GBストレージ）

**セットアップ手順:**
1. [Neon](https://neon.tech/)にアカウント作成
2. プロジェクト作成
3. 接続情報を取得
4. Vercelの環境変数に設定

### 3. **Railway**

**特徴:**
- PostgreSQLベース
- 無料プランあり（$5クレジット/月）
- 簡単なデプロイ
- 他のサービス（Redisなど）も利用可能

**料金:**
- 無料プラン: $5クレジット/月
- Proプラン: $20/月（$10クレジット/月）

**セットアップ手順:**
1. [Railway](https://railway.app/)にアカウント作成
2. PostgreSQLサービスを追加
3. 接続情報を取得
4. Vercelの環境変数に設定

### 4. **PlanetScale** (MySQL互換)

**特徴:**
- MySQL互換
- 無料プランあり（5GBストレージ）
- ブランチ機能
- スケーラブル

**料金:**
- 無料プラン: 5GBストレージ
- Scalerプラン: $29/月（10GBストレージ）

**注意:** DjangoはPostgreSQLを推奨しているため、PlanetScaleを使用する場合は`django.db.backends.mysql`を使用する必要があります。

## Django設定例

### PostgreSQL（Supabase、Neon、Railway）

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'postgres'),
        'USER': os.getenv('DB_USER', ''),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', ''),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

### MySQL（PlanetScale）

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', ''),
        'USER': os.getenv('DB_USER', ''),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', ''),
        'PORT': os.getenv('DB_PORT', '3306'),
    }
}
```

## Vercel環境変数の設定

Vercelダッシュボードの「Settings」→「Environment Variables」で以下を設定：

```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
```

## マイグレーション実行

データベースを設定したら、マイグレーションを実行：

```bash
# ローカルで実行（環境変数を設定後）
python manage.py migrate

# またはVercel CLIを使用
vercel env pull .env.local
python manage.py migrate
```

## 推奨事項

**個人開発にはSupabaseが最もおすすめです：**
- 無料プランで十分な容量
- セットアップが簡単
- Djangoとの相性が良い
- 日本語ドキュメントあり
- 将来的に認証機能なども利用可能

## トラブルシューティング

### 接続エラーが発生する場合

1. **接続情報を確認**: ホスト、ポート、ユーザー名、パスワードが正しいか確認
2. **ファイアウォール設定**: データベースサービスのファイアウォール設定でVercelのIPアドレスを許可
3. **SSL接続**: 多くのサービスでSSL接続が必要（DjangoはデフォルトでSSLを使用）

### SSL接続が必要な場合

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'postgres'),
        'USER': os.getenv('DB_USER', ''),
        'PASSWORD': os.getenv('DB_PASSWORD', ''),
        'HOST': os.getenv('DB_HOST', ''),
        'PORT': os.getenv('DB_PORT', '5432'),
        'OPTIONS': {
            'sslmode': 'require',
        },
    }
}
```
