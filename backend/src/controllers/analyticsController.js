const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// @desc    Get dashboard summary (total balance, income, expenses)
// @route   GET /api/v1/analytics/summary
// @access  Private
const getDashboardSummary = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalIncome - totalExpense;

    res.status(200).json({
      balance,
      totalIncome,
      totalExpense,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get expenses by category
// @route   GET /api/v1/analytics/category-expenses
// @access  Private
const getCategoryExpenses = async (req, res, next) => {
  try {
    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense'
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    res.status(200).json(expenses);
  } catch (error) {
    next(error);
  }
};

// @desc    Get budget status (limit vs actual)
// @route   GET /api/v1/analytics/budget-status
// @access  Private
const getBudgetStatus = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    const transactions = await Transaction.find({ 
      user: req.user._id, 
      type: 'expense' 
    });

    const status = budgets.map(budget => {
      const spent = transactions
        .filter(t => t.category === budget.category)
        .reduce((acc, t) => acc + t.amount, 0);
      
      return {
        category: budget.category,
        limit: budget.limit,
        spent,
        remaining: budget.limit - spent,
        percent: spent > 0 ? (spent / budget.limit) * 100 : 0
      };
    });

    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardSummary,
  getCategoryExpenses,
  getBudgetStatus,
};
