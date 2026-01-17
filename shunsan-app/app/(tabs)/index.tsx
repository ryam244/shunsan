import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout, Typography } from '@/constants/Layout';

/**
 * Home Screen (Phase 1-3: 計算機能版)
 * メイン画面 - 各機能へのナビゲーション
 */
export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🏢</Text>
          </View>
          <Text style={styles.title}>瞬算</Text>
          <Text style={styles.tagline}>不動産営業の計算をサポート</Text>
        </View>

        {/* メイン機能ボタン */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => router.push('/loan-calculator')}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconContainer}>
              <Text style={styles.menuIcon}>🧮</Text>
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>住宅ローン計算</Text>
              <Text style={styles.menuDescription}>
                月々返済額・諸経費・単価換算
              </Text>
            </View>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuButton, styles.menuButtonDisabled]}
            disabled={true}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconContainer, styles.menuIconDisabled]}>
              <Text style={styles.menuIcon}>📋</Text>
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitle, styles.menuTitleDisabled]}>物件管理</Text>
              <Text style={styles.menuDescription}>
                Coming Soon
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ステータス */}
        <View style={styles.statusContainer}>
          <StatusItem label="Expo Router" status="OK" />
          <StatusItem label="TypeScript" status="OK" />
          <StatusItem label="Firebase" status="Ready" />
        </View>
      </View>
    </SafeAreaView>
  );
}

/**
 * StatusItem Component
 */
function StatusItem({ label, status }: { label: string; status: string }) {
  return (
    <View style={styles.statusItem}>
      <Text style={styles.statusLabel}>{label}</Text>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    padding: Layout.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  iconContainer: {
    width: 88,
    height: 88,
    backgroundColor: Colors.light.primary,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  icon: {
    fontSize: 44,
  },
  title: {
    fontSize: Layout.fontSize.largeTitle,
    fontWeight: Layout.fontWeight.heavy,
    color: Colors.light.text,
    lineHeight: Layout.lineHeight.largeTitle,
  },
  tagline: {
    fontSize: Layout.fontSize.callout,
    color: Colors.light.textSecondary,
    marginTop: Layout.spacing.xs,
    lineHeight: Layout.lineHeight.subhead,
  },
  menuContainer: {
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.xl,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundLight,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  menuButtonDisabled: {
    opacity: 0.6,
  },
  menuIconContainer: {
    width: 52,
    height: 52,
    backgroundColor: Colors.light.primary,
    borderRadius: Layout.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Layout.spacing.md,
  },
  menuIconDisabled: {
    backgroundColor: Colors.light.textTertiary,
  },
  menuIcon: {
    fontSize: 26,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.semibold,
    color: Colors.light.text,
    marginBottom: 3,
    lineHeight: Layout.lineHeight.headline,
  },
  menuTitleDisabled: {
    color: Colors.light.textTertiary,
  },
  menuDescription: {
    fontSize: Layout.fontSize.subhead,
    color: Colors.light.textSecondary,
    lineHeight: Layout.lineHeight.subhead,
  },
  menuArrow: {
    fontSize: Layout.fontSize.title2,
    color: Colors.light.textTertiary,
  },
  statusContainer: {
    gap: Layout.spacing.sm,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundLight,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  statusLabel: {
    fontSize: Layout.fontSize.subhead,
    fontWeight: Layout.fontWeight.medium,
    color: Colors.light.textSecondary,
    lineHeight: Layout.lineHeight.subhead,
  },
  statusBadge: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: 4,
    borderRadius: Layout.borderRadius.sm,
  },
  statusText: {
    fontSize: Layout.fontSize.caption1,
    fontWeight: Layout.fontWeight.semibold,
    color: '#ffffff',
  },
});
