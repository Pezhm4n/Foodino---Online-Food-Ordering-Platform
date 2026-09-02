# Security Review: foodino

## Scope

Repository-wide Standard security review of 118 tracked/unignored files at revision b564ba0cf6790785138ceba1d4ae45a94bcd8740.

- Scan mode: repository
- Target kind: git_revision
- Target ID: target_sha256_a1a493c3847feea057c76d002638e9dcc9854b10706784b385d29c7a5046b1bc
- Revision: b564ba0cf6790785138ceba1d4ae45a94bcd8740
- Inventory strategy: repository
- Included paths: .
- Excluded paths: none
- Runtime or test status: Local Next development server smoke-tested; lint, typecheck, build, npm dependency tree, and npm audit baselines were executed.
- Artifacts reviewed: package.json, package-lock.json, all tracked src/app pages, all tracked src/components, src/contexts, src/lib, .cursor/mcp.json, tools
- Scan context: Pre-modernization current-state audit; no repository mutations.

Limitations and exclusions:
- No live production deployment or external infrastructure was available.
- No backend or database exists in this revision.
- No exploit payload or third-party MCP package was executed.

### Scan Summary

| Field | Value |
| --- | --- |
| Scan outcome | completed |
| Reportable findings | 2 |
| Severity mix | critical: 1, medium: 1 |
| Confidence mix | high: 2 |
| Coverage | partial |
| Validation mode | Independent static reviews, local commands, official vendor-advisory comparison, and browser smoke testing. |

Canonical artifacts: `scan-manifest.json`, `findings.json`, and `coverage.json`. This report is a deterministic projection of those files.

## Threat Model

Foodino at revision b564ba0 is a public Next.js App Router browser prototype. It serves public React Server Components and client bundles, but it has no Route Handlers, Server Actions, middleware/proxy, database, payment gateway, or server-backed authorization. The main present risks are the internet-facing framework runtime and developer tooling; localStorage auth/order/cart behavior is an untrusted demo boundary that must not be carried into production.

### Assets

- Next.js server process and its deployment credentials/environment
- Browser-held identity, cart, delivery PII, and demo order state
- Future catalog, prices, customer orders, and payment state
- Developer workstation authority reachable from workspace tooling
- Operator-only Python utilities and runtime-supplied credentials

### Trust Boundaries

- Internet -\> Next.js runtime and React Server Component parser
- Browser/client state -\> server/application services (currently absent)
- Next.js application -\> future Supabase Auth/Postgres/Data API
- Payment provider callback -\> future payment/order transition logic
- Repository configuration -\> developer editor/MCP child process
- Operator shell -\> Python tools and external providers

### Attacker Capabilities

- Unauthenticated remote HTTP requests to public App Router/RSC endpoints
- Arbitrary modification of browser requests, route parameters, and localStorage
- Malicious or compromised npm/MCP package execution after developer activation
- Future authenticated user attempting cross-account access once a backend exists

### Security Objectives

- Patch public framework runtime before deployment
- Treat identity, authorization, price, totals, order state, and payment state as server-authoritative
- Enforce per-user isolation at application and PostgreSQL RLS layers
- Make checkout/payment transactional, replay-safe, and idempotent
- Keep secrets and unnecessary PII out of client storage, repository, URLs, and logs
- Remove or integrity-pin developer tooling that executes third-party packages

### Assumptions

- No hidden backend, gateway, database, deployment control, or external mitigation was supplied
- localStorage flows are demo behavior rather than a current protected resource boundary
- A future public deployment is in scope, making vendor-confirmed public App Router runtime flaws reportable
- Workspace MCP code executes only if a developer enables or loads it

## Findings

