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

// Path ini relatif terhadap /api yang sudah ditangani Vercel
app.use('/transactions', transactionsRouter);
app.use('/categories', categoriesRouter);
app.use('/summary', summaryRouter);

module.exports = app;
