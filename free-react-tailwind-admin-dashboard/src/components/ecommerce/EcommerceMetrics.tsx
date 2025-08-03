import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useContext, useEffect, useState } from "react";
import { getAllStaff } from "../../api/staffApi";
import { AppContext } from "../../context/AppContext";

export default function EcommerceMetrics() {
  const appContext = useContext(AppContext);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);

  useEffect(() => {
    const fetchEmployeeStats = async () => {
      if (!appContext?.accessToken) return;
      
      try {
        const response = await getAllStaff(appContext.accessToken, 1, 1000); // Lấy tất cả nhân viên
        const employees = response.employees;
        
        setTotalEmployees(employees.length);
        setActiveEmployees(employees.filter(emp => emp.is_working).length);
      } catch (error) {
        console.error("Error fetching employee stats:", error);
      }
    };

    fetchEmployeeStats();
  }, [appContext?.accessToken]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Tổng số nhân viên */}
      <div className="rounded-2xl border bg-white p-5 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
          <GroupIcon className="text-blue-600 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">Tổng số nhân viên</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
              {totalEmployees}
            </h4>
          </div>
        </div>
      </div>

      {/* Nhân viên đang làm việc */}
      <div className="rounded-2xl border bg-white p-5 dark:bg-white/[0.03]">
        <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl">
          <BoxIconLine className="text-green-600 size-6" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500">Đang làm việc</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
              {activeEmployees}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {activeEmployees}/{totalEmployees}
          </Badge>
        </div>
      </div>
    </div>
  );
}
