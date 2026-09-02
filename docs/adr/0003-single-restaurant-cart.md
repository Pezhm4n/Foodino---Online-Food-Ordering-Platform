# ADR 0003: Single-Restaurant Cart Invariant

## Status
Accepted

## Context
Foodino orders are prepared and dispatched by individual restaurants. Allowing mixed-restaurant carts introduces unmanageable logistical complexity (multiple pickup locations, conflicting delivery times, separate dispatch fees).

## Decision
The cart strictly enforces a single-restaurant invariant:
1. Every cart is associated with a single `restaurantId`.
2. Adding an item from a different restaurant prompts the user to either clear the existing cart or cancel the addition.
3. Server-side validation schema (`localCartSchema` and `checkoutSchema`) and database procedures reject any order with mixed-restaurant line items.

## Consequences
- Predictable order dispatching and pricing.
- Robust boundary validation at both client domain and server API layers.
