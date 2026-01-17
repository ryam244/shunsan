import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useCalculationStore } from '@/store/calculationStore';

/**
 * Home Screen
 * メイン画面 - シンプルで視認性の高いデザイン
 */
export default function HomeScreen() {
  const router = useRouter();
  const { calculations } = useCalculationStore();

  // 最新の保存計算を取得（最大3件）
  const recentCalculations = calculations.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>瞬算</Text>
          <Text style={styles.subtitle}>不動産営業の計算をサポート</Text>
        </View>

        {/* メイン機能カード */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="percent" size={20} color={Colors.light.primary} />
            <Text style={styles.cardTitle}>計算ツール</Text>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/loan-calculator')}
            activeOpacity={0.6}
          >
            <View style={styles.menuIconContainer}>
              <Feather name="home" size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>住宅ローン計算</Text>
              <Text style={styles.menuDesc}>月々返済額・諸経費・単価換算</Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.light.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/calculation-history')}
            activeOpacity={0.6}
          >
            <View style={styles.menuIconContainer}>
              <Feather name="clock" size={20} color={Colors.light.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>計算履歴</Text>
              <Text style={styles.menuDesc}>
                {calculations.length > 0
                  ? `${calculations.length}件の保存データ`
                  : '保存された計算はありません'}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={Colors.light.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* 最近の計算 */}
        {recentCalculations.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="file-text" size={20} color={Colors.light.primary} />
              <Text style={styles.cardTitle}>最近の計算</Text>
              <TouchableOpacity
                onPress={() => router.push('/calculation-history')}
                style={styles.cardHeaderLink}
              >
                <Text style={styles.linkText}>すべて</Text>
                <Feather name="chevron-right" size={16} color={Colors.light.primary} />
              </TouchableOpacity>
            </View>

            {recentCalculations.map((calc, index) => (
              <View
                key={calc.id}
                style={[
                  styles.recentItem,
                  index === recentCalculations.length - 1 && styles.recentItemLast
                ]}
              >
                <View style={styles.recentLeft}>
                  <Text style={styles.recentName} numberOfLines={1}>
                    {calc.propertyName}
                  </Text>
                  <Text style={styles.recentMeta}>
                    {new Date(calc.createdAt).toLocaleDateString('ja-JP', {
                      month: 'short',
                      day: 'numeric',
                    })} • {calc.input.propertyPrice.toLocaleString()}万円
                  </Text>
                </View>
                <View style={styles.recentRight}>
                  <Text style={styles.recentPayment}>
                    ¥{calc.loanResult.monthlyPayment.toLocaleString()}
                  </Text>
                  <Text style={styles.recentPaymentLabel}>/月</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Coming Soon */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="zap" size={20} color={Colors.light.textTertiary} />
            <Text style={[styles.cardTitle, { color: Colors.light.textTertiary }]}>
              今後の機能
            </Text>
          </View>

          <View style={styles.comingSoonItem}>
            <Feather name="users" size={18} color={Colors.light.textTertiary} />
            <Text style={styles.comingSoonText}>顧客管理</Text>
          </View>
          <View style={styles.comingSoonItem}>
            <Feather name="search" size={18} color={Colors.light.textTertiary} />
            <Text style={styles.comingSoonText}>物件検索</Text>
          </View>
          <View style={[styles.comingSoonItem, { borderBottomWidth: 0 }]}>
            <Feather name="cloud" size={18} color={Colors.light.textTertiary} />
            <Text style={styles.comingSoonText}>クラウド同期</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
  scrollContent: {
    padding: Layout.spacing.md,
  },
  header: {
    paddingVertical: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.xs,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.light.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: Layout.fontSize.body,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: Layout.borderRadius.lg,
    marginBottom: Layout.spacing.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    paddingBottom: Layout.spacing.sm,
    gap: Layout.spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontSize: Layout.fontSize.subhead,
    fontWeight: '600',
    color: Colors.light.text,
  },
  cardHeaderLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: Layout.fontSize.subhead,
    color: Colors.light.primary,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: Layout.spacing.md,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.light.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Layout.fontSize.body,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  menuDesc: {
    fontSize: Layout.fontSize.footnote,
    color: Colors.light.textSecondary,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  recentItemLast: {
    borderBottomWidth: 0,
  },
  recentLeft: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  recentName: {
    fontSize: Layout.fontSize.body,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  recentMeta: {
    fontSize: Layout.fontSize.footnote,
    color: Colors.light.textTertiary,
  },
  recentRight: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  recentPayment: {
    fontSize: Layout.fontSize.title3,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  recentPaymentLabel: {
    fontSize: Layout.fontSize.footnote,
    color: Colors.light.textSecondary,
    marginLeft: 2,
  },
  comingSoonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: Layout.spacing.md,
  },
  comingSoonText: {
    fontSize: Layout.fontSize.body,
    color: Colors.light.textTertiary,
  },
});
