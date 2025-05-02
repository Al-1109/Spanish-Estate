import { useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

interface ToastState {
  message: string;
  type: ToastType;
  duration: number;
  visible: boolean;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    duration: 3000,
    visible: false
  });

  const showToast = useCallback((message: string, options?: ToastOptions) => {
    setToast({
      message,
      type: options?.type || 'info',
      duration: options?.duration || 3000,
      visible: true
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prevToast => ({ ...prevToast, visible: false }));
  }, []);

  return {
    toast,
    showToast,
    hideToast
  };
}; 