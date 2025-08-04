import React from 'react';
import { Edit2, Loader2 } from 'lucide-react';
import { SalaryBackendResponse } from '../../types/salary';

interface SalaryTableProps {
  salary: SalaryBackendResponse | null;
  loading: boolean;
  onEdit: (salary: SalaryBackendResponse) => void;
}

const SalaryTable: React.FC<SalaryTableProps> = ({
  salary,
  loading,
  onEdit
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const calculateTotal = (salary: SalaryBackendResponse) => {
    return salary.salary + (salary.allowance || 0) + (salary.reward || 0);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Đang tải thông tin lương...</span>
        </div>
      </div>
    );
  }

  if (!salary) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Chưa có thông tin lương được hiển thị</p>
          <p className="text-sm text-gray-400 mt-2">Vui lòng tìm kiếm theo ID nhân viên</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Thông tin lương nhân viên ID: {salary.employee_id}
          </h3>
          <button
            onClick={() => onEdit(salary)}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b pb-2">Thông tin cơ bản</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">ID Nhân viên</label>
              <p className="mt-1 text-sm text-gray-900">{salary.employee_id}</p>
            </div>

            {salary.employee_name && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Tên nhân viên</label>
                <p className="mt-1 text-sm text-gray-900">{salary.employee_name}</p>
              </div>
            )}

            {salary.employee_email && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">{salary.employee_email}</p>
              </div>
            )}

            {salary.employee_position && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Chức vụ</label>
                <p className="mt-1 text-sm text-gray-900">{salary.employee_position}</p>
              </div>
            )}
          </div>

          {/* Salary Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b pb-2">Chi tiết lương</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Lương cơ bản</label>
              <p className="mt-1 text-sm font-semibold text-gray-900">
                {formatCurrency(salary.salary)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Phụ cấp</label>
              <p className="mt-1 text-sm text-gray-900">
                {formatCurrency(salary.allowance || 0)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500">Thưởng</label>
              <p className="mt-1 text-sm text-gray-900">
                {formatCurrency(salary.reward || 0)}
              </p>
            </div>

            <div className="pt-2 border-t">
              <label className="block text-sm font-medium text-gray-500">Tổng lương</label>
              <p className="mt-1 text-lg font-bold text-green-600">
                {formatCurrency(calculateTotal(salary))}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 border-b pb-2">Thông tin khác</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-500">Ngày tạo</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(salary.create_date)}</p>
            </div>

            {salary.update_date && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Ngày cập nhật</label>
                <p className="mt-1 text-sm text-gray-900">{formatDate(salary.update_date)}</p>
              </div>
            )}

            {salary.detail && (
              <div>
                <label className="block text-sm font-medium text-gray-500">Ghi chú</label>
                <p className="mt-1 text-sm text-gray-900">{salary.detail}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryTable;
