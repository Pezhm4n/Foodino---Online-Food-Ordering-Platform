"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { createPortal } from "react-dom";
import { Toaster } from "react-hot-toast";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  CloseIcon,
} from "@/components/ui/FoodVisuals";

const slideIn = keyframes`
  from {
    transform: translate(-50%, 14px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translate(-50%, 0);
    opacity: 1;
  }
  to {
    transform: translate(-50%, 14px);
    opacity: 0;
  }
`;

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastInfo {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const ToastBase = styled.div<{ $type: ToastType; $visible: boolean }>`
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.85rem 1.25rem;
  min-width: 260px;
  max-width: 90vw;
  border-radius: ${(props) => props.theme.borderRadius.xl};
  color: #faf6f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  box-shadow: 0 20px 36px -10px rgba(22, 18, 15, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.12);
  z-index: 9999;
  direction: rtl;
  animation: ${(props) => (props.$visible ? slideIn : slideOut)} 200ms
    cubic-bezier(0.16, 1, 0.3, 1) forwards;

  background-color: ${(props) => {
    switch (props.$type) {
      case "success":
        return props.theme.colors.success[600];
      case "error":
        return props.theme.colors.error[600];
      case "warning":
        return props.theme.colors.warning[600];
      case "info":
      default:
        return props.theme.colors.secondary[900];
    }
  }};
`;

const ToastIconWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const ToastMessage = styled.div`
  flex: 1;
  font-size: 0.9rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  padding: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Toast: React.FC<{ toast: ToastInfo; onClose: () => void }> = ({
  toast,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 200);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const renderIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <ToastIconWrap>
            <CheckCircleIcon size={18} />
          </ToastIconWrap>
        );
      case "error":
      case "warning":
        return (
          <ToastIconWrap>
            <AlertCircleIcon size={18} />
          </ToastIconWrap>
        );
      case "info":
      default:
        return (
          <ToastIconWrap>
            <InfoIcon size={18} />
          </ToastIconWrap>
        );
    }
  };

  return (
    <ToastBase $type={toast.type} $visible={visible}>
      {renderIcon()}
      <ToastMessage>{toast.message}</ToastMessage>
      <CloseButton
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 200);
        }}
        aria-label="بستن پیام"
      >
        <CloseIcon size={15} />
      </CloseButton>
    </ToastBase>
  );
};

const ToastContainer: React.FC<{
  toasts: ToastInfo[];
  removeToast: (id: string) => void;
}> = ({ toasts, removeToast }) => {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>,
    document.body
  );
};

export const ToastContext = React.createContext<{
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}>({
  addToast: () => {},
  removeToast: () => {},
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const addToast = (
    message: string,
    type: ToastType = "info",
    duration = 3000
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      <Toaster
        position="top-center"
        containerStyle={{
          top: 24,
          zIndex: 99999,
        }}
        toastOptions={{
          duration: 3600,
          style: {
            background: "#16120F",
            color: "#FAF6F0",
            fontFamily: "var(--font-vazirmatn), system-ui, sans-serif",
            fontSize: "0.875rem",
            fontWeight: 600,
            padding: "12px 16px",
            borderRadius: "14px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 16px 32px -8px rgba(22, 18, 15, 0.3)",
          },
          success: {
            iconTheme: {
              primary: "#22C55E",
              secondary: "#16120F",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#16120F",
            },
          },
        }}
      />
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastProvider;
