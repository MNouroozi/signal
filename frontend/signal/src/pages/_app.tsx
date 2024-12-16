import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ThemeProvider, CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app'; // 🔥 این خط اضافه شد
import theme from '../styles/theme';
import '../styles/globals.css';

// ایجاد کش برای Emotion
const cache = createCache({ key: 'css', prepend: true });

function MyApp({ Component, pageProps }: AppProps) { // 🔥 نوع AppProps مشخص شد
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
    
  );
}

export default MyApp;
