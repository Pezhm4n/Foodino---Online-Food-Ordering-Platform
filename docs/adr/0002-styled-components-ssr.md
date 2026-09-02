# ADR 0002: Server-Side Rendered Styled-Components with Registry

## Status
Accepted

## Context
Foodino's initial prototype utilized styled-components with client-side CSS injection, resulting in Flash of Unstyled Content (FOUC), hydration mismatches, and CSP violations.

## Decision
We utilize Next.js App Router with `styled-components` compiler support in `next.config.ts` and `StyledComponentsRegistry` wrapping the root layout.
CSS styles are collected during server-side rendering and emitted directly into the initial HTML stream.

## Consequences
- Zero flash of unstyled content.
- Clean hydration without style tag mismatches.
- Compatible with strict Content Security Policy (CSP).
