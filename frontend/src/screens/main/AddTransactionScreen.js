import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Modal, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../../store/slices/transactionSlice';
import { getSummary, getBudgetStatus } from '../../store/slices/analyticsSlice';
import { SIZES } from '../../constants/theme';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Education', 'Health', 'Entertainment', 'Others'];

const AddTransactionScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const [form, setForm] = useState({
    amount: '',
    category: 'Food',
    type: 'expense',
    description: '',
    date: new Date()
  });

  const handleSubmit = async () => {
    if (!form.amount || !form.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const result = await dispatch(addTransaction({
      ...form,
      amount: parseFloat(form.amount)
    }));

    if (addTransaction.fulfilled.match(result)) {
      // Refresh dashboard balance + budgets immediately
      dispatch(getSummary());
      dispatch(getBudgetStatus());
      navigation.goBack();
    } else {
      Alert.alert('Error', result.payload || 'Failed to save transaction');
    }
  };

  const [showDropdown, setShowDropdown] = useState(false);

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

  const dynamicStyles = styles(colors);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={dynamicStyles.title}>Add Transaction</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={dynamicStyles.form}>
        <View style={dynamicStyles.typeContainer}>
          <TouchableOpacity 
            style={[dynamicStyles.typeBtn, form.type === 'expense' && dynamicStyles.expenseActive]}
            onPress={() => setForm({...form, type: 'expense'})}
          >
            <Text style={[dynamicStyles.typeText, form.type === 'expense' && dynamicStyles.activeText]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[dynamicStyles.typeBtn, form.type === 'income' && dynamicStyles.incomeActive]}
            onPress={() => setForm({...form, type: 'income'})}
          >
            <Text style={[dynamicStyles.typeText, form.type === 'income' && dynamicStyles.activeText]}>Income</Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Amount"
          placeholder="0.00"
          keyboardType="numeric"
          value={form.amount}
          onChangeText={(val) => setForm({...form, amount: val})}
        />

        <Input
          label="Description"
          placeholder="What was this for?"
          value={form.description}
          onChangeText={(val) => setForm({...form, description: val})}
        />

        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.label}>Category</Text>
          <TouchableOpacity 
            style={dynamicStyles.dropdown} 
            onPress={() => setShowDropdown(true)}
          >
            <View style={dynamicStyles.selectedCatRow}>
              <View style={[dynamicStyles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name={getCategoryIcon(form.category)} size={20} color={colors.primary} />
              </View>
              <Text style={dynamicStyles.selectedCatText}>{form.category}</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <Button 
          title="Save Transaction" 
          onPress={handleSubmit} 
          style={{ marginTop: SIZES.xl }}
        />
      </ScrollView>

      {/* Category Selection Modal */}
      <Modal 
        visible={showDropdown} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setShowDropdown(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <TouchableOpacity 
            style={dynamicStyles.modalBlur} 
            onPress={() => setShowDropdown(false)} 
          />
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalIndicator} />
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowDropdown(false)}>
                <Ionicons name="close-circle" size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>
            
            <View style={dynamicStyles.catGrid}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  style={[dynamicStyles.catGridItem, form.category === cat && dynamicStyles.catGridItemActive]}
                  onPress={() => {
                    setForm({...form, category: cat});
                    setShowDropdown(false);
                  }}
                >
                  <View style={[dynamicStyles.gridIconCircle, { backgroundColor: form.category === cat ? '#FFFFFF' : colors.primary + '10' }]}>
                    <Ionicons 
                      name={getCategoryIcon(cat)} 
                      size={24} 
                      color={form.category === cat ? colors.primary : colors.text} 
                    />
                  </View>
                  <Text style={[dynamicStyles.gridCatLabel, form.category === cat && dynamicStyles.gridCatLabelActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 15 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  title: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: colors.text,
  },
  form: {
    padding: SIZES.lg,
  },
  typeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.border + '50',
    borderRadius: SIZES.sm,
    padding: 4,
    marginBottom: SIZES.xl,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: SIZES.sm - 2,
  },
  expenseActive: {
    backgroundColor: colors.danger,
  },
  incomeActive: {
    backgroundColor: colors.secondary,
  },
  typeText: {
    fontSize: SIZES.body1,
    fontWeight: '600',
    color: colors.textLight,
  },
  activeText: {
    color: '#FFFFFF',
  },
  section: {
    marginVertical: SIZES.md,
  },
  label: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: colors.text,
    marginBottom: SIZES.sm,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: SIZES.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCatText: {
    fontSize: SIZES.body1,
    color: colors.text,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 50,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  modalTitle: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: colors.text,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  catGridItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.border + '20',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  catGridItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  gridIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridCatLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  gridCatLabelActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;