| Finding | Severity | Confidence | Detailed write-up |
| --- | --- | --- | --- |
| [Unauthenticated React Server Components requests can execute code in the Next.js server](#finding-1) | critical | high | inline below |
| [Workspace MCP configuration executes a mutable unpinned npm package](#finding-2) | medium | high | inline below |

### Confidence Scale

| Label | Meaning |
| --- | --- |
| high | Direct evidence supports the finding with no material unresolved blocker. |
| medium | Evidence supports a plausible issue, but material runtime or reachability proof remains. |
| low | Evidence is incomplete and the item is retained only for explicit follow-up. |

<a id="finding-1"></a>

### [1] Unauthenticated React Server Components requests can execute code in the Next.js server

| Field | Value |
| --- | --- |
| Severity | critical |
| Confidence | high |
| Confidence rationale | The manifest and lockfile establish exact affected versions and a live `next start` App Router deployment path; the official Next.js advisory explicitly lists 15.2.0 through 15.2.5 as affected. |
| Category | unsafe-dependency |
| CWE | CWE-502 |
| Affected lines | package.json:8-17, src/app/page.tsx:7-12, src/app/restaurants/\[slug\]/page.tsx:32-34 |

#### Summary

The production path runs next@15.2.5 with react/react-dom@19.1.0 on public App Router endpoints. This falls in the vendor-confirmed CVE-2025-66478 affected range, allowing a crafted unauthenticated RSC request to execute code with the server process privileges.

#### Root Cause

A vendor-confirmed vulnerable Next.js/React Server Components runtime is pinned and exposed through the production App Router server.

**Affected production runtime** — `package.json:8-17`

The checked-in production command starts the affected Next server rather than exporting static files, and the lockfile resolves React and React DOM to 19.1.0.

```json
"start": "next start"\n...\n"next": "15.2.5",\n"react": "^19.0.0",\n"react-dom": "^19.0.0"
```

**Public App Router server entry point** — `src/app/page.tsx:7-12`

An unauthenticated public App Router page causes standard React Server Components request handling in the affected framework runtime.

```tsx
export default function HomePage() {\n  return (\n    <>\n      <HeroSection />\n      <PopularCategories />\n      <TopRestaurants />
```

#### Validation

Validation outcomes are recorded below.

Validation method: Independent source review, exact lockfile/version inspection, npm audit, and comparison with the official Next.js CVE-2025-66478 advisory.

- **Status:** validated
- **Disposition:** reportable

**Affected production runtime** — `package.json:8-17`

The checked-in production command starts the affected Next server rather than exporting static files, and the lockfile resolves React and React DOM to 19.1.0.

```json
"start": "next start"\n...\n"next": "15.2.5",\n"react": "^19.0.0",\n"react-dom": "^19.0.0"
```

**Public App Router server entry point** — `src/app/page.tsx:7-12`

An unauthenticated public App Router page causes standard React Server Components request handling in the affected framework runtime.

```tsx
export default function HomePage() {\n  return (\n    <>\n      <HeroSection />\n      <PopularCategories />\n      <TopRestaurants />
```

Assertions:
- Next.js is exactly 15.2.5 and React/React DOM resolve to 19.1.0.
- Production uses `next start` and public App Router server pages exist.
- The vendor advisory lists Next.js 15.2.0 through 15.2.5 as affected.

Counterevidence and remaining uncertainty:
- No user-authored Server Actions or Route Handlers exist.
- No live production hostname or external mitigation was supplied.

Limitations:
- No exploit payload was executed.
- Historical public deployment exposure is unconfirmed.

#### Dataflow

The canonical finding records the affected path at package.json:8-17, src/app/page.tsx:7-12, src/app/restaurants/\[slug\]/page.tsx:32-34, but no expanded source-to-sink narrative was recorded.

Attack steps:
- Attacker sends a crafted RSC protocol request to any reachable App Router page.
- next@15.2.5 and the resolved React runtime deserialize the attacker-controlled payload.
- The vulnerable deserialization behavior executes code in the Next server process.
- The attacker gains the process's environment, filesystem, network, and downstream-service authority.

**Affected production runtime** — `package.json:8-17`

The checked-in production command starts the affected Next server rather than exporting static files, and the lockfile resolves React and React DOM to 19.1.0.

```json
"start": "next start"\n...\n"next": "15.2.5",\n"react": "^19.0.0",\n"react-dom": "^19.0.0"
```

**Public App Router server entry point** — `src/app/page.tsx:7-12`

An unauthenticated public App Router page causes standard React Server Components request handling in the affected framework runtime.

```tsx
export default function HomePage() {\n  return (\n    <>\n      <HeroSection />\n      <PopularCategories />\n      <TopRestaurants />
```

#### Reachability

Directly reachable when `next start` is publicly deployed.

- **Attacker:** Unauthenticated remote HTTP client

- **Entry point:** Public App Router/RSC request

- **Sink:** Affected React Server Components deserializer in the framework runtime

- **Outcome:** Arbitrary server-side code execution

Preconditions:
- The checked-in production server is reachable.
- No effective external mitigation blocks the vulnerable request.

Existing controls:
- No repository-defined compensating control was found.

**Affected production runtime** — `package.json:8-17`

The checked-in production command starts the affected Next server rather than exporting static files, and the lockfile resolves React and React DOM to 19.1.0.

```json
"start": "next start"\n...\n"next": "15.2.5",\n"react": "^19.0.0",\n"react-dom": "^19.0.0"
```

**Public App Router server entry point** — `src/app/page.tsx:7-12`

An unauthenticated public App Router page causes standard React Server Components request handling in the affected framework runtime.

```tsx
export default function HomePage() {\n  return (\n    <>\n      <HeroSection />\n      <PopularCategories />\n      <TopRestaurants />
```

#### Severity

**Critical** — The vulnerable parser is reached before application authorization from an unauthenticated public HTTP request, and successful exploitation yields arbitrary server-side code execution with access to environment secrets and server-reachable resources.

Severity falls only if the application is provably never remotely reachable or is statically exported behind a control that cannot reach the affected runtime. A patched supported framework/runtime removes the finding.

Impact assessment:
- **Level:** critical
- **Rationale:** Full server process compromise can disclose secrets, alter responses, and access server-reachable data and services.

Likelihood assessment:
- **Level:** high
- **Rationale:** The entry point is unauthenticated and vendor-confirmed; only deployment reachability remains external to repository evidence.

#### Remediation

Upgrade Next.js, React, React DOM, and eslint-config-next together to the current supported patched release, regenerate and verify the lockfile, rebuild, and redeploy all instances. If this revision was publicly online during the exposure window, rotate server-side secrets after patching.

Tests:
- Verify `npm ls next react react-dom` resolves only to the chosen patched versions.
- Run npm audit and fail CI on unresolved high or critical advisories.
- Run lint, typecheck, unit tests, production build, and App Router browser smoke tests after the major upgrade.
- Confirm the deployed artifact revision and framework version, not only package.json.

Preventive controls:
- Pin supported framework versions and review official security advisories before deployment.
- Enable Dependabot, dependency review, and a CI high/critical audit gate.
- Maintain a documented emergency framework-upgrade and secret-rotation procedure.

<a id="finding-2"></a>

### [2] Workspace MCP configuration executes a mutable unpinned npm package

| Field | Value |
| --- | --- |
| Severity | medium |
| Confidence | high |
| Confidence rationale | The complete executable tuple is present in source, the package is absent from package.json/package-lock.json, and independent registry inspection found no currently resolvable package. |
| Category | supply-chain-integrity |
| CWE | CWE-494 |
| Affected lines | .cursor/mcp.json:3-8 |

#### Summary

The checked-in Cursor configuration launches `npx -y task-master-mcp` without a version, lockfile entry, or integrity record. If a developer enables the server, registry-controlled code can execute with the developer account and workspace authority.

#### Root Cause

Repository tooling delegates code selection to a mutable registry lookup at activation time and provides no reviewed version or integrity boundary.

**Unpinned registry-time MCP execution** — `.cursor/mcp.json:3-8`

`-y` suppresses installation confirmation and the bare package name is resolved at execution time instead of from the repository lockfile.

```json
"task-master-ai": {\n  "command": "npx",\n  "args": [\n    "-y",\n    "task-master-mcp"\n  ]
```

#### Validation

Validation outcomes are recorded below.

Validation method: Independent configuration and lockfile review plus a current npm registry lookup.

- **Status:** validated
- **Disposition:** reportable

**Unpinned registry-time MCP execution** — `.cursor/mcp.json:3-8`

`-y` suppresses installation confirmation and the bare package name is resolved at execution time instead of from the repository lockfile.

```json
"task-master-ai": {\n  "command": "npx",\n  "args": [\n    "-y",\n    "task-master-mcp"\n  ]
```

Assertions:
- The configuration invokes `npx -y` with a bare package name.
- No exact version or lockfile integrity entry exists.
- The child process would inherit developer account and workspace authority.

Counterevidence and remaining uncertainty:
- The package name returned npm E404 on 2026-09-01, so no current payload was available.
- Cursor activation/approval is required under default behavior.
- Checked-in API-key values are placeholders.

Limitations:
- The external MCP implementation is not present in the repository and was not executed.

#### Dataflow

The canonical finding records the affected path at .cursor/mcp.json:3-8, but no expanded source-to-sink narrative was recorded.

Attack steps:
- An attacker publishes or compromises the registry package resolved as `task-master-mcp`.
- A developer opens/enables the repository MCP configuration.
- `npx -y` downloads and runs the mutable package without a repository integrity pin.
- The package reads or modifies workspace data and any process-accessible credentials.

**Unpinned registry-time MCP execution** — `.cursor/mcp.json:3-8`

`-y` suppresses installation confirmation and the bare package name is resolved at execution time instead of from the repository lockfile.

```json
"task-master-ai": {\n  "command": "npx",\n  "args": [\n    "-y",\n    "task-master-mcp"\n  ]
```

#### Reachability

Conditionally reachable through developer tooling activation.

- **Attacker:** Malicious or compromised npm package publisher

- **Entry point:** Cursor workspace MCP server activation

- **Sink:** `npx -y task-master-mcp` child process

- **Outcome:** Developer workstation, workspace, and supply-chain compromise

Preconditions:
- A malicious package becomes resolvable.
- A developer activates the MCP server.

Existing controls:
- Default MCP approval reduces automatic invocation but does not integrity-pin the executable.

**Unpinned registry-time MCP execution** — `.cursor/mcp.json:3-8`

`-y` suppresses installation confirmation and the bare package name is resolved at execution time instead of from the repository lockfile.

```json
"task-master-ai": {\n  "command": "npx",\n  "args": [\n    "-y",\n    "task-master-mcp"\n  ]
```

#### Severity

**Medium** — Successful exploitation compromises a developer workstation and downstream source integrity, but it requires developer MCP activation and a malicious/future registry publication; the package name currently returns E404.

Severity rises if the MCP is auto-started, real credentials are passed, or the package is published/compromised. Removing the obsolete configuration or invoking only an exact lockfile-pinned local binary removes the finding.

Impact assessment:
- **Level:** high
- **Rationale:** Arbitrary code executes with developer permissions and can compromise source and credentials.

Likelihood assessment:
- **Level:** low
- **Rationale:** The package is currently absent and activation is required.

#### Remediation

Remove the obsolete Cursor/Windsurf/Task Master configuration and Python tooling as selected for this modernization. If equivalent tooling is later reintroduced, add a reviewed exact package version to devDependencies, commit its lockfile integrity, invoke only the local binary, and require explicit approval.

Tests:
- Verify obsolete `.cursor`, Cursor/Windsurf/Task Master rule files, and unrelated Python tools are absent.
- Search repository configuration for `npx -y` and other registry-time executable downloads.
- Fail dependency review when unpinned executable tooling is introduced.

Preventive controls:
- Treat repository-provided editor/MCP configuration as executable supply-chain code.
- Require exact versions, lockfile integrity, local binary execution, least-privilege credentials, and documented opt-in.

## Reviewed Surfaces

| Surface | Risk Area | Outcome | Notes |
| --- | --- | --- | --- |
| Public Next.js App Router and RSC runtime | Unauthenticated framework-level code execution | Reported | Validated Critical finding on the exact production runtime and public App Router path. |
| Browser prototype auth, cart, checkout, and order state | Client-authoritative prototype state | Rejected | No current protected backend sink exists. This is required modernization work, but not a current cross-user or payment-security finding. |
| Workspace editor and MCP tooling | Unpinned third-party code execution | Reported | Validated Medium supply-chain finding requiring developer activation. |
| Server API, database, uploads, and payment callbacks | not recorded | Not applicable | No route handlers, server actions, database, payment provider, webhook, upload, or protected server resource exists. |
| Operator-only Python utilities | not recorded | No issue found | Not reachable from the web product and requires explicit local operator input. |
| Remaining public pages and components | not recorded | No issue found | Independent focused review found no additional current-revision reportable injection, XSS, navigation, parser, upload, or protected-resource vulnerability. |
| Public Next.js App Router and RSC runtime | not recorded | Reported | Independent validation confirmed the Critical RSC runtime finding. |
| Browser prototype auth, cart, checkout, and order state | not recorded | No issue found | Entirely client-side mock state; there is no protected backend sink to make this a current cross-user vulnerability. It remains unusable as a production trust boundary. |
| Workspace editor and MCP tooling | not recorded | Reported | Independent validation confirmed the Medium unpinned MCP execution finding. |
| Server API, database, uploads, and payment callbacks | not recorded | Not applicable | No route handlers, server actions, database, payment provider, webhook, upload, or protected server resource exists. |
| Operator-only Python utilities | not recorded | No issue found | Distinct operator-only trust boundary and not reachable from the web application. |
| Independent baseline source audit | not recorded | No issue found | Independent baseline review completed; reportable candidates were validated and recorded separately. |

## Open Questions And Follow Up

- The two validated findings still need final attack-path phase accounting and sealed reporting.
  - Follow-up prompt: Review deferred unit attack-path-reporting-pending and close its stated proof gap. Paths: package.json, package-lock.json, .cursor/mcp.json, src/app.
- Independent focused review and validation of framework runtime, prototype trust boundaries, and developer tooling are still pending.
  - Follow-up prompt: Review deferred unit focused-review-pending and close its stated proof gap. Paths: package.json, package-lock.json, src/app, src/components, src/context, .cursor, tools.
- Awaiting parent validation of activation boundary, package resolution behavior, and severity.
  - Follow-up prompt: Review deferred unit baseline-unpinned-mcp-exec and close its stated proof gap.
