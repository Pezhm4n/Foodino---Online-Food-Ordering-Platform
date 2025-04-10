'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import Layout from '@/components/layout/Layout';
import { theme } from '@/styles/theme';
import { ToastProvider } from '@/components/common/Toast';

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <Layout>
          {children}
        </Layout>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default ClientLayout; 