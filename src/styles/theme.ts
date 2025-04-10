import { ThemeColors } from './types';

// سیستم طراحی - برگرفته از فیگما
export const theme = {
  colors: {
    primary: {
      500: '#FF5A00', // رنگ اصلی
      400: '#FF7A30', // رنگ اصلی روشن‌تر
    },
    secondary: {
      500: '#2B2B2B', // رنگ ثانویه
      400: '#3E3E3E',
      300: '#505050',
      200: '#757575',
      100: '#A0A0A0',
    },
    success: {
      500: '#4CAF50', // رنگ موفقیت
      400: '#66BB6A',
      300: '#81C784',
      200: '#A5D6A7',
      100: '#C8E6C9',
    },
    warning: {
      500: '#FFC107', // رنگ هشدار
      400: '#FFCA28',
      300: '#FFD54F',
      200: '#FFE082',
      100: '#FFECB3',
    },
    error: {
      500: '#F44336', // رنگ خطا
      400: '#EF5350',
      300: '#E57373',
      200: '#EF9A9A',
      100: '#FFCDD2',
    },
    neutral: {
      900: '#212121', // تیره‌ترین
      800: '#424242',
      700: '#616161',
      600: '#757575',
      500: '#9E9E9E',
      400: '#BDBDBD',
      300: '#E0E0E0',
      200: '#EEEEEE',
      100: '#F5F5F5',
      50: '#FAFAFA', // روشن‌ترین
    }
  } as ThemeColors,
  typography: {
    fontFamily: 'Vazirmatn, "Segoe UI", Tahoma, sans-serif',
    fontSizes: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  boxShadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
}; 