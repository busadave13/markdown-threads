# FEAT-002: Service Routing

> **Version**: 1.1.0<br>
> **Created**: 2026-04-12<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Implemented

## Goal

Service Routing enables the Mockery proxy to resolve which upstream service an inbound request targets using environment-adaptive resolution — supporting local development via explicit headers, AKS deployment via DNS-based Host header matching, and a path-prefix fallback for callers that cannot use either. Routing behaviour adapts automatically to the deployment environment, allowing teams to add new upstream dependencies through a configuration-only change.

## Motivation

Service Routing eliminates the need for cross-team code changes when onboarding new upstream dependencies, enabling zero-code onboarding through configuration alone. This directly supports [PRD](../PRD.md) Goal 4 (zero-code onboarding of new upstream service dependencies) and Goal 1 (eliminating cascading dependency startup overhead). Without environment-adaptive routing, teams would need to maintain separate proxy configurations for local and AKS environments, increasing onboarding friction and configuration drift.

## User Stories

- As a **Service Developer**, I want inbound requests to be automatically routed to the correct upstream service based on headers or hostname so that I can develop against multiple upstream dependencies without modifying my application's HTTP client code.
- As a **Platform / Developer Experience Team** member, I want teams to onboard new upstream services by adding a configuration block so that no cross-team code changes or coordination are required.
- As a **Service Developer**, I want the proxy to return a clear error when it cannot resolve a target service so that I can diagnose routing misconfigurations quickly.
- As a **Platform / Developer Experience Team** member, I want internal `X-Mockery-*` headers stripped before requests reach upstreams so that proxy internals never leak to upstream services.

## Acceptance Criteria

- [ ] ServiceRouter resolves the target upstream using strict precedence: `X-Mockery-Service` header → `Host` header match (when `Routing:Mode` is `Host` or `Auto`) → path-prefix extraction (`/mock/{serviceName}/...`), and returns the matched service's `UpstreamUrl` and `Transform` configuration
- [ ] Adding a new upstream service requires only a new `Mockery:Services:N` configuration block — no code changes, no recompilation, no redeployment of existing services
- [ ] Each configured service entry contains `Name` (required, string), `Hostname` (optional, string), `UpstreamUrl` (required, string), `UrlPatterns` (required, array), and `Transform` (optional, object with `Instructions` and `PreserveStructure` fields)
- [ ] `Routing:Mode` is configurable with three valid values: `Header` (default — checks `X-Mockery-Service` header and path-prefix only), `Host` (checks `X-Mockery-Service` header, `Host` header, and path-prefix), `Auto` (checks all three, `X-Mockery-Service` takes precedence over `Host`)
- [ ] When no service can be resolved from the request, the proxy returns HTTP 400 with a structured JSON error body: `{ "error": "SERVICE_NOT_RESOLVED", "message": "..." }`
- [ ] All `X-Mockery-*` headers (`X-Mockery-Service`, `X-Mockery-Caller`, `X-Mockery-Intercepted`) are stripped from the forwarded request before it reaches the upstream service
- [ ] When `Routing:Mode` is `Header`, the `Host` header matching step is skipped entirely — only `X-Mockery-Service` header and path-prefix fallback are evaluated
- [ ] When `Routing:Mode` is `Host` or `Auto`, `Host` header values are matched case-insensitively against configured `Hostname` values
- [ ] Path-prefix routing strips the `/mock/{serviceName}/` prefix from the request path before forwarding to the upstream service

## API / Interface Definition

ServiceRouter is an internal component — it does not expose an external HTTP API. Its interface is consumed by ProxyMiddleware within the ASP.NET Core middleware pipeline.

### Authorization

None — `IServiceRouter` is an internal middleware contract with no external-facing surface. The proxy itself enforces no authentication or authorisation; all callers within the development trust boundary are trusted (see ARCHITECTURE.md: Security & Trust Boundary).

### Internal interface: `IServiceRouter`

```csharp
public interface IServiceRouter
{
    ServiceRouteResult? Resolve(HttpRequest request);
}
```

### Input: `HttpRequest`

ServiceRouter reads the following from the inbound `HttpRequest`:

| Source | Field | Type | Purpose |
|---|---|---|---|
| Header | `X-Mockery-Service` | `string?` | Explicit service name — highest precedence |
| Header | `Host` | `string` | Hostname for DNS-based routing in AKS |
| Path | `HttpRequest.Path` | `string` | Path-prefix extraction fallback (`/mock/{serviceName}/...`) |

