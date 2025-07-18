const express = require('express');
const router = express.Router();
const controller = require('../controllers/expenseAnalyticsController');

router.get('/summary-by-category', controller.getSummaryByCategory);
router.get('/monthly-summary', controller.getMonthlySummary);
router.get('/by-day', controller.getExpensesByDay);
router.get('/export', controller.exportToCSV);

module.exports = router;

exports.getSummaryByCategory = async (req, res) => {
  const { month, year } = req.query;
  const start = new Date(`${year}-${month}-01`);
  const end = new Date(year, month, 0, 23, 59, 59);

  const summary = await Expense.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } }
  ]);

  res.json(summary);
};
