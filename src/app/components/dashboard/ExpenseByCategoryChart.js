"use client";

import { Pie } from "react-chartjs-2";

export default function ExpenseByCategoryChart({ data }) {
  const pieChartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => item.color || '#CCCCCC'), // Gunakan warna dari data
        hoverBackgroundColor: data.map((item) => item.color || '#CCCCCC'),
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Pengeluaran per Kategori",
      },
    },
  };

  return <Pie data={pieChartData} options={pieChartOptions} />;
}
