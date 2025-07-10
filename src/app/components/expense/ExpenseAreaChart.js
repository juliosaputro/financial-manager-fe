'use client';

import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';

export default function ExpenseAreaChart({ data, startDate, endDate }) {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tren Pengeluaran Harian',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Agregasi data berdasarkan hari
  const dailyExpense = new Map();

  // 1. Inisialisasi semua hari dalam rentang dengan nilai 0
  if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
    let currentDate = startDate.clone();
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      const dayKey = currentDate.format('YYYY-MM-DD');
      dailyExpense.set(dayKey, 0);
      currentDate = currentDate.add(1, 'day');
    }
  }

  // 2. Akumulasi jumlah transaksi ke hari yang sesuai
  data.forEach((transaction) => {
    const dayKey = dayjs(transaction.date).format('YYYY-MM-DD');
    if (dailyExpense.has(dayKey)) {
      const currentAmount = dailyExpense.get(dayKey) || 0;
      dailyExpense.set(dayKey, currentAmount + transaction.amount);
    }
  });

  // 3. Urutkan data berdasarkan hari (meskipun Map biasanya menjaga urutan penyisipan, ini untuk keamanan)
  const sortedDailyExpense = new Map([...dailyExpense.entries()].sort());

  const chartData = {
    labels: Array.from(sortedDailyExpense.keys()).map((key) =>
      dayjs(key).format("DD")
    ),
    datasets: [
      {
        label: 'Pengeluaran',
        data: Array.from(sortedDailyExpense.values()),
        borderColor: 'rgb(248, 113, 113)',
        backgroundColor: 'rgba(248, 113, 113, 0.2)',
        fill: true,
      },
    ],
  };

  return <Line options={chartOptions} data={chartData} />;
}