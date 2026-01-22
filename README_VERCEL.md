# Django on Vercel デプロイガイド

このドキュメントは、DjangoアプリケーションをVercelにデプロイするための標準的な方法を説明します。

## アーキテクチャ

Vercelはサーバーレス環境のため、Djangoアプリケーションをサーバーレス関数として実行する必要があります。

## ファイル構成

```
project/
├── api/
│   ├── __init__.py
│   └── index.py          # サーバーレス関数エントリーポイント
├── vercel.json           # Vercel設定ファイル
├── requirements.txt      # Python依存関係
└── .gitignore           # Git除外設定
```

## 実装のポイント

### 1. `api/index.py`の実装

- `handler(request)`関数を定義
- `request`は辞書形式で渡される
- レスポンスも辞書形式で返す必要がある
- DjangoのWSGIアプリケーションをラップして実行

### 2. `vercel.json`の設定

- `functions`設定は不要（Vercelが自動検出）
- `routes`でルーティングを定義
- 静的ファイルの配信設定

### 3. 環境変数

- `SECRET_KEY`: Djangoのシークレットキー
- `DEBUG`: `False`（本番環境）
- `ALLOWED_HOSTS`: Vercelのドメイン
- データベース接続情報

## デプロイ手順

1. Vercel CLIでデプロイ: `vercel`
2. 環境変数を設定
3. データベースマイグレーション実行
4. 静的ファイル収集

## 注意事項

- SQLiteは使用不可（PostgreSQLなどが必要）
- 静的ファイルは`collectstatic`で収集
- セッションはデータベースベースを推奨
