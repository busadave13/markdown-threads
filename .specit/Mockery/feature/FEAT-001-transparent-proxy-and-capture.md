# FEAT-001: Transparent Proxy and Capture

> **Version**: 1.0.0<br>
> **Created**: 2026-04-12<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Implemented

## Goal

Transparent Proxy and Capture is the core request-interception pipeline of Mockery. It receives inbound HTTP requests, determines whether a recorded mock exists for the normalised cache key, replays the cached response when one is found, and forwards to the real upstream when one is not — capturing and persisting the sanitised response for future replay.

## Motivation

Transparent Proxy and Capture eliminates cascading dependency startup overhead and removes the need for teams to hand-maintain per-service stub files. This directly supports [PRD](../PRD.md) Goals 1 and 2 by enabling automatic record-and-replay of upstream responses without manual intervention. Without this feature, developers must either run the full upstream dependency tree or manually create and maintain stub files for every endpoint they depend on.

## User Stories

- As a **Service Developer**, I want outbound HTTP calls to configured upstream services to be transparently proxied so that I can develop my service without running the full upstream dependency tree.
- As a **Service Developer**, I want the first call to an uncached endpoint to be forwarded to the real upstream and the response automatically captured so that I never need to hand-author stub files for upstream dependencies.
- As a **Service Developer**, I want subsequent requests to a cached endpoint to be served from the local mock store with sub-millisecond latency so that my development workflow is fast and predictable.
- As a **Platform / Developer Experience Team** member, I want the proxy to intercept requests transparently — without requiring changes to consumer HTTP client code — so that onboarding teams is frictionless.

## Acceptance Criteria

- [ ] When a request targets an upstream endpoint with no cached mock, the proxy forwards it to the real upstream and returns the response to the caller (FR-001).
- [ ] When the first call to an uncached endpoint returns successfully, the proxy stores the captured response (status code, headers, body) as a sanitised mock file via `MockStore.SaveAsync` (FR-002).
- [ ] When a subsequent request matches a normalised URL pattern with a cached mock, the proxy replays it from `MockStore.GetAsync` without contacting upstream (FR-003).
- [ ] Cached mock responses are served with sub-millisecond latency from the local store — the replay path performs only `MockStore.ExistsAsync` + `MockStore.GetAsync` with no upstream HTTP call and no AI transform call (FR-009).
- [ ] The proxy intercepts requests transparently — no changes to the consumer's HTTP client code or business logic are required; the consumer sends HTTP requests to the proxy address with appropriate routing headers (FR-013).
- [ ] Non-GET requests (POST, PUT, PATCH, DELETE) use HTTP method + normalised URL pattern as the cache key, ignoring request body content (FR-014).
- [ ] When the upstream service is unreachable during the record path, the proxy returns HTTP 502 Bad Gateway with a structured JSON error body and does not write a mock blob.
- [ ] When the AI transform agent fails during the record path, the proxy returns HTTP 503 Service Unavailable, does not persist the raw (unsanitised) upstream response, and a retry re-fetches from upstream.
- [ ] When `MockStore` operations fail (read or write), the proxy returns HTTP 500 with a diagnostic message; on write failure during recording, the sanitised response is still returned to the caller but not persisted.
- [ ] Internal `X-Mockery-*` headers (`X-Mockery-Service`, `X-Mockery-Caller`, `X-Mockery-Intercepted`) are stripped from the outbound request before forwarding to the real upstream service.

## API / Interface Definition

ProxyMiddleware is an ASP.NET Core `IMiddleware` that intercepts all inbound HTTP requests — it does not expose a versioned REST API. The interface contract is defined by the HTTP request/response flow through the middleware pipeline.

### Authorization

None — Mockery is a development-only tool. All callers within the local network or development cluster boundary are trusted. No authentication or authorisation is enforced on inbound requests (see ARCHITECTURE.md: Security & Trust Boundary).

### Inbound request contract

```
[ANY METHOD] /{path}
X-Mockery-Service: {serviceName}    — required in Header routing mode; identifies target upstream
X-Mockery-Caller: {callerName}      — optional; caller identity for observability
X-Mockery-Intercepted: 1            — optional; loop prevention marker (set by MockeryHttpHandler)
Host: {hostname}                    — used for routing in Host/Auto mode (AKS)
```

| Header | Type | Required | Description |
|---|---|---|---|
| `X-Mockery-Service` | `string` | Yes (Header/Auto mode) | Unique service name matching `Mockery:Services:N:Name` in configuration |
| `X-Mockery-Caller` | `string` | No | Calling service identity; logged for observability, not used in routing |
| `X-Mockery-Intercepted` | `string` | No | Loop prevention flag; presence indicates the request was already intercepted by a `MockeryHttpHandler` |
| `Host` | `string` | Yes (Host/Auto mode) | Matched against `Mockery:Services:N:Hostname` for service resolution in AKS |

