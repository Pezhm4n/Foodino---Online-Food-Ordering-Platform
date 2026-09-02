# ADR 0004: Money and IRR Integer Pricing Snapshot

## Status
Accepted

## Context
Floating point arithmetic causes rounding errors in monetary calculations. Additionally, Persian consumers think in Toman while accounting systems require Iranian Rials (IRR, 1 Toman = 10 IRR).

## Decision
1. All database columns, calculations, and domain entities store money as integer IRR amounts (`irr_amount`).
2. Toman is strictly a presentation-layer formatting concept (divided by 10 with Persian comma separators).
3. Order creation snapshots product prices, variant adjustments, addon prices, delivery fees, and tax at the moment of checkout, making completed orders immutable to future catalog changes.

## Consequences
- Zero floating-point drift or financial rounding discrepancies.
- Immutable historical financial audit trail.
