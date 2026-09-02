# ADR 0006: Persian-Only (Fa-IR) RTL Scope for V1

## Status
Accepted

## Context
The primary target market for Foodino is Iranian users. Introducing premature multi-language abstractions (next-intl, message bundles, dynamic LTR/RTL switching) complicates refactoring and creates unnecessary regressions.

## Decision
Foodino V1 is strictly Persian-language (Fa-IR) with native Right-to-Left (RTL) layout:
1. HTML root specifies `lang="fa" dir="rtl"`.
2. Typography is powered by the Vazirmatn font family.
3. English language toggles and mock translation dictionaries are removed from the active production path.

## Consequences
- Clean, focused codebase optimized for the target demographic.
- Consistent RTL styling without layout inversion bugs.
