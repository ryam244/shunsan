/**
 * Login Screen
 * ログイン / サインアップ画面
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { isFirebaseConfigured } from '@/lib/firebase';

export default function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { signIn, signUp, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async () => {
    // Firebaseが設定されていない場合
    if (!isFirebaseConfigured()) {
      Alert.alert(
        'Firebase未設定',
        'Firebaseの設定が完了していません。\n\n.envファイルにFirebaseの設定値を追加してください。',
        [
          { text: 'OK' },
          {
            text: 'スキップして続行',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
      return;
    }

    // バリデーション
    if (!email || !password) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      Alert.alert('エラー', 'パスワードが一致しません');
      return;
    }

    if (password.length < 6) {
      Alert.alert('エラー', 'パスワードは6文字以上で入力してください');
      return;
    }

    clearError();

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      // 成功したらホームに遷移
      router.replace('/(tabs)');
    } catch (err: any) {
      // エラーはストアで処理済み
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ヘッダー */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🏢</Text>
            </View>
            <Text style={styles.title}>瞬算</Text>
            <Text style={styles.subtitle}>
              不動産仲介営業向け計算アプリ
            </Text>
          </View>

          {/* フォーム */}
          <View style={styles.form}>
            <Input
              label="メールアドレス"
              placeholder="example@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <Input
              label="パスワード"
              placeholder="6文字以上"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />

            {isSignUp && (
              <Input
                label="パスワード（確認）"
                placeholder="もう一度入力"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="password"
              />
            )}

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <Button
              title={isSignUp ? 'アカウント作成' : 'ログイン'}
              onPress={handleSubmit}
              loading={isLoading}
              fullWidth
              style={styles.submitButton}
            />

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => {
                setIsSignUp(!isSignUp);
                clearError();
              }}
            >
              <Text style={styles.switchText}>
                {isSignUp
                  ? 'すでにアカウントをお持ちの方'
                  : 'アカウントをお持ちでない方'}
              </Text>
              <Text style={styles.switchAction}>
                {isSignUp ? 'ログイン' : '新規登録'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* スキップボタン（開発用） */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>
              ログインせずに続ける（開発用）
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Layout.spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.light.primary,
    borderRadius: Layout.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: Layout.fontSize.xxxl,
    fontWeight: Layout.fontWeight.extrabold,
    color: Colors.light.text,
    marginBottom: Layout.spacing.xs,
  },
  subtitle: {
    fontSize: Layout.fontSize.md,
    color: Colors.light.textSecondary,
  },
  form: {
    backgroundColor: Colors.light.backgroundLight,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.lg,
    ...Layout.shadow.md,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: Layout.fontSize.sm,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  submitButton: {
    marginTop: Layout.spacing.md,
  },
  switchButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Layout.spacing.lg,
    gap: Layout.spacing.xs,
  },
  switchText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.light.textSecondary,
  },
  switchAction: {
    fontSize: Layout.fontSize.sm,
    fontWeight: Layout.fontWeight.bold,
    color: Colors.light.primary,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: Layout.spacing.xl,
    padding: Layout.spacing.md,
  },
  skipText: {
    fontSize: Layout.fontSize.sm,
    color: Colors.light.textTertiary,
    textDecorationLine: 'underline',
  },
});
