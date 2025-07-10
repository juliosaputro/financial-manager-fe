'use client';

import { useState, useEffect, useCallback } from 'react';

// Gunakan URL relatif. Browser akan otomatis menggunakan domain yang sama.
const API_BASE_URL = '/api';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState({ name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async (newFilters = {}, newPage = 1) => {
    setLoading(true);
    setError(null);
    try {
      const currentFilters = { ...filters, ...newFilters };
      const params = new URLSearchParams({
        page: newPage,
        limit: pagination.limit,
      });

      if (currentFilters.name) params.append('name', currentFilters.name);

      const response = await fetch(`${API_BASE_URL}/categories?${params.toString()}`);
      if (!response.ok) throw new Error('Gagal mengambil data kategori');

      const { data, pagination: paginationData } = await response.json();
      setCategories(data);
      setPagination(paginationData);
      setFilters(currentFilters);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.limit]);

  const addCategory = async (newCategoryData) => {
    await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategoryData),
    });
    fetchCategories(filters, pagination.currentPage);
  };

  const updateCategory = async (categoryId, updatedCategoryData) => {
    await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCategoryData),
    });
    fetchCategories(filters, pagination.currentPage);
  };

  const deleteCategory = async (categoryId) => {
    await fetch(`${API_BASE_URL}/categories/${categoryId}`, { method: 'DELETE' });
    fetchCategories(filters, pagination.currentPage);
  };

  useEffect(() => {
    fetchCategories(filters, 1);
  }, []);

  return {
    categories,
    pagination,
    filters,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};

export default useCategories;
