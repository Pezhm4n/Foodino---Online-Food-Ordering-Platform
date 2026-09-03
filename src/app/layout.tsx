import React from 'react';
import { Metadata } from 'next';
import Layout from '@/components/layout/Layout';
import StyledComponentsRegistry from '@/styles/StyledComponentsRegistry';
import { vazirmatn } from '@/app/fonts';
import { requireClaims } from '@/infrastructure/supabase/server';
import { getServerEnv } from '@/infrastructure/config/server-env';

const env = getServerEnv();
export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: 'فودینو | سفارش آنلاین غذا',
  description: 'سفارش آنلاین غذا از بهترین رستوران‌های شهر با فودینو',
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'فودینو',
    title: 'فودینو | سفارش آنلاین غذا',
    description: 'سفارش آنلاین غذا از رستوران‌های فعال فودینو',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const claims = await requireClaims();
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.className} ${vazirmatn.variable}`}>
        <StyledComponentsRegistry>
          <Layout isAuthenticated={claims !== null}>{children}</Layout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
} 
