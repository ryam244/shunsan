# 瞬算（Shunsan） - 不動産計算アプリ

**現場で3秒、根拠つきで"見せられる"不動産計算**

不動産仲介営業向けの専門計算ツール。ローン返済額・諸経費・坪単価を瞬時に計算し、顧客に提示できる形で表示します。

---

## 📱 アプリ概要

- **ターゲット：** 不動産仲介営業担当者
- **プラットフォーム：** iOS (React Native + Expo)
- **主要機能：**
  - ローン返済計算（元利均等）
  - 諸経費概算（仲介手数料・登記費用等）
  - 坪単価/平米単価換算
  - 計算結果の保存・共有

---

## 🚀 セットアップ（開発環境）

### 必要な環境

- **Node.js:** v18+
- **Expo CLI:** `npm install -g expo-cli`
- **iOS:** Xcode + iPhone実機（推奨）

### インストール手順

```bash
# 1. 依存関係のインストール
npm install

# 2. 環境変数の設定
cp .env.example .env
# .env ファイルを開いて、SupabaseのURLとAPIキーを設定

# 3. 開発サーバー起動
npm start

# 4. iOSシミュレーターで起動
npm run ios
```

---

## 📂 プロジェクト構造

```
shunsan-app/
├── app/                  # Expo Router (画面)
│   ├── (tabs)/           # タブナビゲーション
│   └── _layout.tsx       # ルートレイアウト
├── constants/            # 定数・テーマ
│   └── Colors.ts         # カラーパレット
├── package.json
├── app.json
└── tsconfig.json
```

---

## 🗓️ 開発フェーズ

### Phase 1-1: 基本プロジェクト（現在）✅
- [x] Expoプロジェクト作成
- [x] タブナビゲーション実装
- [x] カラーパレット定義

### Phase 1-2: Supabase接続（次）
- [ ] Supabase Client設定
- [ ] 認証機能実装（Email/Apple ID）

### Phase 1-3: ローン計算
- [ ] 計算ロジック実装
- [ ] 計算画面UI実装

---

## 🛠️ 技術スタック

- **フレームワーク:** React Native (Expo SDK 52+)
- **言語:** TypeScript
- **ルーティング:** Expo Router
- **バックエンド:** Supabase (PostgreSQL + Auth)
- **状態管理:** Zustand（Phase 1-2で追加予定）

---

## 📝 ライセンス

Private（開発中）

---

## 👤 開発者

瞬算プロジェクトチーム
