import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { useAuthStore } from '@/store/authStore';
import { useCalculationStore } from '@/store/calculationStore';

/**
 * Settings Screen
 * 設定画面 - アカウント管理・アプリ設定
 */
export default function SettingsScreen() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const { calculations, clearAllData } = useCalculationStore();

  const handleSignOut = async () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    if (calculations.length === 0) {
      Alert.alert('履歴なし', '削除する計算履歴がありません');
      return;
    }

    Alert.alert(
      '履歴を削除',
      `${calculations.length}件の計算履歴をすべて削除しますか？\nこの操作は取り消せません。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            clearAllData();
            Alert.alert('完了', '計算履歴を削除しました');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>設定</Text>
        </View>

        {/* アカウントセクション */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="user" size={20} color={Colors.light.primary} />
            <Text style={styles.cardTitle}>アカウント</Text>
          </View>

          {isAuthenticated ? (
            <>
              <View style={styles.userInfo}>
                <View style={styles.userIcon}>
                  <Feather name="user" size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                  <Text style={styles.userStatus}>ログイン中</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleSignOut}
                activeOpacity={0.6}
              >
                <Feather name="log-out" size={20} color={Colors.light.error} />
                <Text style={[styles.menuText, { color: Colors.light.error }]}>
                  ログアウト
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/(auth)/login')}
              activeOpacity={0.6}
            >
              <Feather name="log-in" size={20} color={Colors.light.primary} />
              <Text style={[styles.menuText, { color: Colors.light.primary }]}>
                ログイン / 新規登録
              </Text>
              <Feather name="chevron-right" size={20} color={Colors.light.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* データ管理セクション */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="database" size={20} color={Colors.light.primary} />
            <Text style={styles.cardTitle}>データ管理</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>保存された計算</Text>
            <Text style={styles.infoValue}>{calculations.length}件</Text>
          </View>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/calculation-history')}
            activeOpacity={0.6}
          >
            <Feather name="clock" size={20} color={Colors.light.text} />
            <Text style={styles.menuText}>計算履歴を見る</Text>
            <Feather name="chevron-right" size={20} color={Colors.light.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleClearHistory}
            activeOpacity={0.6}
          >
            <Feather name="trash-2" size={20} color={Colors.light.error} />
            <Text style={[styles.menuText, { color: Colors.light.error }]}>
              履歴をすべて削除
            </Text>
          </TouchableOpacity>
        </View>

        {/* アプリ情報セクション */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather name="info" size={20} color={Colors.light.primary} />
            <Text style={styles.cardTitle}>アプリ情報</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>バージョン</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Expo SDK</Text>
            <Text style={styles.infoValue}>54</Text>
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: Layout.spacing.md,
  },
  userIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userEmail: {
    fontSize: Layout.fontSize.body,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 2,
  },
  userStatus: {
    fontSize: Layout.fontSize.footnote,
    color: Colors.light.success,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    gap: Layout.spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: Layout.fontSize.body,
    color: Colors.light.text,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  infoLabel: {
    fontSize: Layout.fontSize.body,
    color: Colors.light.textSecondary,
  },
  infoValue: {
    fontSize: Layout.fontSize.body,
    fontWeight: '500',
    color: Colors.light.text,
  },
});
