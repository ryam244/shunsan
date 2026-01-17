/**
 * Calculations Library
 * 不動産計算ロジック
 */

// ============================================
// ローン計算（元利均等返済）
// ============================================

export interface LoanInput {
  propertyPrice: number;      // 物件価格（万円）
  downPayment: number;        // 頭金（万円）
  interestRate: number;       // 金利（%）
  loanTermYears: number;      // 借入期間（年）
  bonusPayment?: number;      // ボーナス払い（万円）
}

export interface LoanResult {
  loanAmount: number;         // 借入金額（万円）
  monthlyPayment: number;     // 月々支払額（円）
  bonusMonthPayment: number;  // ボーナス月支払額（円）
  totalPayment: number;       // 総支払額（万円）
  totalInterest: number;      // 利息合計（万円）
  totalPayments: number;      // 支払回数
}

/**
 * 元利均等返済の計算
 *
 * 月々支払額 = 借入金額 × 月利 × (1 + 月利)^支払回数 / ((1 + 月利)^支払回数 - 1)
 */
export function calculateLoan(input: LoanInput): LoanResult {
  const {
    propertyPrice,
    downPayment,
    interestRate,
    loanTermYears,
    bonusPayment = 0,
  } = input;

  // 借入金額（円）
  const loanAmount = propertyPrice - downPayment;
  const loanAmountYen = loanAmount * 10000;

  // ボーナス払い分（円）
  const bonusAmountYen = bonusPayment * 10000;
  const regularAmountYen = loanAmountYen - bonusAmountYen;

  // 月利
  const monthlyRate = interestRate / 100 / 12;

  // 支払回数
  const totalPayments = loanTermYears * 12;

  // 月々支払額（通常分）
  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    // 金利0%の場合
    monthlyPayment = regularAmountYen / totalPayments;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalPayments);
    monthlyPayment = regularAmountYen * monthlyRate * factor / (factor - 1);
  }

  // ボーナス月支払額（年2回）
  let bonusMonthPayment = 0;
  if (bonusAmountYen > 0) {
    const bonusTotalPayments = loanTermYears * 2; // 年2回
    const bonusRate = interestRate / 100 / 2; // 半年分の金利

    if (bonusRate === 0) {
      bonusMonthPayment = bonusAmountYen / bonusTotalPayments;
    } else {
      const bonusFactor = Math.pow(1 + bonusRate, bonusTotalPayments);
      bonusMonthPayment = bonusAmountYen * bonusRate * bonusFactor / (bonusFactor - 1);
    }
  }

  // 総支払額（万円）
  const totalRegularPayment = monthlyPayment * totalPayments;
  const totalBonusPayment = bonusMonthPayment * loanTermYears * 2;
  const totalPayment = (totalRegularPayment + totalBonusPayment) / 10000;

  // 利息合計（万円）
  const totalInterest = totalPayment - loanAmount;

  return {
    loanAmount,
    monthlyPayment: Math.round(monthlyPayment),
    bonusMonthPayment: Math.round(bonusMonthPayment),
    totalPayment: Math.round(totalPayment * 10) / 10,
    totalInterest: Math.round(totalInterest * 10) / 10,
    totalPayments,
  };
}

// ============================================
// 諸経費計算
// ============================================

export interface ExpenseInput {
  propertyPrice: number;      // 物件価格（万円）
  loanAmount: number;         // 借入金額（万円）
  isNewConstruction?: boolean; // 新築かどうか
}

export interface ExpenseResult {
  brokerageFee: number;       // 仲介手数料（円）
  registrationFee: number;    // 登記費用（円）
  stampDuty: number;          // 印紙代（円）
  loanHandlingFee: number;    // ローン事務手数料（円）
  fireInsurance: number;      // 火災保険（円）
  totalExpenses: number;      // 諸経費合計（円）
  breakdown: ExpenseBreakdown[];
}

export interface ExpenseBreakdown {
  name: string;
  amount: number;
  description: string;
}

/**
 * 諸経費の計算
 *
 * 仲介手数料: (物件価格 × 3% + 6万円) × 消費税
 * 登記費用: 物件価格 × 0.5-1%（概算）
 * 印紙代: 契約金額による
 * ローン事務手数料: 借入額 × 2.2%（概算）
 */
