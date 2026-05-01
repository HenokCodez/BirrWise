import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../store/slices/authSlice';

// Simulating Screens to be created soon
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainNavigator from './MainNavigator';
import AddTransactionScreen from '../screens/main/AddTransactionScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        // A minimal logic - in real world you might decode JWT or fetch getMe
        if (token) {
          dispatch(setUser({ token })); 
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  if (loading) return null; // Or a splash screen

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // Main flow
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen 
              name="AddTransaction" 
              component={AddTransactionScreen} 
              options={{ presentation: 'modal' }}
            />
          </>
        ) : (
          // Auth flow
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
