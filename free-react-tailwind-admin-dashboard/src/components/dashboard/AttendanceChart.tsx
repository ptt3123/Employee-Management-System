import { useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function AttendanceChart() {
  const [timeRange, setTimeRange] = useState("30d");

  // Generate mock attendance data
  const generateAttendanceData = (days: number) => {
    const statuses = ["present", "absent", "late"];
    const data = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      
      // Weekend logic
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      data.push({
        x: date.getTime(),
        y: isWeekend ? null : Math.random() > 0.8 ? (Math.random() > 0.5 ? 2 : 1) : 0,
        status: isWeekend ? "weekend" : statuses[Math.random() > 0.8 ? (Math.random() > 0.5 ? 2 : 1) : 0],
        date: date.toLocaleDateString('vi-VN'),
        checkIn: !isWeekend ? (Math.random() > 0.8 ? "08:45" : "08:15") : null
      });
    }
    
    return data;
  };

  const getDaysCount = () => {
    switch (timeRange) {
      case "7d": return 7;
      case "30d": return 30;
      case "90d": return 90;
      default: return 30;
    }
  };

  const attendanceData = generateAttendanceData(getDaysCount());

  const series = [{
    name: "Chấm công",
    data: attendanceData.map(item => ({
      x: item.x,
      y: item.y,
      status: item.status,
      date: item.date,
      checkIn: item.checkIn
    }))
  }];

  const options: ApexOptions = {
    chart: {
      type: "scatter",
      height: 350,
      toolbar: {
        show: false
      },
      background: "transparent"
    },
    colors: ["#10B981", "#EF4444", "#F59E0B"],
    xaxis: {
      type: "datetime",
      labels: {
        format: "dd/MM"
      }
    },
    yaxis: {
      show: false,
      min: -0.5,
      max: 2.5
    },
    grid: {
      show: true,
      yaxis: {
        lines: {
          show: false
        }
      },
      xaxis: {
        lines: {
          show: true
        }
      }
    },
    markers: {
      size: 8,
      strokeWidth: 2,
      strokeColors: ["#fff"],
      hover: {
        size: 10
      }
    },
    tooltip: {
      custom: function({ seriesIndex, dataPointIndex, w }) {
        const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
        const statusMap = {
          "present": { text: "Đi làm", color: "text-green-600", bg: "bg-green-50" },
          "late": { text: "Muộn", color: "text-yellow-600", bg: "bg-yellow-50" },
          "absent": { text: "Nghỉ", color: "text-red-600", bg: "bg-red-50" },
          "weekend": { text: "Cuối tuần", color: "text-gray-600", bg: "bg-gray-50" }
        };
        
        const status = statusMap[data.status as keyof typeof statusMap] || statusMap.present;
        
        return `
          <div class="bg-white p-3 rounded-lg shadow-lg border">
            <div class="font-medium text-gray-900">${data.date}</div>
            <div class="flex items-center gap-2 mt-1">
              <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.color}">
                ${status.text}
              </span>
              ${data.checkIn ? `<span class="text-sm text-gray-500">• ${data.checkIn}</span>` : ''}
            </div>
          </div>
        `;
      }
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lịch sử chấm công</h3>
          <p className="text-sm text-gray-500 mt-1">Theo dõi tình hình chấm công của bạn</p>
        </div>
        
        <div className="flex gap-2 mt-4 sm:mt-0">
          {[
            { key: "7d", label: "7 ngày" },
            { key: "30d", label: "30 ngày" },
            { key: "90d", label: "3 tháng" }
          ].map(option => (
            <button
              key={option.key}
              onClick={() => setTimeRange(option.key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                timeRange === option.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Đi làm</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Muộn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Nghỉ</span>
        </div>
      </div>

      <div className="relative">
        <Chart options={options} series={series} type="scatter" height={350} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {attendanceData.filter(d => d.status === "present").length}
          </div>
          <div className="text-sm text-gray-500">Ngày đi làm</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {attendanceData.filter(d => d.status === "late").length}
          </div>
          <div className="text-sm text-gray-500">Ngày muộn</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {attendanceData.filter(d => d.status === "absent").length}
          </div>
          <div className="text-sm text-gray-500">Ngày nghỉ</div>
        </div>
      </div>
    </div>
  );
}
