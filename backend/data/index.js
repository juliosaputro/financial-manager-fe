/**
 * PENTING: Untuk Vercel Serverless Functions, filesystem bersifat read-only.
 * Data tidak dapat ditulis ke file JSON. Perubahan ini mengadaptasi data store
 * untuk bekerja secara in-memory.
 *
 * Data akan di-reset pada setiap pemanggilan fungsi serverless.
 * Ini HANYA cocok untuk demonstrasi. Untuk produksi, gunakan database.
 */

// Muat data awal dari file JSON. `require` akan bekerja di Vercel untuk membaca file yang di-deploy.
let TRANSACTIONS_DATA = require('./transactions.json');
let CATEGORIES_DATA = require('./categories.json');

// Helper untuk menulis data (sekarang menjadi no-op/tidak melakukan apa-apa)
const writeData = () => {
  // Di lingkungan serverless, kita tidak bisa menulis ke file.
  // Fungsi ini dibiarkan kosong untuk menghindari error.
  // Perubahan hanya akan ada di memori selama eksekusi fungsi.
};

const dataStore = {
  getTransactions: () => TRANSACTIONS_DATA,
  getCategories: () => CATEGORIES_DATA,

  addTransaction: (transaction) => {
    const newId = TRANSACTIONS_DATA.length > 0 ? Math.max(...TRANSACTIONS_DATA.map(t => t.id)) + 1 : 1;
    const newTransaction = { ...transaction, id: newId };
    TRANSACTIONS_DATA.unshift(newTransaction); // Gunakan unshift agar data baru di atas
    writeData(); // Perubahan hanya di memori
    return newTransaction;
  },

  updateTransaction: (id, updatedData) => {
    const index = TRANSACTIONS_DATA.findIndex(t => t.id === id);
    if (index !== -1) {
      TRANSACTIONS_DATA[index] = { ...TRANSACTIONS_DATA[index], ...updatedData };
      writeData(); // Perubahan hanya di memori
      return TRANSACTIONS_DATA[index];
    }
    return null;
  },

  deleteTransaction: (id) => {
    const initialLength = TRANSACTIONS_DATA.length;
    TRANSACTIONS_DATA = TRANSACTIONS_DATA.filter(t => t.id !== id);
    if (TRANSACTIONS_DATA.length < initialLength) {
      writeData(); // Perubahan hanya di memori
      return true;
    }
    return false;
  },

  addCategory: (category) => {
    const newId = CATEGORIES_DATA.length > 0 ? Math.max(...CATEGORIES_DATA.map(c => c.id)) + 1 : 1;
    const newCategory = { ...category, id: newId };
    CATEGORIES_DATA.push(newCategory);
    writeData(); // Perubahan hanya di memori
    return newCategory;
  },

  updateCategory: (id, updatedData) => {
    const index = CATEGORIES_DATA.findIndex(c => c.id === id);
    if (index !== -1) {
      CATEGORIES_DATA[index] = { ...CATEGORIES_DATA[index], ...updatedData };
      writeData(); // Perubahan hanya di memori
      return CATEGORIES_DATA[index];
    }
    return null;
  },

  deleteCategory: (id) => {
    const initialLength = CATEGORIES_DATA.length;
    CATEGORIES_DATA = CATEGORIES_DATA.filter(c => c.id !== id);
    if (CATEGORIES_DATA.length < initialLength) {
      writeData(); // Perubahan hanya di memori
      return true;
    }
    return false;
  },
};

module.exports = dataStore;