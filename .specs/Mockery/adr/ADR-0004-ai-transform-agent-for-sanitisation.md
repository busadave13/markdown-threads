# ADR-0004: AI Transform Agent for Response Sanitisation via GitHub Copilot SDK

> **Version**: 1.0.0<br>
> **Created**: 2026-04-10<br>
> **Last Updated**: 2026-04-10<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Approved

---

## 1. Context

Upstream service responses captured during recording may contain personally identifiable information — names, email addresses, phone numbers, government identifiers, and other sensitive data. This data must be removed or replaced before the response is written to the filesystem or returned to the caller, because recorded mocks are committed to source control and shared across teams. The sanitisation mechanism must handle diverse data shapes across different upstream services without requiring per-field configuration, and must adapt to evolving data formats without code changes. Each upstream service has different data sensitivity profiles, so the sanitisation behaviour must be configurable per service.

---

## 2. Decision

> We will use a GitHub Copilot SDK agent (`AiTransformAgent`) with per-service natural language transform instructions to sanitise upstream responses before they are persisted to the mock store.

---

## 3. Rationale

Natural language transform instructions allow teams to describe what should be sanitised in plain English (e.g. "replace all email addresses with fake ones, redact Social Security numbers") rather than writing and maintaining field-level transformation rules. The Copilot SDK's language model can identify PII across diverse JSON structures without explicit field mappings, adapting to schema changes automatically. The `preserveStructure` flag ensures the JSON shape remains intact for callers that depend on specific fields existing. Per-service instructions mean each team controls their own sanitisation policy without affecting others.

---

## 4. Alternatives Considered

### Rule-based field-level sanitisation (regex + field paths)
**Why rejected:** A rule-based approach requires explicit configuration of every field path containing PII across every upstream service's response schema. In a large repository with many upstreams, this creates significant configuration burden and drifts whenever an upstream adds new fields containing sensitive data. Regex patterns for PII detection (email, phone, SSN) cover known formats but miss context-dependent sensitivity (e.g. a "notes" field containing a customer's medical information). Maintenance scales linearly with the number of upstream services and their schema complexity.

### Dedicated PII detection library (e.g. Microsoft Presidio)
**Why rejected:** Libraries like Presidio provide strong PII detection capabilities but operate at the entity level (detecting PII occurrences) rather than at the transformation level (producing realistic replacement values that maintain structural validity). Integrating Presidio would require additional transformation logic on top of detection, adding a second dependency. Presidio's entity recognisers are language-specific and may not cover all data formats present in upstream responses. The Copilot SDK provides both detection and transformation in a single call with natural language configurability.

---

## 5. Consequences

### Positive Consequences
- Per-service sanitisation policy defined in plain English — no code changes required to adjust what is sanitised
- Adapts to upstream schema changes automatically — no field-path configurations to maintain
- `preserveStructure` mode ensures callers receive structurally valid responses even after transformation
- Single integration point via the Copilot SDK — no additional PII detection libraries required

### Trade-offs Accepted
- AI sanitisation adds 1–3 seconds of latency per new endpoint recording due to the Copilot SDK round-trip; this cost is paid only once per endpoint since subsequent requests replay from the mock store
- Non-deterministic transformation — the same input may produce slightly different sanitised output across runs; acceptable because the sanitised values are synthetic placeholders, not semantically meaningful data
- Copilot SDK availability is required on the record path; if the SDK is unreachable, recording is rejected and the raw response is not persisted, preventing PII from reaching the filesystem but also preventing new mock capture until the SDK recovers

---

## 6. Related Decisions

- [ADR-0003: URL template normalisation strategy](ADR-0003-url-template-normalisation-strategy.md) — both this decision and ADR-0003 depend on the GitHub Copilot SDK as an AI runtime
- [ADR-0002: Filesystem mock store](ADR-0002-filesystem-mock-store.md) — sanitised responses are the only data written to the mock store; this decision directly protects the store from PII contamination

---

*This ADR is part of the [Architecture Decision Records index](README.md).*
