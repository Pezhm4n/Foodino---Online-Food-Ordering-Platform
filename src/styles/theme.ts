import { ThemeColors } from './types';
import { motionTokens } from './motion';

// تعریف رنگ‌ها — پالت ادیتوریال گرم و اشتهابرانگیز (Warm Culinary Editorial)
const colors: ThemeColors = {
  primary: {
    '50': '#FEF4F0',
    '100': '#FDE5DC',
    '200': '#FAC9B8',
    '300': '#F49F83',
    '400': '#EA6A47',
    '500': '#D9381E',
    '600': '#B82B14',
    '700': '#96210F',
    '800': '#7A1D10',
    '900': '#5E180E',
    main: '#D9381E',
  },
  secondary: {
    '50': '#F9F6F2',
    '100': '#F1ECE4',
    '200': '#E3DBD0',
    '300': '#CCC0B1',
    '400': '#A69786',
    '500': '#7D6F61',
    '600': '#5E5246',
    '700': '#433930',
    '800': '#28211C',
    '900': '#16120F',
    main: '#16120F',
  },
  success: {
    '50': '#F0FDF4',
    '100': '#DCFCE7',
    '200': '#BBF7D0',
    '300': '#86EFAC',
    '400': '#4ADE80',
    '500': '#1E9E52',
    '600': '#15803D',
    '700': '#126932',
    '800': '#14532D',
    '900': '#0F3F22',
  },
  error: {
    '50': '#FEF2F2',
    '100': '#FEE2E2',
    '200': '#FECACA',
    '300': '#FCA5A5',
    '400': '#F87171',
    '500': '#DC2626',
    '600': '#B91C1C',
    '700': '#991B1B',
    '800': '#7F1D1D',
    '900': '#631717',
  },
  warning: {
    '50': '#FFFBEB',
    '100': '#FEF3C7',
    '200': '#FDE68A',
    '300': '#FCD34D',
    '400': '#FBBF24',
    '500': '#E59A11',
    '600': '#C67D0A',
    '700': '#9E5F08',
    '800': '#7C4A0A',
    '900': '#653B0B',
  },
  neutral: {
    '50': '#FAF6F0',
    '100': '#F3ECE2',
    '200': '#E6DDD0',
    '300': '#D5C9B8',
    '400': '#9E907F',
    '500': '#6E6255',
    '600': '#52483E',
    '700': '#3B332B',
    '800': '#241E1A',
    '900': '#16120F',
  },
  gray: {
    '50': '#FAF6F0',
    '100': '#F3ECE2',
    '200': '#E6DDD0',
    '300': '#D5C9B8',
    '400': '#9E907F',
    '500': '#6E6255',
    '600': '#52483E',
    '700': '#3B332B',
    '800': '#241E1A',
    '900': '#16120F',
  }
};

const shadowTokens = {
  xs: '0 1px 2px 0 rgba(22, 18, 15, 0.04)',
  sm: '0 2px 6px -1px rgba(22, 18, 15, 0.05), 0 1px 2px -1px rgba(22, 18, 15, 0.03)',
  md: '0 6px 16px -4px rgba(22, 18, 15, 0.07), 0 2px 4px -2px rgba(22, 18, 15, 0.04)',
  lg: '0 14px 28px -6px rgba(22, 18, 15, 0.09), 0 4px 8px -3px rgba(22, 18, 15, 0.04)',
  xl: '0 24px 48px -12px rgba(22, 18, 15, 0.14), 0 8px 16px -6px rgba(22, 18, 15, 0.05)',
  subtle: '0 2px 12px rgba(22, 18, 15, 0.05)',
  cardHover: '0 20px 36px -10px rgba(22, 18, 15, 0.12), 0 4px 10px -2px rgba(22, 18, 15, 0.04)',
  primaryGlow: '0 10px 24px -6px rgba(217, 56, 30, 0.34)',
  brand: '0 10px 24px -6px rgba(217, 56, 30, 0.34)',
};

// تعریف تم
export const theme = {
  colors,
  typography: {
    fontFamily: 'var(--font-vazirmatn)',
    fontSizes: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      loose: 1.75,
    },
  },
  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    '2xl': '1.375rem', // 22px
    '3xl': '1.75rem', // 28px
    full: '9999px',
  },
  boxShadow: shadowTokens,
  shadows: shadowTokens,
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem', // 2px
    1: '0.25rem', // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem', // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem', // 12px
    3.5: '0.875rem', // 14px
    4: '1rem', // 16px
    5: '1.25rem', // 20px
    6: '1.5rem', // 24px
    7: '1.75rem', // 28px
    8: '2rem', // 32px
    9: '2.25rem', // 36px
    10: '2.5rem', // 40px
    11: '2.75rem', // 44px
    12: '3rem', // 48px
    14: '3.5rem', // 56px
    16: '4rem', // 64px
    20: '5rem', // 80px
    24: '6rem', // 96px
    28: '7rem', // 112px
    32: '8rem', // 128px
    36: '9rem', // 144px
    40: '10rem', // 160px
    44: '11rem', // 176px
    48: '12rem', // 192px
    52: '13rem', // 208px
    56: '14rem', // 224px
    60: '15rem', // 240px
    64: '16rem', // 256px
    72: '18rem', // 288px
    80: '20rem', // 320px
    96: '24rem', // 384px
  },
  zIndex: {
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
  },
  motion: motionTokens,
};
