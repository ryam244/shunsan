# PROJECT_PLAN.md - 不動産計算アプリ「瞬算」

## 1. プロジェクト概要

### アプリ名
**瞬算（Instant Estate）** - 不動産仲介営業向け計算アプリ

### コンセプト
「現場で3秒、根拠つきで"見せられる"不動産計算」

仲介営業の接客現場で、ローン返済額・諸経費・坪単価を瞬時に計算し、顧客に提示できる形で表示する専門ツール。

### ターゲットユーザー
**プライマリ：** 不動産仲介営業担当者（売買・賃貸）
**セカンダリ：** 個人不動産投資家、マイホーム購入検討者

### USP（差別化要素）
1. **速度：** 最短10秒で計算完了
2. **再現性：** 計算条件を保存・共有可能
3. **提示力：** 顧客に見せられる計算結果画面
4. **統合：** ローン・諸経費・単価換算を1アプリで

---

## 2. 現在のステータス

**Phase：** Phase 1-1（基本プロジェクト構築完了）
**進捗：** 15% - 基本構造・カラーパレット・タブナビゲーション完成
**予定工数：** 5.5週間（約1.5ヶ月）
**目標リリース日：** TBD（技術仕様確定後に設定）

**Phase 1-1 完了タスク：**
- ✅ Expoプロジェクト作成
- ✅ TypeScript設定
- ✅ Expo Router設定
- ✅ カラーパレット作成
- ✅ タブナビゲーション実装（4タブ）
- ✅ 起動確認用ホーム画面

---

## 3. 技術スタック

### フロントエンド
- **フレームワーク：** React Native (Expo SDK 52+)
- **言語：** TypeScript
- **ルーティング：** Expo Router (File-based routing)
- **スタイリング：** StyleSheet (標準)
- **状態管理：** Zustand

### バックエンド
- **BaaS：** Firebase
  - Firestore（NoSQLデータベース）
  - Firebase Auth（認証：Email / Apple ID / Google）
  - Firebase Storage（画像保存）
  - Firebase Analytics（分析・モニタリング）

### 外部サービス
- **認証：** Firebase Auth
- **分析：** Firebase Analytics（統合済み）
- **課金：** Phase 1.5で実装予定（RevenueCat検討）

### 開発環境
- **Node.js：** v18+
- **Expo CLI：** 最新版
- **iOS：** iOS 15.0+
- **テストデバイス：** iPhone実機（推奨）

---

## 4. データモデル

### 4.1 User（ユーザー）
```typescript
interface User {
  id: string;                    // Firebase Auth UID
  email: string;                 // メールアドレス
  display_name?: string;         // 表示名
  company_name?: string;         // 会社名
  logo_url?: string;             // ロゴ画像URL
  default_interest_rate: number; // 標準金利（デフォルト: 0.475）
  created_at: string;            // 作成日時
  updated_at: string;            // 更新日時
}
```

### 4.2 Property（物件・計算結果）
```typescript
interface Property {
  id: string;                    // UUID
  user_id: string;               // ユーザーID (FK)
  
  // 基本情報
  property_name: string;         // 物件名
  address?: string;              // 住所
  image_url?: string;            // 物件画像URL
  is_pinned: boolean;            // ピン留めフラグ
  
  // 物件詳細
  structure?: string;            // 構造（RC造/鉄骨造/木造）
  building_age?: number;         // 築年数
  floor?: number;                // 所在階
  area_sqm?: number;             // 専有面積（㎡）
  rent?: number;                 // 賃料
  
  // ローン計算データ
  property_price: number;        // 物件価格（万円）
  down_payment: number;          // 頭金（万円）
  interest_rate: number;         // 金利（%）
  loan_term: number;             // 借入期間（年）
  bonus_payment: number;         // ボーナス払い（万円）
  
  // 計算結果
  monthly_payment: number;       // 月々支払額（円）
  total_payment: number;         // 総支払額（万円）
  total_interest: number;        // 利息合計（万円）
  
  // 諸経費データ
  brokerage_fee: number;         // 仲介手数料（円）
  registration_fee: number;      // 登記費用（円）
  stamp_duty: number;            // 印紙代（円）
  loan_handling_fee: number;     // ローン事務手数料（円）
  total_expenses: number;        // 諸経費合計（円）
  
  // メタデータ
  calculation_type: 'loan' | 'expense' | 'unit'; // 計算種別
  created_at: string;            // 作成日時
  updated_at: string;            // 更新日時
}
```

