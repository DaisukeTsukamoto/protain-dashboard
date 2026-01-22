# Vercelプロジェクト設定ガイド

DjangoアプリケーションをVercelにデプロイする際の、Vercelダッシュボードでの設定項目です。

## 1. プロジェクトの基本設定

### プロジェクト名
- 任意のプロジェクト名を設定

### Framework Preset
- **設定不要**（`vercel.json`で設定済み）

### Root Directory
- **設定不要**（プロジェクトルートがデフォルト）

### Build Command
- **空欄**（`vercel.json`で`buildCommand: ""`を設定済み）

### Output Directory
- **設定不要**（Djangoアプリケーションのため）

### Install Command
- **空欄**（`vercel.json`で`installCommand: ""`を設定済み）

## 2. 環境変数の設定

Vercelダッシュボードの「Settings」→「Environment Variables」で以下を設定：

### 必須環境変数

#### `SECRET_KEY`
- **値**: Djangoのシークレットキー（本番用に強力なキーを生成）
- **生成方法**:
  ```python
  from django.core.management.utils import get_random_secret_key
  print(get_random_secret_key())
  ```
- **環境**: Production, Preview, Development すべて

#### `DEBUG`
- **値**: `False`（本番環境）
- **環境**: Production, Preview, Development すべて

#### `ALLOWED_HOSTS`
- **値**: Vercelのドメイン（カンマ区切り）
  - 例: `your-app.vercel.app,your-app-*.vercel.app`
  - カスタムドメインを使用する場合も追加
- **環境**: Production, Preview, Development すべて

### データベース環境変数（PostgreSQLを使用する場合）

#### `DB_ENGINE`
- **値**: `django.db.backends.postgresql`
- **環境**: Production, Preview, Development すべて

#### `DB_NAME`
- **値**: データベース名
- **環境**: Production, Preview, Development すべて

#### `DB_USER`
- **値**: データベースユーザー名
- **環境**: Production, Preview, Development すべて

#### `DB_PASSWORD`
- **値**: データベースパスワード
- **環境**: Production, Preview, Development すべて

#### `DB_HOST`
- **値**: データベースホスト（例: `db.xxxxx.supabase.co`）
- **環境**: Production, Preview, Development すべて

#### `DB_PORT`
- **値**: `5432`（PostgreSQLのデフォルトポート）
- **環境**: Production, Preview, Development すべて

## 3. デプロイ設定

### Git連携
- GitHub/GitLab/Bitbucketと連携する場合：
  1. 「Settings」→「Git」でリポジトリを接続
  2. ブランチごとに自動デプロイを設定可能

### カスタムドメイン
- 「Settings」→「Domains」でカスタムドメインを追加
- `ALLOWED_HOSTS`にカスタムドメインも追加することを忘れずに

## 4. ビルド設定

### Build & Development Settings
- **Framework Preset**: 設定不要（`vercel.json`で設定済み）
- **Root Directory**: 設定不要
- **Build Command**: 空欄（`vercel.json`で設定済み）
- **Output Directory**: 設定不要
- **Install Command**: 空欄（`vercel.json`で設定済み）

## 5. 関数設定

### Serverless Functions
- `api/index.py`が自動的に検出されます
- `vercel.json`の`functions`設定で`python3.9`ランタイムが指定済み

## 6. デプロイ後の作業

### 1. データベースマイグレーション
Vercel CLIを使用してマイグレーションを実行：

```bash
vercel env pull .env.local
python manage.py migrate
```

または、Vercelダッシュボードの「Functions」タブから実行

### 2. 静的ファイルの収集
`vercel.json`の`buildCommand`に以下を追加するか、手動で実行：

```bash
python manage.py collectstatic --noinput
```

### 3. スーパーユーザーの作成
ローカル環境でデータベースに接続して作成するか、Vercel CLIを使用：

```bash
vercel env pull .env.local
python manage.py createsuperuser
```

## 7. トラブルシューティング

### デプロイが失敗する場合
1. **ログを確認**: 「Deployments」タブでデプロイログを確認
2. **環境変数を確認**: すべての環境変数が正しく設定されているか確認
3. **`vercel.json`を確認**: 設定が正しいか確認

### アプリケーションが動作しない場合
1. **Functionsログを確認**: 「Functions」タブで`api/index.py`のログを確認
2. **`DEBUG=True`に一時的に変更**: エラーメッセージを確認（本番環境では`False`に戻す）
3. **データベース接続を確認**: データベースの接続情報が正しいか確認

## 8. 推奨設定

### セキュリティ
- `DEBUG=False`を必ず設定
- `SECRET_KEY`は強力なキーを使用
- 環境変数は「Settings」→「Environment Variables」で管理

### パフォーマンス
- 静的ファイルはCDNで配信（`vercel.json`で設定済み）
- データベース接続プールを使用（可能な場合）

### 監視
- Vercelの「Analytics」でパフォーマンスを監視
- 「Logs」タブでエラーログを確認
