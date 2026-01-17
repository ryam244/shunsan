# 瞬算アプリ - 引き継ぎドキュメント

## 現在のステータス

**Phase 1 完了** - Expo SDK 54 アップグレード完了・テスト準備OK

---

## 完了した作業

### Phase 1-1: 基本プロジェクト構築
- [x] Expo SDK 54 + TypeScript環境
- [x] Expo Router v6（ファイルベースルーティング）
- [x] タブナビゲーション（4タブ）

### Phase 1-2: Firebase統合・認証UI
- [x] Firebase SDK設定（`.env`に設定済み）
- [x] Zustand状態管理（authStore, calculationStore）
- [x] UIコンポーネント（Button, Input）
- [x] ログイン画面

### Phase 1-3: ローン計算機能
- [x] 住宅ローン計算（元利均等返済）
- [x] 諸経費計算（仲介手数料、登記費用など）
- [x] 単価換算（㎡/坪）
- [x] 3タブUIインターフェース

### Phase 1-4: 計算保存機能
- [x] ローカル保存（AsyncStorage）
- [x] 計算履歴画面
- [x] 保存モーダル

### SDK 54アップグレード（2026-01-17）
- [x] Expo SDK 52 → 54 移行
- [x] React 19.1 + React Native 0.81.5
- [x] expo-router v6
- [x] TypeScript 5.7
- [x] TypeScriptコンパイル確認
- [x] Expo起動確認

---

## 次にやること

### 1. Mac環境での動作確認（最優先）
```bash
cd shunsan-app
npm install --legacy-peer-deps
npx expo start
```
→ iPhoneでExpo GoアプリからQRコード読み取り

**注意**: SDK 54はExpo Go 54.xが必要です（最新のExpo Goで動作確認済み）

### 2. Firebase Console設定（5分）
1. https://console.firebase.google.com/ → プロジェクト「shunsan」
2. **Authentication** → Sign-in method → 「メール/パスワード」有効化
3. **Firestore Database** → 「データベースを作成」→ テストモードで開始
4. プロジェクト設定 → マイアプリ → ウェブアプリ → 設定値を`.env`にコピー

### 3. .envファイルの設定
現在はプレースホルダー値が設定されています。実際のFirebase設定値に置き換えてください：
```
EXPO_PUBLIC_FIREBASE_API_KEY=実際のAPIキー
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=shunsan-27dca.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=shunsan-27dca
...
```

### 4. Phase 2: ビルドテスト
- EAS Build設定
- Xcodeでのローカルビルド
- TestFlight配布

---

## プロジェクト情報

| 項目 | 値 |
|------|-----|
| ブランチ | `claude/firebase-expo-setup-YAUyB` |
| Firebase Project ID | `shunsan-27dca` |
| Bundle ID | `com.shunsan.app` |
| Expo SDK | **54** |
| React | 19.1.0 |
| React Native | 0.81.5 |
| expo-router | 6.x |

---

## ファイル構成

```
shunsan-app/
├── app/
│   ├── (auth)/login.tsx      # ログイン画面
│   ├── (tabs)/
│   │   ├── index.tsx         # ホーム画面
│   │   ├── customers.tsx     # 顧客管理（Coming Soon）
│   │   ├── properties.tsx    # 物件検索（Coming Soon）
│   │   └── settings.tsx      # 設定（Coming Soon）
│   ├── loan-calculator.tsx   # ローン計算画面
│   └── calculation-history.tsx # 計算履歴画面
├── lib/
│   ├── firebase.ts           # Firebase設定
│   └── calculations.ts       # 計算ロジック
├── store/
│   ├── authStore.ts          # 認証状態管理
│   └── calculationStore.ts   # 計算保存管理
├── constants/
│   ├── Colors.ts             # カラー定義
│   └── Layout.ts             # レイアウト・フォント定義
└── .env                      # Firebase設定値（gitignore済み）
```

---

## 次回の呼び出し方

Claude Codeで以下のように伝えてください：

```
shunsan-appプロジェクトの続きをお願いします。
HANDOFF.mdを読んで状況を確認してください。

現在の状況：
- Mac環境で作業可能
- （やりたいこと：動作確認 / Firebase設定 / Xcodeビルド など）
```

---

## 注意事項

- `.env`ファイルはgitにコミットされていません（セキュリティ）
- 別環境で作業する場合は`.env.example`を参考に`.env`を作成
- Firebase未設定でもアプリはオフラインで動作します
- npm installには`--legacy-peer-deps`フラグを使用してください
