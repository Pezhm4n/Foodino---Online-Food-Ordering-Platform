# ADR 0001: Supabase Server-Only BFF Architecture

## Status
Accepted

## Context
Foodino requires secure database access, authentication, and state management. Exposing database credentials or direct client-side Supabase connections from browser applications presents severe security risks (leaking credentials, bypassing business logic, exposing customer PII).

## Decision
We enforce a Server-Only Backend-For-Frontend (BFF) architecture:
1. The browser NEVER receives Supabase secret keys or direct database access.
2. All client interactions pass through Next.js Server Components, Server Actions, or Route Handlers.
3. Supabase client is initialized exclusively on the server using `@supabase/ssr`.
4. RLS policies enforce that authenticated customers only access their own data, and anonymous users only access public catalog data.

## Consequences
- Complete protection against client-side token/credential leakage.
- Strict centralized validation for pricing, orders, and authentication.
- Single source of truth for business rules on the server.
