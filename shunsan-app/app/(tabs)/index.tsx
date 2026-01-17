import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';

/**
 * Home Screen (Phase 1-1: 基本版)
 * 起動確認用のシンプルなホーム画面
 */
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🏢</Text>
          </View>
          <Text style={styles.title}>瞬算</Text>
        </View>

        {/* メッセージ */}
        <View style={styles.messageContainer}>
          <Text style={styles.message}>✅ 起動成功！</Text>
          <Text style={styles.subtitle}>
            Phase 1-1: 基本プロジェクト構築完了
          </Text>
          <Text style={styles.description}>
            次のステップでSupabase接続と認証機能を追加します。
          </Text>
        </View>

        {/* ステータス */}
        <View style={styles.statusContainer}>
          <StatusItem label="Expo Router" status="OK" />
          <StatusItem label="TypeScript" status="OK" />
          <StatusItem label="React Native" status="OK" />
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
    marginBottom: 40,
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
  messageContainer: {
    backgroundColor: Colors.light.backgroundLight,
    padding: 24,
    borderRadius: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  message: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.light.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
  statusContainer: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.backgroundLight,
    padding: 16,
    borderRadius: 12,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  statusBadge: {
    backgroundColor: Colors.light.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});
