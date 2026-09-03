import { css, keyframes } from 'styled-components';

// توکن‌های زمان‌بندی و انیمیشن مرکزی پروژه
export const motionTokens = {
  duration: {
    fast: '140ms',
    normal: '200ms',
    slow: '280ms',
  },
  durationMs: {
    fast: 140,
    normal: 200,
    slow: 280,
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
    subtleSpring: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  transition: {
    interactive: 'transform 140ms cubic-bezier(0.2, 0, 0, 1), background-color 140ms cubic-bezier(0.2, 0, 0, 1), border-color 140ms cubic-bezier(0.2, 0, 0, 1), box-shadow 140ms cubic-bezier(0.2, 0, 0, 1)',
    button: 'transform 120ms cubic-bezier(0.2, 0, 0, 1), background-color 140ms cubic-bezier(0.2, 0, 0, 1), border-color 140ms cubic-bezier(0.2, 0, 0, 1), box-shadow 140ms cubic-bezier(0.2, 0, 0, 1), color 140ms cubic-bezier(0.2, 0, 0, 1)',
    card: 'transform 200ms cubic-bezier(0.2, 0, 0, 1), box-shadow 200ms cubic-bezier(0.2, 0, 0, 1), border-color 200ms cubic-bezier(0.2, 0, 0, 1)',
    fade: 'opacity 200ms cubic-bezier(0, 0, 0.2, 1)',
    input: 'border-color 160ms cubic-bezier(0.2, 0, 0, 1), box-shadow 160ms cubic-bezier(0.2, 0, 0, 1), background-color 160ms cubic-bezier(0.2, 0, 0, 1)',
    color: 'color 160ms cubic-bezier(0.2, 0, 0, 1)',
  },
} as const;

// کی‌فریم‌های متداول و استاندارد جهت استفاده مجدد
export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const modalCardEnter = keyframes`
  from {
    opacity: 0;
    transform: scale(0.97) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

export const drawerEnterRTL = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const badgePop = keyframes`
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.18);
  }
  100% {
    transform: scale(1);
  }
`;

export const heartPopSubtle = keyframes`
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.14);
  }
  100% {
    transform: scale(1);
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const slideUpFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const slideDownFade = keyframes`
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// هلپر برای پشتیبانی همه‌جانبه از reduced-motion
export const reducedMotionSupport = css`
  @media (prefers-reduced-motion: reduce) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
    transform: none !important;
  }
`;
