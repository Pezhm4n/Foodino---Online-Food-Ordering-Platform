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
    icon: [{ url: '/icon.svg?v=2', type: 'image/svg+xml' }],
    shortcut: '/icon.svg?v=2',
    apple: '/icon.svg?v=2',
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
    <html lang="fa" dir="rtl" className={vazirmatn.variable} suppressHydrationWarning>
      <body
        className={`${vazirmatn.className} ${vazirmatn.variable}`}
        suppressHydrationWarning
      >
        <StyledComponentsRegistry>
          <Layout isAuthenticated={claims !== null}>{children}</Layout>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
} 
