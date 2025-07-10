const express = require('express');
const cors = require('cors');
const transactionsRouter = require('../backend/routes/transactions');
const categoriesRouter = require('../backend/routes/categories');
const summaryRouter = require('../backend/routes/summary');

const app = express();

app.use(cors()); 
app.use(express.json());

// Path ini relatif terhadap /api yang sudah ditangani Vercel
app.use('/transactions', transactionsRouter);
app.use('/categories', categoriesRouter);
app.use('/summary', summaryRouter);

module.exports = app;
