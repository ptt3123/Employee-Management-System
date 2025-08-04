import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { 
  checkin, 
  checkout, 
  createDtkRegisForm,
  checkIfRegisteredDtk,
  getMyDtkHistory,
  deleteRegisteredScheduleNextWeek
} from '../api/datetimekeepingApi';

const TimeKeepingPage: React.FC = () => {
  const { accessToken } = useContext(AppContext)!;
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  // Check registration status
  const checkRegistrationStatus = async () => {
    if (!accessToken) return;
    
    try {
      const response = await checkIfRegisteredDtk(accessToken);
      setIsRegistered(response.message === "True");
      console.log("📋 Registration status:", response.message);
    } catch (error) {
      console.error("❌ Kiểm tra đăng ký thất bại:", error);
    }
  };

  // Handle check-in
  const handleCheckIn = async () => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }
    
    setLoading(true);
    try {
      const response = await checkin(accessToken);
      console.log("✅ Check-in thành công:", response);
      setCheckInTime(new Date().toISOString());
      alert("Check-in thành công!");
    } catch (error: any) {
      console.error("❌ Check-in thất bại:", error);
      alert(`Check-in thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle check-out
  const handleCheckOut = async () => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }
    
    setLoading(true);
    try {
      const response = await checkout(accessToken);
      console.log("✅ Check-out thành công:", response);
      setCheckOutTime(new Date().toISOString());
      alert("Check-out thành công!");
    } catch (error: any) {
      console.error("❌ Check-out thất bại:", error);
      alert(`Check-out thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Register schedule for next week
  const handleRegisterSchedule = async () => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }

    // Create sample schedule for next week - API expects array directly
    const scheduleData = [
      {
        date: "2025-08-11", // Monday next week
        shift_start: "08:00",
        shift_end: "17:00"
      },
      {
        date: "2025-08-12", // Tuesday next week
        shift_start: "08:00", 
        shift_end: "17:00"
      },
      {
        date: "2025-08-13", // Wednesday next week
        shift_start: "08:00",
        shift_end: "17:00"
      }
    ];
    
    setLoading(true);
    try {
      const response = await createDtkRegisForm(accessToken, scheduleData);
      console.log("✅ Đăng ký lịch thành công:", response);
      alert("Đăng ký lịch làm việc thành công!");
      await checkRegistrationStatus();
    } catch (error: any) {
      console.error("❌ Đăng ký lịch thất bại:", error);
      alert(`Đăng ký lịch thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete registered schedule
  const handleDeleteSchedule = async () => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }
    
    if (!confirm("Bạn có chắc muốn xóa lịch đăng ký?")) return;
    
    setLoading(true);
    try {
      const response = await deleteRegisteredScheduleNextWeek(accessToken);
      console.log("✅ Xóa lịch thành công:", response);
      alert("Xóa lịch đăng ký thành công!");
      await checkRegistrationStatus();
    } catch (error: any) {
      console.error("❌ Xóa lịch thất bại:", error);
      alert(`Xóa lịch thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get my DTK history
  const handleGetHistory = async () => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập lại!");
      return;
    }
    
    setLoading(true);
    try {
      const response = await getMyDtkHistory(accessToken, "2025", "08");
      console.log("📈 Lịch sử chấm công:", response);
      setHistory(response.data || []);
      alert("Lấy lịch sử thành công! Kiểm tra console để xem dữ liệu.");
    } catch (error: any) {
      console.error("❌ Lấy lịch sử thất bại:", error);
      alert(`Lấy lịch sử thất bại: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (iso: string | null) => {
    if (!iso) return "--:--";
    const date = new Date(iso);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (accessToken) {
      checkRegistrationStatus();
    }
  }, [accessToken]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🕐 Time Keeping Management</h1>
      
      {!accessToken && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          ⚠️ Vui lòng đăng nhập để sử dụng chức năng chấm công!
        </div>
      )}

      {/* Registration Status */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📋 Trạng thái đăng ký</h2>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isRegistered 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isRegistered ? '✅ Đã đăng ký' : '❌ Chưa đăng ký'}
          </span>
          <button
            onClick={checkRegistrationStatus}
            disabled={loading || !accessToken}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            🔄 Kiểm tra lại
          </button>
        </div>
      </div>

      {/* Check In/Out */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🟢 Check In</h3>
          <p className="text-gray-600 mb-4">
            Thời gian: <span className="font-mono">{formatTime(checkInTime)}</span>
          </p>
          <button
            onClick={handleCheckIn}
            disabled={loading || !accessToken || checkInTime !== null}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? '⏳ Đang xử lý...' : checkInTime ? '✅ Đã check-in' : '🟢 Check In'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">🔴 Check Out</h3>
          <p className="text-gray-600 mb-4">
            Thời gian: <span className="font-mono">{formatTime(checkOutTime)}</span>
          </p>
          <button
            onClick={handleCheckOut}
            disabled={loading || !accessToken || checkOutTime !== null}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? '⏳ Đang xử lý...' : checkOutTime ? '✅ Đã check-out' : '🔴 Check Out'}
          </button>
        </div>
      </div>

      {/* Schedule Management */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">📅 Quản lý lịch làm việc</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleRegisterSchedule}
            disabled={loading || !accessToken || isRegistered}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            📝 Đăng ký lịch tuần tới
          </button>
          
          <button
            onClick={handleDeleteSchedule}
            disabled={loading || !accessToken || !isRegistered}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            🗑️ Xóa lịch đăng ký
          </button>
        </div>
      </div>

      {/* History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">📈 Lịch sử chấm công</h2>
        <button
          onClick={handleGetHistory}
          disabled={loading || !accessToken}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 mb-4"
        >
          📊 Lấy lịch sử tháng 8/2025
        </button>
        
        {history.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Dữ liệu lịch sử:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(history, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* API Status */}
      <div className="mt-6 text-center text-gray-500">
        <p>🔧 Tất cả API đã được tích hợp và sẵn sàng sử dụng!</p>
        <p>📋 Kiểm tra Console để xem log chi tiết của các API calls.</p>
      </div>
    </div>
  );
};

export default TimeKeepingPage;
