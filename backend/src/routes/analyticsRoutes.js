const express = require('express');
const router = express.Router();
const { 
  getDashboardSummary, 
  getCategoryExpenses, 
  getBudgetStatus 
} = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/summary', protect, getDashboardSummary);
router.get('/category-expenses', protect, getCategoryExpenses);
router.get('/budget-status', protect, getBudgetStatus);

module.exports = router;