### 4.3 Settings（設定）
```typescript
interface Settings {
  user_id: string;               // ユーザーID (PK, FK)
  
  // 計算デフォルト設定
  default_interest_rate: number; // 標準金利（%）
  default_loan_term: number;     // 標準借入期間（年）
  
  // 諸経費デフォルト設定
  brokerage_rate: number;        // 仲介手数料率（標準: 3%）
  registration_rate: number;     // 登記費用率（標準: 0.5-1%）
  
  // 表示設定
  theme: 'light' | 'dark';       // テーマ
  font_size: 'small' | 'medium' | 'large'; // 文字サイズ
  
  updated_at: string;            // 更新日時
}
```

---

## 5. ディレクトリ構造

```
shunsan-app/
├── app/                        # Expo Router (画面)
│   ├── (auth)/                 # 認証フロー
│   │   ├── login.tsx           # ログイン画面
│   │   └── signup.tsx          # サインアップ画面
│   ├── (tabs)/                 # タブナビゲーション
│   │   ├── index.tsx           # ホーム画面
│   │   ├── properties.tsx      # 物件一覧画面
│   │   └── settings.tsx        # 設定画面
│   ├── loan-calculator.tsx     # ローン計算画面
│   ├── property-detail.tsx     # 物件詳細入力画面
│   ├── result-detail.tsx       # 計算結果詳細画面
│   └── _layout.tsx             # ルートレイアウト
│
├── components/                 # 再利用可能コンポーネント
│   ├── ui/                     # UI基本コンポーネント
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── TabBar.tsx
│   ├── calculator/             # 計算関連コンポーネント
│   │   ├── LoanForm.tsx
│   │   ├── ExpenseForm.tsx
│   │   └── UnitConverter.tsx
│   └── property/               # 物件関連コンポーネント
│       ├── PropertyCard.tsx
│       └── PropertyList.tsx
│
├── constants/                  # 定数・テーマ
│   ├── Colors.ts               # カラーパレット
│   ├── Layout.ts               # レイアウト定数
│   └── DefaultValues.ts        # デフォルト値
│
├── hooks/                      # カスタムフック
│   ├── useAuth.ts              # 認証フック
│   ├── useProperty.ts          # 物件データフック
│   └── useCalculator.ts        # 計算ロジックフック
│
├── lib/                        # 外部サービス・ユーティリティ
│   ├── firebase.ts             # Firebase設定
│   └── calculations.ts         # 計算ロジック
│
├── store/                      # Zustand状態管理
│   ├── authStore.ts            # 認証状態
│   ├── propertyStore.ts        # 物件データ状態
│   └── settingsStore.ts        # 設定状態
│
├── types/                      # TypeScript型定義
│   ├── property.ts
│   ├── user.ts
│   └── calculator.ts
│
├── app.json                    # Expo設定
├── package.json
├── tsconfig.json
└── README.md
```

---

## 6. 実装ロードマップ（Phase 1: MVP）

### 【Week 1: セットアップ & 基盤構築】

#### 1.1 プロジェクト初期化
- [x] Expo プロジェクト作成（`npx create-expo-app shunsan-app --template tabs`）
- [x] TypeScript 設定
- [x] Expo Router セットアップ
- [ ] Zustand インストール・設定（Phase 1-2で追加）
- [x] 基本ディレクトリ構造作成

