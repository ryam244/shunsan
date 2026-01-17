/**
 * User Types
 */

export interface User {
  id: string;                    // Firebase Auth UID
  email: string;                 // メールアドレス
  displayName?: string;          // 表示名
  companyName?: string;          // 会社名
  logoUrl?: string;              // ロゴ画像URL
  defaultInterestRate: number;   // 標準金利（デフォルト: 0.475）
  createdAt: string;             // 作成日時
  updatedAt: string;             // 更新日時
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
