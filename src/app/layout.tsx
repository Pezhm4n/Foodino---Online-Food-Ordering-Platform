import React from 'react';
import { Metadata } from 'next';
import Layout from '@/components/layout/Layout';
import { vazirmatn } from './fonts';

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
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  );
} 