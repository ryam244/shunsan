/**
 * Button Component
 * 再利用可能なボタンコンポーネント
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Layout } from '@/constants/Layout';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const base: ViewStyle = {
      ...styles.base,
      ...sizeStyles[size],
    };

    if (fullWidth) {
      base.width = '100%';
    }

    switch (variant) {
      case 'primary':
        return {
          ...base,
          backgroundColor: disabled ? Colors.light.textTertiary : Colors.light.primary,
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: disabled ? Colors.light.borderLight : Colors.light.backgroundLight,
          borderWidth: 1,
          borderColor: Colors.light.border,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: disabled ? Colors.light.textTertiary : Colors.light.primary,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
        };
      default:
        return base;
    }
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      ...styles.text,
      ...textSizeStyles[size],
    };

    switch (variant) {
      case 'primary':
        return {
          ...base,
          color: '#ffffff',
        };
      case 'secondary':
        return {
          ...base,
          color: disabled ? Colors.light.textTertiary : Colors.light.text,
        };
      case 'outline':
      case 'ghost':
        return {
          ...base,
          color: disabled ? Colors.light.textTertiary : Colors.light.primary,
        };
      default:
        return base;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : Colors.light.primary}
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.borderRadius.md,
  },
  text: {
    fontWeight: Layout.fontWeight.bold,
  },
});

const sizeStyles: Record<string, ViewStyle> = {
  sm: {
    height: 40,
    paddingHorizontal: Layout.spacing.md,
  },
  md: {
    height: Layout.height.button,
    paddingHorizontal: Layout.spacing.lg,
  },
  lg: {
    height: 60,
    paddingHorizontal: Layout.spacing.xl,
  },
};

const textSizeStyles: Record<string, TextStyle> = {
  sm: {
    fontSize: Layout.fontSize.sm,
  },
  md: {
    fontSize: Layout.fontSize.lg,
  },
  lg: {
    fontSize: Layout.fontSize.xl,
  },
};
