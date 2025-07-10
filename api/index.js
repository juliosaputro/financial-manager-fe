const express = require('express');
const cors = require('cors');
const path = require('path');

const transactionsRouter = require(path.resolve(process.cwd(), 'backend/routes/transactions.js'));
const categoriesRouter = require(path.resolve(process.cwd(), 'backend/routes/categories.js'));
const summaryRouter = require(path.resolve(process.cwd(), 'backend/routes/summary.js'));

const app = express();

app.use(cors()); 
app.use(express.json());

// Path ini relatif terhadap /api yang sudah ditangani Vercel
app.use('/transactions', transactionsRouter);
app.use('/categories', categoriesRouter);
app.use('/summary', summaryRouter);

module.exports = app;
