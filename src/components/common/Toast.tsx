"use client";

import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { createPortal } from 'react-dom';
import { Toaster } from 'react-hot-toast';

// انیمیشن‌های Toast
const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

// نوع‌های Toast
export type ToastType = 'success' | 'error' | 'info' | 'warning';

// انواع اطلاعات Toast
export interface ToastInfo {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// مؤلفه پایه Toast
const ToastBase = styled.div<{ $type: ToastType; $visible: boolean }>`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 1.5rem;
  min-width: 250px;
  border-radius: ${props => props.theme.borderRadius.md};
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: ${props => props.theme.boxShadow.md};
  z-index: 9999;
  animation: ${props => (props.$visible ? slideIn : slideOut)} 0.3s ease forwards;
  
  background-color: ${props => {
    switch (props.$type) {
      case 'success': return props.theme.colors.success[500];
      case 'error': return props.theme.colors.error[500];
      case 'warning': return props.theme.colors.warning[500];
      case 'info': return props.theme.colors.primary[500];
      default: return props.theme.colors.primary[500];
    }
  }};
`;

const ToastIcon = styled.div`
  margin-right: 0.75rem;
  font-size: 1.2rem;
`;

const ToastMessage = styled.div`
  flex: 1;
  font-size: ${props => props.theme.typography.fontSizes.md};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: 0.75rem;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

// کامپوننت Toast
const Toast: React.FC<{ toast: ToastInfo; onClose: () => void }> = ({ toast, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  // بستن اتوماتیک Toast
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      const animationDuration = 300; // میلی‌ثانیه
      setTimeout(onClose, animationDuration);
    }, toast.duration || 3000);
    
    return () => clearTimeout(timer);
  }, [toast, onClose]);
  
  // آیکون متناسب با نوع Toast
  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <ToastIcon>✓</ToastIcon>;
      case 'error':
        return <ToastIcon>✗</ToastIcon>;
      case 'warning':
        return <ToastIcon>⚠</ToastIcon>;
      case 'info':
        return <ToastIcon>ℹ</ToastIcon>;
      default:
        return null;
    }
  };
  
  return (
    <ToastBase $type={toast.type} $visible={visible}>
      {renderIcon()}
      <ToastMessage>{toast.message}</ToastMessage>
      <CloseButton onClick={() => { setVisible(false); setTimeout(onClose, 300); }}>
        ×
      </CloseButton>
    </ToastBase>
  );
};

// کانتینر برای نمایش چندین Toast
const ToastContainer: React.FC<{ toasts: ToastInfo[]; removeToast: (id: string) => void }> = ({ 
  toasts,
  removeToast 
}) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  if (!isBrowser) {
    return null;
  }

  return isBrowser ? createPortal(
    <>
      {toasts.map(toast => (
        <Toast 
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>,
    document.body
  ) : null;
};

// Context برای مدیریت Toast‌ها
export const ToastContext = React.createContext<{
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}>({
  addToast: () => {},
  removeToast: () => {},
});

// Provider برای ToastContext
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  
  // اضافه کردن یک Toast جدید
  const addToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };
  
  // حذف یک Toast
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };
  
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            fontFamily: 'Vazirmatn, system-ui, sans-serif',
            fontSize: '0.875rem',
            padding: '12px',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook برای استفاده از Toast در کامپوننت‌ها
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider; 