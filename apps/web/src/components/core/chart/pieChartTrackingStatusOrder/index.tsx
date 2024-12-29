import React from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

export default function ChartComponents({ completedOrders, pendingOrders }: any) {
  const data = {
    labels: ['Selesai', 'Belum Selesai'],
    datasets: [
      {
        label: 'Jumlah Pesanan',
        data: [completedOrders?.length, pendingOrders?.length],
        backgroundColor: ['rgba(0, 0, 255, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'],
        borderWidth: 5,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 14, family: "'Roboto', sans-serif" },
          boxWidth: 20,
        },
      },
      title: {
        display: true,
        text: 'Data Status Pesanan',
        font: {
          size: 16,
          family: "'Roboto', sans-serif"
        },
        padding: { bottom: 15 },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
    cutout: '50%',
  };

  return (
    <Pie data={data} options={options} />
  );
}