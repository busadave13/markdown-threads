# FEAT-003: URL Template Normalisation

> **Version**: 1.1.0<br>
> **Created**: 2026-04-12<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Draft

## Goal

URL Template Normalisation converts raw request paths into canonical URL templates so that a single recorded mock covers all parametric variants of an endpoint (e.g. `/users/42` and `/users/99` both resolve to `/users/{id}`). The normaliser uses configured regex patterns for deterministic matching, falls back to AI inference via the GitHub Copilot SDK for unrecognised paths (ADR-0003), and produces deterministic cache keys that the MockStore uses for record-or-replay decisions.

## Motivation

Without URL normalisation, teams would need to record separate mocks for every parameter combination — an unsustainable maintenance burden as the number of endpoints and parameter values grows. This directly supports [PRD](../PRD.md) Goal 2 (eliminating manual stub maintenance) by ensuring that a single recorded mock covers all parametric variants of an endpoint. The AI inference fallback (FR-006, FR-007, FR-008) further reduces manual work by automatically handling new URL shapes that lack configured patterns.

## User Stories

- As a **Service Developer**, I want request paths to be automatically normalised into URL templates so that one recorded mock covers all parametric variants of an endpoint without manual configuration for every ID value.
- As a **Service Developer**, I want unknown URL shapes to be inferred by AI so that I am not blocked when an upstream adds a new endpoint that has no configured pattern.
- As a **Platform / Developer Experience Team** member, I want AI-inferred patterns to optionally persist back to configuration so that the system progressively hardens from inference to deterministic matching.
- As a **Platform / Developer Experience Team** member, I want cache keys to be deterministic and composed of service name, HTTP method, and canonical URL template so that mock lookups are predictable and repeatable.

## Acceptance Criteria

- [ ] When an upstream response is captured, `UrlNormaliser` converts the raw request path into a canonical URL template by matching it against configured regex patterns (FR-006).
- [ ] When the request path matches at least one configured `UrlPatterns` rule, the corresponding template is returned without invoking AI inference (FR-007).
- [ ] When no configured rule matches and `Mockery:AiInference:Enabled` is `true`, the system invokes `AiPatternInferenceAgent` to infer a URL template from the raw path (FR-008).
- [ ] When no configured rule matches and `Mockery:AiInference:Enabled` is `false`, the system returns the raw path as a fallback template and logs a warning at `Warning` level.
- [ ] `CacheKey.Build(serviceName, httpMethod, canonicalTemplate)` returns a deterministic string that is identical for any two calls with the same three inputs.
- [ ] `CacheKey.Build` is a pure function — it performs no I/O, no external service calls, and no async operations.
- [ ] Non-GET requests (POST, PUT, PATCH, DELETE) use HTTP method + normalised URL template as the cache key; request body content is not included (FR-014).
- [ ] When `Mockery:AiInference:PersistLearnedPatterns` is `true`, AI-inferred patterns are written back to configuration so that subsequent requests for the same URL shape use deterministic regex matching.
- [ ] When `Mockery:AiInference:PersistLearnedPatterns` is `false`, AI-inferred patterns are used for the current request only and are not persisted.
- [ ] Configured regex patterns are evaluated in declaration order; the first matching pattern wins.
- [ ] The normalised template uses `{paramName}` placeholder syntax (e.g. `/users/{id}`, `/orders/{orderId}/items/{itemId}`).

## API / Interface Definition

N/A — this feature defines internal components (`UrlNormaliser`, `CacheKey`, `AiPatternInferenceAgent`) consumed within the proxy pipeline. There is no external HTTP API surface. The components are invoked by `ProxyMiddleware` as part of the request processing flow described in ARCHITECTURE.md.

### Internal Component Contracts

#### UrlNormaliser

