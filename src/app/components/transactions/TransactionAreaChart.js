'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';

// Komponen Chart.js sudah diregistrasi di file page.js,
// jadi tidak perlu diregistrasi ulang di sini.

/**
 * Komponen Area Chart generik untuk menampilkan tren transaksi (Pemasukan/Pengeluaran).
 * @param {object[]} data - Array data transaksi.
 * @param {'Income' | 'Expense'} type - Tipe transaksi yang akan ditampilkan.
 */
export default function TransactionAreaChart({ data, type }) {
  // 1. Konfigurasi dinamis berdasarkan 'type' prop
  const chartConfig = useMemo(() => {
    if (type === 'Income') {
      return {
        title: 'Tren Pemasukan Harian',
        label: 'Pemasukan',
        borderColor: 'rgb(74, 222, 128)', // Tailwind green-400
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
      };
    }
    // Default ke 'Expense'
    return {
      title: 'Tren Pengeluaran Harian',
      label: 'Pengeluaran',
      borderColor: 'rgb(248, 113, 113)', // Tailwind red-400
      backgroundColor: 'rgba(248, 113, 113, 0.2)',
    };
  }, [type]);

  // 2. Proses data untuk chart
  const { labels, dailyTotals } = useMemo(() => {
    const now = dayjs();
    const daysInMonth = now.daysInMonth();
    const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    const dailyTotals = Array(daysInMonth).fill(0);

    // Filter data hanya untuk bulan ini
    const currentMonthData = data.filter(item => dayjs(item.date).isSame(now, 'month'));

    currentMonthData.forEach((item) => {
      const day = dayjs(item.date).date(); // Hasilnya 1-31
      dailyTotals[day - 1] += item.amount; // day-1 untuk indeks array (0-30)
    });

    return { labels, dailyTotals };
  }, [data]);

  // 3. Opsi dan data untuk Chart.js
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartConfig.title,
        font: { size: 16 },
        color: '#374151', // gray-700
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const chartData = {
    labels,
    datasets: [{
      label: chartConfig.label,
      data: dailyTotals,
      borderColor: chartConfig.borderColor,
      backgroundColor: chartConfig.backgroundColor,
      fill: true,
      tension: 0.4,
    }],
  };

  return <Line options={chartOptions} data={chartData} />;
}