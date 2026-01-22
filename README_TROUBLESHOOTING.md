# Vercelデプロイ トラブルシューティングガイド

## 500エラー: FUNCTION_INVOCATION_FAILED

サーバーレス関数がクラッシュしている場合の対処法です。

## 1. Vercelのログを確認

### ログの確認方法

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Functions」タブを開く
4. `api/index.py`を選択
5. 「Logs」タブでエラーログを確認

### よくあるエラーと対処法

#### データベース接続エラー

**エラーメッセージ例:**
```
django.db.utils.OperationalError: could not connect to server
```

**対処法:**
1. Vercelダッシュボードの「Settings」→「Environment Variables」で以下を確認：
   - `DB_ENGINE=django.db.backends.postgresql`
   - `DB_NAME=postgres`
   - `DB_USER=postgres`
   - `DB_PASSWORD=your_supabase_password`
   - `DB_HOST=db.xxxxx.supabase.co`
   - `DB_PORT=5432`

2. Supabaseの接続情報を確認：
   - Supabaseダッシュボードの「Settings」→「Database」で接続情報を確認
   - パスワードが正しいか確認
   - ホスト名が正しいか確認

3. Supabaseのファイアウォール設定を確認：
   - Supabaseダッシュボードの「Settings」→「Database」→「Connection pooling」
   - 「Allow connections from anywhere」が有効になっているか確認

#### SECRET_KEYエラー

**エラーメッセージ例:**
```
django.core.exceptions.ImproperlyConfigured: The SECRET_KEY setting must not be empty
```

**対処法:**
1. Vercelダッシュボードの「Settings」→「Environment Variables」で`SECRET_KEY`を設定
2. 強力なシークレットキーを生成：
   ```python
   from django.core.management.utils import get_random_secret_key
   print(get_random_secret_key())
   ```
3. 生成したキーをVercelの環境変数に設定

#### モジュールインポートエラー

**エラーメッセージ例:**
```
ModuleNotFoundError: No module named 'psycopg2'
```

**対処法:**
1. `requirements.txt`に必要なパッケージが含まれているか確認
2. 特に以下が含まれているか確認：
   - `psycopg2-binary==2.9.9`（PostgreSQL接続用）
   - `python-dotenv==1.0.0`（.envファイル読み込み用）

3. 再デプロイを実行

#### Django初期化エラー

**エラーメッセージ例:**
```
django.core.exceptions.AppRegistryNotReady
```

**対処法:**
1. `api/index.py`のDjango初期化部分を確認
2. `django.setup()`が正しく呼ばれているか確認
3. `settings.py`の設定を確認

## 2. 環境変数の確認

### 必須環境変数

以下がすべて設定されているか確認：

```
SECRET_KEY=your_secret_key
DEBUG=False
ALLOWED_HOSTS=your-app.vercel.app,your-app-*.vercel.app

DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
```

### 環境変数の設定方法

1. Vercelダッシュボードの「Settings」→「Environment Variables」を開く
2. 各環境変数を追加
3. 「Production」「Preview」「Development」を選択
4. 「Save」をクリック
5. **再デプロイを実行**（重要！）

## 3. デプロイ後の確認事項

### データベースマイグレーション

環境変数を設定した後、マイグレーションを実行：

```bash
# Vercel CLIを使用
vercel env pull .env.local
python manage.py migrate
```

または、Vercelダッシュボードの「Functions」タブから実行

### 静的ファイルの収集

静的ファイルが必要な場合：

```bash
python manage.py collectstatic --noinput
```

## 4. デバッグモードの有効化

一時的にデバッグモードを有効にして、詳細なエラー情報を確認：

1. Vercelダッシュボードの「Settings」→「Environment Variables」
2. `DEBUG=True`に設定（本番環境では`False`に戻す）
3. 再デプロイ

## 5. よくある問題と解決策

### 問題: 環境変数を追加したが反映されない

**解決策:**
- 環境変数を追加した後、**必ず再デプロイ**を実行
- Vercelはデプロイ時に環境変数を読み込むため、再デプロイが必要

### 問題: データベース接続がタイムアウトする

**解決策:**
1. Supabaseの接続プール設定を確認
2. `DB_HOST`が正しいか確認（接続プールのホストを使用）
3. Supabaseのファイアウォール設定を確認

### 問題: 関数がタイムアウトする

**解決策:**
1. `vercel.json`でタイムアウト設定を追加：
   ```json
   {
     "functions": {
       "api/index.py": {
         "maxDuration": 30
       }
     }
   }
   ```

## 6. ログの確認方法

### Vercelダッシュボード

1. 「Functions」タブ → `api/index.py` → 「Logs」タブ
2. リアルタイムでログを確認可能

### Vercel CLI

```bash
vercel logs
```

## 7. サポート

問題が解決しない場合：

1. Vercelのログを確認
2. エラーメッセージの全文をコピー
3. 環境変数の設定を確認
4. `requirements.txt`と`vercel.json`の設定を確認
