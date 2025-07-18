const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Expense = require('./models/Expense');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Подключено к MongoDB');
}).catch(err => console.error('❌ MongoDB error:', err));

// API: добавить расход
app.post('/api/expenses', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: получить все расходы
app.get('/api/expenses', async (req, res) => {
  const expenses = await Expense.find().sort({ date: -1 });
  res.json(expenses);
});

// Запуск сервера
app.listen(PORT, () => console.log(`🚀 Сервер запущен: http://localhost:${PORT}`));

const analyticsRoutes = require('./routes/expenseAnalyticsRoutes');
app.use('/api/analytics', analyticsRoutes);
