/**
 * Auth Store
 * Zustandを使用した認証状態管理
 */

import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/lib/firebase';
import { User } from '@/types/user';

interface AuthStore {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  initialize: () => () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  firebaseUser: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,

  // 認証状態の初期化（リスナー設定）
  initialize: () => {
    // Firebaseが設定されていない場合はデモモード
    if (!isFirebaseConfigured()) {
      set({ isLoading: false, isAuthenticated: false });
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ローカルユーザーオブジェクトを作成
        const localUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined,
          defaultInterestRate: 0.475,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // まずローカルで認証状態を設定（Firestoreエラーでもログイン成功）
        set({
          user: localUser,
          firebaseUser,
          isAuthenticated: true,
          isLoading: false,
        });

        // Firestoreへの保存は非同期で試行（失敗してもOK）
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            set({ user: userData });
          } else {
            await setDoc(doc(db, 'users', firebaseUser.uid), {
              ...localUser,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (error) {
          console.warn('Firestore sync skipped:', error);
          // Firestoreエラーは無視してローカルで続行
        }
      } else {
        set({
          user: null,
          firebaseUser: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return unsubscribe;
  },

  // メール/パスワードでサインイン
  signIn: async (email: string, password: string) => {
    if (!isFirebaseConfigured()) {
      set({ error: 'Firebaseが設定されていません' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      let errorMessage = 'ログインに失敗しました';

      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'メールアドレスの形式が正しくありません';
          break;
        case 'auth/user-not-found':
          errorMessage = 'ユーザーが見つかりません';
          break;
        case 'auth/wrong-password':
          errorMessage = 'パスワードが正しくありません';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'メールアドレスまたはパスワードが正しくありません';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'ログイン試行回数が多すぎます。しばらく待ってから再試行してください';
          break;
      }

      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // メール/パスワードでサインアップ
  signUp: async (email: string, password: string) => {
    if (!isFirebaseConfigured()) {
      set({ error: 'Firebaseが設定されていません' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      let errorMessage = 'アカウント作成に失敗しました';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'このメールアドレスは既に使用されています';
          break;
        case 'auth/invalid-email':
          errorMessage = 'メールアドレスの形式が正しくありません';
          break;
        case 'auth/weak-password':
          errorMessage = 'パスワードは6文字以上で設定してください';
          break;
      }

      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // サインアウト
  signOut: async () => {
    if (!isFirebaseConfigured()) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    try {
      await firebaseSignOut(auth);
      set({ user: null, firebaseUser: null, isAuthenticated: false });
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  // エラーをクリア
  clearError: () => set({ error: null }),
}));
