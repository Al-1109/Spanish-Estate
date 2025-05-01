'use client';

import React, { createContext, useContext, useState } from 'react';
import { FiX, FiCheck, FiInfo, FiAlertTriangle } from 'react-icons/fi';

// Типы для уведомлений
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

interface ToastContextProps {
  showToast: (props: Omit<ToastProps, 'id'>) => void;
  hideToast: (id: string) => void;
}

// Создаем контекст
const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Хук для использования Toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Компонент для отображения одного уведомления
const Toast: React.FC<ToastProps & { onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck className="text-green-500" size={20} />;
      case 'error':
        return <FiX className="text-red-500" size={20} />;
      case 'info':
        return <FiInfo className="text-blue-500" size={20} />;
      case 'warning':
        return <FiAlertTriangle className="text-yellow-500" size={20} />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`flex items-center p-4 mb-3 rounded-lg shadow-md border ${getBgColor()} animate-fade-in`}>
      <div className="mr-3">
        {getIcon()}
      </div>
      <div className="flex-1">
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="p-1 ml-3 rounded-full hover:bg-gray-200 transition-colors"
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

// Провайдер для управления уведомлениями
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = ({ message, type, duration = 3000 }: Omit<ToastProps, 'id'>) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    // Автоматически скрываем уведомление через указанное время
    setTimeout(() => {
      hideToast(id);
    }, duration);
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-5 right-5 z-50 flex flex-col items-end">
        {toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            {...toast} 
            onClose={() => hideToast(toast.id)} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider; 