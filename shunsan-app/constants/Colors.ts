/**
 * Colors.ts
 * アプリ全体で使用するカラーパレット
 */

export const Colors = {
  light: {
    // Primary Colors
    primary: '#137fec',
    primaryDark: '#0f66bd',
    
    // Background Colors
    background: '#f6f7f8',
    backgroundLight: '#ffffff',
    backgroundDark: '#f2f2f7',
    
    // Text Colors
    text: '#0d141b',
    textSecondary: '#4c739a',
    textTertiary: '#64748b',
    
    // Border Colors
    border: '#e7edf3',
    borderLight: '#f1f5f9',
    
    // Status Colors
    success: '#34c759',
    warning: '#ff9500',
    error: '#ff3b30',
    info: '#5ac8fa',
    
    // Card Colors
    card: '#ffffff',
    cardShadow: 'rgba(0, 0, 0, 0.05)',
  },
  
  dark: {
    // Primary Colors
    primary: '#137fec',
    primaryDark: '#0f66bd',
    
    // Background Colors
    background: '#101922',
    backgroundLight: '#1a2632',
    backgroundDark: '#0a0f14',
    
    // Text Colors
    text: '#ffffff',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b',
    
    // Border Colors
    border: '#334155',
    borderLight: '#1e293b',
    
    // Status Colors
    success: '#34c759',
    warning: '#ff9500',
    error: '#ff3b30',
    info: '#5ac8fa',
    
    // Card Colors
    card: '#1a2632',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export type ColorScheme = keyof typeof Colors;
