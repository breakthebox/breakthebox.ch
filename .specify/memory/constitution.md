# [PROJECT_NAME] Constitution

## Core Principles

### I. User-Centred UX
Every user-facing flow MUST use human-readable domain language and MUST NOT expose
internal identifiers (template IDs, camelCase keys, snake_case fields, enum values).
Guided input flows MUST NOT require users to enter information already available from
the entity hierarchy. Known context MUST be displayed as read-only and passed through
automatically.
Rationale: Trust and comprehension are core product value, not optional polish.

### II. Secure Access, Data Protection, and OWASP Top 10 Compliance
Protected routes MUST enforce authenticated access and role-aware authorization through
shared server guards. Changes affecting user or business data MUST include explicit
access control checks and MUST preserve scoped data boundaries.
Every feature specification and implementation plan MUST include an OWASP Top 10
assessment (A01-A10). For each category: (a) not affected, (b) already mitigated,
or (c) requires new mitigation with concrete measures.
Rationale: Systematic OWASP assessment prevents security blind spots that arise from
AI-assisted development where generated code may introduce vulnerabilities.

### III. Test, Type Safety, and Coverage Gates
All production changes MUST pass strict TypeScript validation. Every behavior change
MUST add or update automated tests. Production code MUST NOT use `any`; exceptions
require inline justification. Type assertions (`as T`) MUST be avoided where proper
generics or narrowing can be used.
**Regression test mandate**: Every bug fix MUST include at least one automated test
that reproduces the original defect and verifies the fix.
Rationale: Fast iteration is only sustainable with reliable regression protection.

### IV. Reliable AI and Traceable Output
AI-assisted features MUST use deterministic input shaping, validate outputs against
typed schemas, and preserve a reliable fallback path so user workflows remain available.
Generated outputs MUST be attributable to context and version state.
Rationale: AI value depends on reliability, reproducibility, and reviewability.

### V. Design System, Accessibility, and i18n Consistency
UI changes MUST follow established design tokens, components, and interaction patterns.
i18n keys and visible text MUST remain consistent across supported locales.
No hard-coded locale-specific strings in reusable components.

Sub-rules:
- **Z-Index discipline**: All z-index MUST use canonical token scale. Raw numbers PROHIBITED.
- **Overflow safety**: Floating UI MUST NOT be clipped by parent overflow containers.
- **Token-first styling**: All visual values MUST use CSS custom properties (tokens).
- **Error feedback**: Every async operation MUST provide visible feedback on failure.
  Silent catch blocks PROHIBITED.
- **Empty states**: All empty-data scenarios MUST use shared EmptyState component.
- **Humanization**: No technical identifiers in user-visible contexts. All values through i18n.
- **Button hierarchy**: Differentiated styling required. Cancel never identical to Primary.
Rationale: Visual and linguistic consistency prevents UX debt accumulation.

### VI. Structured Error Handling and Observability
Server modules MUST use centralized logging (not raw `console.*`). Log entries MUST
include structured context (module, operation, entity IDs). Non-fatal catch blocks MUST
log with context; silent error swallowing PROHIBITED.
Rationale: Production debugging without structured observability wastes time.

### VII. Code Style, Module Boundaries, and Refactoring Safety
Consistent formatting via ESLint + Prettier with pre-commit hooks.
Module boundaries MUST be explicit:
- Components MUST NOT import from server modules
- Shared types re-exported from `types/` directory
- Barrel exports (`index.ts`) for public module APIs
Rationale: Clean boundaries protect refactoring safety.

## Operational Standards

- Schema changes MUST follow the ORM migration workflow exclusively
  (modify schema -> generate migration -> apply migration).
  Manually created SQL files PROHIBITED. `db:push` PROHIBITED.
- Multi-table operations MUST use database transactions.
- Security: input validation, least-privilege auth, secure secrets, safe defaults.
- OWASP Top 10 gate: every implementation plan MUST include assessment table (A01-A10).
- DRY CSS: design tokens from global stylesheet, never hardcoded values.
- Shared utilities: extract patterns before duplicating across >2 files.
- Structured logging: centralized logger module, not raw console.*.
- Code style: ESLint + Prettier enforced via pre-commit hooks.
- Module boundaries: components cannot import server code; types in shared directory.

## Delivery Workflow and Quality Gates

1. Specs and plans MUST include Constitution Check mapping to all principles.
2. PRs MUST document risk areas, test evidence, and principle exceptions.
3. Security changes MUST include threat review + OWASP Top 10 assessment.
4. Every behavior change MUST have corresponding tests.
5. Lint + format checks MUST pass before merge.
6. Reviewers MUST block merges failing security, test, type, or design checks.

## Governance

This constitution overrides conflicting local habits or ad-hoc process notes.

- Amendment: requires rationale + impact assessment + reviewer approval.
- Versioning: MAJOR (breaking governance), MINOR (new principle), PATCH (clarification).
- Compliance: every plan and PR MUST include Constitution Check outcome.

Operational guidance lives in `CLAUDE.md` and `docs/`.

**Version**: 1.0.0 | **Ratified**: [DATE] | **Last Amended**: [DATE]
