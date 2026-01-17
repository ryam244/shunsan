import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '@/constants/Colors';

/**
 * Customers Screen (Placeholder)
 * Phase 2以降で実装予定
 */
export default function CustomersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>👥</Text>
        <Text style={styles.title}>顧客管理</Text>
        <Text style={styles.subtitle}>Phase 2で実装予定</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
  },
});
