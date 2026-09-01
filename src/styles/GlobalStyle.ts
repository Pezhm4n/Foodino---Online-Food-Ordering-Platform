import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    max-width: 100vw;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: ${({ theme }) => theme.colors.neutral[50]};
    color: ${({ theme }) => theme.colors.neutral[900]};
    font-family: var(--font-vazirmatn), system-ui, sans-serif;
  }

  body, button, input, select, textarea {
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button, input, select, textarea {
    font: inherit;
  }

  :focus-visible {
    outline: 3px solid ${({ theme }) => theme.colors.primary[500]};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