#### 1.2 Firebase セットアップ
- [ ] Firebaseプロジェクト作成（Firebase Console）
- [ ] iOSアプリ登録（Bundle ID: com.shunsan.app）
- [ ] GoogleService-Info.plist取得・配置
- [ ] Firestoreコレクション設計（users, properties, settings）
- [ ] Firestore Security Rules設定
- [ ] Firebase Client設定（`lib/firebase.ts`）
- [ ] 環境変数設定（`.env`）

#### 1.3 デザインシステム構築
- [x] `constants/Colors.ts` 作成（カラーパレット）
- [ ] `constants/Layout.ts` 作成（レイアウト定数）（Phase 1-2で追加）
- [ ] 基本UIコンポーネント作成（Phase 1-2で追加）
  - [ ] `Button.tsx`
  - [ ] `Input.tsx`
  - [ ] `Card.tsx`

---

### 【Week 2: 認証 & ホーム画面】

#### 2.1 認証機能実装
- [ ] ログイン画面（`app/(auth)/login.tsx`）
  - [ ] メール認証UI
  - [ ] Apple ID認証ボタン（iOS）
- [ ] サインアップ画面（`app/(auth)/signup.tsx`）
- [ ] 認証フック（`hooks/useAuth.ts`）
- [ ] 認証状態管理（`store/authStore.ts`）
- [ ] 認証ガード（未ログイン時のリダイレクト）

#### 2.2 ホーム画面実装
- [ ] ホーム画面レイアウト（`app/(tabs)/index.tsx`）
- [ ] クイックツールボタン（4つ）
  - [ ] ローン計算
  - [ ] 諸経費
  - [ ] 投資分析（Phase 2予定）
  - [ ] PDF作成（Phase 2予定）
- [ ] ピン留め物件セクション
- [ ] 本日の予定セクション（ダミーデータ）

#### 2.3 ボトムナビゲーション
- [ ] タブバー実装（`components/ui/TabBar.tsx`）
- [ ] 4タブ設定（ホーム・顧客管理・物件検索・設定）

---

### 【Week 3: ローン計算画面】

#### 3.1 計算ロジック実装
- [ ] 元利均等返済計算関数（`lib/calculations.ts`）
  - [ ] 月々支払額計算
  - [ ] 総支払額計算
  - [ ] 利息合計計算
- [ ] 諸経費概算計算関数
  - [ ] 仲介手数料（3% + 6万円 + 消費税）
  - [ ] 登記費用（物件価格の0.5-1%）
  - [ ] 印紙代（固定）
  - [ ] ローン事務手数料（借入額の1-2%）

#### 3.2 ローン計算画面UI
- [ ] 画面レイアウト（`app/loan-calculator.tsx`）
- [ ] タブ切替（住宅ローン/諸経費/単価換算）
- [ ] 入力フォーム（`components/calculator/LoanForm.tsx`）
  - [ ] 物件価格入力（+/-ボタン）
  - [ ] 頭金入力
  - [ ] 金利入力
  - [ ] 借入期間入力
  - [ ] ボーナス払い入力
- [ ] 結果表示フッター（青背景）
  - [ ] 月々支払額（大きく表示）
  - [ ] 総支払額・利息合計
- [ ] 保存ボタン
- [ ] 共有ボタン

---

### 【Week 4: 諸経費・単価換算 & 物件詳細】

#### 4.1 諸経費計算タブ
- [ ] 諸経費フォーム（`components/calculator/ExpenseForm.tsx`）
- [ ] 物件価格入力
- [ ] 諸経費内訳表示
  - [ ] 仲介手数料
  - [ ] 登記費用
  - [ ] 印紙代
  - [ ] ローン事務手数料
- [ ] 諸経費合計表示
- [ ] 編集ボタン（手動調整機能）

#### 4.2 単価換算タブ
- [ ] 単価換算フォーム（`components/calculator/UnitConverter.tsx`）
- [ ] 金額入力
- [ ] 面積入力（坪 or ㎡）
- [ ] 坪単価/㎡単価自動計算
- [ ] 坪↔㎡換算ボタン

