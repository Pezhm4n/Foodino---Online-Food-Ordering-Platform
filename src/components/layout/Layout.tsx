"use client";

import React, { ReactNode, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { theme } from '../../styles/theme';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ToastProvider } from '@/components/common/Toast';

// استایل‌های کامپوننت Main
const Main = styled.main`
  min-height: 100vh;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  // اضافه کردن useEffect برای مدیریت کلاس‌های اضافه شده توسط افزونه‌ها به body در سمت کلاینت
  useEffect(() => {
    // اگر کلاس‌های خاصی هست که می‌خواهیم حفظ کنیم، می‌توانیم آنها را به این شکل مدیریت کنیم
    // اینجا ما فقط مطمئن می‌شویم که hydration با سرور مطابقت دارد
    return () => {
      // پاکسازی در زمان unmount (اختیاری)
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Header />
              <Main>{children}</Main>
              <Footer />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default Layout; 