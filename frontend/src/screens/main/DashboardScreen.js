import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, SafeAreaView, Platform, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getSummary } from '../../store/slices/analyticsSlice';
import { getTransactions } from '../../store/slices/transactionSlice';
import { SIZES, SHADOWS } from '../../constants/theme';
import { useTheme } from '../../hooks/useTheme';

const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'Food': return 'restaurant';
    case 'Transport': return 'bus';
    case 'Shopping': return 'cart';
    case 'Education': return 'book';
    case 'Health': return 'medical';
    case 'Entertainment': return 'game-controller';
    case 'Salary': return 'cash';
    case 'Gift': return 'gift';
    default: return 'grid';
  }
};

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { summary, isLoading: analyticsLoading } = useSelector((state) => state.analytics);
  const { transactions, isLoading: txLoading } = useSelector((state) => state.transactions);
  const { user } = useSelector((state) => state.auth);
  const { colors, isDark } = useTheme();

  const isLoading = analyticsLoading || txLoading;

  // Auto-refresh every time this screen is visited
  useFocusEffect(
    useCallback(() => {
      dispatch(getSummary());
      dispatch(getTransactions());
    }, [dispatch])
  );

  const onRefresh = () => {
    dispatch(getSummary());
    dispatch(getTransactions());
  };

  // After adding a transaction, refresh the summary
  const recentTransactions = transactions.slice(0, 5);

  const dynamicStyles = styles(colors, isDark);

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <ScrollView
        style={dynamicStyles.container}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={dynamicStyles.header}>
          <View>
            <Text style={dynamicStyles.welcome}>Welcome back,</Text>
            <Text style={dynamicStyles.title}>{user?.name || 'Guest'} 👋</Text>
          </View>
          <TouchableOpacity
            style={[dynamicStyles.avatar, SHADOWS.sm]}
            onPress={() => navigation.navigate('Profile')}
          >
            {user?.profileImage ? (
              <Image source={{ uri: user.profileImage }} style={dynamicStyles.avatarImg} />
            ) : (
              <Text style={dynamicStyles.avatarText}>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={[dynamicStyles.balanceCard, SHADOWS.md]}>
          <Text style={dynamicStyles.balanceLabel}>Total Balance</Text>
          <Text style={dynamicStyles.balanceAmount}>
            {user?.currency} {summary.balance.toLocaleString()}
          </Text>
          <View style={dynamicStyles.statsRow}>
            <View style={dynamicStyles.statItem}>
              <View style={[dynamicStyles.statIconBg, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                <Ionicons name="arrow-down-circle" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={dynamicStyles.statLabel}>Income</Text>
                <Text style={dynamicStyles.statValue}>+{summary.totalIncome.toLocaleString()}</Text>
              </View>
            </View>
            <View style={dynamicStyles.statDivider} />
            <View style={dynamicStyles.statItem}>
              <View style={[dynamicStyles.statIconBg, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
                <Ionicons name="arrow-up-circle" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={dynamicStyles.statLabel}>Expenses</Text>
                <Text style={dynamicStyles.statValue}>-{summary.totalExpense.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={dynamicStyles.quickActions}>
          <TouchableOpacity
            style={[dynamicStyles.actionBtn, SHADOWS.sm]}
            onPress={() => navigation.navigate('AddTransaction')}
          >
            <View style={[dynamicStyles.actionIcon, { backgroundColor: colors.primary + '15' }]}>
              <Ionicons name="add-circle" size={24} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.actionLabel}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[dynamicStyles.actionBtn, SHADOWS.sm]}
            onPress={() => navigation.navigate('Transactions')}
          >
            <View style={[dynamicStyles.actionIcon, { backgroundColor: colors.secondary + '15' }]}>
              <Ionicons name="list" size={24} color={colors.secondary} />
            </View>
            <Text style={dynamicStyles.actionLabel}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[dynamicStyles.actionBtn, SHADOWS.sm]}
            onPress={() => navigation.navigate('Budgets')}
          >
            <View style={[dynamicStyles.actionIcon, { backgroundColor: colors.warning + '15' }]}>
              <Ionicons name="pie-chart" size={24} color={colors.warning || '#F59E0B'} />
            </View>
            <Text style={dynamicStyles.actionLabel}>Budgets</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[dynamicStyles.actionBtn, SHADOWS.sm]}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={[dynamicStyles.actionIcon, { backgroundColor: colors.danger + '15' }]}>
              <Ionicons name="person" size={24} color={colors.danger} />
            </View>
            <Text style={dynamicStyles.actionLabel}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={dynamicStyles.sectionHeader}>
          <Text style={dynamicStyles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={dynamicStyles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.activityList}>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((item) => {
              const isIncome = item.type === 'income';
              return (
                <View key={item._id} style={[dynamicStyles.txCard, SHADOWS.sm]}>
                  <View style={[
                    dynamicStyles.txIcon,
                    { backgroundColor: isIncome ? colors.secondary + '15' : colors.danger + '15' }
                  ]}>
                    <Ionicons
                      name={isIncome ? 'wallet' : getCategoryIcon(item.category)}
                      size={20}
                      color={isIncome ? colors.secondary : colors.danger}
                    />
                  </View>
                  <View style={dynamicStyles.txDetails}>
                    <Text style={dynamicStyles.txDesc} numberOfLines={1}>{item.description || item.title}</Text>
                    <View style={[dynamicStyles.txBadge, { backgroundColor: colors.border + '40' }]}>
                      <Text style={dynamicStyles.txCategory}>{item.category}</Text>
                    </View>
                  </View>
                  <Text style={[dynamicStyles.txAmount, { color: isIncome ? colors.secondary : colors.danger }]}>
                    {isIncome ? '+' : '-'}{item.amount.toLocaleString()} {user?.currency}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={dynamicStyles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color={colors.textLight + '50'} />
              <Text style={dynamicStyles.emptyText}>No transactions yet</Text>
              <TouchableOpacity
                style={dynamicStyles.emptyBtn}
                onPress={() => navigation.navigate('AddTransaction')}
              >
                <Text style={dynamicStyles.emptyBtnText}>Add your first transaction</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[dynamicStyles.fab, SHADOWS.md]}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = (colors, isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 15 : 0,
  },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.md,
    paddingBottom: SIZES.sm,
  },
  welcome: {
    fontSize: SIZES.caption,
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: SIZES.h3,
    color: colors.text,
    fontWeight: '800',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: isDark ? colors.card : '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  avatarText: { color: '#FFFFFF', fontSize: SIZES.h4, fontWeight: 'bold' },

  // Balance Card
  balanceCard: {
    marginHorizontal: SIZES.lg,
    marginVertical: SIZES.md,
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: SIZES.xl,
  },
  balanceLabel: {
    fontSize: SIZES.caption,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: SIZES.xl,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  statValue: {
    fontSize: SIZES.body1,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: SIZES.md,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.lg,
    gap: SIZES.sm,
    marginBottom: SIZES.lg,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: SIZES.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? colors.border : '#FFFFFF',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    color: colors.text,
    fontWeight: '800',
  },
  seeAll: {
    fontSize: SIZES.body2,
    color: colors.primary,
    fontWeight: '700',
  },

  // Transaction Cards
  activityList: { paddingHorizontal: SIZES.lg },
  txCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: SIZES.md,
    borderRadius: 16,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: isDark ? colors.border : '#FFFFFF',
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  txDetails: { flex: 1 },
  txDesc: {
    fontSize: SIZES.body1,
    fontWeight: '700',
    color: colors.text,
  },
  txBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  txCategory: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  txAmount: {
    fontSize: SIZES.body2,
    fontWeight: '800',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: SIZES.xl * 2,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: SIZES.body2,
    fontWeight: '600',
    marginTop: SIZES.md,
  },
  emptyBtn: {
    marginTop: SIZES.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.sm,
    borderRadius: 20,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: SIZES.body2,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 100,
    right: SIZES.lg,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});

export default DashboardScreen;
