"use client";

import dayjs from "dayjs";
import { Line } from "react-chartjs-2";

export default function IncomeAreaChart({ data, startDate, endDate }) {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tren Pemasukan Harian",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Agregasi data berdasarkan hari
  const dailyIncome = new Map();

  // 1. Inisialisasi semua hari dalam rentang dengan nilai 0
  if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
    let currentDate = startDate.clone();
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      const dayKey = currentDate.format('YYYY-MM-DD');
      dailyIncome.set(dayKey, 0);
      currentDate = currentDate.add(1, 'day');
    }
  }

  // 2. Akumulasi jumlah transaksi ke hari yang sesuai
  data.forEach((transaction) => {
    const dayKey = dayjs(transaction.date).format('YYYY-MM-DD');
    if (dailyIncome.has(dayKey)) {
      const currentAmount = dailyIncome.get(dayKey) || 0;
      dailyIncome.set(dayKey, currentAmount + transaction.amount);
    }
  });

  // 3. Urutkan data berdasarkan hari (meskipun Map biasanya menjaga urutan penyisipan, ini untuk keamanan)
  const sortedDailyIncome = new Map([...dailyIncome.entries()].sort());

  const chartData = {
    labels: Array.from(sortedDailyIncome.keys()).map((key) =>
      dayjs(key).format("DD")
    ),
    datasets: [
      {
        label: "Pemasukan",
        data: Array.from(sortedDailyIncome.values()),
        borderColor: "rgb(74, 222, 128)",
        backgroundColor: "rgba(74, 222, 128, 0.2)",
        fill: true,
      },
    ],
  };

  return <Line options={chartOptions} data={chartData} />;
}
