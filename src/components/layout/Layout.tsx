"use client";

import React, { ReactNode, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { theme } from '../../styles/theme';
import { createGlobalStyle } from 'styled-components';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';

// تعریف استایل‌های سراسری
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  
  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
    font-family: ${theme.typography.fontFamily};
    background-color: ${theme.colors.neutral[50]};
    direction: rtl;
  }
  
  a {
    color: inherit;
    text-decoration: none;
  }
`;

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
      <AuthProvider>
        <CartProvider>
          <GlobalStyle />
          <Header />
          <Main>{children}</Main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Layout; 