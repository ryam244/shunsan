import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout, Typography } from '@/constants/Layout';
import { useCalculationStore } from '@/store/calculationStore';

/**
 * Home Screen
 * メイン画面 - 各機能へのナビゲーション
 */
export default function HomeScreen() {
  const router = useRouter();
  const { calculations } = useCalculationStore();

  // 最新の保存計算を取得（最大3件）
  const recentCalculations = calculations.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* ヘッダー */}
          <View style={styles.header}>
            <Text style={styles.greeting}>瞬算</Text>
            <Text style={styles.subtitle}>不動産営業の計算をサポート</Text>
          </View>

          {/* メイン機能ボタン */}
          <View style={styles.mainSection}>
            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => router.push('/loan-calculator')}
              activeOpacity={0.7}
            >
              <View style={styles.mainButtonIcon}>
                <Text style={styles.mainButtonEmoji}>🧮</Text>
              </View>
              <View style={styles.mainButtonContent}>
                <Text style={styles.mainButtonTitle}>住宅ローン計算</Text>
                <Text style={styles.mainButtonDesc}>
                  月々返済額・諸経費・単価換算
                </Text>
              </View>
              <Text style={styles.mainButtonArrow}>›</Text>
            </TouchableOpacity>
          </View>

          {/* 最近の計算履歴 */}
          {recentCalculations.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>最近の計算</Text>
                <TouchableOpacity onPress={() => router.push('/calculation-history')}>
                  <Text style={styles.sectionLink}>すべて見る</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.recentList}>
                {recentCalculations.map((calc) => (
                  <View key={calc.id} style={styles.recentItem}>
                    <View style={styles.recentItemLeft}>
                      <Text style={styles.recentName}>{calc.propertyName}</Text>
                      <Text style={styles.recentDate}>
                        {new Date(calc.createdAt).toLocaleDateString('ja-JP')}
                      </Text>
                    </View>
                    <View style={styles.recentItemRight}>
                      <Text style={styles.recentPrice}>
                        {(calc.input.propertyPrice).toLocaleString()}万円
                      </Text>
                      <Text style={styles.recentPayment}>
                        月々¥{calc.loanResult.monthlyPayment.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* クイックアクセス */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>クイックアクセス</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => router.push('/loan-calculator')}
                activeOpacity={0.7}
              >
                <Text style={styles.quickEmoji}>💰</Text>
                <Text style={styles.quickLabel}>ローン計算</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickButton}
                onPress={() => router.push('/calculation-history')}
                activeOpacity={0.7}
              >
                <Text style={styles.quickEmoji}>📋</Text>
                <Text style={styles.quickLabel}>履歴</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickButton, styles.quickButtonDisabled]}
                disabled
                activeOpacity={0.7}
              >
                <Text style={styles.quickEmoji}>👥</Text>
                <Text style={styles.quickLabelDisabled}>顧客管理</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickButton, styles.quickButtonDisabled]}
                disabled
                activeOpacity={0.7}
              >
                <Text style={styles.quickEmoji}>🏢</Text>
                <Text style={styles.quickLabelDisabled}>物件検索</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 余白 */}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Layout.spacing.lg,
  },
  header: {
    marginBottom: Layout.spacing.xl,
    marginTop: Layout.spacing.md,
  },
  greeting: {
    fontSize: Layout.fontSize.largeTitle,
    fontWeight: Layout.fontWeight.heavy,
    color: Colors.light.text,
    lineHeight: Layout.lineHeight.largeTitle,
  },
  subtitle: {
    fontSize: Layout.fontSize.body,
    color: Colors.light.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  mainSection: {
    marginBottom: Layout.spacing.xl,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.lg,
  },
  mainButtonIcon: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  mainButtonEmoji: {
    fontSize: 28,
  },
  mainButtonContent: {
    flex: 1,
  },
  mainButtonTitle: {
    fontSize: Layout.fontSize.title3,
    fontWeight: Layout.fontWeight.bold,
    color: '#ffffff',
    marginBottom: 4,
  },
  mainButtonDesc: {
    fontSize: Layout.fontSize.subhead,
    color: 'rgba(255,255,255,0.8)',
  },
  mainButtonArrow: {
    fontSize: 32,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '300',
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.semibold,
    color: Colors.light.text,
  },
  sectionLink: {
    fontSize: Layout.fontSize.subhead,
    color: Colors.light.primary,
    fontWeight: Layout.fontWeight.medium,
  },
  recentList: {
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: Layout.borderRadius.lg,
    overflow: 'hidden',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  recentItemLeft: {
    flex: 1,
  },
  recentName: {
    fontSize: Layout.fontSize.body,
    fontWeight: Layout.fontWeight.medium,
    color: Colors.light.text,
    marginBottom: 2,
  },
  recentDate: {
    fontSize: Layout.fontSize.caption1,
    color: Colors.light.textTertiary,
  },
  recentItemRight: {
    alignItems: 'flex-end',
  },
  recentPrice: {
    fontSize: Layout.fontSize.subhead,
    fontWeight: Layout.fontWeight.semibold,
    color: Colors.light.text,
    marginBottom: 2,
  },
  recentPayment: {
    fontSize: Layout.fontSize.caption1,
    color: Colors.light.primary,
    fontWeight: Layout.fontWeight.medium,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  quickButton: {
    width: '48%',
    backgroundColor: Colors.light.backgroundLight,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  quickButtonDisabled: {
    opacity: 0.5,
  },
  quickEmoji: {
    fontSize: 28,
    marginBottom: Layout.spacing.xs,
  },
  quickLabel: {
    fontSize: Layout.fontSize.subhead,
    fontWeight: Layout.fontWeight.medium,
    color: Colors.light.text,
  },
  quickLabelDisabled: {
    fontSize: Layout.fontSize.subhead,
    fontWeight: Layout.fontWeight.medium,
    color: Colors.light.textTertiary,
  },
});
