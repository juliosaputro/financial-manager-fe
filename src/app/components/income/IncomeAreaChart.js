"use client";

import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';

function IncomeAreaChart({ data, startDate, endDate }) {
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tren Pemasukan Harian", // <-- Ubah judul
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Agregasi data berdasarkan hari dalam rentang tanggal yang dipilih
  const dailyData = new Map();
  if (startDate && endDate && startDate.isValid() && endDate.isValid()) {
    let currentDate = startDate.clone();
    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      const dayKey = currentDate.format('YYYY-MM-DD');
      dailyData.set(dayKey, 0);
      currentDate = currentDate.add(1, 'day');
    }
  }

  data.forEach((item) => {
    const dayKey = dayjs(item.date).format('YYYY-MM-DD');
    if (dailyData.has(dayKey)) {
      dailyData.set(dayKey, dailyData.get(dayKey) + item.amount);
    }
  });

  const sortedDailyData = new Map([...dailyData.entries()].sort());

  const chartData = {
    labels: Array.from(sortedDailyData.keys()).map(key => dayjs(key).format('DD')),
    datasets: [
      {
        label: "Pemasukan", // <-- Ubah label
        data: Array.from(sortedDailyData.values()),
        borderColor: "rgb(74, 222, 128)", // <-- Ubah warna (hijau)
        backgroundColor: "rgba(74, 222, 128, 0.2)", // <-- Ubah warna (hijau)
        fill: true,
      },
    ],
  };

  return <Line options={chartOptions} data={chartData} />;
}

export default IncomeAreaChart;