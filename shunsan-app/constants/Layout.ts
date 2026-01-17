/**
 * Layout Constants
 * アプリ全体で使用するレイアウト定数
 * Apple Human Interface Guidelines準拠
 */

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  // Screen dimensions
  window: {
    width,
    height,
  },

  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  // Font sizes - Apple HIG準拠
  // https://developer.apple.com/design/human-interface-guidelines/typography
  fontSize: {
    // Caption & Footnote
    caption2: 11,    // Caption 2
    caption1: 12,    // Caption 1
    footnote: 13,    // Footnote

    // Body text
    subhead: 15,     // Subhead
    callout: 16,     // Callout
    body: 17,        // Body (デフォルト本文サイズ)

    // Headings
    headline: 17,    // Headline (semibold)
    title3: 20,      // Title 3
    title2: 22,      // Title 2
    title1: 28,      // Title 1
    largeTitle: 34,  // Large Title

    // Legacy aliases (後方互換性)
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 28,
    xxxl: 34,
  },

  // Line heights - 読みやすさのための行間
  lineHeight: {
    caption: 16,
    footnote: 18,
    subhead: 20,
    body: 22,
    headline: 22,
    title3: 25,
    title2: 28,
    title1: 34,
    largeTitle: 41,
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,

    // Legacy aliases
    normal: '400' as const,
    extrabold: '800' as const,
  },

  // Common component heights
  height: {
    button: 52,
    input: 52,
    tabBar: Platform.OS === 'ios' ? 85 : 65,
    header: 56,
  },

  // Safe areas (approximations, use SafeAreaView for actual values)
  safeArea: {
    top: Platform.OS === 'ios' ? 47 : 0,
    bottom: Platform.OS === 'ios' ? 34 : 0,
  },

  // Shadow (iOS)
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
  },
};

// Typography presets for common use cases
export const Typography = {
  largeTitle: {
    fontSize: Layout.fontSize.largeTitle,
    fontWeight: Layout.fontWeight.bold,
    lineHeight: Layout.lineHeight.largeTitle,
  },
  title1: {
    fontSize: Layout.fontSize.title1,
    fontWeight: Layout.fontWeight.bold,
    lineHeight: Layout.lineHeight.title1,
  },
  title2: {
    fontSize: Layout.fontSize.title2,
    fontWeight: Layout.fontWeight.bold,
    lineHeight: Layout.lineHeight.title2,
  },
  title3: {
    fontSize: Layout.fontSize.title3,
    fontWeight: Layout.fontWeight.semibold,
    lineHeight: Layout.lineHeight.title3,
  },
  headline: {
    fontSize: Layout.fontSize.headline,
    fontWeight: Layout.fontWeight.semibold,
    lineHeight: Layout.lineHeight.headline,
  },
  body: {
    fontSize: Layout.fontSize.body,
    fontWeight: Layout.fontWeight.regular,
    lineHeight: Layout.lineHeight.body,
  },
  callout: {
    fontSize: Layout.fontSize.callout,
    fontWeight: Layout.fontWeight.regular,
    lineHeight: Layout.lineHeight.subhead,
  },
  subhead: {
    fontSize: Layout.fontSize.subhead,
    fontWeight: Layout.fontWeight.regular,
    lineHeight: Layout.lineHeight.subhead,
  },
  footnote: {
    fontSize: Layout.fontSize.footnote,
    fontWeight: Layout.fontWeight.regular,
    lineHeight: Layout.lineHeight.footnote,
  },
  caption1: {
    fontSize: Layout.fontSize.caption1,
    fontWeight: Layout.fontWeight.regular,
    lineHeight: Layout.lineHeight.caption,
  },
  caption2: {
    fontSize: Layout.fontSize.caption2,
    fontWeight: Layout.fontWeight.regular,
    lineHeight: Layout.lineHeight.caption,
  },
};
