# データ記録（DB設計・制約・運用）メモ

この文書は、MVPで扱うデータを「どう記録するか」を実装可能な粒度で整理します。  
要件本文は `docs/requirements.md` を正とします。

## 1. 対象（MVP）

- 会員（Member）
- 配送先（ShippingAddress）
- 注文（Order）
- 管理ユーザー（Django 標準 User）

## 2. データを「記録」する時に最低限決めること

### 2.1 制約（DBで守る）

- **ユニーク**: Member.email は **ユニークにする（決定）**
- **NOT NULL**: 必須項目（例: Member.name）
- **文字数/形式（決定）**
  - postal_code: **ハイフンありの文字列**（例: `123-4567`）
  - phone: **ハイフンありの文字列**（例: `090-1234-5678`）
  - 入力揺れ対応: 登録/更新時に正規化（ハイフン無し入力でも保存形式に合わせる）
- **外部キー整合性**: Order.member_id / Order.shipping_address_id

### 2.2 リレーション

- Member（1）-（N）ShippingAddress
- Member（1）-（N）Order
- ShippingAddress（1）-（N）Order

### 2.3 削除ポリシー（重要）

運用上、参照整合性が壊れないように「削除」をどう扱うかを決めます。

- **方針（決定）: 論理削除（ソフトデリート）**
  - Member / ShippingAddress は論理削除で残す
  - Order は原則削除しない（取消は `status` で表現）

#### 論理削除に必要なカラム（決定）

- **採用**: `is_active`（bool）
  - 理由: MVPで最小。UI上の「無効化/非表示」要件に対応しやすい
- **MVPでは採用しない**: `deleted_at`（datetime）
  - 理由: 運用ログ要件がMVP対象外のため。必要になった段階で追加しやすい

## 3. データ辞書（MVP）

※ 「型」は Django モデル想定の概念表記です。最終はモデル実装で確定します。

### 3.1 Member（会員）

| カラム | 型（目安） | 必須 | 例 | 備考 |
| --- | --- | --- | --- | --- |
| name | string | Yes | 山田 太郎 | 氏名 |
| email | string | Yes | taro@example.com | ユニーク（決定） |
| phone | string | No | 090-1234-5678 | ハイフンあり文字列（決定） |
| is_active | bool | Yes | true | 論理削除フラグ（false=無効） |
| created_at | datetime | Yes |  | 自動付与 |
| updated_at | datetime | Yes |  | 自動付与 |

### 3.2 ShippingAddress（配送先）

| カラム | 型（目安） | 必須 | 例 | 備考 |
| --- | --- | --- | --- | --- |
| member_id | FK | Yes | 1 | Member 参照 |
| label | string | Yes | 自宅 | 配送先の表示名 |
| postal_code | string | Yes | 123-4567 | ハイフンあり文字列（決定） |
| address1 | string | Yes | 東京都渋谷区 | 都道府県・市区町村 |
| address2 | string | Yes | 1-2-3 | 番地等 |
| recipient_name | string | Yes | 山田 太郎 | 宛名 |
| phone | string | No | 090-1234-5678 | 任意 |
| is_active | bool | Yes | true | 論理削除フラグ（false=無効） |
| created_at | datetime | Yes |  | 自動付与 |
| updated_at | datetime | Yes |  | 自動付与 |

### 3.3 Order（注文）

| カラム | 型（目安） | 必須 | 例 | 備考 |
| --- | --- | --- | --- | --- |
| member_id | FK | Yes | 1 | Member 参照 |
| shipping_address_id | FK | Yes | 10 | ShippingAddress 参照 |
| status | enum/string | Yes | 受付 | 候補値は下記（決定） |
| memo | text | No | 玄関前に置いてください | 任意 |
| created_at | datetime | Yes |  | 自動付与 |
| updated_at | datetime | Yes |  | 自動付与 |

#### Order.status 候補値（決定）

MVPで運用が回りやすく、将来の拡張にも繋がる最小セットです。

| 値 | 意味 | 備考 |
| --- | --- | --- |
| 受付 | 注文を受け付けた（新規作成直後） | **初期値** |
| 対応中 | 対応・準備中 | 作業中の雑な状態を吸収 |
| 完了 | 対応が完了した | 「発送済み」等は次フェーズで追加可能 |
| キャンセル | 取り消し | Order は削除せず status で表現 |

#### 推奨する最低限のルール

- 受付 → 対応中 → 完了
- 受付/対応中 → キャンセル（必要なら）

## 4. 運用上の「記録」方針（MVPの範囲内）

### 4.1 監査ログ/操作ログ

`docs/requirements.md` 上は MVP 対象外です。  
ただし将来追加しやすくするため、以下は“前提”として揃えると安全です。

- **created_at/updated_at の統一**
- **削除は論理削除寄りで設計**（後から履歴が必要になっても困りにくい）

<!-- 開発中のノイズを避けるため、未確定事項リストは置かない。決定事項のみを本文に反映する。 -->

