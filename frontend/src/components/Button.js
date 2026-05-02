import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SIZES, SHADOWS } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

const Button = ({ title, onPress, type = 'primary', loading = false, style }) => {
  const { colors } = useTheme();
  const isPrimary = type === 'primary';
  const bgColor = isPrimary ? colors.primary : colors.background;
  const textColor = isPrimary ? '#FFFFFF' : colors.primary;
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: bgColor },
        isPrimary && SHADOWS.sm,
        style,
      ]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: SIZES.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SIZES.xs,
  },
  text: {
    fontSize: SIZES.body1,
    fontWeight: 'bold',
  },
});

export default Button;