export function calculateExpenses(input: ExpenseInput): ExpenseResult {
  const { propertyPrice, loanAmount, isNewConstruction = false } = input;

  const propertyPriceYen = propertyPrice * 10000;
  const loanAmountYen = loanAmount * 10000;

  // 仲介手数料（新築の場合は不要な場合あり）
  let brokerageFee = 0;
  if (!isNewConstruction) {
    brokerageFee = Math.floor((propertyPriceYen * 0.03 + 60000) * 1.1);
  }

  // 登記費用（概算：物件価格の0.7%）
  const registrationFee = Math.floor(propertyPriceYen * 0.007);

  // 印紙代
  const stampDuty = getStampDuty(propertyPriceYen);

  // ローン事務手数料（概算：借入額の2.2%）
  const loanHandlingFee = Math.floor(loanAmountYen * 0.022);

  // 火災保険（概算：10年分で20万円）
  const fireInsurance = 200000;

  // 合計
  const totalExpenses = brokerageFee + registrationFee + stampDuty + loanHandlingFee + fireInsurance;

  const breakdown: ExpenseBreakdown[] = [
    {
      name: '仲介手数料',
      amount: brokerageFee,
      description: isNewConstruction ? '新築のため不要' : '(物件価格×3%+6万円)×消費税',
    },
    {
      name: '登記費用',
      amount: registrationFee,
      description: '所有権移転・抵当権設定（概算）',
    },
    {
      name: '印紙代',
      amount: stampDuty,
      description: '売買契約書・金消契約書',
    },
    {
      name: 'ローン事務手数料',
      amount: loanHandlingFee,
      description: '借入額の2.2%（概算）',
    },
    {
      name: '火災保険',
      amount: fireInsurance,
      description: '10年分（概算）',
    },
  ];

  return {
    brokerageFee,
    registrationFee,
    stampDuty,
    loanHandlingFee,
    fireInsurance,
    totalExpenses,
    breakdown,
  };
}

/**
 * 印紙代の計算
 */
function getStampDuty(amount: number): number {
  // 売買契約書の印紙代
  let saleTax = 0;
  if (amount <= 5000000) saleTax = 1000;
  else if (amount <= 10000000) saleTax = 5000;
  else if (amount <= 50000000) saleTax = 10000;
  else if (amount <= 100000000) saleTax = 30000;
  else if (amount <= 500000000) saleTax = 60000;
  else saleTax = 100000;

  // 金消契約書の印紙代（同額で概算）
  const loanTax = saleTax;

  return saleTax + loanTax;
}

// ============================================
// 単価換算
// ============================================

export interface UnitConversionInput {
  amount: number;             // 金額（万円）
  areaSqm?: number;           // 面積（㎡）
  areaTsubo?: number;         // 面積（坪）
}

export interface UnitConversionResult {
  areaSqm: number;            // 面積（㎡）
  areaTsubo: number;          // 面積（坪）
  pricePerSqm: number;        // ㎡単価（万円）
  pricePerTsubo: number;      // 坪単価（万円）
}

// 1坪 = 3.30578㎡
const TSUBO_TO_SQM = 3.30578;

/**
 * 単価換算
 */
export function calculateUnitPrice(input: UnitConversionInput): UnitConversionResult {
  const { amount, areaSqm, areaTsubo } = input;

  let sqm: number;
  let tsubo: number;

  if (areaSqm !== undefined && areaSqm > 0) {
    sqm = areaSqm;
    tsubo = sqm / TSUBO_TO_SQM;
  } else if (areaTsubo !== undefined && areaTsubo > 0) {
    tsubo = areaTsubo;
    sqm = tsubo * TSUBO_TO_SQM;
  } else {
    return {
      areaSqm: 0,
      areaTsubo: 0,
      pricePerSqm: 0,
      pricePerTsubo: 0,
    };
  }

  const pricePerSqm = amount / sqm;
  const pricePerTsubo = amount / tsubo;

  return {
    areaSqm: Math.round(sqm * 100) / 100,
    areaTsubo: Math.round(tsubo * 100) / 100,
    pricePerSqm: Math.round(pricePerSqm * 10) / 10,
    pricePerTsubo: Math.round(pricePerTsubo * 10) / 10,
  };
}

/**
 * 坪から㎡への変換
 */
export function tsuboToSqm(tsubo: number): number {
  return Math.round(tsubo * TSUBO_TO_SQM * 100) / 100;
}

/**
 * ㎡から坪への変換
 */
export function sqmToTsubo(sqm: number): number {
  return Math.round(sqm / TSUBO_TO_SQM * 100) / 100;
}

// ============================================
// フォーマット関数
// ============================================

/**
 * 金額のフォーマット（円）
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('ja-JP');
}

/**
 * 金額のフォーマット（万円）
 */
export function formatManYen(amount: number): string {
  return `${amount.toLocaleString('ja-JP')}万円`;
}

/**
 * パーセントのフォーマット
 */
export function formatPercent(value: number, decimals: number = 3): string {
  return `${value.toFixed(decimals)}%`;
}
