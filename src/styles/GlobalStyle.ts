import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --surface-canvas: #FAF6F0;
    --surface-stone: #F3ECE2;
    --surface-card: #FFFFFF;
    --surface-elevated: #FFFDF9;
    --ink-espresso: #16120F;
    --ink-charcoal: #241E1A;
    --ink-muted: #52483E;
    --ink-subtle: #6E6255;
    --brand-vermilion: #D9381E;
    --brand-vermilion-dark: #B82B14;
    --brand-saffron: #E59A11;
    --brand-herb: #15803D;
    --border-hairline: #E6DDD0;
    --border-strong: #D5C9B8;
    --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
    --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
    --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    -webkit-tap-highlight-color: transparent;
  }

  html, body {
    max-width: 100vw;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: ${({ theme }) => theme.colors.neutral[50]};
    color: ${({ theme }) => theme.colors.neutral[900]};
    font-family: var(--font-vazirmatn), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${({ theme }) => theme.colors.neutral[900]};
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primary[200]};
    color: ${({ theme }) => theme.colors.primary[900]};
  }

  img, svg {
    max-width: 100%;
    height: auto;
  }

  body, button, input, select, textarea {
    font-family: inherit;
    font-feature-settings: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, select, textarea {
    font: inherit;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  /* Custom subtle warm scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.neutral[400]};
  }

  @keyframes foodinoFloat {
    0%, 100% {
      transform: translateY(0px) rotate(0deg);
    }
    50% {
      transform: translateY(-6px) rotate(1.2deg);
    }
  }

  @keyframes foodinoSteam {
    0% {
      opacity: 0;
      transform: translateY(4px) scaleX(0.9);
    }
    50% {
      opacity: 0.55;
      transform: translateY(-5px) scaleX(1.05);
    }
    100% {
      opacity: 0;
      transform: translateY(-14px) scaleX(0.95);
    }
  }

  @keyframes foodinoPulseDot {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.55);
    }
    70% {
      box-shadow: 0 0 0 7px rgba(74, 222, 128, 0);
    }
  }

  @keyframes foodinoFadeUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .foodino-dish-hero {
    animation: foodinoFloat 4.2s ease-in-out infinite;
    transform-origin: center center;
  }

  .foodino-steam-1 {
    animation: foodinoSteam 2.8s ease-in-out infinite;
  }

  .foodino-steam-2 {
    animation: foodinoSteam 2.8s ease-in-out 0.9s infinite;
  }

  .foodino-steam-3 {
    animation: foodinoSteam 2.8s ease-in-out 1.7s infinite;
  }
`;
