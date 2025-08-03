import { useState } from "react";

interface Activity {
  id: number;
  type: "attendance" | "leave" | "salary" | "task" | "notification";
  title: string;
  description: string;
  time: string;
  status?: "success" | "pending" | "warning" | "info";
  icon: string;
  color: string;
}

export default function RecentActivities() {
  const [activities] = useState<Activity[]>([
    {
      id: 1,
      type: "leave",
      title: "Đơn nghỉ phép được duyệt",
      description: "Đơn xin nghỉ ngày 15/08/2025 đã được Manager phê duyệt",
      time: "2 giờ trước",
      status: "success",
      icon: "✅",
      color: "text-green-600"
    },
    {
      id: 2,
      type: "task",
      title: "Hoàn thành task #1245",
      description: "Cập nhật giao diện trang dashboard đã hoàn thành",
      time: "4 giờ trước",
      status: "success",
      icon: "🎯",
      color: "text-blue-600"
    },
    {
      id: 3,
      type: "attendance",
      title: "Chấm công hôm nay",
      description: "Chấm công vào lúc 08:15 AM - Đúng giờ",
      time: "Hôm nay",
      status: "success",
      icon: "⏰",
      color: "text-green-600"
    },
    {
      id: 4,
      type: "leave",
      title: "Tạo đơn xin nghỉ",
      description: "Đã tạo đơn xin nghỉ ngày 20/08/2025 - Chờ duyệt",
      time: "1 ngày trước",
      status: "pending",
      icon: "📝",
      color: "text-yellow-600"
    },
    {
      id: 5,
      type: "salary",
      title: "Bảng lương tháng 7",
      description: "Bảng lương tháng 7/2025 đã được cập nhật",
      time: "3 ngày trước",
      status: "info",
      icon: "💰",
      color: "text-purple-600"
    },
    {
      id: 6,
      type: "notification",
      title: "Thông báo nghỉ lễ",
      description: "Thông báo lịch nghỉ lễ Quốc khánh 2/9",
      time: "1 tuần trước",
      status: "info",
      icon: "🔔",
      color: "text-gray-600"
    }
  ]);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "warning":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "attendance": return "Chấm công";
      case "leave": return "Nghỉ phép";
      case "salary": return "Lương";
      case "task": return "Công việc";
      case "notification": return "Thông báo";
      default: return "Khác";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
          <p className="text-sm text-gray-500 mt-1">Theo dõi các hoạt động mới nhất của bạn</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Xem tất cả
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg">{activity.icon}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    {activity.status && (
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(activity.status)}`}>
                        {getTypeLabel(activity.type)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {activity.description}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Thao tác nhanh</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button className="flex flex-col items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-sm">📄</span>
            </div>
            <span className="text-xs text-blue-700 font-medium">Tạo đơn nghỉ</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-sm">⏰</span>
            </div>
            <span className="text-xs text-green-700 font-medium">Chấm công</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-sm">💰</span>
            </div>
            <span className="text-xs text-purple-700 font-medium">Bảng lương</span>
          </button>

          <button className="flex flex-col items-center gap-2 p-3 bg-orange-50 hover:bg-orange-100 rounded-xl transition-colors group">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-sm">👤</span>
            </div>
            <span className="text-xs text-orange-700 font-medium">Hồ sơ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
