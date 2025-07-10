const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
// Impor dataStore yang baru
const dataStore = require('../data');

// Aturan validasi untuk kategori
const categoryValidationRules = () => {
  return [
    body('name')
      .trim()
      .notEmpty().withMessage('Nama kategori tidak boleh kosong.')
      .custom(async (name, { req }) => {
        // Cek apakah nama kategori sudah ada (unik)
        const categories = dataStore.getCategories();
        const categoryId = req.params.id ? parseInt(req.params.id, 10) : null;
        // Cari kategori dengan nama yang sama, tapi bukan kategori yang sedang diedit
        const existingCategory = categories.find(
          c => c.name.toLowerCase() === name.toLowerCase() && c.id !== categoryId
        );
        if (existingCategory) {
          return Promise.reject('Nama kategori sudah digunakan.');
        }
      }),
    body('color')
      .trim()
      .notEmpty().withMessage('Warna tidak boleh kosong.')
      .isHexColor().withMessage('Format warna tidak valid (harus kode hex, cth: #RRGGBB).')
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

// GET semua kategori dengan filter dan pagination
// URL: GET /api/categories?name=Gaji&page=1&limit=5
router.get('/', (req, res) => {
  const { name, page = 1, limit = 10 } = req.query;

  let filteredCategories = dataStore.getCategories();

  // Filter berdasarkan nama (pencarian case-insensitive)
  if (name) {
    filteredCategories = filteredCategories.filter(c =>
      c.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // Terapkan pagination
  const numericPage = parseInt(page, 10);
  const numericLimit = parseInt(limit, 10);
  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / numericLimit);
  const startIndex = (numericPage - 1) * numericLimit;
  const paginatedData = filteredCategories.slice(startIndex, startIndex + numericLimit);

  console.log(`GET /api/categories - query:`, req.query);
  console.log(`Mengirim ${paginatedData.length} dari ${totalItems} kategori.`);

  res.json({
    data: paginatedData,
    pagination: { totalItems, totalPages, currentPage: numericPage, limit: numericLimit },
  });
});

// POST (Create) kategori baru
// URL: POST /api/categories/
router.post('/', categoryValidationRules(), validate, (req, res) => {
  // Data sudah divalidasi, termasuk keunikan nama
  const { name, color } = req.body;
  const addedCategory = dataStore.addCategory({ name, color });
  console.log('POST /api/categories - Menambahkan kategori baru:', addedCategory);
  res.status(201).json(addedCategory);
});

// PUT (Update) kategori berdasarkan ID
// URL: PUT /api/categories/:id
router.put('/:id', categoryValidationRules(), validate, (req, res) => {
  const categoryId = parseInt(req.params.id, 10);
  const updatedCategory = dataStore.updateCategory(categoryId, req.body);
  if (!updatedCategory) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
  }
  console.log(`PUT /api/categories/${categoryId} - Memperbarui kategori:`, updatedCategory);
  res.json(updatedCategory);
});

// DELETE kategori berdasarkan ID
// URL: DELETE /api/categories/:id
router.delete('/:id', (req, res) => {
  const categoryId = parseInt(req.params.id, 10);

  const success = dataStore.deleteCategory(categoryId);

  if (!success) {
    return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
  }

  console.log(`DELETE /api/categories/${categoryId} - Kategori dihapus.`);
  res.status(204).send(); // 204 No Content adalah respons standar untuk delete yang berhasil
});

module.exports = router;