"use client";

import React, { ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { theme } from '../../styles/theme';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/components/common/Toast';
import { GlobalStyle } from '@/styles/GlobalStyle';

// استایل‌های کامپوننت Main
const Main = styled.main`
  min-height: 100vh;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Header />
            <Main>{children}</Main>
            <Footer />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Layout; 
