import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SHADOWS, SIZES } from '../constants/theme';
import { useTheme } from '../hooks/useTheme';

import DashboardScreen from '../screens/main/DashboardScreen';
import TransactionsScreen from '../screens/main/TransactionsScreen';
import BudgetsScreen from '../screens/main/BudgetsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Budgets') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 8,
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 0,
          height: 80,
          paddingTop: 12,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 20,
          ...Platform.select({
            web: {
              boxShadow: '0px -10px 20px rgba(0,0,0,0.1)',
            },
            default: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            }
          })
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen name="Budgets" component={BudgetsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
