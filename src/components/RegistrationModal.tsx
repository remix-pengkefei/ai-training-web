import React, { useState } from 'react';

interface RegistrationModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; department: string }) => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    department: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证
    const newErrors = {
      name: '',
      department: ''
    };
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = '请输入部门';
    }
    
    setErrors(newErrors);
    
    if (!newErrors.name && !newErrors.department) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: 'name' | 'department', value: string) => {
    setFormData({ ...formData, [field]: value });
    // 清除对应的错误提示
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      
      {/* 模态框内容 */}
      <div className="relative w-full max-w-md animate-slide-up">
        {/* 毛玻璃卡片效果 */}
        <div className="backdrop-blur-md bg-white/90 rounded-3xl shadow-2xl overflow-hidden">
          {/* 顶部装饰条 */}
          <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-600" />
          
          <div className="p-8">
            {/* 标题区域 */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">活动报名</h2>
              <p className="text-sm text-gray-600">先进的人，先看到未来</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 姓名输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  姓名
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                    placeholder="请输入您的姓名"
                  />
                  {/* 装饰图标 */}
                  <div className="absolute right-3 top-3.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.name}</p>
                )}
              </div>
              
              {/* 部门输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  部门
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.department 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all`}
                    placeholder="请输入您所在的部门"
                  />
                  {/* 装饰图标 */}
                  <div className="absolute right-3 top-3.5 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.department}</p>
                )}
              </div>
              
              {/* 按钮组 */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl active:scale-95 transition-all"
                >
                  确认报名
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;