/**
 * Calculation History Screen
 * 保存された計算一覧
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useCalculationStore } from '@/store/calculationStore';
import { useAuthStore } from '@/store/authStore';
import { SavedCalculation } from '@/types/calculator';

// 金額フォーマット
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('ja-JP');
};

// 日付フォーマット
const formatDate = (date: Date): string => {
  const d = new Date(date);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

export default function CalculationHistoryScreen() {
  const router = useRouter();
  const { calculations, deleteCalculation, isLoading } = useCalculationStore();
  const { user } = useAuthStore();

  // ユーザーの計算のみフィルタリング（ログイン時）
  const userCalculations = user
    ? calculations.filter((calc) => calc.userId === user.id)
    : calculations;

  const handleDelete = (item: SavedCalculation) => {
    Alert.alert(
      '削除確認',
      `「${item.propertyName}」を削除しますか？`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => deleteCalculation(item.id),
        },
      ]
    );
  };

  const handlePress = (item: SavedCalculation) => {
    // 詳細表示（将来的にはedit画面へ遷移）
    Alert.alert(
      item.propertyName,
      `物件価格: ${formatCurrency(item.input.propertyPrice)}万円\n` +
      `借入額: ${formatCurrency(item.loanResult.loanAmount / 10000)}万円\n` +
      `月々返済: ${formatCurrency(item.loanResult.monthlyPayment)}円\n` +
      `諸経費: ${formatCurrency(item.expenseResult.total)}円\n` +
      (item.note ? `\nメモ: ${item.note}` : ''),
      [{ text: '閉じる' }]
    );
  };

  const renderItem = ({ item }: { item: SavedCalculation }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePress(item)}
      onLongPress={() => handleDelete(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.propertyName} numberOfLines={1}>
          {item.propertyName}
        </Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>物件価格</Text>
          <Text style={styles.value}>
            {formatCurrency(item.input.propertyPrice)}万円
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>月々返済</Text>
          <Text style={styles.valueHighlight}>
            {formatCurrency(item.loanResult.monthlyPayment)}円
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>諸経費</Text>
          <Text style={styles.value}>
            {formatCurrency(item.expenseResult.total)}円
          </Text>
        </View>
      </View>

      {item.note && (
        <View style={styles.noteContainer}>
          <Text style={styles.note} numberOfLines={2}>
            {item.note}
          </Text>
        </View>
      )}

      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          金利 {item.input.interestRate}% / {item.input.loanTermYears}年
        </Text>
        <Text style={styles.deleteHint}>長押しで削除</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📝</Text>
      <Text style={styles.emptyTitle}>保存された計算がありません</Text>
      <Text style={styles.emptyDescription}>
        ローン計算画面で計算結果を保存すると、ここに表示されます
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => router.push('/loan-calculator')}
      >
        <Text style={styles.emptyButtonText}>計算画面へ</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← 戻る</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>計算履歴</Text>
        <View style={styles.headerRight}>
          {userCalculations.length > 0 && (
            <Text style={styles.countBadge}>{userCalculations.length}件</Text>
          )}
        </View>
      </View>

      {/* リスト */}
      <FlatList
        data={userCalculations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
  },
  headerRight: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  countBadge: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  card: {
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 12,
    color: Colors.light.textTertiary,
  },
  cardBody: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: Colors.light.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  valueHighlight: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  noteContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  note: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.textTertiary,
  },
  deleteHint: {
    fontSize: 11,
    color: Colors.light.textTertiary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
