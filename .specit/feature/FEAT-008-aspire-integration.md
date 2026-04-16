# FEAT-008: Aspire Integration

> **Version**: 1.1.1<br>
> **Created**: 2026-04-12<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Draft

## Goal

Integrate Mockery into the .NET Aspire orchestrator so the proxy starts and stops as a managed resource within the developer's service profile, health and diagnostics are surfaced through Aspire's infrastructure, and consuming services automatically discover the proxy URL via Aspire service discovery — eliminating manual configuration.

## Motivation

Without Aspire integration, developers must manually start the proxy, configure its URL in every consuming service, and manage Azurite lifecycle separately — all of which adds friction to the onboarding experience. This directly aligns with [PRD](../PRD.md) Goal 1 (eliminate cascading dependency startup overhead) and Goal 4 (zero-code onboarding of new upstream dependencies), as well as FR-012 (proxy starts and stops alongside the developer's service profile).

## User Stories

- As a **Service Developer**, I want to add the Mockery proxy to my Aspire AppHost with a single `AddMockProxy()` call so that I can start developing against mocked upstreams without configuring proxy URLs or managing separate processes.
- As a **Platform / Developer Experience Team** member, I want the proxy's health and diagnostics visible in Aspire's dashboard so that I can verify the proxy is running and inspect its configuration without separate tooling.
- As a **Service Developer**, I want `MockeryHttpHandler` to resolve the proxy URL automatically via Aspire service discovery so that I do not need to hard-code or manually configure `Mockery:ProxyUrl` in my service's settings.

## Acceptance Criteria

- [ ] `AddMockProxy()` is an extension method on `IDistributedApplicationBuilder` provided by `Mockery.Aspire` that registers the Mockery proxy as an Aspire hosted resource with a single declarative call (PRD FR-012)
- [ ] The proxy starts automatically when the Aspire AppHost starts the developer's service profile and stops when the profile shuts down
- [ ] `GET /health` returns HTTP 200 with body `{"status":"Healthy"}` when the proxy is ready; this endpoint is registered with Aspire's health check infrastructure via the standard `IHealthCheck` integration
- [ ] `GET /health` returns HTTP 503 with error body `{ "error": "PROXY_UNHEALTHY", "status": "Unhealthy", "message": "..." }` when the storage backend is unreachable or a critical subsystem has failed
- [ ] When `AddMockeryHttpHandler()` is called without a matching proxy resource in the AppHost, service discovery resolution fails and `MockeryHttpHandler` applies `onProxyUnavailable` behaviour (`FailFast` by default, returning 502)
- [ ] `GET /__mock/status` returns HTTP 200 with a JSON body containing `services` (array of configured service summaries), `mockCounts` (object mapping service name to integer count), `storageType` (string: `"Azurite"` or `"AzureBlob"`), and `containerName` (string)
- [ ] `Mockery.Aspire` is a separate shared project that depends on `Mockery.Client` and does **not** reference the proxy server project or any proxy internals
- [ ] `Mockery.Aspire` provides an `AddMockeryHttpHandler()` extension method that configures `MockeryHttpHandler` with the proxy URL resolved automatically from Aspire service discovery, requiring no manual `Mockery:ProxyUrl` configuration
- [ ] Azurite is registered as an Aspire resource (via `AddAzurite()` or equivalent) and its connection string is automatically wired to the proxy's `Mockery:Storage:ConnectionString`
- [ ] The proxy resource declares a dependency on the Azurite resource so that Azurite starts before the proxy

## API / Interface Definition

### Authorization

None — Mockery is a development-only tool. Health and diagnostics endpoints are not authenticated. All callers within the local network or development cluster boundary are trusted (see ARCHITECTURE.md: Security & Trust Boundary).

### Health endpoint

```
GET /health
```

Response `200 OK`:
```json
{
  "status": "string — 'Healthy' | 'Degraded' | 'Unhealthy'"
}
```

Errors:
- `503 Service Unavailable` — `{ "error": "PROXY_UNHEALTHY", "status": "Unhealthy", "message": "Proxy health check failed: storage backend unreachable or critical subsystem unavailable." }` — returned when the proxy cannot reach its storage backend or a critical subsystem has failed

### Diagnostics endpoint

```
GET /__mock/status
```

Response `200 OK`:
```json
{
  "services": [
    {
      "name": "string — unique service identifier from configuration",
      "upstreamUrl": "string — base URL of the real upstream service",
      "urlPatternCount": "integer — number of configured URL patterns for this service"
    }
  ],
  "mockCounts": {
    "<serviceName>": "integer — number of recorded mock blobs for this service"
  },
  "storageType": "string — 'Azurite' | 'AzureBlob'",
  "containerName": "string — blob container name (e.g. 'recorded-mocks')"
}
```

Errors:
- `500 Internal Server Error` — `{ "error": "STORAGE_UNAVAILABLE", "message": "Unable to query mock store: {detail}" }` — returned when the storage backend is unreachable and mock counts cannot be retrieved

### AppHost registration API (C# extension methods)

```csharp
// In Mockery.Aspire (shared project, consumed by the AppHost)
// Registers the Mockery proxy as an Aspire resource with Azurite dependency
IResourceBuilder<MockProxyResource> AddMockProxy(
    this IDistributedApplicationBuilder builder,
    string name = "mockery-proxy",       // string — Aspire resource name, optional, default "mockery-proxy"
    int port = 5550,                     // int — HTTP port the proxy listens on, optional, default 5550
    string containerName = "recorded-mocks" // string — blob container name, optional, default "recorded-mocks"
);
```

```csharp
// In Mockery.Aspire (shared project, consumed by calling services)
// Configures MockeryHttpHandler with service-discovery-resolved proxy URL
IHttpClientBuilder AddMockeryHttpHandler(
    this IHttpClientBuilder builder,
    string serviceName,                  // string — target upstream service name for X-Mockery-Service header, required
    string proxyResourceName = "mockery-proxy" // string — Aspire resource name to resolve via service discovery, optional, default "mockery-proxy"
);
```

### MockProxyResource type

```csharp
// Aspire resource type representing the Mockery proxy
public class MockProxyResource : IResourceWithConnectionString, IResourceWithEndpoints
{
    Name:              string  — resource name passed to AddMockProxy()
    HttpEndpoint:      EndpointReference — the proxy's HTTP endpoint exposed to Aspire service discovery
    ConnectionString:  string  — derived from HttpEndpoint for consumer services using service discovery
}
```

## Data Model

N/A — this feature introduces no new persistent data entities. The proxy's existing `MockStore` and configuration model are unchanged. `MockProxyResource` is a runtime Aspire resource descriptor, not a persisted entity.

## Edge Cases & Error Handling

| Scenario | Expected behaviour |
|---|---|
| Azurite container fails to start before the proxy | Aspire honours the declared resource dependency and does not start the proxy until Azurite is healthy; if Azurite never becomes healthy, the proxy resource enters a failed state and Aspire surfaces the error in the dashboard |
| Proxy health check fails after startup (e.g. Azurite crashes mid-session) | `GET /health` returns `503` with `{"status":"Unhealthy"}`; Aspire marks the resource as unhealthy in the dashboard; consuming services using `MockeryHttpHandler` receive failures governed by `onProxyUnavailable` mode (`FailFast` → 502 or `Bypass` → direct upstream) |
| `AddMockeryHttpHandler()` called without a matching proxy resource in the AppHost | Service discovery resolution fails at startup; `MockeryHttpHandler` cannot resolve `ProxyUrl`; the handler falls back to `onProxyUnavailable` behaviour (`FailFast` by default, returning 502) and logs an `Error`-level message identifying the missing resource name |
| Multiple AppHost projects in the same solution call `AddMockProxy()` with the same resource name | Each AppHost runs its own independent proxy instance; no conflict occurs because Aspire resource names are scoped to their AppHost process |
| `GET /__mock/status` called when storage backend is unreachable | Endpoint returns `500` with `{ "error": "STORAGE_UNAVAILABLE", "message": "Unable to query mock store: {detail}" }`; the `services` and `storageType` fields are still populated from configuration (they do not require storage access), but `mockCounts` cannot be computed |
| Port specified in `AddMockProxy()` is already in use | Aspire's resource hosting surfaces the port-conflict error in the dashboard; the proxy resource fails to start and is marked as failed |
| Consumer service starts before proxy is fully ready | Aspire health check integration delays traffic until `GET /health` returns 200; if the consumer makes requests before the proxy is ready, `MockeryHttpHandler` receives connection errors and applies `onProxyUnavailable` behaviour |

## Preservation Constraints

- Preserve the existing Mockery proxy runtime contract: `GET /health` must remain the readiness endpoint, `GET /__mock/status` must remain the diagnostics endpoint, and existing response shapes for both endpoints must not change.
- Preserve the current `Mockery.Client` handler behavior and header contract (`X-Mockery-Service`, `X-Mockery-Caller`, `X-Mockery-Intercepted`); Aspire integration must only resolve configuration, not change outbound request rewriting semantics.
- Preserve the current fail-fast / bypass handling in `MockeryHttpHandler` when the proxy is unavailable; Aspire service discovery must not introduce silent fallback paths beyond the existing documented modes.
- Preserve the existing storage and routing architecture from ARCHITECTURE.md and ADR-0005/ADR-0006: one shared proxy instance, Azurite for local development, Azure Blob Storage for AKS/production, and the existing routing precedence.
- Preserve the separation between `Mockery.Client` and `Mockery.Aspire`; the Aspire package may depend on `Mockery.Client`, but it must not introduce proxy-internal dependencies or require changes to non-Aspire consumers.

## Out of Scope

- Custom Aspire dashboard widgets for mock management
- Aspire deployment profiles for production (Mockery is dev-only)
- Multi-instance proxy scaling within Aspire
- Non-Aspire orchestrator support (Docker Compose, Kubernetes directly)

## Dependencies

- Requires: [ADR-0006](../adr/ADR-0006-azure-blob-storage-mock-store.md) — Azure Blob Storage mock store with Azurite emulation (Azurite is the local storage resource registered in Aspire)
- Requires: [ADR-0007](../adr/ADR-0007-mockery-http-handler-multi-hop.md) — MockeryHttpHandler (the handler that `Mockery.Aspire` configures with service discovery)
- Requires: PRD FR-012 — the proxy must start and stop alongside the developer's service profile when added through declarative configuration
- Requires: `Mockery.Client` shared project — `Mockery.Aspire` depends on it for `MockeryHttpHandler` and related types
- Requires: .NET Aspire SDK — `Aspire.Hosting` and `Aspire.Hosting.Azure.Storage` packages for resource registration and Azurite integration

## Open Questions

None.
