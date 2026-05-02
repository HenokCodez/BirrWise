import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { SIZES } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

const Input = ({ label, icon, error, ...props }) => {
  const { colors } = useTheme();
  const dynamicStyles = styles(colors);
  
  return (
    <View style={dynamicStyles.container}>
      {label && <Text style={dynamicStyles.label}>{label}</Text>}
      <View style={[dynamicStyles.inputContainer, error && dynamicStyles.errorBorder]}>
        {icon}
        <TextInput
          style={dynamicStyles.input}
          placeholderTextColor={colors.textLight}
          {...props}
        />
      </View>
      {error && <Text style={dynamicStyles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = (colors) => StyleSheet.create({
  container: {
    marginBottom: SIZES.md,
  },
  label: {
    color: colors.text,
    fontSize: SIZES.body2,
    fontWeight: '600',
    marginBottom: SIZES.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: SIZES.sm,
    paddingHorizontal: SIZES.sm,
    height: 50,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: SIZES.body1,
    marginLeft: SIZES.xs,
  },
  errorBorder: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: SIZES.caption,
    marginTop: 4,
  },
});

export default Input;
