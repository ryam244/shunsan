/**
 * Calculation Store
 * 計算結果の保存・管理
 * - ローカルストレージ（AsyncStorage）
 * - Firestore同期（オンライン時）
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  SavedCalculation,
  LoanCalculationInput,
  LoanCalculationResult,
  ExpenseCalculationResult
} from '@/types/calculator';

// Firestore用の型（Timestampを使用）
interface FirestoreSavedCalculation extends Omit<SavedCalculation, 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface CalculationState {
  calculations: SavedCalculation[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;

  // ローカル操作
  addCalculation: (
    userId: string,
    propertyName: string,
    input: LoanCalculationInput,
    loanResult: LoanCalculationResult,
    expenseResult: ExpenseCalculationResult,
    note?: string
  ) => Promise<string>;

  updateCalculation: (id: string, updates: Partial<Pick<SavedCalculation, 'propertyName' | 'note'>>) => Promise<void>;
  deleteCalculation: (id: string) => Promise<void>;
  getCalculation: (id: string) => SavedCalculation | undefined;

  // Firestore同期
  syncWithFirestore: (userId: string) => void;
  stopSync: () => void;

  // ユーティリティ
  clearError: () => void;
  clearAllData: () => void;
}

// UUID生成（簡易版）
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Firestore購読解除用
let unsubscribe: (() => void) | null = null;

export const useCalculationStore = create<CalculationState>()(
  persist(
    (set, get) => ({
      calculations: [],
      isLoading: false,
      isSyncing: false,
      error: null,

      addCalculation: async (userId, propertyName, input, loanResult, expenseResult, note) => {
        const id = generateId();
        const now = new Date();

        const newCalculation: SavedCalculation = {
          id,
          userId,
          propertyName,
          input,
          loanResult,
          expenseResult,
          createdAt: now,
          updatedAt: now,
          note,
        };

        // ローカルに追加
        set((state) => ({
          calculations: [newCalculation, ...state.calculations],
        }));

        // Firestoreに保存（オンライン時）
        try {
          if (db) {
            await addDoc(collection(db, 'calculations'), {
              ...newCalculation,
              createdAt: Timestamp.fromDate(now),
              updatedAt: Timestamp.fromDate(now),
            });
          }
        } catch (error) {
          console.warn('Firestore save failed, keeping local copy:', error);
        }

        return id;
      },

      updateCalculation: async (id, updates) => {
        const now = new Date();

        set((state) => ({
          calculations: state.calculations.map((calc) =>
            calc.id === id ? { ...calc, ...updates, updatedAt: now } : calc
          ),
        }));

        // Firestoreを更新
        try {
          if (db) {
            const q = query(collection(db, 'calculations'), where('id', '==', id));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
              const docRef = doc(db, 'calculations', snapshot.docs[0].id);
              await updateDoc(docRef, {
                ...updates,
                updatedAt: Timestamp.fromDate(now),
              });
            }
          }
        } catch (error) {
          console.warn('Firestore update failed:', error);
        }
      },

      deleteCalculation: async (id) => {
        set((state) => ({
          calculations: state.calculations.filter((calc) => calc.id !== id),
        }));

        // Firestoreから削除
        try {
          if (db) {
            const q = query(collection(db, 'calculations'), where('id', '==', id));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
              await deleteDoc(doc(db, 'calculations', snapshot.docs[0].id));
            }
          }
        } catch (error) {
          console.warn('Firestore delete failed:', error);
        }
      },

      getCalculation: (id) => {
        return get().calculations.find((calc) => calc.id === id);
      },

      syncWithFirestore: (userId) => {
        if (!db) {
          console.warn('Firestore not initialized');
          return;
        }

        set({ isSyncing: true });

        // 既存の購読を解除
        if (unsubscribe) {
          unsubscribe();
        }

        try {
          const q = query(
            collection(db, 'calculations'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
          );

          unsubscribe = onSnapshot(
            q,
            (snapshot) => {
              const firestoreCalculations: SavedCalculation[] = snapshot.docs.map((doc) => {
                const data = doc.data() as FirestoreSavedCalculation;
                return {
                  ...data,
                  createdAt: data.createdAt.toDate(),
                  updatedAt: data.updatedAt.toDate(),
                };
              });

              // ローカルとマージ（Firestoreを優先）
              const localCalcs = get().calculations.filter(
                (calc) => calc.userId === userId && !firestoreCalculations.some((fc) => fc.id === calc.id)
              );

              set({
                calculations: [...firestoreCalculations, ...localCalcs],
                isSyncing: false,
                error: null,
              });
            },
            (error) => {
              console.error('Firestore sync error:', error);
              set({ isSyncing: false, error: 'データ同期に失敗しました' });
            }
          );
        } catch (error) {
          console.error('Firestore sync setup error:', error);
          set({ isSyncing: false, error: 'データ同期の設定に失敗しました' });
        }
      },

      stopSync: () => {
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
        set({ isSyncing: false });
      },

      clearError: () => set({ error: null }),

      clearAllData: () => {
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
        set({ calculations: [], error: null, isSyncing: false });
      },
    }),
    {
      name: 'shunsan-calculations',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        calculations: state.calculations,
      }),
      // Date復元用
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.calculations = state.calculations.map((calc) => ({
            ...calc,
            createdAt: new Date(calc.createdAt),
            updatedAt: new Date(calc.updatedAt),
          }));
        }
      },
    }
  )
);
