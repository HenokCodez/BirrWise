import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from '../../store/slices/transactionSlice';
import { SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

const TransactionsScreen = () => {
  const dispatch = useDispatch();
  const { transactions, isLoading } = useSelector((state) => state.transactions);
  const { user } = useSelector((state) => state.auth);
  const { colors, isDark } = useTheme();
  const [filter, setFilter] = React.useState('all'); // all, income, expense

  // Auto-refresh every time this screen is visited
  useFocusEffect(
    useCallback(() => {
      dispatch(getTransactions());
    }, [dispatch])
  );

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Food': return 'restaurant';
      case 'Transport': return 'bus';
      case 'Shopping': return 'cart';
      case 'Education': return 'book';
      case 'Health': return 'medical';
      case 'Entertainment': return 'game-controller';
      default: return 'grid';
    }
  };

  const [showFilterMenu, setShowFilterMenu] = React.useState(false);

  const dynamicStyles = styles(colors, isDark);

  const renderItem = ({ item }) => {
    const isIncome = item.type === 'income';
    return (
      <View style={[dynamicStyles.card, SHADOWS.sm]}>
        <View style={[dynamicStyles.iconContainer, { backgroundColor: isIncome ? colors.secondary + '15' : colors.danger + '15' }]}>
          <Ionicons 
            name={isIncome ? 'wallet' : getCategoryIcon(item.category)} 
            size={22} 
            color={isIncome ? colors.secondary : colors.danger} 
          />
        </View>
        <View style={dynamicStyles.details}>
          <Text style={dynamicStyles.description} numberOfLines={1}>{item.description}</Text>
          <View style={[dynamicStyles.categoryBadge, { backgroundColor: colors.border + '30' }]}>
            <Text style={dynamicStyles.categoryText}>{item.category}</Text>
          </View>
        </View>
        <View style={dynamicStyles.amountContainer}>
          <Text style={[dynamicStyles.amount, { color: isIncome ? colors.secondary : colors.danger }]}>
            {isIncome ? '+' : '-'}{item.amount.toLocaleString()} 
          </Text>
          <Text style={dynamicStyles.currencyText}>{user?.currency}</Text>
        </View>
      </View>
    );
  };

  const getFilterLabel = (f) => {
    if (f === 'all') return 'All Activity';
    if (f === 'income') return 'Income Only';
    return 'Expenses Only';
  };

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <View style={dynamicStyles.header}>
        <View>
          <Text style={dynamicStyles.title}>Transactions</Text>
          <Text style={dynamicStyles.subtitle}>{getFilterLabel(filter)}</Text>
        </View>
        
        <View style={dynamicStyles.filterContainer}>
          <TouchableOpacity 
            style={dynamicStyles.filterIconButton} 
            onPress={() => setShowFilterMenu(!showFilterMenu)}
          >
            <Ionicons name="options-outline" size={20} color={colors.text} />
          </TouchableOpacity>

          {showFilterMenu && (
            <View style={[dynamicStyles.filterDropdown, SHADOWS.md]}>
              {['all', 'income', 'expense'].map((f) => (
                <TouchableOpacity 
                  key={f}
                  style={[dynamicStyles.filterOption, filter === f && dynamicStyles.activeOption]}
                  onPress={() => {
                    setFilter(f);
                    setShowFilterMenu(false);
                  }}
                >
                  <Text style={[dynamicStyles.filterOptionText, filter === f && dynamicStyles.activeOptionText]}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </Text>
                  {filter === f && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
      <FlatList
        data={filteredTransactions}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={dynamicStyles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => dispatch(getTransactions())} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={dynamicStyles.empty}>
            <View style={dynamicStyles.emptyIconBg}>
               <Ionicons name="receipt" size={48} color={colors.textLight + '50'} />
            </View>
            <Text style={dynamicStyles.emptyText}>No activity recorded yet.</Text>
          </View>
        }
      />
      <View style={{ height: 80 }} />
    </SafeAreaView>
  );
};

const styles = (colors, isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 15 : 0, // Extra margin for Samsung/Android notch
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl,
    paddingBottom: SIZES.md,
    backgroundColor: colors.background,
    zIndex: 100,
  },
  title: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    fontSize: SIZES.caption,
    color: colors.textLight,
    fontWeight: '600',
    marginTop: -2,
  },
  filterContainer: {
    position: 'relative',
    zIndex: 200,
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterDropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    width: 160,
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 300,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
  },
  activeOption: {
    backgroundColor: colors.primary + '10',
  },
  filterOptionText: {
    fontSize: SIZES.body2,
    color: colors.text,
    fontWeight: '500',
  },
  activeOptionText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  list: {
    padding: SIZES.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: SIZES.md,
    borderRadius: SIZES.lg,
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: isDark ? colors.border : '#FFFFFF',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22, // Perfect circle
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: SIZES.body1,
    fontWeight: '700',
    color: colors.text,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: SIZES.body1,
    fontWeight: '800',
  },
  currencyText: {
    fontSize: 10,
    color: colors.textLight,
    fontWeight: 'bold',
  },
  empty: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  emptyText: {
    color: colors.textLight,
    fontSize: SIZES.body2,
    fontWeight: '600',
  },
});

export default TransactionsScreen;
