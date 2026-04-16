# FEAT-007: MockeryHttpHandler

> **Version**: 1.1.0<br>
> **Created**: 2026-04-12<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Draft

## Goal

MockeryHttpHandler is a .NET `DelegatingHandler` that transparently intercepts outbound `HttpClient` calls in consuming services and rewrites them to flow through the Mockery Proxy — enabling multi-hop service-to-service mocking without any changes to application code. The handler lives in the `Mockery.Client` shared project and communicates with the proxy exclusively over HTTP, with no dependency on proxy internals (ADR-0007).

## Motivation

Without a client-side handler, consuming services would need to manually configure each `HttpClient` to point at the Mockery proxy and manage routing headers — a tedious and error-prone process that scales poorly across teams. This directly supports [PRD](../PRD.md) Goal 1 (eliminate cascading dependency startup overhead) and Goal 4 (zero-code onboarding) by allowing a service's outbound HTTP dependencies to be automatically recorded and replayed via a single handler registration per `HttpClient`.

## User Stories

- As a **Service Developer**, I want my service's outbound `HttpClient` calls to upstream dependencies to be automatically routed through the Mockery Proxy so that I can develop and test without running the full dependency tree.
- As a **Service Developer**, I want the handler to be a complete no-op in Production so that the same service binary runs safely across all environments without conditional compilation or code changes.
- As a **Platform / Developer Experience Team** member, I want a single shared project (`Mockery.Client`) that any consuming service can reference so that onboarding a service to multi-hop mocking requires only a project reference and 1–3 lines of registration code per upstream dependency.
- As a **Security / Compliance** reviewer, I want the handler to default to fail-fast (HTTP 502) when the proxy is unavailable so that outbound calls never silently bypass PII sanitisation.

## Acceptance Criteria

Each criterion must be independently testable. If you can't write a test for it, rewrite it.

- [ ] `MockeryHttpHandler` is a `DelegatingHandler` that can be registered in the `HttpClientFactory` pipeline via `IHttpClientBuilder.AddHttpMessageHandler<MockeryHttpHandler>()`.
- [ ] When `Mockery:Enabled` is `true`, the handler rewrites the outbound request's `RequestUri` authority (scheme + host + port) to the value of `Mockery:ProxyUrl`, preserving the original path, query string, body, and all non-Mockery headers.
- [ ] When `Mockery:Enabled` is `true`, the handler adds three headers to the outbound request: `X-Mockery-Service` (set to the configured target service name for this named `HttpClient`), `X-Mockery-Caller` (set to `Mockery:CallerName` or `IHostEnvironment.ApplicationName` if not configured), and `X-Mockery-Intercepted` with value `"1"`.
- [ ] When `Mockery:Enabled` is `false`, the handler invokes `base.SendAsync()` without modifying the request in any way — zero allocations, zero header reads, zero URL inspection.
- [ ] When the outbound request already contains an `X-Mockery-Intercepted` header, the handler passes through to `base.SendAsync()` without rewriting the URL or adding any headers, regardless of `Mockery:Enabled`.
- [ ] When `Mockery:OnProxyUnavailable` is `FailFast` (default) and the proxy is unreachable (e.g. `HttpRequestException`, `TaskCanceledException` on timeout), the handler returns an `HttpResponseMessage` with status code 502 and a JSON body `{ "error": "MockeryProxyUnavailable", "message": "Mockery proxy at {proxyUrl} is unreachable" }`.
- [ ] When `Mockery:OnProxyUnavailable` is `Bypass` and the proxy is unreachable, the handler retries the request against the original upstream URL (before rewriting), emits a warning-level structured log containing the service name and proxy URL, increments a bypass counter metric via `System.Diagnostics.Metrics`, and returns the upstream response.
- [ ] Each named `HttpClient` registered with `HttpClientFactory` can have its own `MockeryHttpHandler` instance targeting a different upstream service name (e.g. `services.AddHttpClient("OrdersApi").AddMockeryHandler("orders-api")`).
- [ ] The handler lives in the `Mockery.Client` shared project and has no compile-time dependency on the proxy server project or any proxy-internal types.
- [ ] The original request path (including query string), request body (for POST/PUT/PATCH), HTTP method, and all non-`X-Mockery-*` headers are preserved byte-for-byte after URL rewriting.

## API / Interface Definition

This feature exposes a C# registration API, not an HTTP endpoint. The handler itself is an internal `DelegatingHandler` — it modifies outbound requests, not inbound.

