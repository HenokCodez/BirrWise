import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView,
  Platform, SafeAreaView, TouchableOpacity, ScrollView,
  Dimensions, StatusBar
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { SIZES } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { colors } = useTheme();
  
  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.auth);

  const [localError, setLocalError] = useState('');
  
  const handleRegister = () => {
    setLocalError('');
    
    if (!name || !email || !password) {
        setLocalError('All fields are required');
        return;
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      setLocalError('Password must be at least 6 characters, contain 1 capital, 1 number and 1 special character');
      return;
    }

    dispatch(register({ name, email, password }));
  };

  const dynamicStyles = styles(colors);

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={dynamicStyles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Header Section */}
          <View style={dynamicStyles.headerSection}>
              <Text style={dynamicStyles.brand}>BirrWise</Text>
              <Text style={dynamicStyles.brandTagline}>Create Your Account</Text>
          </View>

          {/* Form Card */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.title}>Join Us</Text>
            <Text style={dynamicStyles.subtitle}>Start tracking your expenses smart</Text>

            <View style={dynamicStyles.form}>
              <Input
                label="Full Name"
                placeholder="John Doe"
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                value={name}
                onChangeText={setName}
              />
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
                placeholder="Create a strong password"
                secureTextEntry={true}
                autoComplete="password-new"
                textContentType="newPassword"
                value={password}
                onChangeText={setPassword}
              />
              
              {(localError || isError) && (
                <View style={dynamicStyles.errorBox}>
                  <Ionicons name="alert-circle" size={16} color={colors.danger} />
                  <Text style={dynamicStyles.errorText}>{localError || message}</Text>
                </View>
              )}

              <Button 
                title="Sign Up" 
                onPress={handleRegister} 
                loading={isLoading} 
                style={{ marginTop: SIZES.lg }} 
              />
              
              <TouchableOpacity 
                style={dynamicStyles.linkBtn}
                onPress={() => navigation.goBack()} 
              >
                <Text style={dynamicStyles.linkText}>
                  Already have an account? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
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
    justifyContent: 'center',
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
    marginTop: 10,
  },
  brand: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  brandTagline: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 32,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.xl,
    marginHorizontal: SIZES.lg,
    // Floating style card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
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
  form: {
    width: '100%',
  },
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
  }
});

export default RegisterScreen;