```csharp
public interface IUrlNormaliser
{
    /// <summary>
    /// Normalises a raw request path into a canonical URL template.
    /// Tries configured regex patterns first, then AI inference fallback.
    /// </summary>
    /// <param name="serviceName">Name of the upstream service (from ServiceRouter)</param>
    /// <param name="rawPath">Raw request path (e.g. "/users/42/orders/abc-123")</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Normalisation result containing the canonical template and source</returns>
    Task<NormalisationResult> NormaliseAsync(
        string serviceName,
        string rawPath,
        CancellationToken cancellationToken = default);
}

public sealed record NormalisationResult
{
    /// <summary>Canonical URL template (e.g. "/users/{id}/orders/{orderId}")</summary>
    public required string Template { get; init; }

    /// <summary>How the template was resolved</summary>
    public required NormalisationSource Source { get; init; }
}

public enum NormalisationSource
{
    /// <summary>Matched a configured regex pattern</summary>
    ConfiguredPattern,

    /// <summary>Inferred by AiPatternInferenceAgent</summary>
    AiInference,

    /// <summary>No pattern matched and AI is disabled — raw path used as-is</summary>
    RawPathFallback
}
```

#### CacheKey

```csharp
public static class CacheKey
{
    /// <summary>
    /// Builds a deterministic cache key from the composite parts.
    /// Pure function — no I/O, no side effects.
    /// </summary>
    /// <param name="serviceName">Upstream service name (e.g. "orders-api")</param>
    /// <param name="httpMethod">HTTP method in uppercase (e.g. "GET", "POST")</param>
    /// <param name="canonicalTemplate">Normalised URL template (e.g. "/users/{id}")</param>
    /// <returns>Deterministic composite key string</returns>
    public static string Build(string serviceName, string httpMethod, string canonicalTemplate);
}
```

**CacheKey format**: `{serviceName}/{httpMethod}{canonicalTemplate}`

Examples:
- `CacheKey.Build("orders-api", "GET", "/orders/{orderId}")` → `"orders-api/GET/orders/{orderId}"`
- `CacheKey.Build("users-api", "POST", "/users/{id}/activate")` → `"users-api/POST/users/{id}/activate"`

**Validation rules** (enforced inside `Build`):

| Parameter | Rule | On violation |
|---|---|---|
| `serviceName` | Must be non-null, non-empty, non-whitespace | Throw `ArgumentException` with message `"serviceName must be a non-empty string"` |
| `httpMethod` | Must be non-null, non-empty, non-whitespace | Throw `ArgumentException` with message `"httpMethod must be a non-empty string"` |
| `canonicalTemplate` | Must be non-null, must start with `/` | Throw `ArgumentException` with message `"canonicalTemplate must start with '/'"` |
| `httpMethod` | Normalised to uppercase internally | No error — `"get"` and `"GET"` produce the same key |

#### AiPatternInferenceAgent

```csharp
public interface IAiPatternInferenceAgent
{
    /// <summary>
    /// Infers a canonical URL template from a raw request path using
    /// the GitHub Copilot SDK. Optionally persists the learned pattern.
    /// </summary>
    /// <param name="serviceName">Name of the upstream service</param>
    /// <param name="rawPath">Raw request path to infer a template for</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Inferred canonical URL template string</returns>
    Task<string> InferTemplateAsync(
        string serviceName,
        string rawPath,
        CancellationToken cancellationToken = default);
}
```

## Data Model

### UrlPatternRule (configuration-bound, read-only at runtime)

```
UrlPatternRule {
    Pattern:   string  — Regex pattern matched against inbound request paths (e.g. "^/users/[^/]+$")
    Template:  string  — Canonical URL template that replaces matched paths (e.g. "/users/{id}")
}
```

Bound from `Mockery:Services:N:UrlPatterns:N` via `IOptions<T>`. Each service has an ordered list of `UrlPatternRule` entries. Rules are evaluated in declaration order; the first match wins.

### NormalisationResult (in-memory value object)

```
NormalisationResult {
    Template:  string               — Canonical URL template (e.g. "/users/{id}")
    Source:    NormalisationSource   — ConfiguredPattern | AiInference | RawPathFallback
}
```

### CacheKey output (string, not persisted as a separate entity)

```
Format: "{serviceName}/{httpMethod}{canonicalTemplate}"
Example: "orders-api/GET/orders/{orderId}/items/{itemId}"
```

The cache key string is passed to `MockStore.ExistsAsync(key)` and `MockStore.GetAsync(key)` — it maps directly to a blob path in Azure Blob Storage / Azurite.

## Edge Cases & Error Handling

