const express = require('express');
const cors = require('cors');
const transactionsRouter = require('../backend/routes/transactions');
const categoriesRouter = require('../backend/routes/categories');
const summaryRouter = require('../backend/routes/summary');

const app = express();

// Middleware
// Izinkan request dari semua origin. Untuk produksi, Anda mungkin ingin mengkonfigurasinya lebih ketat.
app.use(cors()); 
app.use(express.json());

// Gunakan router yang sudah ada
// Hapus prefix '/api' karena sudah ditangani oleh vercel.json
app.use('/transactions', transactionsRouter);
app.use('/categories', categoriesRouter);
app.use('/summary', summaryRouter);

// Ekspor aplikasi Express agar Vercel dapat menggunakannya
module.exports = app;