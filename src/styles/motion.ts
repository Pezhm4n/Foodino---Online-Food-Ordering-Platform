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

export const sectionArrival = keyframes`
  from { opacity: 0.88; translate: 0 10px; }
  to { opacity: 1; translate: 0 0; }
`;

export const actionFeedbackAttrs: { 'data-action-feedback'?: string } = { 'data-action-feedback': '' };

export const actionFeedback = css`
  -webkit-tap-highlight-color: rgba(184, 43, 20, 0.18);
  transition: background-color ${motionTokens.duration.fast}, color ${motionTokens.duration.fast},
    border-color ${motionTokens.duration.fast}, box-shadow ${motionTokens.duration.fast};

  &:focus-visible {
    outline: 2px solid var(--action-focus-color, ${({ theme }) => theme.colors.primary[600]});
    outline-offset: 3px;
  }

  &:not(:disabled) {
    &:focus-visible {
      background-color: var(--action-hover-bg, ${({ theme }) => theme.colors.primary[50]});
      color: var(--action-hover-ink, ${({ theme }) => theme.colors.primary[700]});
      border-color: ${({ theme }) => theme.colors.primary[300]};
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        background-color: var(--action-hover-bg, ${({ theme }) => theme.colors.primary[50]});
        color: var(--action-hover-ink, ${({ theme }) => theme.colors.primary[700]});
        border-color: ${({ theme }) => theme.colors.primary[300]};
        box-shadow: var(--action-hover-shadow, 0 2px 8px rgba(132, 45, 27, 0.13));
      }
    }

    &:is(:active, [data-touch-pressed]) {
      background-color: var(--action-press-bg, ${({ theme }) => theme.colors.primary[100]});
      color: var(--action-hover-ink, ${({ theme }) => theme.colors.primary[700]});
      box-shadow: inset 0 2px 4px rgba(85, 25, 10, 0.18);
    }
  }

  > svg { pointer-events: none; flex-shrink: 0; }

  @media (prefers-reduced-motion: no-preference) {
    > svg { transition: translate ${motionTokens.duration.normal} ${motionTokens.easing.subtleSpring}; }
    &:focus-visible > svg { translate: var(--action-icon-shift, -4px 0); }

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) > svg { translate: var(--action-icon-shift, -4px 0); }
    }

    &:is(:active, [data-touch-pressed]):not(:disabled) > svg { translate: 0 1px; }
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const cardIconFeedback = css`
  [data-feedback-icon] {
    transition: color ${motionTokens.duration.fast};
  }

  &:focus-within [data-feedback-icon] { color: var(--feedback-icon-ink, ${({ theme }) => theme.colors.primary[700]}); }
  @media (hover: hover) and (pointer: fine) {
    &:hover [data-feedback-icon] { color: var(--feedback-icon-ink, ${({ theme }) => theme.colors.primary[700]}); }
  }

  @media (prefers-reduced-motion: no-preference) {
    [data-feedback-icon] { transition: color ${motionTokens.duration.fast}, translate ${motionTokens.duration.normal} ${motionTokens.easing.subtleSpring}; }
    &:focus-within [data-feedback-icon] { translate: 0 -3px; }

    @media (hover: hover) and (pointer: fine) {
      &:hover [data-feedback-icon] { translate: 0 -3px; }
    }
  }

  @media (prefers-reduced-motion: reduce) { [data-feedback-icon] { transition: none; } }
`;

export const fieldFeedback = css`
  transition: ${motionTokens.transition.input};

  @media (hover: hover) and (pointer: fine) {
    &:hover:not(:focus):not([aria-invalid='true']) {
      border-color: ${({ theme }) => theme.colors.neutral[500]};
    }
  }

  &:focus {
    outline: none;
    background-color: #ffffff;
    border-color: ${({ theme }) => theme.colors.primary[600]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  @media (prefers-reduced-motion: reduce) { transition: none; }
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
