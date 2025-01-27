"use client";
import { NextAppProvider } from '@toolpad/core/nextjs';
import LinearProgress from '@mui/material/LinearProgress';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import React, { useState, useLayoutEffect } from 'react';
import { NAVIGATION } from './components/Navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useLayoutEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <body>
        {isClient ? (
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <React.Suspense fallback={<LinearProgress />}>
              <NextAppProvider navigation={NAVIGATION} branding={null}>
                {children}
              </NextAppProvider>
            </React.Suspense>
          </AppRouterCacheProvider>
        ) : (
          <LinearProgress />
        )}
      </body>
    </html>
  );
}
