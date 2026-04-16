# ADR-0003: Use a Hybrid URL Template Normalisation Strategy

> **Version**: 1.0.1<br>
> **Created**: 2026-04-10<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Approved

---

## 1. Context

Upstream services expose endpoints with parametric path segments (e.g. `/users/42`, `/orders/abc-123/items/7`). For the mock store to return the same recorded response regardless of which specific IDs appear in a request, raw paths must be normalised into canonical templates (e.g. `/users/{id}`, `/orders/{orderId}/items/{itemId}`). The normalisation strategy must handle known URL shapes reliably and predictably, but also avoid blocking developers when they encounter a new endpoint that has no configured pattern. The system must balance determinism (configured patterns produce repeatable results) with adaptability (unknown paths should not require a configuration change before they work).

---

## 2. Decision

> We will use a hybrid URL template normalisation strategy.

---

## 3. Rationale

Configured regex patterns give teams full control over how their upstream URLs map to templates — the mapping is explicit, reviewable, and deterministic. When a developer encounters a new endpoint shape, the AI inference fallback generates a reasonable template without requiring a configuration change or cross-team coordination. This two-tier approach means the system works correctly from the first request to any endpoint while allowing teams to harden their patterns over time. The `persistLearnedPatterns` option bridges the gap by writing inferred patterns back to configuration for future deterministic matching.

---

## 4. Alternatives Considered

### Regex-only normalisation (no AI fallback)
**Why rejected:** A regex-only approach requires every URL pattern to be configured before first use. In a large multi-service repository, upstream APIs evolve frequently and new endpoints appear without notice. Requiring configuration changes before recording blocks developers and creates cross-team coordination overhead — exactly the friction Mockery is designed to eliminate. Unmatched paths would either fail or produce un-normalised keys, causing duplicate recordings.

### AI-only normalisation (no configured patterns)
**Why rejected:** Relying solely on AI inference introduces non-determinism — the same path might produce different templates across runs depending on model behaviour. This makes cache key stability unpredictable and could cause phantom cache misses. AI calls also add latency to every normalisation step rather than just unrecognised paths. Teams would lose the ability to enforce specific template shapes for their services.

### Heuristic-based normalisation (e.g. detect GUIDs, integers automatically)
**Why rejected:** Simple heuristics (replace GUIDs with `{id}`, integers with `{n}`) cover common cases but fail on non-standard identifiers like slugs, composite keys, or base64-encoded tokens. Heuristics cannot distinguish between path segments that are parameters and those that are fixed route components (e.g. `/users/active` vs `/users/42`). The false-positive rate would require frequent manual correction, undermining the zero-maintenance goal.

---

## 5. Consequences

### Positive Consequences
- Known URL shapes are matched deterministically with zero latency via configured regex patterns
- Unknown paths are handled gracefully without blocking the developer or requiring configuration changes
- Teams can progressively harden their configuration by reviewing and committing AI-inferred patterns
- The `persistLearnedPatterns` option creates a natural feedback loop from inference to deterministic matching

### Trade-offs Accepted
- AI inference introduces a Copilot SDK dependency on the record path for unrecognised URLs; if the SDK is unavailable and no pattern matches, the system falls back to a raw-path key with a logged warning, which may cause duplicate recordings
- Inferred templates may not match the team's preferred naming conventions (e.g. `{param1}` instead of `{userId}`); teams should review persisted patterns and adjust names in configuration
- Two normalisation code paths (regex + AI) increase implementation complexity compared to a single strategy; mitigated by the UrlNormaliser encapsulating both behind a single interface

---

## 6. Related Decisions

- [ADR-0002: Filesystem mock store](ADR-0002-filesystem-mock-store.md) — normalised templates directly determine the file paths used in the mock store
- [ADR-0004: AI transform agent for response sanitisation](ADR-0004-ai-transform-agent-for-sanitisation.md) — both this decision and ADR-0004 depend on the GitHub Copilot SDK as an AI runtime

---

*This ADR is part of the [Architecture Decision Records index](README.md).*
