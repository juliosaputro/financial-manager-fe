const express = require('express');
const router = express.Router();
const dataStore = require('../data');

// Helper function untuk filtering
const filterTransactionsByPeriod = (transactions, { year, month, startDate, endDate }) => {
  let filtered = transactions;

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    filtered = filtered.filter(t => new Date(t.date) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    filtered = filtered.filter(t => new Date(t.date) <= end);
  }

  // Filter year/month hanya jika startDate tidak ada
  if (!startDate && year) {
    filtered = filtered.filter(t => new Date(t.date).getFullYear() === year);
    if (month) {
      filtered = filtered.filter(t => new Date(t.date).getMonth() === month - 1);
    }
  }
  return filtered;
};

// Endpoint untuk data Summary Cards
// URL: GET /api/summary?startDate=2024-01-01&endDate=2024-12-31
router.get('/', (req, res) => {
  const { year, month, startDate, endDate } = req.query;

  const allTransactions = dataStore.getTransactions();
  const numericYear = year ? parseInt(year, 10) : new Date().getFullYear();
  const numericMonth = month ? parseInt(month, 10) : null;
  const filtered = filterTransactionsByPeriod(allTransactions, { year: numericYear, month: numericMonth, startDate, endDate });

  const totalIncome = filtered.filter(t => t.type === 'Income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'Expense').reduce((acc, t) => acc + t.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  res.json({ totalIncome, totalExpense, totalBalance });
});

module.exports = router;