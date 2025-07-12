"use client";

import { useState, useCallback, useEffect } from "react";
import dayjs from "dayjs";

// Gunakan URL relatif. Browser akan otomatis menggunakan domain yang sama.
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

console.log("API_BASE_URL:", process.env);

/**
 * Hook fleksibel untuk mengelola data transaksi.
 * @param {('Income'|'Expense'|null)} [initialType=null] - Tipe transaksi yang ingin diambil secara default.
 */
const useTransactions = (initialType = null) => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    year: dayjs().year(),
    month: dayjs().month() + 1,
    category: "",
    search: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(
    async (newFilters = {}, options = {}) => {
      setLoading(true);
      setError(null);
      try {
        const currentFilters = { ...filters, ...newFilters };
        const params = new URLSearchParams({
          page: options.page || pagination.currentPage,
          limit: options.limit || pagination.limit,
        });

        // Tambahkan filter ke parameter
        // Prioritaskan startDate/endDate jika ada, jika tidak, baru gunakan year/month
        if (currentFilters.startDate)
          params.append("startDate", currentFilters.startDate);
        if (currentFilters.endDate)
          params.append("endDate", currentFilters.endDate);
        if (currentFilters.year && !currentFilters.startDate)
          params.append("year", currentFilters.year);
        if (currentFilters.month && !currentFilters.startDate)
          params.append("month", currentFilters.month);
        if (currentFilters.category)
          params.append("category", currentFilters.category);
        if (currentFilters.search)
          params.append("search", currentFilters.search);

        // KUNCI: Tambahkan filter tipe jika disediakan
        if (initialType) {
          params.append("type", initialType);
        }

        const response = await fetch(
          `${API_BASE_URL}/transactions?${params.toString()}`
        );
        if (!response.ok) throw new Error("Gagal mengambil data transaksi");

        const { data, pagination: paginationData } = await response.json();
        setTransactions(data);
        setPagination(paginationData || {});
        setFilters(currentFilters);
      } catch (err) {
        setError(err.message);
        console.error(
          `Error fetching ${initialType || "all"} transactions:`,
          err
        );
      } finally {
        setLoading(false);
      }
    },
    [initialType, pagination.currentPage, pagination.limit]
  );

  const addTransaction = async (newTransactionData) => {
    // Pastikan tipe transaksi sesuai dengan yang diinisialisasi
    const payload = {
      ...newTransactionData,
      type: initialType,
      amount: parseInt(newTransactionData.amount) || 0,
    };
    await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    fetchTransactions(filters, { page: 1 }); // Kembali ke halaman 1 setelah menambah data
  };

  const updateTransaction = async (transactionId, updatedData) => {
    // Tambahkan tipe transaksi ke payload sebelum mengirim
    const payload = {
      ...updatedData,
      type: initialType,
      amount: parseInt(updatedData.amount) || 0,
    };
    await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    fetchTransactions(filters, { page: pagination.currentPage });
  };

  const deleteTransaction = async (transactionId) => {
    await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: "DELETE",
    });
    fetchTransactions(filters, { page: pagination.currentPage });
  };

  return {
    transactions,
    pagination,
    filters,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setFilters,
    setPagination, // <-- Tambahkan ini
  };
};

export default useTransactions;
