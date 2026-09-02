# ADR 0005: Fail-Closed Payment Adapter Architecture

## Status
Accepted

## Context
In production, running a simulated development payment provider would allow malicious users to complete real orders without payment.

## Decision
1. The codebase provides a pluggable `PaymentProvider` interface.
2. In development and test environments, `DevelopmentPaymentProvider` allows simulated checkout and verification.
3. In production (`NODE_ENV=production`), the server environment schema strictly forbids `PAYMENT_PROVIDER='development'`. If attempted, the application fails to start or defaults to `disabled` (fail-closed).
4. Real gateway integration (e.g., Shaparak/Zarinpal) is configured via authenticated server credentials and validated webhooks.

## Consequences
- Mathematically eliminates the risk of unauthorized simulated orders in production.
- Clear separation between local developer velocity and production financial safety.
