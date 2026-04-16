# FEAT-004: AI Response Sanitisation

> **Version**: 1.1.0<br>
> **Created**: 2026-04-12<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Approved

## Goal

Ensure that every upstream HTTP response captured during the recording path is sanitised by an AI transform agent before any data reaches the mock store or the caller, guaranteeing that no personally identifiable information appears in recorded mocks committed to source control or stored in blob storage. The sanitisation is driven by per-service natural language transform instructions and powered by the GitHub Copilot SDK, as mandated by ADR-0004.

## Motivation

Recorded mocks may contain personally identifiable information from upstream responses — names, emails, government identifiers — that must never appear in source control or shared storage. This feature directly delivers [PRD](../PRD.md) Goal 3 ("Guarantee that no personally identifiable information appears in captured mock data") and satisfies FR-004 and FR-005. Without inline AI sanitisation, teams would need to manually scrub captured responses or risk PII leakage into developer workstations and repositories.

## User Stories

- As a **Service Developer**, I want captured upstream responses to be automatically sanitised of PII so that I can commit and share recorded mocks without risk of exposing sensitive data.
- As a **Security / Compliance** team member, I want all PII removed from captured responses in-line — before any data reaches blob storage — so that developer workstations and source control never contain personally identifiable information.
- As an **Upstream Service Team** member, I want to define natural language transform instructions for my service's responses so that I control what is sanitised without writing per-field rules or coordinating with consumer teams.
- As a **Platform / Developer Experience Team** member, I want sanitisation failures to reject the recording rather than persisting raw data so that the system fails safe and PII never leaks into the mock store.

## Acceptance Criteria

- [ ] When an upstream response is captured on the record path, the `AiTransformAgent` sanitises it using the per-service `Transform:Instructions` before any data is written to MockStore — raw upstream response data never reaches blob storage (FR-004, FR-005).
- [ ] The sanitised response — not the raw upstream response — is returned to the caller on the record path, so the caller never receives unsanitised PII from Mockery.
- [ ] When `Transform:PreserveStructure` is `true` for a service, the AI agent preserves the JSON object structure (all keys, nesting, and array lengths) and only replaces field values containing PII with synthetic replacements.
- [ ] When `Transform:PreserveStructure` is `false` for a service, the AI agent may remove fields entirely or restructure the response as needed to eliminate PII.
- [ ] When the `Transform:Instructions` for a service are empty (`""`), the AI agent applies a default PII removal pass (names, emails, phone numbers, government identifiers, addresses) without service-specific guidance.
- [ ] When the AI transform agent fails (Copilot SDK unreachable, timeout, or model error), ProxyMiddleware rejects the recording — the raw upstream response is **not** persisted to MockStore and the caller receives HTTP 503 with the error body `{ "error": "SANITISATION_FAILED", "message": "AI transform agent failed; raw response was not persisted to prevent PII leakage." }`.
- [ ] When the AI transform agent fails, no partial or raw response data is written to blob storage — the failure is atomic (nothing persisted).
- [ ] The `aiTransformApplied` metadata flag is set to `true` on every mock blob written by the record path, confirming sanitisation was applied.
- [ ] The `originalBodyHash` metadata field is set to the SHA-256 hex digest of the raw upstream response body on every mock blob, enabling drift detection without storing original content.
- [ ] Sanitisation operates only on JSON response bodies — non-JSON content types are not processed by the AI transform agent in v1.

## API / Interface Definition

N/A — AI Response Sanitisation is an internal pipeline component within ProxyMiddleware and does not expose an external-facing HTTP API. Its behaviour is invoked automatically on the record path and configured via the existing `Mockery:Services:N:Transform` configuration section.

### Authorization

None — `IAiTransformAgent` is an internal pipeline component with no external-facing surface. It is invoked by ProxyMiddleware within the proxy process (see ARCHITECTURE.md: Security & Trust Boundary).

### Internal interface: `IAiTransformAgent`

Defined in the Core layer; implemented in Infrastructure via the GitHub Copilot SDK.

