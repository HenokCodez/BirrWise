import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, RefreshControl,
  TouchableOpacity, Modal, SafeAreaView, Platform, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getBudgetStatus } from '../../store/slices/analyticsSlice';
import { addBudget } from '../../store/slices/budgetSlice';
import { SIZES, SHADOWS } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import Input from '../../components/Input';
import Button from '../../components/Button';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Education', 'Health', 'Entertainment', 'Others'];

const getCategoryIcon = (cat) => {
  switch (cat) {
    case 'Food': return 'restaurant';
    case 'Transport': return 'bus';
    case 'Shopping': return 'cart';
    case 'Education': return 'book';
    case 'Health': return 'medical';
    case 'Entertainment': return 'game-controller';
    default: return 'grid';
  }
};

const BudgetsScreen = () => {
  const dispatch = useDispatch();
  const { budgetStatus, isLoading } = useSelector((state) => state.analytics);
  const { user } = useSelector((state) => state.auth);
  const { colors, isDark } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: 'Food', limit: '', period: 'monthly' });

  // Auto-refresh whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      dispatch(getBudgetStatus());
    }, [dispatch])
  );

  const handleAddBudget = async () => {
    if (!newBudget.limit) {
      Alert.alert('Error', 'Please enter a budget limit');
      return;
    }
    await dispatch(addBudget({
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      period: newBudget.period,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
    }));
    dispatch(getBudgetStatus());
    setModalVisible(false);
    setNewBudget({ category: 'Food', limit: '', period: 'monthly' });
  };

  const dynamicStyles = styles(colors, isDark);

  const getStatusInfo = (item) => {
    const percent = item.percent || 0;
    if (item.spent > item.limit) {
      return {
        color: colors.danger,
        icon: 'alert-circle',
        label: 'Over Budget!',
        message: `You've exceeded this budget by ${(item.spent - item.limit).toLocaleString()} ${user?.currency}`
      };
    } else if (percent >= 90) {
      return {
        color: '#F97316',
        icon: 'warning',
        label: 'Critical',
        message: `Only ${item.remaining.toLocaleString()} ${user?.currency} left — you'll hit your limit soon!`
      };
    } else if (percent >= 75) {
      return {
        color: '#FBBF24',
        icon: 'alert',
        label: 'Warning',
        message: `${Math.round(100 - percent)}% of your budget remaining.`
      };
    }
    return {
      color: colors.secondary,
      icon: 'checkmark-circle',
      label: 'On Track',
      message: null
    };
  };

  const renderBudgetItem = (item) => {
    const percent = item.percent || 0;
    const progress = Math.min(percent / 100, 1);
    const progressWidth = isNaN(progress) ? 0 : progress * 100;
    const status = getStatusInfo(item);

    return (
      <View key={item.category} style={[dynamicStyles.budgetCard, SHADOWS.sm]}>
        {/* Card Header */}
        <View style={dynamicStyles.cardHeader}>
          <View style={dynamicStyles.categoryRow}>
            <View style={[dynamicStyles.catIcon, { backgroundColor: status.color + '15' }]}>
              <Ionicons name={getCategoryIcon(item.category)} size={20} color={status.color} />
            </View>
            <View>
              <Text style={dynamicStyles.categoryName}>{item.category}</Text>
              <Text style={dynamicStyles.periodText}>Monthly Budget</Text>
            </View>
          </View>
          <View style={dynamicStyles.amountBlock}>
            <Text style={[dynamicStyles.spentAmount, { color: status.color }]}>
              {item.spent.toLocaleString()}
            </Text>
            <Text style={dynamicStyles.limitAmount}>/ {item.limit.toLocaleString()} {user?.currency}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={dynamicStyles.progressContainer}>
          <View style={dynamicStyles.progressBg}>
            <View style={[
              dynamicStyles.progressFill,
              { width: `${Math.min(progressWidth, 100)}%`, backgroundColor: status.color }
            ]} />
          </View>
          <Text style={[dynamicStyles.percentText, { color: status.color }]}>
            {Math.round(percent)}%
          </Text>
        </View>

        {/* Warning Banner */}
        {status.message && (
          <View style={[dynamicStyles.warningBanner, { backgroundColor: status.color + '12', borderColor: status.color + '30' }]}>
            <Ionicons name={status.icon} size={15} color={status.color} />
            <Text style={[dynamicStyles.warningText, { color: status.color }]}>
              {status.message}
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={dynamicStyles.cardFooter}>
          <View style={[dynamicStyles.statusBadge, { backgroundColor: status.color + '15' }]}>
            <View style={[dynamicStyles.dot, { backgroundColor: status.color }]} />
            <Text style={[dynamicStyles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
          <Text style={dynamicStyles.remainingText}>
            {item.remaining >= 0
              ? `${item.remaining.toLocaleString()} remaining`
              : `${Math.abs(item.remaining).toLocaleString()} over limit`}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={dynamicStyles.safeArea}>
      <View style={dynamicStyles.header}>
        <View>
          <Text style={dynamicStyles.title}>Budgets</Text>
          <Text style={dynamicStyles.subtitle}>{budgetStatus.length} active budgets</Text>
        </View>
        <TouchableOpacity
          style={[dynamicStyles.addBtn, SHADOWS.sm]}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={dynamicStyles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => dispatch(getBudgetStatus())}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {budgetStatus.length > 0 ? (
          budgetStatus.map(renderBudgetItem)
        ) : (
          <View style={dynamicStyles.emptyContainer}>
            <View style={dynamicStyles.emptyIconBg}>
              <Ionicons name="pie-chart" size={48} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.emptyTitle}>No Budgets Set</Text>
            <Text style={dynamicStyles.emptyText}>
              Create budgets to track your spending and get notified when you're close to your limits.
            </Text>
            <Button
              title="Create First Budget"
              onPress={() => setModalVisible(true)}
              style={{ marginTop: SIZES.xl, width: 220 }}
            />
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Budget Modal */}
      <Modal visible={!!modalVisible} animationType="slide" transparent={true}>
        <View style={dynamicStyles.modalBg}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalIndicator} />
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>New Budget</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={28} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <Input
              label="Monthly Limit Amount"
              placeholder="0.00"
              keyboardType="numeric"
              value={newBudget.limit}
              onChangeText={(txt) => setNewBudget({ ...newBudget, limit: txt })}
            />

            <Text style={dynamicStyles.label}>Category</Text>
            <View style={dynamicStyles.catGrid}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[dynamicStyles.catChip, newBudget.category === cat && dynamicStyles.catChipActive]}
                  onPress={() => setNewBudget({ ...newBudget, category: cat })}
                >
                  <Ionicons
                    name={getCategoryIcon(cat)}
                    size={16}
                    color={newBudget.category === cat ? '#FFFFFF' : colors.textLight}
                  />
                  <Text style={[dynamicStyles.catChipText, newBudget.category === cat && dynamicStyles.catChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button title="Create Budget" onPress={handleAddBudget} style={{ marginTop: SIZES.xl }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = (colors, isDark) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingTop: SIZES.xl,
    paddingBottom: SIZES.md,
    backgroundColor: colors.background,
  },
  title: { fontSize: SIZES.h2, color: colors.text, fontWeight: '800' },
  subtitle: { fontSize: SIZES.caption, color: colors.textLight, fontWeight: '600', marginTop: 2 },
  addBtn: {
    width: 42, height: 42, borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
  },
  scroll: { padding: SIZES.lg },
  budgetCard: {
    backgroundColor: colors.card,
    padding: SIZES.lg,
    borderRadius: 20,
    marginBottom: SIZES.lg,
    borderWidth: 1,
    borderColor: isDark ? colors.border : '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  catIcon: {
    width: 42, height: 42, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  categoryName: { fontSize: SIZES.body1, fontWeight: '700', color: colors.text },
  periodText: { fontSize: SIZES.caption, color: colors.textLight, marginTop: 2 },
  amountBlock: { alignItems: 'flex-end' },
  spentAmount: { fontSize: SIZES.h4, fontWeight: '800' },
  limitAmount: { fontSize: SIZES.caption, color: colors.textLight, fontWeight: '600' },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
    gap: 10,
  },
  progressBg: {
    flex: 1, height: 10,
    backgroundColor: isDark ? colors.border : '#F1F5F9',
    borderRadius: 5, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 5 },
  percentText: { fontSize: SIZES.caption, fontWeight: '800', width: 38, textAlign: 'right' },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: SIZES.sm,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: SIZES.sm,
  },
  warningText: { fontSize: SIZES.caption, fontWeight: '600', flex: 1 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  remainingText: { fontSize: SIZES.caption, color: colors.textLight, fontWeight: '600' },
  emptyContainer: { marginTop: 60, alignItems: 'center', paddingHorizontal: SIZES.xl },
  emptyIconBg: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center', alignItems: 'center', marginBottom: SIZES.lg,
  },
  emptyTitle: { fontSize: SIZES.h3, fontWeight: 'bold', color: colors.text, marginBottom: SIZES.sm },
  emptyText: { color: colors.textLight, fontSize: SIZES.body2, textAlign: 'center', lineHeight: 22 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: SIZES.lg, paddingBottom: 50,
  },
  modalIndicator: {
    width: 40, height: 5, backgroundColor: colors.border,
    borderRadius: 3, alignSelf: 'center', marginBottom: 20,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.xl },
  modalTitle: { fontSize: SIZES.h3, fontWeight: '800', color: colors.text },
  label: { fontSize: SIZES.body2, fontWeight: '700', marginBottom: SIZES.sm, color: colors.text },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: colors.border,
    backgroundColor: colors.card,
  },
  catChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  catChipText: { color: colors.textLight, fontWeight: '600', fontSize: 13 },
  catChipTextActive: { color: '#FFFFFF', fontWeight: 'bold' },
});

export default BudgetsScreen;
