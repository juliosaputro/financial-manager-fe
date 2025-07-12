'use client';

import { useState, useCallback } from 'react';

// Gunakan URL relatif. Browser akan otomatis menggunakan domain yang sama.
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const useSummary = () => {
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      // Gunakan filter yang diterima dari argumen fungsi
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await fetch(`${API_BASE_URL}/summary?${params.toString()}`);
      if (!response.ok) throw new Error('Gagal mengambil data summary');

      const data = await response.json();
      setSummaryData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching summary data:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Dependensi bisa dikosongkan karena fungsi ini mandiri

  return {
    summaryData,
    loading,
    error,
    fetchSummary,
  };
};

export default useSummary;