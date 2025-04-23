import React from 'react';
import { Metadata } from 'next';
import Layout from '@/components/layout/Layout';
import '@/styles/fonts.css';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'فودینو | سفارش آنلاین غذا',
  description: 'سفارش آنلاین غذا از بهترین رستوران‌های شهر با فودینو',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="">
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
} 