"use client";

import React, { ReactNode } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import { theme } from '../../styles/theme';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/components/common/Toast';
import { GlobalStyle } from '@/styles/GlobalStyle';

// استایل‌های کامپوننت Main
const Main = styled.main`
  min-height: 100vh;
`;

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
}

const Layout = ({ children, isAuthenticated }: LayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <CartProvider>
        <ToastProvider>
          <Header isAuthenticated={isAuthenticated} />
          <Main>{children}</Main>
          <Footer />
        </ToastProvider>
      </CartProvider>
    </ThemeProvider>
  );
};

export default Layout; 