#### 4.3 物件詳細入力画面
- [ ] 画面レイアウト（`app/property-detail.tsx`）
- [ ] 構造選択（RC造/鉄骨造/木造）
- [ ] 築年数入力（スライダー + ボタン）
- [ ] 所在階選択（1F/2F/3F/4F+）
- [ ] 賃料入力
- [ ] 専有面積入力
- [ ] 写真撮影・追加ボタン

---

### 【Week 5: 計算結果詳細 & 保存機能】

#### 5.1 計算結果詳細画面
- [ ] 画面レイアウト（`app/result-detail.tsx`）
- [ ] 月々支払額ヒーローセクション
- [ ] 金融詳細セクション
  - [ ] 借入金額
  - [ ] 諸経費合計
  - [ ] 必要自己資金
- [ ] 賃貸との比較グラフ（横棒グラフ）
- [ ] PDFレポート作成ボタン（Phase 2予定）
- [ ] 保存して比較に追加ボタン

#### 5.2 保存機能実装
- [ ] Firestoreへの保存処理
- [ ] 物件名入力ダイアログ
- [ ] 保存成功トースト表示
- [ ] 物件一覧画面への遷移

---

### 【Week 6: 物件一覧 & 設定画面】

#### 6.1 物件一覧画面
- [ ] 画面レイアウト（`app/(tabs)/properties.tsx`）
- [ ] 保存済み物件リスト表示
- [ ] フィルタ機能（収益性/価格帯/エリア/築年数）
- [ ] 検索機能
- [ ] ピン留め機能
- [ ] 削除機能（スワイプ or 編集モード）
- [ ] 空の状態表示（初回利用時）

#### 6.2 設定画面
- [ ] 画面レイアウト（`app/(tabs)/settings.tsx`）
- [ ] レポート設定セクション
  - [ ] プロフィール設定
  - [ ] ロゴ登録
  - [ ] 免責事項・注釈
- [ ] 計算デフォルト設定
  - [ ] 標準金利設定
  - [ ] 税率設定
  - [ ] 仲介手数料計算式
- [ ] 表示・操作
  - [ ] ダークモード切替
  - [ ] 文字サイズ変更
- [ ] アカウント・その他
  - [ ] アカウント情報
  - [ ] アプリについて
  - [ ] ログアウト

---

### 【Week 7: テスト & バグ修正】

#### 7.1 機能テスト
- [ ] 認証フローテスト（ログイン/ログアウト）
- [ ] ローン計算精度テスト
- [ ] 諸経費計算精度テスト
- [ ] 単価換算精度テスト
- [ ] 保存・読み込みテスト
- [ ] ピン留め機能テスト
- [ ] 削除機能テスト

#### 7.2 UIテスト
- [ ] iOS実機テスト（各画面）
- [ ] ダークモード表示確認
- [ ] キーボード表示時のレイアウト確認
- [ ] スクロール動作確認
- [ ] タップ・スワイプ動作確認

#### 7.3 バグ修正
- [ ] 発見されたバグの修正
- [ ] エラーハンドリング追加
- [ ] ローディング状態の追加

---

### 【Week 8: Apple審査準備 & 提出】

#### 8.1 App Store準備
- [ ] アプリアイコン作成（1024x1024）
- [ ] スクリーンショット作成（5枚）
  - [ ] ホーム画面
  - [ ] ローン計算画面
  - [ ] 計算結果詳細画面
  - [ ] 物件一覧画面
  - [ ] 設定画面
- [ ] App Store説明文作成
- [ ] プライバシーポリシー作成
- [ ] 利用規約作成

#### 8.2 ビルド & 提出
- [ ] Production ビルド（`eas build --platform ios`）
- [ ] TestFlight アップロード
- [ ] 内部テスト実施
- [ ] App Store Connect 情報入力
- [ ] 審査提出