### Output: `ServiceRouteResult`

```csharp
public sealed class ServiceRouteResult
{
    public required string ServiceName { get; init; }
    public required string UpstreamUrl { get; init; }
    public required IReadOnlyList<UrlPatternEntry> UrlPatterns { get; init; }
    public required TransformConfig Transform { get; init; }
    public required string ResolvedBy { get; init; }  // "header", "host", or "prefix"
    public string? StrippedPrefix { get; init; }       // non-null when resolved by prefix
}

public sealed class UrlPatternEntry
{
    public required string Pattern { get; init; }
    public required string Template { get; init; }
}

public sealed class TransformConfig
{
    public string Instructions { get; init; } = "";
    public bool PreserveStructure { get; init; } = true;
}
```

### Return behaviour

| Condition | Return value |
|---|---|
| Service resolved via any strategy | `ServiceRouteResult` with all fields populated |
| No service resolved | `null` |

### Error response (emitted by ProxyMiddleware when `Resolve` returns `null`)

```
HTTP 400 Bad Request
Content-Type: application/json

{
  "error": "SERVICE_NOT_RESOLVED",
  "message": "No upstream service could be resolved from the request. Provide an X-Mockery-Service header, use a configured hostname, or use the /mock/{serviceName}/... path prefix.",
  "routingMode": "Header | Host | Auto",
  "checkedStrategies": ["header", "prefix"]
}
```

| Field | Type | Description |
|---|---|---|
| `error` | `string` | Machine-readable error code, always `"SERVICE_NOT_RESOLVED"` |
| `message` | `string` | Human-readable description with resolution guidance |
| `routingMode` | `string` | The active `Routing:Mode` value |
| `checkedStrategies` | `string[]` | Which resolution strategies were attempted (subset of `["header", "host", "prefix"]`) |

### Header stripping (performed by ProxyMiddleware before forwarding)

The following headers are removed from the outbound request to the upstream service:

| Header | Reason |
|---|---|
| `X-Mockery-Service` | Internal routing — not part of the upstream contract |
| `X-Mockery-Caller` | Internal observability — not part of the upstream contract |
| `X-Mockery-Intercepted` | Internal loop prevention — not part of the upstream contract |

## Data Model

### Configuration model: `ServiceConfig` (bound from `Mockery:Services:N`)

```csharp
public sealed class ServiceConfig
{
    public required string Name { get; init; }         // Unique service identifier; used in header matching and blob paths
    public string Hostname { get; init; } = "";        // DNS hostname for Host-header matching (e.g. "orders-api.mockery.svc.cluster.local"); required when Routing:Mode is Host or Auto
    public required string UpstreamUrl { get; init; }  // Base URL of the real upstream service (e.g. "https://orders-api.internal:8443")
    public required IReadOnlyList<UrlPatternEntry> UrlPatterns { get; init; }  // Regex patterns for URL normalisation
    public TransformConfig Transform { get; init; } = new();  // AI sanitisation instructions
}
```

### Configuration model: `RoutingConfig` (bound from `Mockery:Routing`)

```csharp
public sealed class RoutingConfig
{
    public RoutingMode Mode { get; init; } = RoutingMode.Header;
}

public enum RoutingMode
{
    Header,  // X-Mockery-Service header + path-prefix only (default, local dev)
    Host,    // X-Mockery-Service header + Host header + path-prefix (AKS)
    Auto     // All three; X-Mockery-Service takes precedence (either environment)
}
```

### Configuration example (`appsettings.json`)

```json
{
  "Mockery": {
    "Routing": {
      "Mode": "Header"
    },
    "Services": [
      {
        "Name": "orders-api",
        "Hostname": "orders-api.mockery.svc.cluster.local",
        "UpstreamUrl": "https://orders-api.internal:8443",
        "UrlPatterns": [
          {
            "Pattern": "^/orders/[a-f0-9-]+$",
            "Template": "/orders/{id}"
          }
        ],
        "Transform": {
          "Instructions": "Replace customer names with fake names. Replace email addresses with fake@example.com.",
          "PreserveStructure": true
        }
      }
    ]
  }
}
```

### Relationships

