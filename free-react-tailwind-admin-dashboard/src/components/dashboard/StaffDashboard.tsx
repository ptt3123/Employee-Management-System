import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import StaffMetrics from "../dashboard/StaffMetrics";
import AttendanceChart from "../dashboard/AttendanceChart";
import RecentActivities from "../dashboard/RecentActivities";
import PersonalGoals from "../dashboard/PersonalGoals";
import PageMeta from "../common/PageMeta";

export default function StaffDashboard() {
  const { accessToken } = useContext(AppContext)!;
  const [staffInfo] = useState({
    name: "Nguyễn Văn A",
    position: "Nhân viên IT",
    department: "Phòng Công nghệ thông tin"
  });

  // TODO: Use accessToken to fetch staff data
  console.log("Staff dashboard loaded with token:", accessToken);

  return (
    <>
      <PageMeta
        title="Dashboard Nhân viên | Hệ thống quản lý"
        description="Trang dashboard cá nhân cho nhân viên"
      />
      
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold">Chào mừng trở lại, {staffInfo.name}! 👋</h1>
          <p className="mt-2 opacity-90">{staffInfo.position} - {staffInfo.department}</p>
          <p className="mt-1 text-sm opacity-80">Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>

        {/* Metrics Cards */}
        <StaffMetrics />

        {/* Charts and Goals Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Attendance Chart - Takes 2 columns */}
          <div className="xl:col-span-2">
            <AttendanceChart />
          </div>
          
          {/* Personal Goals - Takes 1 column */}
          <div className="xl:col-span-1">
            <PersonalGoals />
          </div>
        </div>

        {/* Recent Activities */}
        <RecentActivities />
      </div>
    </>
  );
}