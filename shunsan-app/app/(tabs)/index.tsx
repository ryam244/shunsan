import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

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
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.text,
  },
  tagline: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  menuContainer: {
    gap: 12,
    marginBottom: 32,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundLight,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  menuButtonDisabled: {
    opacity: 0.6,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconDisabled: {
    backgroundColor: Colors.light.textTertiary,
  },
  menuIcon: {
    fontSize: 24,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 2,
  },
  menuTitleDisabled: {
    color: Colors.light.textTertiary,
  },
  menuDescription: {
    fontSize: 12,
    color: Colors.light.textSecondary,
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.light.textTertiary,
  },
  statusContainer: {
    gap: 8,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundLight,
    padding: 12,
    borderRadius: 10,
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
  statusBadge: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
});
