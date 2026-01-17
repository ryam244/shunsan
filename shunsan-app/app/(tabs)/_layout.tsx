import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

/**
 * Tabs Layout
 * ボトムナビゲーション（4タブ）
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#137fec',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e7edf3',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color }) => (
            <TabIcon name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: '顧客管理',
          tabBarIcon: ({ color }) => (
            <TabIcon name="group" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="properties"
        options={{
          title: '物件検索',
          tabBarIcon: ({ color }) => (
            <TabIcon name="apartment" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '設定',
          tabBarIcon: ({ color }) => (
            <TabIcon name="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

/**
 * TabIcon Component
 * Material Symbols アイコンの代替（Phase 1では簡易版）
 */
function TabIcon({ name, color }: { name: string; color: string }) {
  // Phase 1-2で Material Symbols に置き換え予定
  const iconMap: Record<string, string> = {
    home: '🏠',
    group: '👥',
    apartment: '🏢',
    settings: '⚙️',
  };

  return (
    <span style={{ fontSize: 24, color }}>
      {iconMap[name] || '❓'}
    </span>
  );
}
