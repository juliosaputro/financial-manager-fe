'use client';

import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';

export default function IncomeExpenseChart({ data, startDate, endDate  }) {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tren Pemasukan vs Pengeluaran Harian',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Agregasi data berdasarkan hari
  const dailyData = new Map();

  // 1. Inisialisasi semua hari dalam rentang dengan nilai 0
  if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
    let currentDate = startDate.clone();
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      const dayKey = currentDate.format('YYYY-MM-DD');
      dailyData.set(dayKey, { income: 0, expense: 0 });
      currentDate = currentDate.add(1, 'day');
    }
  }

  // 2. Akumulasi jumlah transaksi ke hari yang sesuai
  data.forEach((transaction) => {
    const dayKey = dayjs(transaction.date).format('YYYY-MM-DD');
    if (dailyData.has(dayKey)) {
      const current = dailyData.get(dayKey);
      if (transaction.type === 'Income') {
        current.income += transaction.amount;
      } else if (transaction.type === 'Expense') {
        current.expense += transaction.amount;
      }
    }
  });

  // 3. Urutkan data berdasarkan hari (meskipun Map biasanya menjaga urutan penyisipan, ini untuk keamanan)
  const sortedDailyData = new Map([...dailyData.entries()].sort());


  const chartData = {
    labels: Array.from(sortedDailyData.keys()).map(key => dayjs(key).format("DD")),
    datasets: [
      {
        label: 'Pemasukan',
        data: Array.from(sortedDailyData.values()).map(d => d.income),
        borderColor: 'rgb(74, 222, 128)',
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        fill: true,
      },
      {
        label: 'Pengeluaran',
        data: Array.from(sortedDailyData.values()).map(d => d.expense),
        borderColor: 'rgb(248, 113, 113)',
        backgroundColor: 'rgba(248, 113, 113, 0.2)',
        fill: true,
      },
    ],
  };

  return <Line options={chartOptions} data={chartData} />;
}