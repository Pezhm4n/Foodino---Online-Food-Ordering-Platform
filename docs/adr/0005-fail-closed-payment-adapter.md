# ADR 0005: Fail-Closed Payment Adapter Architecture

## Status
Accepted

## Context
In production, running a simulated development payment provider would allow malicious users to complete real orders without payment.

## Decision
1. The codebase provides a pluggable `PaymentProvider` interface.
2. In development and test environments, `DevelopmentPaymentProvider` allows simulated checkout and verification.
3. In production (`NODE_ENV=production`), the server environment schema strictly forbids `PAYMENT_PROVIDER='development'`. If attempted, the application fails to start or defaults to `disabled` (fail-closed).
4. Real gateway integration requires a separate adapter with server credentials and validated provider callbacks; no real-bank adapter is currently implemented.
5. An explicitly opted-in `demo` provider is allowed only with `DEMO_MODE=true`, including public demo deployments. It is distinct from `development`, records `provider=demo`, and labels its gateway and receipt as simulated. See [ADR 0007](0007-explicit-demo-checkout.md).

## Consequences
- Production cannot select the local development adapter. A public demonstration requires both explicit demo settings and cannot be treated as proof of a real payment.
- Clear separation between local developer velocity and production financial safety.
