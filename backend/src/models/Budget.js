const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  limit: {
    type: Number,
    required: [true, 'Please add a limit amount']
  },
  period: {
    type: String,
    enum: ['weekly', 'monthly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);
