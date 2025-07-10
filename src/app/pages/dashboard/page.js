"use client";
import { useMemo, useState, useEffect } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from 'dayjs';
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// Import Components
import SummaryCard from "../../components/dashboard/SummaryCard";
import IncomeExpenseChart from "../../components/dashboard/IncomeExpenseChart";
import ExpenseByCategoryChart from "../../components/dashboard/ExpenseByCategoryChart";
import TransactionsTable from "../../components/dashboard/TransactionsTable";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Import Custom Hooks
import useTransactions from '@/app/hook/useTransactions';
import useSummary from '@/app/hook/useSummary';
import useCategories from '@/app/hook/useCategories';
import { formattedToIDR } from "@/app/constants/formattedtoIDR";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardPage() {
  // 1. State filter terpusat untuk Dashboard
  const [startDate, setStartDate] = useState(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));


  // 2. Inisialisasi hooks
  const { summaryData, fetchSummary, loading: summaryLoading, error: summaryError } = useSummary();
  // Ambil SEMUA transaksi (type: null) untuk chart dan tabel
  const { transactions, fetchTransactions, loading: transactionsLoading, error: transactionsError } = useTransactions(null);
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

  // 3. Effect untuk mengambil data setiap kali filter berubah
  useEffect(() => {
    const filters = {
      startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
      endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
    };
    fetchSummary(filters);
    // Ambil semua transaksi untuk periode ini (untuk chart) dengan limit yang besar
    // dan 5 transaksi terbaru untuk tabel.
    fetchTransactions(filters, { limit: 1000, page: 1 });
  }, [startDate, endDate, fetchSummary, fetchTransactions]);

  // 4. Kalkulasi data chart dari state `transactions` yang lengkap
  const expenseByCategoryChartData = useMemo(() => {
    if (!transactions || !categories) return [];

    const categoryColorMap = new Map(
      categories.map((cat) => [cat.name, cat.color || "#CCCCCC"])
    );
    const expenseMap = new Map();

    transactions
      .filter((t) => t.type === "Expense") // <-- KUNCI: Kode ini memfilter hanya pengeluaran
      .forEach((expense) => {
        const currentAmount = expenseMap.get(expense.category) || 0;
        expenseMap.set(expense.category, currentAmount + expense.amount);
      });

    return Array.from(expenseMap.entries()).map(([name, value]) => ({
      name,
      value,
      color: categoryColorMap.get(name) || "#CCCCCC", // Fallback color
    }));
  }, [transactions, categories]);
  

  // 5. Konfigurasi kolom untuk tabel
  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Tanggal",
        Cell: ({ cell }) => dayjs(cell.getValue()).format('YYYY-MM-DD'),
      },
      { accessorKey: "description", header: "Deskripsi" },
      { accessorKey: "category", header: "Kategori" },
      {
        accessorKey: "type",
        header: "Tipe",
        Cell: ({ cell }) => {
          const type = cell.getValue();
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                type === "Expense"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {type}
            </span>
          );
        },
      },
      {
        accessorKey: "amount",
        header: "Jumlah",
        Cell: ({ cell }) => `${formattedToIDR(cell.getValue())}`,
      },
    ],
    []
  );

  // 6. Penanganan state Loading dan Error
  const isLoading = summaryLoading || transactionsLoading || categoriesLoading;
  const error = summaryError || transactionsError || categoriesError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold">Memuat data...</h1>
      </div>
    );
  }

  // Handle Error State
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-semibold text-red-500">
          Error: {error}
        </h1>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Filter Controls */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-md">
        <span className="font-semibold">Tampilkan Data:</span>
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
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <SummaryCard
          icon={AccountBalanceIcon}
          title="Total Saldo"
          value={summaryData.totalBalance || 0}
          color="text-blue-500"
        />
        <SummaryCard
          icon={TrendingUpIcon}
          title="Total Pemasukan"
          value={summaryData.totalIncome || 0}
          color="text-green-500"
        />
        <SummaryCard
          icon={TrendingDownIcon}
          title="Total Pengeluaran"
          value={summaryData.totalExpense || 0}
          color="text-red-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3 p-4 bg-white rounded-lg shadow-md">
          <IncomeExpenseChart data={transactions} startDate={startDate} endDate={endDate} />
        </div>
        <div className="lg:col-span-2 p-4 bg-white rounded-lg shadow-md">
          <ExpenseByCategoryChart data={expenseByCategoryChartData} />
        </div>
      </div>

      {/* Table */}
      <div className="grid grid-cols-1 gap-6">
        <TransactionsTable
          title="Detail Transaksi"
          columns={columns}
          data={transactions.slice(0, 5)} // Tampilkan 5 transaksi pertama dari data yang sudah ada
        />
      </div>
    </>
  );
}