| Scenario | Expected behaviour |
|---|---|
| Raw path matches multiple configured patterns | The first pattern in declaration order wins; subsequent matches are ignored. `NormalisationResult.Source` is `ConfiguredPattern`. |
| Raw path matches zero configured patterns and AI inference is enabled | `AiPatternInferenceAgent.InferTemplateAsync` is called. `NormalisationResult.Source` is `AiInference`. |
| Raw path matches zero configured patterns and AI inference is disabled (`Mockery:AiInference:Enabled` = `false`) | The raw path is returned as the template verbatim. `NormalisationResult.Source` is `RawPathFallback`. A warning is logged: `"No configured URL pattern matched for {serviceName} path '{rawPath}'; AI inference is disabled — using raw path as cache key"`. |
| AI inference call fails (Copilot SDK error, timeout, network failure) | `UrlNormaliser` catches the exception, logs an `Error`-level message with the exception details, and falls back to the raw path as the template. `NormalisationResult.Source` is `RawPathFallback`. The request is not dropped. |
| AI inference returns an invalid template (empty string, null, or does not start with `/`) | `UrlNormaliser` treats the result as a failure, logs a `Warning`-level message, and falls back to the raw path. `NormalisationResult.Source` is `RawPathFallback`. |
| `CacheKey.Build` receives null or empty `serviceName` | Throws `ArgumentException` with message `"serviceName must be a non-empty string"`. |
| `CacheKey.Build` receives null or empty `httpMethod` | Throws `ArgumentException` with message `"httpMethod must be a non-empty string"`. |
| `CacheKey.Build` receives a `canonicalTemplate` that does not start with `/` | Throws `ArgumentException` with message `"canonicalTemplate must start with '/'"`. |
| `CacheKey.Build` receives mixed-case `httpMethod` (e.g. `"Get"`) | The method is normalised to uppercase internally; `"Get"` and `"GET"` produce identical cache keys. |
| `PersistLearnedPatterns` is `true` but configuration write fails | `AiPatternInferenceAgent` logs a `Warning`-level message and returns the inferred template normally. The failure to persist does not affect the current request's normalisation result. |
| Request path is `/` (root path) | Normalised as-is to `/`. No regex matching or AI inference needed. CacheKey output: `"{serviceName}/GET/"`. |
| Request path contains query string | Query string is stripped before normalisation. Only the path component is normalised. This is a v1 constraint — query string normalisation is out of scope. |

## Preservation Constraints

- Preserve the deterministic cache key contract: `{serviceName}/{httpMethod}{canonicalTemplate}` and the current validation behavior in `CacheKey.Build`.
- Preserve the regex-first, AI-fallback normalisation flow, including raw-path fallback when AI inference is disabled or fails.
- Preserve `UrlPatternRule` evaluation order and first-match-wins behavior for configured patterns.
- Preserve query-string stripping and root-path handling exactly as currently specified.
- Preserve the existing `Mockery:AiInference:*` and `Mockery:Services:N:UrlPatterns:N` configuration keys and their semantics.
- Preserve the current replay model where request body content is not part of the cache key.
- Preserve the warning-on-persist-failure behavior so learned-pattern writes do not break the current request.

## Out of Scope

- AI agent implementation details for sanitisation (covered by FEAT-004).
- Mock store persistence layer (covered by FEAT-005).
- Request body inclusion in cache keys — v1 uses HTTP method + URL template only for all methods including POST, PUT, PATCH (PRD constraint).
- Query string normalisation — only the path component is normalised in v1.
- Custom placeholder naming conventions — AI-inferred templates use model-chosen names (e.g. `{param1}`); teams refine names by reviewing persisted patterns in configuration.
- Cache key versioning or migration — the key format is fixed for v1.

## Dependencies

- **ADR-0003**: [URL template normalisation strategy](../adr/ADR-0003-url-template-normalisation-strategy.md) — architectural decision that mandates the configured-regex-plus-AI-fallback approach.
- **GitHub Copilot SDK**: Required for `AiPatternInferenceAgent` on the AI inference fallback path. If the SDK is unavailable and no configured pattern matches, the system degrades to raw-path fallback.
- **ServiceRouter** (resolved in ProxyMiddleware): Provides the `serviceName` input to `UrlNormaliser` and the per-service `UrlPatterns` configuration.
- **MockStore** (downstream consumer): Consumes the `CacheKey` output for blob path resolution. Defined in FEAT-005.

## Open Questions

None.
