/**
 * Root Layout
 * アプリ全体のルートレイアウト
 * 認証状態に応じてルーティングを制御
 */

import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  // 認証リスナーの初期化
  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, []);

  // 認証状態に応じたルーティング
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // 未認証でauth以外にいる場合 → ログインへ
      // router.replace('/(auth)/login');
      // 開発中は認証なしでも使えるようにコメントアウト
    } else if (isAuthenticated && inAuthGroup) {
      // 認証済みでauthにいる場合 → ホームへ
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  // ローディング中
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
});