### Replay response (cache hit)

```
HTTP/{version} {recordedStatusCode}
Content-Type: {recordedContentType}
X-Mockery-Cache: HIT

{recordedBody}
```

| Field | Type | Description |
|---|---|---|
| Status code | `int` | The HTTP status code from the original recorded upstream response |
| `X-Mockery-Cache` | `string` | `"HIT"` — indicates this response was served from the mock store |
| Body | `string` (JSON) | The sanitised response body as stored in the mock blob |

### Record response (cache miss — first call)

```
HTTP/{version} {upstreamStatusCode}
Content-Type: {upstreamContentType}
X-Mockery-Cache: MISS

{sanitisedBody}
```

| Field | Type | Description |
|---|---|---|
| Status code | `int` | The HTTP status code from the real upstream response |
| `X-Mockery-Cache` | `string` | `"MISS"` — indicates this response was fetched from upstream and recorded |
| Body | `string` (JSON) | The sanitised response body (PII removed by AiTransformAgent) |

### Error responses

| Status | Condition | Body |
|---|---|---|
| `400 Bad Request` | `{ "error": "MISSING_SERVICE_HEADER", "message": "X-Mockery-Service header is required when routing mode is Header." }` | Service header missing in Header routing mode and Host header does not match any configured service |
| `404 Not Found` | `{ "error": "UNKNOWN_SERVICE", "message": "No configured service matches '{serviceName}'." }` | The `X-Mockery-Service` value or `Host` header does not match any entry in `Mockery:Services` |
| `502 Bad Gateway` | `{ "error": "UPSTREAM_UNREACHABLE", "message": "Failed to connect to upstream service '{serviceName}' at '{upstreamUrl}'.", "service": "{serviceName}", "upstreamUrl": "{upstreamUrl}" }` | Upstream service is unreachable during the record path |
| `503 Service Unavailable` | `{ "error": "SANITISATION_FAILED", "message": "AI transform agent failed to sanitise the upstream response. The raw response was not persisted. Retry the request.", "service": "{serviceName}" }` | AiTransformAgent threw an exception during PII sanitisation |
| `500 Internal Server Error` | `{ "error": "STORE_FAILURE", "message": "MockStore operation failed: {exceptionMessage}", "service": "{serviceName}" }` | `MockStore.ExistsAsync`, `GetAsync`, or `SaveAsync` threw a `RequestFailedException` |

## Data Model

ProxyMiddleware does not own a persistent data model — it delegates storage to `MockStore` (FEAT-005). However, it constructs and consumes the following internal types:

### CacheKey (value object — pure, no I/O)

```csharp
CacheKey {
    ServiceName: string    — unique service identifier from configuration
    HttpMethod:  string    — uppercase HTTP method (GET, POST, PUT, PATCH, DELETE)
    Template:    string    — normalised URL template from UrlNormaliser (e.g. "/users/{id}")
}
```

`CacheKey.ToString()` returns the deterministic composite key string used by `MockStore` for blob naming: `"{ServiceName}/{HttpMethod}{Template}"` (e.g. `orders-api/GET/orders/{orderId}`).

### MockResponse (DTO — serialised to/from JSON blob)

```csharp
MockResponse {
    StatusCode:        int                        — HTTP status code from the upstream response
    Headers:           Dictionary<string, string[]> — response headers (sanitised, multi-value, excluding hop-by-hop headers)
    Body:              string                      — sanitised response body (JSON string)
    RecordedAt:        DateTimeOffset              — UTC timestamp when the mock was recorded
    AiTransformApplied: bool                       — true if the AI transform agent processed this response
    OriginalBodyHash:  string                      — SHA-256 hash of the pre-sanitisation body for drift detection
}
```

### ProxyResult (internal — not persisted)

```csharp
ProxyResult {
    Response:    MockResponse   — the response to return to the caller
    CacheStatus: string         — "HIT" or "MISS"
    CacheKey:    CacheKey       — the resolved cache key for logging/tracing
}
```

## Edge Cases & Error Handling

