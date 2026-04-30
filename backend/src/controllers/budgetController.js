const Budget = require('../models/Budget');

// @desc    Get user budgets
// @route   GET /api/v1/budgets
// @access  Private
const getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.status(200).json(budgets);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a budget
// @route   POST /api/v1/budgets
// @access  Private
const addBudget = async (req, res, next) => {
  try {
    const { category, limit, period, startDate, endDate } = req.body;

    const budget = await Budget.create({
      category,
      limit,
      period,
      startDate,
      endDate,
      user: req.user._id
    });

    res.status(201).json(budget);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a budget
// @route   PUT /api/v1/budgets/:id
// @access  Private
const updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404);
      throw new Error('Budget not found');
    }

    // Checking for user
    if (budget.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedBudget);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a budget
// @route   DELETE /api/v1/budgets/:id
// @access  Private
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      res.status(404);
      throw new Error('Budget not found');
    }

    // Checking for user
    if (budget.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await budget.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget
};
