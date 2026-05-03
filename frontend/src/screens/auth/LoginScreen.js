import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, SafeAreaView, TouchableOpacity, ScrollView,
  Dimensions, StatusBar
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { SIZES } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.auth);

  const handleLogin = () => {
    if (!email || !password) return;
    dispatch(login({ email, password }));
  };

  const dynamicStyles = styles(colors);

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500} // Significant offset to force content up on Android
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={dynamicStyles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Logo Section */}
          <View style={dynamicStyles.logoContainer}>
            <View style={dynamicStyles.logoCircle}>
              <Ionicons name="wallet" size={32} color="#FFFFFF" />
            </View>
            <Text style={dynamicStyles.brand}>BirrWise</Text>
            <Text style={dynamicStyles.brandTagline}>Smart Finance Tracker</Text>
          </View>

          {/* Form Section */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.title}>Welcome Back</Text>
            <Text style={dynamicStyles.subtitle}>Sign in to your account</Text>

            <View style={dynamicStyles.form}>
              <Input
                label="Email"
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                secureTextEntry={true}
                autoComplete="password"
                textContentType="password"
                value={password}
                onChangeText={setPassword}
              />

              {isError && (
                <View style={dynamicStyles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color={colors.danger} />
                  <Text style={dynamicStyles.errorText}>{message}</Text>
                </View>
              )}

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                style={{ marginTop: SIZES.lg }}
              />

              <TouchableOpacity
                style={dynamicStyles.linkBtn}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={dynamicStyles.linkText}>
                  Don't have an account? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Bottom spacer to allow scrolling past the button when keyboard is up */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center', // Centers everything when keyboard is closed
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
    marginTop: 20,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  brand: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 32,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.xl,
    marginHorizontal: SIZES.lg,
    marginTop: SIZES.md,
    // Floating style card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: SIZES.body2,
    color: colors.textLight,
    marginBottom: SIZES.xl,
  },
  form: { width: '100%' },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.danger + '12',
    padding: SIZES.sm,
    borderRadius: 10,
    marginTop: SIZES.sm,
    borderWidth: 1,
    borderColor: colors.danger + '30',
  },
  errorText: {
    color: colors.danger,
    fontSize: SIZES.caption,
    fontWeight: '600',
    flex: 1,
  },
  linkBtn: {
    marginTop: SIZES.xl,
    alignItems: 'center',
    paddingVertical: SIZES.sm,
  },
  linkText: {
    fontSize: SIZES.body2,
    color: colors.textLight,
  },
});

export default LoginScreen;
