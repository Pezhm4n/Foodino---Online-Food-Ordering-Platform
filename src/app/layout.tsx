import React from 'react';
import { Metadata } from 'next';
import Layout from '@/components/layout/Layout';
import StyledComponentsRegistry from '@/styles/StyledComponentsRegistry';
import { vazirmatn } from '@/app/fonts';
import { requireClaims } from '@/infrastructure/supabase/server';

export const metadata: Metadata = {
  title: 'فودینو | سفارش آنلاین غذا',
  description: 'سفارش آنلاین غذا از بهترین رستوران‌های شهر با فودینو',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const claims = await requireClaims();
  return (
    <html lang="fa" dir="rtl">
      <body className={vazirmatn.variable}>
        <StyledComponentsRegistry>
          <Layout isAuthenticated={claims !== null}>{children}</Layout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
} 
