/**
 * Loan Calculator Screen
 * ローン計算画面（住宅ローン・諸経費・単価換算）
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Button } from '@/components/ui/Button';
import { useCalculationStore } from '@/store/calculationStore';
import { useAuthStore } from '@/store/authStore';
import {
  calculateLoan,
  calculateExpenses,
  calculateUnitPrice,
  formatCurrency,
  LoanResult,
  ExpenseResult,
  UnitConversionResult,
} from '@/lib/calculations';
import {
  CalculatorTab,
  DEFAULT_VALUES,
  INTEREST_RATE_PRESETS,
  LOAN_TERM_PRESETS,
  STEP_VALUES,
} from '@/types/calculator';

export default function LoanCalculatorScreen() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('loan');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [propertyName, setPropertyName] = useState('');
  const [note, setNote] = useState('');

  const { addCalculation } = useCalculationStore();
  const { user } = useAuthStore();

  // ローン計算の入力値
  const [propertyPrice, setPropertyPrice] = useState(DEFAULT_VALUES.propertyPrice);
  const [downPayment, setDownPayment] = useState(DEFAULT_VALUES.downPayment);
  const [interestRate, setInterestRate] = useState(DEFAULT_VALUES.interestRate);
  const [loanTermYears, setLoanTermYears] = useState(DEFAULT_VALUES.loanTermYears);
  const [bonusPayment, setBonusPayment] = useState(DEFAULT_VALUES.bonusPayment);

  // 諸経費の入力値
  const [isNewConstruction, setIsNewConstruction] = useState(DEFAULT_VALUES.isNewConstruction);

  // 単価換算の入力値
  const [unitAmount, setUnitAmount] = useState(DEFAULT_VALUES.propertyPrice);
  const [areaSqm, setAreaSqm] = useState(DEFAULT_VALUES.areaSqm);

  // ローン計算結果
  const loanResult: LoanResult = useMemo(() => {
    return calculateLoan({
      propertyPrice,
      downPayment,
      interestRate,
      loanTermYears,
      bonusPayment,
    });
  }, [propertyPrice, downPayment, interestRate, loanTermYears, bonusPayment]);

  // 諸経費計算結果
  const expenseResult: ExpenseResult = useMemo(() => {
    return calculateExpenses({
      propertyPrice,
      loanAmount: loanResult.loanAmount,
      isNewConstruction,
    });
  }, [propertyPrice, loanResult.loanAmount, isNewConstruction]);

  // 単価換算結果
  const unitResult: UnitConversionResult = useMemo(() => {
    return calculateUnitPrice({
      amount: unitAmount,
      areaSqm,
    });
  }, [unitAmount, areaSqm]);

  // 値の増減
  const adjustValue = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    step: number,
    min: number = 0
  ) => (direction: 'up' | 'down') => {
    setter((prev) => {
      const newValue = direction === 'up' ? prev + step : prev - step;
      return Math.max(min, newValue);
    });
  };

  // 保存処理
  const handleSave = async () => {
    if (!propertyName.trim()) {
      Alert.alert('エラー', '物件名を入力してください');
      return;
    }

    const userId = user?.id || 'guest';

    try {
      await addCalculation(
        userId,
        propertyName.trim(),
        {
          propertyPrice,
          downPayment,
          interestRate,
          loanTermYears,
          bonusPayment,
          isNewConstruction,
        },
        {
          monthlyPayment: loanResult.monthlyPayment,
          totalPayment: loanResult.totalPayment * 10000, // 万円→円
          totalInterest: loanResult.totalInterest * 10000,
          loanAmount: loanResult.loanAmount * 10000,
        },
        {
          total: expenseResult.totalExpenses,
          breakdown: {
            brokerageFee: expenseResult.breakdown.find(b => b.name === '仲介手数料')?.amount || 0,
            registrationTax: expenseResult.breakdown.find(b => b.name === '登録免許税')?.amount || 0,
            stampDuty: expenseResult.breakdown.find(b => b.name === '印紙代')?.amount || 0,
            judicialScrivenerFee: expenseResult.breakdown.find(b => b.name === '司法書士報酬')?.amount || 0,
            loanFees: expenseResult.breakdown.find(b => b.name === 'ローン諸費用')?.amount || 0,
            fireInsurance: expenseResult.breakdown.find(b => b.name === '火災保険')?.amount || 0,
            acquisitionTax: expenseResult.breakdown.find(b => b.name === '不動産取得税')?.amount || 0,
          },
        },
        note.trim() || undefined
      );

      setShowSaveModal(false);
      setPropertyName('');
      setNote('');
      Alert.alert('保存完了', '計算結果を保存しました');
    } catch (error) {
      Alert.alert('エラー', '保存に失敗しました');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>計算</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={() => router.push('/calculation-history')}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>履歴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowSaveModal(true)}
            style={[styles.headerButton, styles.saveButton]}
          >
            <Text style={styles.saveButtonText}>保存</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* タブ */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'loan' && styles.tabActive]}
          onPress={() => setActiveTab('loan')}
        >
          <Text style={[styles.tabText, activeTab === 'loan' && styles.tabTextActive]}>
            住宅ローン
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'expense' && styles.tabActive]}
          onPress={() => setActiveTab('expense')}
        >
          <Text style={[styles.tabText, activeTab === 'expense' && styles.tabTextActive]}>
            諸経費
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unit' && styles.tabActive]}
          onPress={() => setActiveTab('unit')}
        >
          <Text style={[styles.tabText, activeTab === 'unit' && styles.tabTextActive]}>
            単価換算
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 住宅ローンタブ */}
        {activeTab === 'loan' && (
          <View style={styles.tabContent}>
            {/* 物件価格 */}
            <InputRow
              label="物件価格"
              value={propertyPrice}
              unit="万円"
              onAdjust={adjustValue(setPropertyPrice, STEP_VALUES.propertyPrice)}
              onChange={setPropertyPrice}
            />

            {/* 頭金 */}
            <InputRow
              label="頭金"
              value={downPayment}
              unit="万円"
              onAdjust={adjustValue(setDownPayment, STEP_VALUES.downPayment)}
              onChange={setDownPayment}
            />

            {/* 借入金額（自動計算） */}
            <View style={styles.calculatedRow}>
              <Text style={styles.calculatedLabel}>借入金額</Text>
              <Text style={styles.calculatedValue}>
                {formatCurrency(loanResult.loanAmount)}万円
              </Text>
            </View>

            {/* 金利 */}
            <InputRow
              label="金利（年）"
              value={interestRate}
              unit="%"
              decimals={3}
              onAdjust={adjustValue(setInterestRate, STEP_VALUES.interestRate)}
              onChange={setInterestRate}
            />

            {/* 金利プリセット */}
            <View style={styles.presetContainer}>
              {INTEREST_RATE_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.value}
                  style={[
                    styles.presetButton,
                    interestRate === preset.value && styles.presetButtonActive,
                  ]}
                  onPress={() => setInterestRate(preset.value)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      interestRate === preset.value && styles.presetTextActive,
                    ]}
                  >
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 借入期間 */}
            <InputRow
              label="借入期間"
              value={loanTermYears}
              unit="年"
              onAdjust={adjustValue(setLoanTermYears, STEP_VALUES.loanTermYears, 1)}
              onChange={setLoanTermYears}
            />

            {/* 借入期間プリセット */}
            <View style={styles.presetContainer}>
              {LOAN_TERM_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.value}
                  style={[
                    styles.presetButton,
                    loanTermYears === preset.value && styles.presetButtonActive,
                  ]}
                  onPress={() => setLoanTermYears(preset.value)}
                >
                  <Text
                    style={[
                      styles.presetText,
                      loanTermYears === preset.value && styles.presetTextActive,
                    ]}
                  >
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ボーナス払い */}
            <InputRow
              label="ボーナス払い"
              value={bonusPayment}
              unit="万円"
              onAdjust={adjustValue(setBonusPayment, STEP_VALUES.bonusPayment)}
              onChange={setBonusPayment}
            />
          </View>
        )}

        {/* 諸経費タブ */}
        {activeTab === 'expense' && (
          <View style={styles.tabContent}>
            {/* 物件種別 */}
            <View style={styles.toggleRow}>
              <Text style={styles.inputLabel}>物件種別</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, !isNewConstruction && styles.toggleButtonActive]}
                  onPress={() => setIsNewConstruction(false)}
                >
                  <Text style={[styles.toggleText, !isNewConstruction && styles.toggleTextActive]}>
                    中古
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, isNewConstruction && styles.toggleButtonActive]}
                  onPress={() => setIsNewConstruction(true)}
                >
                  <Text style={[styles.toggleText, isNewConstruction && styles.toggleTextActive]}>
                    新築
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 諸経費内訳 */}
            <View style={styles.expenseList}>
              {expenseResult.breakdown.map((item, index) => (
                <View key={index} style={styles.expenseItem}>
                  <View>
                    <Text style={styles.expenseName}>{item.name}</Text>
                    <Text style={styles.expenseDescription}>{item.description}</Text>
                  </View>
                  <Text style={styles.expenseAmount}>
                    ¥{formatCurrency(item.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 単価換算タブ */}
        {activeTab === 'unit' && (
          <View style={styles.tabContent}>
            {/* 金額 */}
            <InputRow
              label="金額"
              value={unitAmount}
              unit="万円"
              onAdjust={adjustValue(setUnitAmount, STEP_VALUES.propertyPrice)}
              onChange={setUnitAmount}
            />

            {/* 面積（㎡） */}
            <InputRow
              label="面積"
              value={areaSqm}
              unit="㎡"
              decimals={2}
              onAdjust={adjustValue(setAreaSqm, STEP_VALUES.area, 1)}
              onChange={setAreaSqm}
            />

            {/* 変換結果 */}
            <View style={styles.conversionResult}>
              <View style={styles.conversionItem}>
                <Text style={styles.conversionLabel}>坪数</Text>
                <Text style={styles.conversionValue}>{unitResult.areaTsubo}坪</Text>
              </View>
              <View style={styles.conversionItem}>
                <Text style={styles.conversionLabel}>㎡単価</Text>
                <Text style={styles.conversionValue}>{formatCurrency(unitResult.pricePerSqm)}万円/㎡</Text>
              </View>
              <View style={styles.conversionItem}>
                <Text style={styles.conversionLabel}>坪単価</Text>
                <Text style={styles.conversionValue}>{formatCurrency(unitResult.pricePerTsubo)}万円/坪</Text>
              </View>
            </View>
          </View>
        )}

        {/* 余白 */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* 結果フッター */}
      <View style={styles.resultFooter}>
        {activeTab === 'loan' && (
          <>
            <View style={styles.resultMain}>
              <Text style={styles.resultLabel}>月々支払額</Text>
              <Text style={styles.resultValue}>
                ¥{formatCurrency(loanResult.monthlyPayment)}
              </Text>
            </View>
            <View style={styles.resultSub}>
              <View style={styles.resultSubItem}>
                <Text style={styles.resultSubLabel}>総支払額</Text>
                <Text style={styles.resultSubValue}>{formatCurrency(loanResult.totalPayment)}万円</Text>
              </View>
              <View style={styles.resultSubItem}>
                <Text style={styles.resultSubLabel}>利息合計</Text>
                <Text style={styles.resultSubValue}>{formatCurrency(loanResult.totalInterest)}万円</Text>
              </View>
            </View>
          </>
        )}

        {activeTab === 'expense' && (
          <View style={styles.resultMain}>
            <Text style={styles.resultLabel}>諸経費合計</Text>
            <Text style={styles.resultValue}>
              ¥{formatCurrency(expenseResult.totalExpenses)}
            </Text>
          </View>
        )}

        {activeTab === 'unit' && (
          <View style={styles.resultMain}>
            <Text style={styles.resultLabel}>坪単価</Text>
            <Text style={styles.resultValue}>
              {formatCurrency(unitResult.pricePerTsubo)}万円/坪
            </Text>
          </View>
        )}
      </View>

      {/* 保存モーダル */}
      <Modal
        visible={showSaveModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>計算結果を保存</Text>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>物件名 *</Text>
              <TextInput
                style={styles.modalInput}
                value={propertyName}
                onChangeText={setPropertyName}
                placeholder="例: 〇〇マンション 3LDK"
                placeholderTextColor={Colors.light.textTertiary}
              />
            </View>

            <View style={styles.modalInputGroup}>
              <Text style={styles.modalLabel}>メモ（任意）</Text>
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                value={note}
                onChangeText={setNote}
                placeholder="メモを入力..."
                placeholderTextColor={Colors.light.textTertiary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.modalSummary}>
              <Text style={styles.modalSummaryText}>
                物件価格: {formatCurrency(propertyPrice)}万円
              </Text>
              <Text style={styles.modalSummaryText}>
                月々返済: ¥{formatCurrency(loanResult.monthlyPayment)}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowSaveModal(false)}
              >
                <Text style={styles.modalCancelText}>キャンセル</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleSave}
              >
                <Text style={styles.modalSaveText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// 入力行コンポーネント
interface InputRowProps {
  label: string;
  value: number;
  unit: string;
  decimals?: number;
  onAdjust: (direction: 'up' | 'down') => void;
  onChange: (value: number) => void;
}

function InputRow({ label, value, unit, decimals = 0, onAdjust, onChange }: InputRowProps) {
  return (
    <View style={styles.inputRow}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputControls}>
        <TouchableOpacity style={styles.adjustButton} onPress={() => onAdjust('down')}>
          <Text style={styles.adjustButtonText}>−</Text>
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={decimals > 0 ? value.toFixed(decimals) : value.toString()}
            onChangeText={(text) => {
              const num = parseFloat(text);
              if (!isNaN(num)) onChange(num);
            }}
            keyboardType="decimal-pad"
            selectTextOnFocus
          />
          <Text style={styles.inputUnit}>{unit}</Text>
        </View>
        <TouchableOpacity style={styles.adjustButton} onPress={() => onAdjust('up')}>
          <Text style={styles.adjustButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.light.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: Colors.light.primary,
  },
  headerTitle: {
    fontSize: Layout.fontSize.xl,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.light.text,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  headerButtonText: {
    fontSize: 13,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  saveButtonText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundLight,
    paddingHorizontal: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.light.primary,
  },
  tabText: {
    fontSize: Layout.fontSize.md,
    fontWeight: Layout.fontWeight.medium,
    color: Colors.light.textSecondary,
  },
  tabTextActive: {
    color: Colors.light.primary,
    fontWeight: Layout.fontWeight.bold,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: Layout.spacing.md,
  },
  inputRow: {
    marginBottom: Layout.spacing.md,
  },
  inputLabel: {
    fontSize: Layout.fontSize.sm,
    fontWeight: Layout.fontWeight.semibold,
    color: Colors.light.text,
    marginBottom: Layout.spacing.xs,
  },
  inputControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  adjustButton: {
    width: 44,
    height: 44,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.light.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustButtonText: {
    fontSize: 24,
    color: Colors.light.primary,
    fontWeight: Layout.fontWeight.bold,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: Layout.spacing.md,
  },
  input: {
    flex: 1,
    fontSize: Layout.fontSize.xl,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.light.text,
    textAlign: 'right',
  },
  inputUnit: {
    fontSize: Layout.fontSize.md,
    color: Colors.light.textSecondary,
    marginLeft: Layout.spacing.xs,
  },
  calculatedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
    backgroundColor: Colors.light.primary + '10',
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
  },
  calculatedLabel: {
    fontSize: Layout.fontSize.md,
    color: Colors.light.textSecondary,
  },
  calculatedValue: {
    fontSize: Layout.fontSize.xl,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.light.primary,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.xs,
    marginBottom: Layout.spacing.md,
  },
  presetButton: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.light.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  presetButtonActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  presetText: {
    fontSize: Layout.fontSize.xs,
    color: Colors.light.textSecondary,
  },
  presetTextActive: {
    color: '#ffffff',
    fontWeight: Layout.fontWeight.bold,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: Layout.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  toggleButton: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.light.backgroundLight,
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.primary,
  },
  toggleText: {
    fontSize: Layout.fontSize.md,
    color: Colors.light.textSecondary,
  },
  toggleTextActive: {
    color: '#ffffff',
    fontWeight: Layout.fontWeight.bold,
  },
  expenseList: {
    gap: Layout.spacing.sm,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: Layout.borderRadius.md,
  },
  expenseName: {
    fontSize: Layout.fontSize.md,
    fontWeight: Layout.fontWeight.semibold,
    color: Colors.light.text,
  },
  expenseDescription: {
    fontSize: Layout.fontSize.xs,
    color: Colors.light.textTertiary,
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: Layout.fontSize.lg,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.light.text,
  },
  conversionResult: {
    gap: Layout.spacing.sm,
    marginTop: Layout.spacing.md,
  },
  conversionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: Layout.borderRadius.md,
  },
  conversionLabel: {
    fontSize: Layout.fontSize.md,
    color: Colors.light.textSecondary,
  },
  conversionValue: {
    fontSize: Layout.fontSize.lg,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.light.text,
  },
  resultFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
    paddingBottom: Layout.spacing.xl,
    borderTopLeftRadius: Layout.borderRadius.lg,
    borderTopRightRadius: Layout.borderRadius.lg,
  },
  resultMain: {
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  resultLabel: {
    fontSize: Layout.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Layout.spacing.xs,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: Layout.fontWeight.extrabold,
    color: '#ffffff',
  },
  resultSub: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layout.spacing.xl,
  },
  resultSubItem: {
    alignItems: 'center',
  },
  resultSubLabel: {
    fontSize: Layout.fontSize.xs,
    color: 'rgba(255,255,255,0.7)',
  },
  resultSubValue: {
    fontSize: Layout.fontSize.md,
    fontWeight: Layout.fontWeight.bold,
    color: '#ffffff',
  },
  // モーダルスタイル
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInputGroup: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: Colors.light.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: Colors.light.text,
  },
  modalTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalSummary: {
    backgroundColor: Colors.light.backgroundLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalSummaryText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
