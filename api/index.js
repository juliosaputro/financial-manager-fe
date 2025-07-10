const express = require('express');
const cors = require('cors');
const path = require('path');

// Gunakan path relatif dari file ini. Ini adalah cara yang paling andal.
const transactionsRouter = require('./routes/transactions.js');
const categoriesRouter = require('./routes/categories.js');
const summaryRouter = require('./routes/summary.js');

const app = express();

app.use(cors()); 
app.use(express.json());

// Konfigurasikan Express untuk menangani path lengkap yang diterima dari Vercel
app.use('/api/transactions', transactionsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/summary', summaryRouter);

module.exports = app;