```csharp
// Mockery.Core — interface
namespace Mockery.Core.Sanitisation;

public interface IAiTransformAgent
{
    /// <summary>
    /// Sanitises a raw upstream JSON response body by removing or replacing PII
    /// according to per-service transform instructions.
    /// </summary>
    /// <param name="responseBody">Raw JSON response body from upstream</param>
    /// <param name="transformConfig">Per-service transform configuration</param>
    /// <param name="cancellationToken">Cancellation token</param>
    /// <returns>Transform result containing the sanitised body and original body hash</returns>
    Task<TransformResult> TransformAsync(
        string responseBody,
        TransformConfig transformConfig,
        CancellationToken cancellationToken = default);
}

public sealed record TransformConfig
{
    /// <summary>Natural language instructions describing what to sanitise (may be empty)</summary>
    public required string Instructions { get; init; }

    /// <summary>When true, preserve JSON keys/structure and replace values only</summary>
    public required bool PreserveStructure { get; init; }
}

public sealed record TransformResult
{
    /// <summary>Sanitised JSON response body</summary>
    public required string SanitisedBody { get; init; }

    /// <summary>SHA-256 hex digest of the raw input body (64 characters, lowercase)</summary>
    public required string OriginalBodyHash { get; init; }
}
```

### Error response returned by ProxyMiddleware when sanitisation fails

```
HTTP/1.1 503 Service Unavailable
Content-Type: application/json

{
  "error": "SANITISATION_FAILED",
  "message": "AI transform agent failed; raw response was not persisted to prevent PII leakage."
}
```

### Configuration (existing section — no new keys)

| Key | Type | Default | Description |
|---|---|---|---|
| `Mockery:Services:N:Transform:Instructions` | `string` | `""` | Natural language instructions describing what to sanitise for this service |
| `Mockery:Services:N:Transform:PreserveStructure` | `bool` | `true` | When `true`, preserve JSON structure and only replace field values |

## Data Model

### Mock blob metadata (written by MockStore on record path)

All fields below are set as blob metadata on each recorded mock blob in Azure Blob Storage / Azurite. These extend the existing mock blob structure — no new blob containers or entities are introduced.

```
MockBlobMetadata {
  recordedAt:          string (ISO 8601 timestamp) — when the mock was recorded
  aiTransformApplied:  bool                        — true if AI sanitisation was applied to this blob
  originalBodyHash:    string (SHA-256 hex, 64 chars) — hash of the raw upstream body before sanitisation
  serviceName:         string                       — the upstream service name from configuration
  httpMethod:          string                       — HTTP method (GET, POST, PUT, PATCH, DELETE)
  urlTemplate:         string                       — normalised URL template used as part of the cache key
}
```

### AiTransformAgent prompt structure (internal)

The agent constructs a system prompt from `TransformConfig` and sends the raw response body as the user message to the Copilot SDK:

```
SystemPrompt {
  role:               "system"
  preserveStructure:  bool   — from TransformConfig.preserveStructure
  instructions:       string — from TransformConfig.instructions (or default PII removal instructions if empty)
}

UserMessage {
  role:               "user"
  content:            string — the raw JSON response body to sanitise
}
```

## Edge Cases & Error Handling

