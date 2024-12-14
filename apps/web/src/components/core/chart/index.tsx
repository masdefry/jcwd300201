import { ApexOptions } from "apexcharts";
import React, { useState } from "react";
import Chart from "react-apexcharts";

export default function ChartComponents() {
  const [chartData] = useState({
    series: [
      {
        name: "Penjualan",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        type: "line" as const, 
        height: 350,
      },
      stroke: {
        curve: "smooth",
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
        ],
      },
      yaxis: {
        title: {
          text: "Jumlah Penjualan",
        },
      },
      title: {
        text: "Grafik Penjualan Bulanan",
        align: "center",
        margin: 10,
        style: {
          fontSize: "18px",
          color: "#263238",
        },
      },
    } as ApexOptions,
  });

  return (
    <div>
      {/* <Chart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={250}
      /> */}
      <h1>TES</h1>
    </div>
  )
}