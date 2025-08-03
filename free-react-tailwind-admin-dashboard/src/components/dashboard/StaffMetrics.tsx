import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import {
  CalenderIcon,
  UserCircleIcon,
  GridIcon,
  BoxIconLine,
} from "../../icons";

interface StaffMetricsData {
  workDays: {
    current: number;
    total: number;
    change: number;
  };
  workHours: {
    current: number;
    total: number;
    percentage: number;
  };
  leaveDays: {
    remaining: number;
    used: number;
    total: number;
  };
  salary: {
    current: number;
    status: string;
  };
}

export default function StaffMetrics() {
  const { accessToken } = useContext(AppContext)!;
  const [metrics] = useState<StaffMetricsData>({
    workDays: {
      current: 22,
      total: 30,
      change: 2
    },
    workHours: {
      current: 176,
      total: 184,
      percentage: 95.7
    },
    leaveDays: {
      remaining: 8,
      used: 4,
      total: 12
    },
    salary: {
      current: 12000000,
      status: "Tạm tính"
    }
  });

  // TODO: Fetch real data from API
  useEffect(() => {
    if (accessToken) {
      // Fetch staff metrics from API
      console.log("Fetching staff metrics...");
    }
  }, [accessToken]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Work Days */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
            <CalenderIcon className="text-blue-600 size-6" />
          </div>
          {metrics.workDays.change > 0 && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{metrics.workDays.change} tuần này
            </span>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {metrics.workDays.current}/{metrics.workDays.total}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Ngày công</p>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(metrics.workDays.current / metrics.workDays.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Work Hours */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
            <UserCircleIcon className="text-green-600 size-6" />
          </div>
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {metrics.workHours.percentage}%
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {metrics.workHours.current}h
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Giờ làm việc / {metrics.workHours.total}h
          </p>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${metrics.workHours.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Leave Days */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl">
            <GridIcon className="text-orange-600 size-6" />
          </div>
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
            Còn {metrics.leaveDays.remaining}
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-2xl font-bold text-gray-900">
            {metrics.leaveDays.used}/{metrics.leaveDays.total}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Ngày nghỉ phép</p>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(metrics.leaveDays.used / metrics.leaveDays.total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Salary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl">
            <BoxIconLine className="text-purple-600 size-6" />
          </div>
          <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
            {metrics.salary.status}
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold text-gray-900">
            {formatCurrency(metrics.salary.current)}
          </h3>
          <p className="text-sm text-gray-500 mt-1">Lương tháng này</p>
          <p className="text-xs text-gray-400 mt-2">
            Chưa bao gồm thưởng và phụ cấp
          </p>
        </div>
      </div>
    </div>
  );
}
