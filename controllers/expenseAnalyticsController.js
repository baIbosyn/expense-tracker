const Expense = require('../models/Expense');
const { Parser } = require('json2csv');

// 📊 Сумма по категориям за месяц
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

// 📊 Сумма по месяцам
exports.getMonthlySummary = async (req, res) => {
  const monthsBack = parseInt(req.query.months || '3');
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);

  const summary = await Expense.aggregate([
    { $match: { date: { $gte: start } } },
    {
      $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.json(summary);
};

// 📆 Расходы по дням
exports.getExpensesByDay = async (req, res) => {
  const { month, year } = req.query;
  const start = new Date(`${year}-${month}-01`);
  const end = new Date(year, month, 0, 23, 59, 59);

  const daily = await Expense.aggregate([
    { $match: { date: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: { $dayOfMonth: '$date' },
        total: { $sum: '$amount' },
        expenses: { $push: '$$ROOT' }
      }
    }
  ]);

  res.json(daily);
};

// 📁 Экспорт в CSV
exports.exportToCSV = async (req, res) => {
  const { month, year } = req.query;
  const start = new Date(`${year}-${month}-01`);
  const end = new Date(year, month, 0, 23, 59, 59);

  const expenses = await Expense.find({ date: { $gte: start, $lte: end } });
  const fields = ['title', 'amount', 'category', 'date', 'note', 'tags'];
  const parser = new Parser({ fields });
  const csv = parser.parse(expenses);

  res.header('Content-Type', 'text/csv');
  res.attachment(`expenses-${month}-${year}.csv`);
  res.send(csv);
};


