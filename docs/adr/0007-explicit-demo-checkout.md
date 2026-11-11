# ADR 0007: Explicit demo checkout and cloud Data API configuration

## Status

Accepted for the public Foodino demonstration.

## Context

Database migrations create the `api` schema and its narrowly granted order functions. Hosted Supabase Data API exposure is a separate project setting. If only `public` is exposed, catalog and account reads can work while checkout RPCs fail with `PGRST106`.

The public demo also needs a selectable successful/failed payment experience. Enabling the local development provider in production would undermine its existing safety boundary.

## Decision

- Expose `public` and `api` in the project's Data API configuration. Existing `graphql_public` may remain when present; never expose `private`. Keep the per-function role grants from the migrations instead of granting every function to every role.
- Readiness checks the catalog and a harmless empty public-tracking RPC through `api`. A missing API schema returns 503. This check does not certify a real payment gateway or every authenticated permission.
- Keep `development` forbidden in production. The separate `demo` adapter requires both `PAYMENT_PROVIDER=demo` and `DEMO_MODE=true`.
- Demo completion accepts a success/failure choice only from the authenticated order owner through a same-origin POST. Amount and payment reference come from the database, not browser input. The existing atomic payment transition determines the committed outcome.
- Persist `provider=demo` and identify the gateway and receipt as simulations without money movement or real delivery. Demo does not introduce unsigned external callbacks or bank-card fields.
- Public tracking carries only an additional `is_demo` boolean derived from the persisted payment. Shared tracking links retain the simulation disclosure even if deployment settings later change; no payment record, amount, owner or address is exposed by this addition.
- Preserve the submitted cart until the result is known. A failed/canceled result permits retry; a succeeded receipt clears only the matching submitted cart, protecting later edits and other tabs.

## Consequences

The demonstration can exercise real server pricing, persistence, receipts and tracking without claiming a bank transaction. Any future real gateway, financial report or fulfillment integration must distinguish demo payments from real payments. Real payment acceptance requires its own provider integration and end-to-end verification.

Configuration values and secrets belong in private local files or deployment environment settings, never this document or Git.
