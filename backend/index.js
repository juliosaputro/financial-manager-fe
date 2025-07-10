const express = require('express');
const cors = require('cors');

// Impor rute
const transactionRoutes = require('./routes/transactions'); // Rute ini sudah lengkap
const categoryRoutes = require('./routes/categories');
const summaryRoutes = require('./routes/summary');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --- API Endpoints ---
// Gunakan rute yang telah diimpor
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/summary', summaryRoutes);

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
