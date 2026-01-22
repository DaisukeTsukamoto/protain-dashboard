# 環境変数の管理方法

## 重要なポイント

**`.env`ファイルはGitにコミットしません！**

`.env`ファイルには機密情報（パスワード、シークレットキーなど）が含まれるため、Gitにコミットしてはいけません。代わりに、各環境で環境変数を設定します。

## ローカル開発環境

### `.env`ファイルを使用

1. プロジェクトルートに`.env`ファイルを作成（既に作成済み）
2. Supabaseの接続情報を設定：

```bash
# .env
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
```

3. `settings.py`の`load_dotenv()`が`.env`ファイルを自動的に読み込みます

## Vercel（本番環境）

### Vercelダッシュボードで環境変数を設定

`.env`ファイルはGitにコミットされないため、Vercelでは使用されません。代わりに、Vercelダッシュボードで環境変数を設定します。

#### 設定手順

1. Vercelダッシュボードにログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」を開く
4. 以下の環境変数を追加：

```
SECRET_KEY=your_production_secret_key
DEBUG=False
ALLOWED_HOSTS=your-app.vercel.app,your-app-*.vercel.app

DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
```

5. 各環境変数に対して「Production」「Preview」「Development」を選択
6. 「Save」をクリック

#### 動作の仕組み

- Vercelはデプロイ時に、ダッシュボードで設定した環境変数を自動的に読み込みます
- `settings.py`の`os.getenv()`が、Vercelの環境変数から直接値を取得します
- `load_dotenv()`はローカル開発環境でのみ動作し、Vercelでは無視されます

## `.env.example`ファイル

`.env.example`はテンプレートファイルとしてGitにコミットします。これにより、他の開発者がどの環境変数が必要かを把握できます。

```bash
# .env.example（Gitにコミットされる）
SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password_here
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
```

## セキュリティのベストプラクティス

1. **`.env`ファイルは絶対にGitにコミットしない**
   - `.gitignore`に`.env`が含まれていることを確認

2. **本番環境のシークレットキーは強力なものを使用**
   ```python
   from django.core.management.utils import get_random_secret_key
   print(get_random_secret_key())
   ```

3. **環境変数は各環境で個別に管理**
   - ローカル: `.env`ファイル
   - Vercel: Vercelダッシュボード

4. **`.env.example`はテンプレートとしてコミット**
   - 実際のパスワードは含めない

## トラブルシューティング

### Vercelで環境変数が読み込まれない場合

1. Vercelダッシュボードで環境変数が正しく設定されているか確認
2. 環境変数の名前が`settings.py`の`os.getenv()`と一致しているか確認
3. デプロイ後に環境変数を追加した場合は、再デプロイが必要です

### ローカルで環境変数が読み込まれない場合

1. `.env`ファイルがプロジェクトルート（`manage.py`と同じディレクトリ）にあるか確認
2. `python-dotenv`がインストールされているか確認：
   ```bash
   pip install python-dotenv
   ```
3. `settings.py`の`load_dotenv()`が正しく設定されているか確認