---

## 7. Phase 2以降の予定機能

### Phase 1.5（リリース後2週間）
- [ ] サブスク課金実装（RevenueCat）
  - 無料：3件まで保存
  - 月額¥300：無制限保存
  - 年額¥3,000：無制限保存（2ヶ月分お得）

### Phase 2（リリース後1-2ヶ月）
- [ ] 3物件比較画面
- [ ] PDF出力機能
- [ ] 画像共有機能
- [ ] 元金均等返済対応
- [ ] ボーナス払い詳細対応
- [ ] 繰上返済シミュレーション

### Phase 3（リリース後3-4ヶ月）
- [ ] 投資分析機能（利回り計算・CF計算）
- [ ] 感度分析（家賃±5%、金利±0.3%）
- [ ] Android対応
- [ ] 顧客管理機能（CRM簡易版）

---

## 8. 画面遷移フロー

```
【初回起動】
スプラッシュ → ログイン画面 → サインアップ → ホーム画面

【ローン計算フロー】
ホーム画面
  ↓ [ローン計算]タップ
ローン計算画面（入力）
  ↓ [資金計画書を作成]タップ
計算結果詳細画面
  ↓ [保存して比較に追加]タップ
物件名入力ダイアログ → 物件一覧画面

【物件一覧フロー】
ホーム画面
  ↓ [物件検索]タブタップ
物件一覧画面
  ↓ 物件カードタップ
計算結果詳細画面（編集可能）

【設定フロー】
ホーム画面
  ↓ [設定]タブタップ
設定画面
  ↓ 各項目タップ
詳細設定画面
```

---

## 9. 重要な技術的注意事項

### 9.1 計算精度
- 金利計算は小数点以下6桁まで扱う
- 月々支払額は四捨五入（円単位）
- 総支払額は万円単位で表示

### 9.2 Firestore Security Rules
- ユーザーは自分のデータのみアクセス可能
- 適切なセキュリティルール設定が必須
- 認証済みユーザーのみ読み書き可能に設定

### 9.3 エラーハンドリング
- ネットワークエラー時の適切な表示
- 計算エラー時のフォールバック
- 認証エラー時のリダイレクト

### 9.4 パフォーマンス
- 計算処理は即座に完了（非同期不要）
- 画像はキャッシュを活用
- リスト表示は仮想化（FlatList使用）

---

## 10. 成功指標（KPI）

### Phase 1リリース後1ヶ月
- ダウンロード数：100+
- DAU（日間アクティブユーザー）：20+
- 平均セッション時間：5分+
- 保存件数（1ユーザーあたり）：3件+

### Phase 1.5（課金実装後）
- 課金転換率：3%+
- 月額課金継続率：60%+（3ヶ月後）

---

## 11. リスク & 対策

### リスク1：Apple審査リジェクト
**対策：**
- プライバシーポリシー・利用規約を明確に
- 権限要求（カメラ・ストレージ）の説明を丁寧に
- TestFlightで事前テスト実施

### リスク2：Firebase無料枠超過
**対策：**
- Spark（無料）プランで開始（Firestore 1GB、Storage 5GB）
- 読み書き回数に注意（1日5万読み取り、2万書き込み）
- 超過の可能性がある場合はBlaze（従量課金）プランに移行

### リスク3：計算ロジックのバグ
**対策：**
- ユニットテスト実装（Jest）
- 複数の計算パターンでテスト
- ユーザーからのフィードバック窓口設置

---

## 12. 次のアクション

✅ **Phase 1の実装を開始します。**

次に作成するドキュメント：
1. 技術仕様書（PRD） - 詳細な実装ガイド
2. デザイン仕様書 - UIコンポーネントの詳細

**コーディングは技術仕様書作成後に開始します。**

---

**最終更新日：** 2026-01-16
**ステータス：** Phase 1-1 完了 - Phase 1-2（Firebase接続）開始待ち
