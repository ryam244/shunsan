/**
 * Calculator Types
 * 計算機能に関連する型定義
 */

// 計算タブの種類
export type CalculatorTab = 'loan' | 'expense' | 'unit';

// デフォルト値
export const DEFAULT_VALUES = {
  // ローン計算
  propertyPrice: 3000,      // 物件価格（万円）
  downPayment: 300,         // 頭金（万円）
  interestRate: 0.475,      // 金利（%）
  loanTermYears: 35,        // 借入期間（年）
  bonusPayment: 0,          // ボーナス払い（万円）

  // 諸経費
  isNewConstruction: false,

  // 単価換算
  areaSqm: 70,              // 面積（㎡）
};

// 金利プリセット
export const INTEREST_RATE_PRESETS = [
  { label: '変動 0.3%', value: 0.3 },
  { label: '変動 0.475%', value: 0.475 },
  { label: '変動 0.6%', value: 0.6 },
  { label: '固定 1.0%', value: 1.0 },
  { label: '固定 1.5%', value: 1.5 },
  { label: '固定 2.0%', value: 2.0 },
];

// 借入期間プリセット
export const LOAN_TERM_PRESETS = [
  { label: '20年', value: 20 },
  { label: '25年', value: 25 },
  { label: '30年', value: 30 },
  { label: '35年', value: 35 },
];

// 入力値の増減ステップ
export const STEP_VALUES = {
  propertyPrice: 100,       // 物件価格：100万円単位
  downPayment: 50,          // 頭金：50万円単位
  interestRate: 0.05,       // 金利：0.05%単位
  loanTermYears: 1,         // 借入期間：1年単位
  bonusPayment: 10,         // ボーナス払い：10万円単位
  area: 1,                  // 面積：1単位
};
