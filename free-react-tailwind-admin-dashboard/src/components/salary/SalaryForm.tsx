import React, { useState, useEffect } from 'react';
import { X, Save, DollarSign } from 'lucide-react';
import { SalaryBackendResponse, SalaryCreate, SalaryUpdate } from '../../types/salary';

interface SalaryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SalaryCreate | SalaryUpdate) => void;
  salary?: SalaryBackendResponse | null;
  loading?: boolean;
}

const SalaryForm: React.FC<SalaryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  salary,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    employee_id: 0,      // Backend field name
    salary: 0,           // Backend field name (lương cơ bản)
    allowance: 0,        // Phụ cấp
    reward: 0,           // Backend field name (thưởng)
    detail: ''           // Backend field name (ghi chú)
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (salary) {
      setFormData({
        employee_id: salary.employee_id,
        salary: salary.salary,
        allowance: salary.allowance || 0,
        reward: salary.reward || 0,
        detail: salary.detail || ''
      });
    } else {
      setFormData({
        employee_id: 0,
        salary: 0,
        allowance: 0,
        reward: 0,
        detail: ''
      });
    }
    setErrors({});
  }, [salary, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!salary && formData.employee_id <= 0) {
      newErrors.employee_id = 'Vui lòng chọn nhân viên';
    }
    if (formData.salary <= 0) {
      newErrors.salary = 'Lương cơ bản phải lớn hơn 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (salary) {
      // Update mode
      const updateData: SalaryUpdate = {
        salary: formData.salary,
        allowance: formData.allowance,
        reward: formData.reward,
        detail: formData.detail
      };
      onSubmit(updateData);
    } else {
      // Create mode
      const createData: SalaryCreate = {
        employee_id: formData.employee_id,
        salary: formData.salary,
        allowance: formData.allowance,
        reward: formData.reward,
        detail: formData.detail
      };
      onSubmit(createData);
    }
  };

  const calculateTotal = () => {
    return formData.salary + formData.allowance + formData.reward;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <DollarSign className="h-6 w-6 mr-2 text-green-600" />
            {salary ? 'Cập nhật lương' : 'Thêm lương mới'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Employee ID (only for create mode) */}
          {!salary && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID Nhân viên *
              </label>
              <input
                type="number"
                value={formData.employee_id}
                onChange={(e) => setFormData(prev => ({ ...prev, employee_id: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.employee_id ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nhập ID nhân viên"
              />
              {errors.employee_id && <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>}
            </div>
          )}

          {/* Salary components */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lương cơ bản *
              </label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: parseInt(e.target.value) || 0 }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.salary ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phụ cấp
              </label>
              <input
                type="number"
                value={formData.allowance}
                onChange={(e) => setFormData(prev => ({ ...prev, allowance: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thưởng
              </label>
              <input
                type="number"
                value={formData.reward}
                onChange={(e) => setFormData(prev => ({ ...prev, reward: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Total calculation */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Tổng lương:</span>
              <span className="text-lg font-bold text-green-600">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(calculateTotal())}
              </span>
            </div>
          </div>

          {/* Detail/Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chi tiết/Ghi chú
            </label>
            <textarea
              value={formData.detail}
              onChange={(e) => setFormData(prev => ({ ...prev, detail: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Nhập chi tiết hoặc ghi chú (không bắt buộc)"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {salary ? 'Cập nhật' : 'Thêm mới'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryForm;