| Scenario | Expected behaviour |
|---|---|
| Copilot SDK is unreachable (network failure, DNS resolution failure) | `AiTransformAgent.TransformAsync()` throws; ProxyMiddleware catches the exception, logs at `Error` level with service name and URL template, does **not** persist any data to MockStore, and returns HTTP 503 with `SANITISATION_FAILED` error body to the caller. |
| Copilot SDK returns a timeout (request exceeds SDK client timeout) | Same as unreachable — recording rejected, HTTP 503 returned, nothing persisted. The SDK client timeout is inherited from the default `CopilotClient` configuration. |
| AI model returns malformed JSON when `PreserveStructure` is `true` | `AiTransformAgent` validates that the returned body is valid JSON and structurally matches the input (same top-level keys). If validation fails, the agent treats it as a transform failure — recording rejected, HTTP 503 returned, nothing persisted. |
| AI model returns an empty body or whitespace-only response | `AiTransformAgent` treats an empty or whitespace-only model response as a transform failure — recording rejected, HTTP 503 returned, nothing persisted. |
| Upstream response body is not valid JSON (e.g. HTML error page, plain text) | ProxyMiddleware skips AI sanitisation entirely — the non-JSON response is **not** recorded to MockStore and is returned to the caller as-is from the upstream. A warning is logged: "Non-JSON response from {service}; skipping sanitisation and recording." |
| Upstream response body is valid JSON but empty object `{}` or empty array `[]` | Sanitisation is applied normally (the AI agent receives the empty structure). Since there is no PII to remove, the response passes through unchanged and is persisted. |
| `Transform:Instructions` is empty string and `PreserveStructure` is `true` | The agent applies default PII removal instructions ("Remove or replace all personally identifiable information including names, email addresses, phone numbers, government identifiers, and physical addresses. Replace with realistic synthetic values.") while preserving JSON structure. |
| Upstream returns a very large JSON body (>1 MB) | The agent sends the full body to the Copilot SDK. If the SDK rejects the request due to token limits, this surfaces as a transform failure — recording rejected, HTTP 503 returned, nothing persisted. A warning is logged with the body size. |
| Concurrent record requests for the same cache key | The first request to complete sanitisation and call `MockStore.SaveAsync()` wins. Subsequent requests that arrive before the first completes will also attempt the full record path (upstream call + sanitisation + save). MockStore's blob PUT is last-writer-wins — the final sanitised result persists. No data corruption occurs because all persisted data is sanitised. |
| Replay path (mock already exists) | AI sanitisation is **not** invoked on the replay path — `AiTransformAgent` is only called during recording. Cached mocks are returned directly from MockStore without re-processing. |

## Preservation Constraints

- Preserve the record-path ordering: `ProxyMiddleware` must continue to receive the upstream response, call `AiTransformAgent.TransformAsync()`, and only then call `MockStore.SaveAsync()` with the sanitised payload.
- Preserve the fail-safe contract: sanitisation failures must reject the recording, must not persist raw upstream content, and must return HTTP 503 with `SANITISATION_FAILED`.
- Preserve the existing configuration surface under `Mockery:Services:N:Transform`; do not add new sanitisation keys or change the meaning of `Instructions` and `PreserveStructure`.
- Preserve the replay path: cached mocks are returned directly from `MockStore` without re-running AI sanitisation.
- Preserve the existing storage backend contract: sanitised responses continue to be written through `MockStore` to Azure Blob Storage in AKS/production and Azurite locally.

## Out of Scope

- Non-JSON response body sanitisation — v1 targets JSON only; HTML, XML, plain text, and binary responses from upstreams are not sanitised or recorded.
- Custom sanitisation plugins or rule engines — v1 uses AI-only sanitisation via the Copilot SDK; no extensibility mechanism for third-party or rule-based sanitisation.
- PII detection reporting or audit logging beyond the `aiTransformApplied` metadata flag — no detailed report of what PII was detected or what replacements were made.
- Sanitisation of request bodies — only upstream response bodies are sanitised; request bodies sent by callers are not inspected or transformed.
- Configurable SDK timeout or retry policies for the AI transform agent — v1 uses default `CopilotClient` timeout and no automatic retries; a failed transform always results in a rejected recording.

## Dependencies

- **ADR-0004**: [AI transform agent for response sanitisation](../adr/ADR-0004-ai-transform-agent-for-sanitisation.md) — establishes the Copilot SDK agent approach and per-service natural language instructions pattern
- **GitHub Copilot SDK** (`CopilotClient`, `AsAIAgent()`): Organisation-licensed AI service used to power the transform agent; must be available on the record path
- **MockStore** (`IMockStore`): Blob storage abstraction that persists sanitised responses; `AiTransformAgent` must complete before `MockStore.SaveAsync()` is called
- **ProxyMiddleware**: Orchestrates the record path pipeline; calls `AiTransformAgent.TransformAsync()` between upstream response receipt and `MockStore.SaveAsync()`
- **ServiceRouter**: Provides per-service `TransformConfig` (instructions + preserveStructure flag) resolved from `Mockery:Services:N:Transform` configuration

## Open Questions

None.