- `ServiceConfig` is consumed by `ServiceRouter` (read-only, via `IOptions<MockeryOptions>`)
- `ServiceConfig.UrlPatterns` is consumed by `UrlNormaliser` (FEAT-003) after routing resolves the target service
- `ServiceConfig.Transform` is consumed by `AiTransformAgent` during the recording path
- `ServiceConfig.Name` is used by `CacheKey` as the service component of the composite key

## Edge Cases & Error Handling

| Scenario | Expected behaviour |
|---|---|
| Request has no `X-Mockery-Service` header and `Routing:Mode` is `Header` | ServiceRouter skips host matching, attempts path-prefix extraction; if path does not start with `/mock/{serviceName}/`, returns `null` and ProxyMiddleware responds with HTTP 400 `SERVICE_NOT_RESOLVED` |
| `X-Mockery-Service` header contains a service name not present in configuration | ServiceRouter returns `null`; ProxyMiddleware responds with HTTP 400 `SERVICE_NOT_RESOLVED` — the header value is included in the error message for diagnostics |
| `Host` header matches a configured hostname but `Routing:Mode` is `Header` | Host matching is skipped entirely; the request falls through to path-prefix extraction only |
| Multiple `ServiceConfig` entries share the same `Hostname` value | ServiceRouter matches the first entry in configuration order; a startup validation warning is logged identifying the duplicate hostname |
| `Hostname` field is empty or missing for a service and `Routing:Mode` is `Host` | That service is unreachable via Host-header routing; it can still be reached via `X-Mockery-Service` header or path-prefix; a startup warning is logged |
| Path-prefix service name (`/mock/{serviceName}/...`) contains characters not matching any configured `Name` | ServiceRouter returns `null`; ProxyMiddleware responds with HTTP 400 `SERVICE_NOT_RESOLVED` |
| `X-Mockery-Service` header is present AND `Host` header matches a different service | `X-Mockery-Service` wins — strict precedence is always enforced regardless of `Routing:Mode` |
| Request path is exactly `/mock/` or `/mock` with no service name segment | Path-prefix extraction yields an empty service name; ServiceRouter returns `null`; ProxyMiddleware responds with HTTP 400 |
| `Routing:Mode` configuration value is not one of `Header`, `Host`, `Auto` (case-insensitive) | Application fails to start with a configuration validation error logged at `Critical` level, identifying the invalid value |
| `X-Mockery-Service` header value has leading/trailing whitespace | ServiceRouter trims whitespace before matching against configured service names |

## Preservation Constraints

- The routing precedence must remain `X-Mockery-Service` header first, then `Host` header when `Routing:Mode` is `Host` or `Auto`, then `/mock/{serviceName}/...` path-prefix fallback.
- The `Routing:Mode` contract must remain limited to `Header`, `Host`, and `Auto`, with `Header` as the default and `X-Mockery-Service` always taking precedence over `Host`.
- `ProxyMiddleware` must continue stripping all `X-Mockery-*` headers before forwarding requests to upstream services.
- Service resolution must remain an internal middleware concern; this feature must not introduce a new external HTTP API or authentication surface.
- The feature must continue to honour ADR-0001 and ADR-0005, including the single shared proxy instance design and environment-adaptive routing strategy.

## Out of Scope

- URL normalisation logic — converting raw request paths into canonical URL templates is handled by FEAT-003 (UrlNormaliser); ServiceRouter only provides the `UrlPatterns` configuration to it
- Authentication or credential forwarding to upstream services — the proxy does not intercept, store, or forward authentication credentials (per PRD Out of Scope)
- Dynamic service discovery — services are statically defined in configuration; runtime registration or deregistration is not supported in v1
- Non-HTTP protocol routing — gRPC, WebSocket, and message-queue routing are out of scope (per PRD and ARCHITECTURE.md)
- MockeryHttpHandler implementation — the client-side `DelegatingHandler` that sets `X-Mockery-Service` headers is a separate concern (ADR-0007); this feature covers the server-side routing resolution only

## Dependencies

- Requires: [ADR-0001](../adr/ADR-0001-single-shared-proxy-instance.md) — single shared proxy instance design that necessitates per-request service resolution
- Requires: [ADR-0005](../adr/ADR-0005-caller-to-service-routing.md) — environment-adaptive routing decision that defines the three-mode resolution strategy
- Consumed by: FEAT-003 (URL Normalisation) — uses `ServiceRouteResult.UrlPatterns` for pattern matching
- Consumed by: ProxyMiddleware — calls `IServiceRouter.Resolve()` on every inbound request

## Open Questions

None.