### Registration API (extension methods on `IHttpClientBuilder`)

```csharp
namespace Mockery.Client;

public static class MockeryHttpClientBuilderExtensions
{
    /// <summary>
    /// Adds MockeryHttpHandler to the named HttpClient pipeline, targeting the
    /// specified upstream service for proxy routing.
    /// </summary>
    /// <param name="builder">The IHttpClientBuilder for the named HttpClient.</param>
    /// <param name="serviceName">
    ///   Target upstream service name — sent as the X-Mockery-Service header.
    ///   Required; must be non-empty.
    /// </param>
    /// <returns>The IHttpClientBuilder for chaining.</returns>
    public static IHttpClientBuilder AddMockeryHandler(
        this IHttpClientBuilder builder,
        string serviceName);  // required, non-null, non-empty
}
```

### Configuration options (bound from `Mockery` section)

```csharp
namespace Mockery.Client;

public sealed class MockeryClientOptions
{
    /// <summary>Master switch. When false, handler is a complete no-op.</summary>
    public bool Enabled { get; set; } = true;

    /// <summary>
    /// Base URL of the Mockery Proxy (e.g. "http://localhost:5000").
    /// Required when Enabled is true.
    /// </summary>
    public string ProxyUrl { get; set; } = "";

    /// <summary>
    /// Behaviour when the proxy is unreachable.
    /// Valid values: "FailFast" (default), "Bypass".
    /// </summary>
    public string OnProxyUnavailable { get; set; } = "FailFast";

    /// <summary>
    /// Calling service identity sent as X-Mockery-Caller header.
    /// Falls back to IHostEnvironment.ApplicationName if empty.
    /// </summary>
    public string CallerName { get; set; } = "";
}
```

### Headers added by the handler (when enabled and not loop-detected)

| Header | Value | Purpose |
|---|---|---|
| `X-Mockery-Service` | `{serviceName}` parameter from `AddMockeryHandler()` | Target upstream service routing in the proxy |
| `X-Mockery-Caller` | `MockeryClientOptions.CallerName` or `IHostEnvironment.ApplicationName` | Caller identity for observability and tracing |
| `X-Mockery-Intercepted` | `"1"` | Loop prevention marker — if present on an outbound request, handler passes through |

### Error responses generated by the handler

| Condition | HTTP Status | Response Body |
|---|---|---|
| Proxy unreachable + `FailFast` mode | 502 | `{ "error": "MockeryProxyUnavailable", "message": "Mockery proxy at {proxyUrl} is unreachable" }` |
| Proxy unreachable + `Bypass` mode | (upstream response) | No synthetic response — falls through to real upstream; warning log emitted |

### Registration validation errors

| Condition | Behaviour |
|---|---|
| `serviceName` is null or empty | `ArgumentException` thrown at registration time from `AddMockeryHandler()` |
| `Mockery:ProxyUrl` is empty when `Mockery:Enabled` is `true` | `OptionsValidationException` thrown on first request — options validation via `IValidateOptions<MockeryClientOptions>` |

## Data Model

N/A — MockeryHttpHandler does not create, read, update, or delete any persisted data. It operates purely as an in-memory request transform in the `HttpClient` pipeline. Recorded mock data is managed by the proxy's MockStore component (see FEAT for MockStore / ProxyMiddleware).

## Edge Cases & Error Handling

