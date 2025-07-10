"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Edit, Delete } from "@mui/icons-material";

import IncomeAreaChart from "@/app/components/income/IncomeAreaChart";
import { formattedToIDR } from "@/app/constants/formattedtoIDR";
import { SharedCreateTransactionModal } from "@/app/components/shared-components/SharedCreateTransactionModal";
import useCategories from "@/app/hook/useCategories";
import useTransactions from "@/app/hook/useTransactions";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend, Filler } from 'chart.js';

// Register Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

export default function IncomePage() {
  // Gunakan hook fleksibel dengan tipe 'Income'
  const {
    transactions: income, // Ganti nama variabel agar lebih jelas
    pagination,
    setPagination,
    loading,
    error,
    fetchTransactions: fetchIncome,
    addTransaction: addIncome,
    updateTransaction: updateIncome,
    deleteTransaction: deleteIncome,
  } = useTransactions("Income");

  const { categories } = useCategories();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // State lokal untuk filter agar bisa dikontrol
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));
  const debounceTimeout = useRef(null);

  // Ambil data saat paginasi atau filter kategori berubah
  useEffect(() => {
    // Jangan fetch jika searchTerm masih dalam proses debounce
    if (debounceTimeout.current) return;
    const filters = {
      search: searchTerm,
      category: categoryFilter,
      startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
    };
    fetchIncome(filters, pagination);
  }, [pagination.currentPage, pagination.limit, categoryFilter, startDate, endDate]);

  // Debounce untuk input pencarian
  const handleSearchChange = (event) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);

    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      debounceTimeout.current = null; // Hapus timeout setelah selesai
      fetchIncome(
        {
          search: newSearchTerm, category: categoryFilter,
          startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
          endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
        },
        { ...pagination, currentPage: 1 }
      );
    }, 500); // Tunda 500ms
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStartDate(dayjs().startOf('month'));
    setEndDate(dayjs().endOf('month'));
  };

  // Kolom untuk table
  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Tanggal",
        Cell: ({ cell }) => dayjs(cell.getValue()).format('YYYY-MM-DD'),
      },
      {
        accessorKey: "description",
        header: "Deskripsi",
      },
      {
        accessorKey: "category",
        header: "Kategori",
      },
      {
        accessorKey: "amount",
        header: "Jumlah",
        Cell: ({ cell }) => formattedToIDR(cell.getValue()),
      },
    ],
    []
  );

  const handleCreateNewRow = async (values) => {
    addIncome(values);
  };

  const handleSaveRowEdits = ({ values, row, exitEditingMode }) => {
    updateIncome(row.original.id, values);
    exitEditingMode();
  };

  const handleDeleteRow = async (row) => {
    if (
      !confirm(`Yakin ingin menghapus pemasukan: ${row.original.description}?`)
    )
      return;
    deleteIncome(row.original.id);
  };

  const table = useMaterialReactTable({
    columns,
    data: income,
    manualPagination: true, // <-- PENTING: Aktifkan paginasi manual
    rowCount: pagination.totalItems, // <-- Beri tahu tabel total baris data di server
    editDisplayMode: "modal",
    enableEditing: true,
    onEditingRowSave: handleSaveRowEdits,
    onPaginationChange: setPagination, // <-- Sambungkan event tabel ke state hook
    state: {
      isLoading: loading,
      pagination: {
        // <-- Sinkronkan UI tabel dengan state dari hook
        pageIndex: pagination.currentPage - 1, // Konversi dari 1-based ke 0-based
        pageSize: pagination.limit,
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title="Hapus">
          <IconButton
            color="error"
            onClick={() => handleDeleteRow(row.original)}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
        <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
          Tambah Pemasukan
        </Button>
        <Stack
          direction="row"
          spacing={2}
          sx={{ ml: 'auto', alignItems: 'center' }}
        >
          <DatePicker
            label="Tanggal Mulai"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
            sx={{ minWidth: 180 }}
          />
          <DatePicker
            label="Tanggal Akhir"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
            sx={{ minWidth: 180 }}
          />
          <TextField
            label="Cari Deskripsi..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Autocomplete
            options={categories.map((cat) => cat.name) || []}
            value={categoryFilter || null}
            onChange={(_, newValue) => {
              setCategoryFilter(newValue || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter Kategori"
                variant="outlined"
                size="small"
              />
            )}
            sx={{ minWidth: 200 }}
          />
          <Button onClick={handleResetFilters} variant="outlined" size="small">
            Reset
          </Button>
        </Stack>
      </Stack>
    ),
  });

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pemasukan</h1>

      {/* Chart */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
        <IncomeAreaChart data={income} startDate={startDate} endDate={endDate} />
      </div>

      {/* Tabel */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <MaterialReactTable table={table} />
      </div>

      {/* Modal Tambah */}
      <SharedCreateTransactionModal
        title="Tambah Pemasukan Baru"
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </>
  );
}
