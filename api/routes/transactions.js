const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
// Impor dataStore yang baru
const dataStore = require('../data');

// Aturan validasi untuk membuat transaksi baru
const transactionValidationRules = () => {
  return [
    body('description').trim().notEmpty().withMessage('Deskripsi tidak boleh kosong.'),
    body('amount').isFloat({ gt: 0 }).withMessage('Jumlah harus angka dan lebih besar dari 0.'),
    body('type').isIn(['Income', 'Expense']).withMessage("Tipe harus 'Income' atau 'Expense'."),
    body('date').isISO8601().toDate().withMessage('Format tanggal tidak valid (gunakan YYYY-MM-DD).'),
    body('category').trim().notEmpty().withMessage('Kategori tidak boleh kosong.'),
  ];
};

// Middleware untuk menangani hasil validasi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = errors.array().map(err => ({ [err.path]: err.msg }));
  return res.status(422).json({ errors: extractedErrors });
};

// GET semua transaksi dengan filter dan pagination
// URL: GET /api/transactions?year=2025&month=7&type=Expense&category=Makanan&search=siang&page=1&limit=10
router.get('/', (req, res) => {
  const { year, month, type, category, search, startDate, endDate, page = 1, limit = 10 } = req.query;

  let transactions = dataStore.getTransactions();

  // Terapkan filter
  if (year) {
    const numericYear = parseInt(year, 10);
    if (!isNaN(numericYear)) {
      transactions = transactions.filter(t => new Date(t.date).getFullYear() === numericYear);
    }
  }

  if (month) {
    const numericMonth = parseInt(month, 10);
    if (!isNaN(numericMonth)) {
      transactions = transactions.filter(t => new Date(t.date).getMonth() === numericMonth - 1);
    }
  }

  if (type) {
    transactions = transactions.filter(t => t.type.toLowerCase() === type.toLowerCase());
  }

  if (category) {
    transactions = transactions.filter(t => t.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    transactions = transactions.filter(t =>
      t.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Filter berdasarkan rentang tanggal. Ini akan lebih diutamakan daripada filter year/month jika ada.
  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0); // Set ke awal hari
    transactions = transactions.filter(t => new Date(t.date) >= start);
  }
  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set ke akhir hari
    transactions = transactions.filter(t => new Date(t.date) <= end);
  }

  // Terapkan pagination
  const numericPage = parseInt(page, 10);
  const numericLimit = parseInt(limit, 10);
  const totalItems = transactions.length;
  const totalPages = Math.ceil(totalItems / numericLimit);
  const startIndex = (numericPage - 1) * numericLimit;
  const paginatedData = transactions.slice(startIndex, startIndex + numericLimit);

  res.json({
    data: paginatedData,
    pagination: { totalItems, totalPages, currentPage: numericPage, limit: numericLimit },
  });
});

// POST (Create) transaksi baru
router.post(
  '/',
  transactionValidationRules(),
  validate,
  (req, res) => {
    // Data sudah divalidasi dan aman untuk disimpan
    const newTransaction = dataStore.addTransaction(req.body);
    res.status(201).json(newTransaction);
  }
);

// PUT (Update) transaksi berdasarkan ID
router.put('/:id', transactionValidationRules(), validate, (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  const updatedTransaction = dataStore.updateTransaction(transactionId, req.body);
  if (!updatedTransaction) return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
  res.json(updatedTransaction);
});

// DELETE transaksi berdasarkan ID
router.delete('/:id', (req, res) => {
  const transactionId = parseInt(req.params.id, 10);
  const success = dataStore.deleteTransaction(transactionId);
  if (!success) return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
  res.status(204).send();
});

module.exports = router;
