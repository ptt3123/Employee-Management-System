import React, { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function StatisticsChart() {
  const [timeRange, setTimeRange] = useState("3m");

  type ShiftData = {
    count: number;
    shifts: string[];
  };

  const generateDetailedData = (range: string): ShiftData[] => {
    const totalDays = range === "7d" ? 7 : range === "30d" ? 30 : 90;

    return Array.from({ length: totalDays }, () => {
      const hasMorning = Math.random() > 0.5;
      const hasAfternoon = Math.random() > 0.5;
      const shifts = [];
      if (hasMorning) shifts.push("Ca sáng");
      if (hasAfternoon) shifts.push("Ca chiều");

      return {
        count: shifts.length,
        shifts,
      };
    });
  };

  const detailedData = generateDetailedData(timeRange);

  const labels: Record<string, string[]> = {
    "7d": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    "30d": Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
    "3m": Array.from({ length: 90 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (89 - i));
      return `${d.getMonth() + 1}/${d.getDate()}`;
    }),
  };

  const series = [
    {
      name: "Số ca làm",
      data: detailedData.map((item) => item.count),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 310,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    colors: ["#3B82F6", "#93C5FD"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 0,
      hover: { size: 5 },
    },
    xaxis: {
      categories: labels[timeRange],
      labels: {
        show: true,
        style: { colors: "#6B7280", fontSize: "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
    },
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const day = labels[timeRange][dataPointIndex];
        const shiftList = detailedData[dataPointIndex].shifts;
        const content = shiftList.length > 0
          ? shiftList.join(", ")
          : "Không đăng ký ca";

        return `<div class="p-2">
          <strong>${day}</strong><br/>
          ${content}
        </div>`;
      },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Số ca làm</h3>
          <p className="mt-1 text-gray-500 text-sm">Tổng số ca làm theo ngày</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("3m")}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === "3m" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Last 3 months
          </button>
          <button
            onClick={() => setTimeRange("30d")}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === "30d" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Last 30 days
          </button>
          <button
            onClick={() => setTimeRange("7d")}
            className={`px-3 py-1 rounded-md text-sm ${timeRange === "7d" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}
          >
            Last 7 days
          </button>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}