| Scenario | Expected behaviour |
|---|---|
| `Mockery:Enabled` is `false` (Production) | Handler calls `base.SendAsync()` immediately with no modification. No header inspection, no URL parsing, no allocations beyond the delegate invocation. The request reaches the originally configured upstream URL unchanged. |
| Outbound request already has `X-Mockery-Intercepted` header | Handler calls `base.SendAsync()` without rewriting URL or adding any Mockery headers. This prevents infinite loops when the proxy's own upstream calls pass through a handler in the same process. |
| Proxy unreachable in `FailFast` mode (default) | Handler catches `HttpRequestException` and `TaskCanceledException` from the rewritten request, returns a synthetic `HttpResponseMessage` with status 502 and JSON error body. The original upstream is not contacted. |
| Proxy unreachable in `Bypass` mode | Handler catches the proxy connection failure, logs a structured warning (`"Mockery proxy unavailable, bypassing to real upstream"` with `serviceName`, `proxyUrl`, and `originalUrl` fields), increments a bypass counter metric via `System.Diagnostics.Metrics`, restores the original `RequestUri`, and calls `base.SendAsync()` with the original URL. The upstream response is returned unmodified — recording and sanitisation are skipped. |
| `Mockery:ProxyUrl` is empty but `Mockery:Enabled` is `true` | `IValidateOptions<MockeryClientOptions>` validation fails with `OptionsValidationException` on first request, providing a clear error message: `"Mockery:ProxyUrl is required when Mockery:Enabled is true"`. |
| `serviceName` parameter is null or whitespace | `AddMockeryHandler()` throws `ArgumentException` at DI registration time with message `"serviceName must be a non-empty string"`. |
| Request has a body (POST/PUT/PATCH) | Handler rewrites only the `RequestUri` authority; the `Content` property (body stream, content headers, content length) is left untouched and forwarded to the proxy as-is. |
| Request has custom headers (e.g. `Authorization`, `Accept`, `X-Correlation-Id`) | All non-`X-Mockery-*` headers are preserved. The handler only adds `X-Mockery-Service`, `X-Mockery-Caller`, and `X-Mockery-Intercepted`; it does not remove or modify any existing headers. |
| Multiple named HttpClients targeting different services | Each `AddMockeryHandler("service-name")` call creates an independent handler instance bound to that service name. ServiceA calling both `ordersClient.GetAsync(...)` and `inventoryClient.GetAsync(...)` produces two independent proxy requests with different `X-Mockery-Service` values. |
| Concurrent requests through the same handler instance | Handler is stateless — `SendAsync` reads options and service name from injected configuration and the closure from registration. No shared mutable state exists. Thread-safe by construction. |
| Proxy returns a non-2xx response (e.g. 503 from AI transform failure) | Handler returns the proxy's response as-is to the calling code. The handler does not interpret or transform proxy responses — it is a transparent pass-through after URL rewriting. |

## Preservation Constraints

- Preserve the `Mockery:Enabled` no-op contract: when disabled, `MockeryHttpHandler` must continue to pass requests through unchanged with no URL rewriting, header mutation, or interception logic.
- Preserve loop-prevention behavior: any outbound request already carrying `X-Mockery-Intercepted` must continue to bypass rewriting and header injection.
- Preserve the request transformation contract from ADR-0007: when enabled, the handler may rewrite only the `RequestUri` authority and add the `X-Mockery-Service`, `X-Mockery-Caller`, and `X-Mockery-Intercepted` headers; it must not alter the original path, query string, method, body, or non-Mockery headers.
- Preserve the failure semantics: default behavior remains `FailFast` with HTTP 502 when the proxy is unavailable, while `Bypass` remains an explicit opt-in that falls through to the original upstream.
- Preserve the architectural boundary: the handler stays in `Mockery.Client`, communicates with the proxy only over HTTP, and must not acquire any dependency on proxy-internal types or implementation details.

## Out of Scope

- Aspire service discovery integration for automatic `ProxyUrl` resolution — covered by FEAT-008 (Mockery.Aspire).
- Authentication passthrough for host-bound auth schemes (mTLS, HMAC signatures, OAuth audience validation) — documented as a known constraint in ARCHITECTURE.md; services using such schemes must order auth handlers before `MockeryHttpHandler` or exclude those clients.
- Automatic retry logic when the proxy returns transient errors (5xx) — the handler is a single-attempt pass-through; retry policies should be configured separately via Polly or `HttpClientFactory` resilience features.
- gRPC, WebSocket, or non-HTTP protocol interception — HTTP-only in v1 per PRD scope.
- NuGet packaging of `Mockery.Client` — the shared project is referenced directly within the repository; packaging is a future distribution concern per ADR-0007.

## Dependencies

- Requires: [ADR-0007](../adr/ADR-0007-mockery-http-handler-multi-hop.md) — architectural decision governing handler design, header conventions, loop prevention, and failure modes.
- Requires: Mockery Proxy (ProxyMiddleware) running and reachable at the configured `Mockery:ProxyUrl` for record/replay to function. The handler can operate independently in `Bypass` mode or when `Enabled` is `false`.
- Requires: `Microsoft.Extensions.Http` (for `IHttpClientBuilder` and `DelegatingHandler` pipeline) — standard .NET SDK dependency, no additional package required.
- Requires: `Microsoft.Extensions.Options` (for `IOptions<MockeryClientOptions>` and `IValidateOptions<T>`) — standard .NET SDK dependency.

## Open Questions

None.
