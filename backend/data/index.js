const fs = require('fs');
const path = require('path');

const transactionsPath = path.join(__dirname, 'transactions.json');
const categoriesPath = path.join(__dirname, 'categories.json');

// Helper untuk membaca data dari file JSON
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') return []; // Jika file tidak ada, kembalikan array kosong
    console.error(`Gagal membaca file dari disk: ${filePath}`, error);
    return [];
  }
};

// Helper untuk menulis data ke file JSON
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Gagal menulis file ke disk: ${filePath}`, error);
  }
};

// Inisialisasi data dari file
let TRANSACTIONS_DATA = readData(transactionsPath);
let CATEGORIES_DATA = readData(categoriesPath);

const dataStore = {
  getTransactions: () => TRANSACTIONS_DATA,
  getCategories: () => CATEGORIES_DATA,

  addTransaction: (transaction) => {
    const newId = TRANSACTIONS_DATA.length > 0 ? Math.max(...TRANSACTIONS_DATA.map(t => t.id)) + 1 : 1;
    const newTransaction = { ...transaction, id: newId };
    TRANSACTIONS_DATA.push(newTransaction);
    writeData(transactionsPath, TRANSACTIONS_DATA);
    return newTransaction;
  },

  updateTransaction: (id, updatedData) => {
    const index = TRANSACTIONS_DATA.findIndex(t => t.id === id);
    if (index !== -1) {
      TRANSACTIONS_DATA[index] = { ...TRANSACTIONS_DATA[index], ...updatedData };
      writeData(transactionsPath, TRANSACTIONS_DATA);
      return TRANSACTIONS_DATA[index];
    }
    return null;
  },

  deleteTransaction: (id) => {
    const initialLength = TRANSACTIONS_DATA.length;
    TRANSACTIONS_DATA = TRANSACTIONS_DATA.filter(t => t.id !== id);
    if (TRANSACTIONS_DATA.length < initialLength) {
      writeData(transactionsPath, TRANSACTIONS_DATA);
      return true;
    }
    return false;
  },

  addCategory: (category) => {
    const newId = CATEGORIES_DATA.length > 0 ? Math.max(...CATEGORIES_DATA.map(c => c.id)) + 1 : 1;
    const newCategory = { ...category, id: newId };
    CATEGORIES_DATA.push(newCategory);
    writeData(categoriesPath, CATEGORIES_DATA);
    return newCategory;
  },

  updateCategory: (id, updatedData) => {
    const index = CATEGORIES_DATA.findIndex(c => c.id === id);
    if (index !== -1) {
      CATEGORIES_DATA[index] = { ...CATEGORIES_DATA[index], ...updatedData };
      writeData(categoriesPath, CATEGORIES_DATA);
      return CATEGORIES_DATA[index];
    }
    return null;
  },

  deleteCategory: (id) => {
    const initialLength = CATEGORIES_DATA.length;
    CATEGORIES_DATA = CATEGORIES_DATA.filter(c => c.id !== id);
    if (CATEGORIES_DATA.length < initialLength) {
      writeData(categoriesPath, CATEGORIES_DATA);
      return true;
    }
    return false;
  },
};

module.exports = dataStore;