| Scenario | Expected behaviour |
|---|---|
| Upstream returns a non-2xx status code (e.g. 404, 500) during first-call recording | The proxy does **not** record the response as a mock. It returns the upstream's status code and body to the caller verbatim (after sanitisation). Only 2xx responses are persisted to avoid caching error states. |
| Upstream returns an empty body (Content-Length: 0) with a 2xx status | The proxy records the empty-body response as a valid mock with `Body: ""`. Subsequent replays return the same empty body with the recorded status code. |
| Two concurrent first-call requests arrive for the same uncached endpoint | Both requests are forwarded to the upstream. The second `MockStore.SaveAsync` overwrites the first's blob (last-writer-wins). Both callers receive valid sanitised responses. No locking is performed — the recording is idempotent for the same endpoint. |
| Request path contains encoded characters (e.g. `/users/John%20Doe`) | The path is URL-decoded before being passed to `UrlNormaliser`. The normalised template and cache key use decoded path segments. |
| `X-Mockery-Service` header contains a value not matching any configured service | The proxy returns HTTP 404 with `UNKNOWN_SERVICE` error body. No upstream call is made. |
| Upstream response body exceeds 10 MB | The proxy truncates the body at 10 MB, logs a warning with the original `Content-Length`, and records the truncated version. The `MockResponse.Headers` dictionary retains the original `Content-Length` for reference. |
| Request includes `X-Mockery-Intercepted` header | ProxyMiddleware does not treat this header specially — it is informational. Loop prevention is handled by `MockeryHttpHandler` on the client side (FEAT-007). The header is stripped before forwarding to upstream. |
| `Mockery:Services` configuration is empty (no services configured) | All requests return HTTP 404 with `UNKNOWN_SERVICE` error. The proxy starts successfully but cannot route any traffic. A warning is logged at startup. |
| `MockStore` write fails but read succeeds (partial storage outage) | During recording, the sanitised response is returned to the caller with `X-Mockery-Cache: MISS`. An error is logged. The next identical request will attempt to record again since no blob was persisted. |

## Preservation Constraints

- Existing HTTP client code in calling services must not require changes when the proxy is introduced or updated.
- Proxy must remain backward-compatible with any existing mock data previously recorded in the mock store.
- Configuration format for `Mockery:Services` entries must remain backward-compatible with existing service definitions.
- Health check endpoints must continue to respond during mode transitions between record and replay paths.
- Existing Aspire integration points (resource registration, service discovery) must not break when proxy behaviour changes.
- The `X-Mockery-Cache` response header contract (`HIT`/`MISS`) must remain stable for any downstream tooling or observability that depends on it.

## Out of Scope

- URL normalisation logic — pattern matching and AI inference are implemented by `UrlNormaliser` (FEAT-003).
- AI sanitisation logic — PII removal is implemented by `AiTransformAgent` (FEAT-004).
- Mock store implementation — blob storage read/write operations are implemented by `MockStore` (FEAT-005).
- `MockeryHttpHandler` client-side interception — outbound `HttpClient` rewriting is implemented in the `Mockery.Client` shared project (FEAT-007).
- Aspire integration — `AddMockProxy()` registration and service discovery are implemented in `Mockery.Aspire` (FEAT-008).
- Manual mock authoring — creating or uploading mock files for endpoints that do not yet exist (separate feature, see PRD).
- Cache invalidation or expiration — recorded mocks have no TTL and are not automatically refreshed when upstream responses change; re-recording requires manual deletion of the existing blob.

## Dependencies

- Requires: `UrlNormaliser` interface (FEAT-003) — ProxyMiddleware calls `IUrlNormaliser.NormaliseAsync(path)` to obtain canonical URL templates for cache key construction.
- Requires: `AiTransformAgent` interface (FEAT-004) — ProxyMiddleware calls `IAiTransformAgent.TransformAsync(response, config)` to sanitise upstream responses before persistence.
- Requires: `MockStore` interface (FEAT-005) — ProxyMiddleware calls `IMockStore.ExistsAsync(key)`, `IMockStore.GetAsync(key)`, and `IMockStore.SaveAsync(key, response)` for cache operations.
- Requires: `ServiceRouter` — resolves target upstream URL and per-service configuration from `X-Mockery-Service` / `Host` header. ServiceRouter is an internal component of the proxy, not a separate feature spec.
- Requires: `CacheKey` — pure value object that builds deterministic composite keys. Internal component, not a separate feature spec.
- References: [ADR-0001](../adr/ADR-0001-single-shared-proxy-instance.md) — single shared proxy instance architecture.
- References: [ADR-0005](../adr/ADR-0005-caller-to-service-routing.md) — environment-adaptive service routing strategy.
- References: [ADR-0006](../adr/ADR-0006-azure-blob-storage-mock-store.md) — Azure Blob Storage mock store with Azurite emulation.

## Open Questions

None.
