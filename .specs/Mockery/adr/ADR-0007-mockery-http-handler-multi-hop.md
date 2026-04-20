# ADR-0007: Use MockeryHttpHandler to Route Multi-Hop HttpClient Calls Through the Mockery Proxy

> **Version**: 1.0.2<br>
> **Created**: 2026-04-11<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Approved

---

## 1. Context

Mockery's current architecture assumes a direct relationship between a caller and the proxy: the caller sends requests directly to the proxy, which records or replays upstream responses. This works for simple topologies where the service under development is the direct caller. However, in real multi-service repositories, the common pattern is multi-hop: a client calls ServiceA, which in turn calls ServiceB and ServiceC via `HttpClient`. In this topology, ServiceA's outbound calls need to be transparently routed through the Mockery Proxy so that ServiceB and ServiceC responses are recorded and replayed — without requiring ServiceA's application code to know about Mockery.

The integration mechanism must work with .NET's `HttpClientFactory` and `DelegatingHandler` pipeline, support multiple upstream services per calling service (ServiceA → ServiceB + ServiceC), prevent request loops when the proxy itself makes outbound HTTP calls, and define clear failure semantics when the proxy is unavailable.

---

## 2. Decision

> We will route multi-hop outbound `HttpClient` calls through the Mockery Proxy using a `MockeryHttpHandler` `DelegatingHandler`.

---

## 3. Rationale

A `DelegatingHandler` is the idiomatic .NET integration point for cross-cutting HTTP client concerns. It slots into `HttpClientFactory`'s pipeline with zero changes to application code — the calling service's business logic continues to call `HttpClient.GetAsync("/users/123")` with the original path and body. The handler only rewrites the base URL and adds routing headers, preserving request semantics.

Separating into `Mockery.Client` (core handler + options) and `Mockery.Aspire` (Aspire service discovery) as shared projects keeps the base project free of Aspire dependencies, allowing non-Aspire consumers to reference the handler. Using shared project references rather than NuGet packages avoids package publishing overhead during active development; the projects are structured so they can be packaged as NuGet packages later when distribution beyond the repository is needed.

The handler adds the `X-Mockery-Service` header with the target service name and includes an `X-Mockery-Intercepted` header for loop prevention. Loop prevention is essential because the proxy itself may make outbound HTTP calls (e.g. to upstream services during recording). Without a marker, those calls could be re-intercepted by a handler in the same process, creating infinite loops. The handler checks for this header and passes through without rewriting when present. The proxy strips all `X-Mockery-*` headers before forwarding to upstreams.

When `mockery.enabled` is `false` (e.g. in Production), the handler is a complete no-op — requests pass through directly to the real upstream with zero overhead. When the proxy is unavailable, the handler defaults to fail-fast (HTTP 502) with configurable bypass modes. The fail-fast default prevents silent behaviour drift where outbound calls unexpectedly bypass the proxy and hit real upstreams — which would skip sanitisation and recording, violating Mockery's PII guarantees.

---

## 4. Alternatives Considered

### Network-level interception (iptables / service mesh sidecar)
**Why rejected:** Network-level redirection (e.g. Envoy sidecar, iptables rules) would make Mockery transparent without any code or handler, but adds heavy infrastructure requirements — a service mesh for AKS or iptables manipulation locally. This contradicts the zero-infrastructure onboarding goal and makes the routing logic invisible and hard to debug. It also couples Mockery to specific infrastructure that not all teams control.

### Custom HttpClient wrapper class
**Why rejected:** Wrapping `HttpClient` in a `MockeryHttpClient` class would require callers to change their injection and usage patterns. This leaks Mockery awareness into application code, breaks the transparent-proxy goal, and creates a maintenance burden for every consuming service. `DelegatingHandler` achieves the same result without changing the `HttpClient` API surface.

### Per-service proxy instances (one proxy per upstream)
**Why rejected:** Running a separate proxy for each upstream service would eliminate the need for a routing header — each proxy's port identifies the target. However, this contradicts ADR-0001 (single shared proxy), multiplies infrastructure overhead, and requires callers to know different ports per upstream. The handler approach preserves the single-proxy model.

---

## 5. Consequences

### Positive Consequences
- Multi-hop mocking is transparent to application code — ServiceA's business logic is unaware of Mockery
- Each named `HttpClient` can target a different upstream service through independent handler registrations, supporting ServiceA → ServiceB + ServiceC scenarios naturally
- `X-Mockery-Intercepted` header prevents request loops in processes that both host a handler and make outbound proxy calls
- Fail-fast default prevents silent bypass of PII sanitisation when the proxy is down
- Separate `Mockery.Client` and `Mockery.Aspire` shared projects keep dependencies minimal for non-Aspire consumers; can be packaged as NuGet later for distribution beyond the repository
- Handler adds `X-Mockery-Caller` header with the calling service identity, enabling the proxy to log and trace multi-hop chains
- When `mockery.enabled` is `false`, the handler is a complete no-op with zero performance overhead — the same service binary runs safely in Production without Mockery interception and in Development with full mocking support
- Environment-specific configuration via standard .NET `appsettings.{Environment}.json` makes it trivial to disable Mockery per environment without code changes or conditional compilation

### Trade-offs Accepted
- Each consuming service must add a project reference to `Mockery.Client` and register the handler per `HttpClient` — this is a small per-service onboarding step, typically 1–3 lines of code per upstream dependency. The handler remains in the `DelegatingHandler` pipeline in all environments but is a no-op when disabled.
- The handler rewrites `RequestUri` authority, which may break host-bound authentication schemes (HMAC signatures, OAuth audience validation, mTLS/SNI). Services using such schemes must order their auth handlers to run **before** `MockeryHttpHandler` in the `DelegatingHandler` pipeline, or exclude those clients from Mockery interception. This is documented as a known constraint. When `mockery.enabled` is `false`, no rewriting occurs and auth is unaffected.
- In AKS with `routing.mode: host`, the handler is still needed to rewrite the base URL to the proxy address unless DNS-level redirection is used. The handler and DNS-based routing are complementary, not mutually exclusive.
- Configurable bypass mode (`Bypass`) allows calls to real upstreams when the proxy is unavailable, but this skips recording and sanitisation. Teams must explicitly opt in and accept the PII risk.

---

## 6. Related Decisions

- [ADR-0001: Single shared proxy instance](ADR-0001-single-shared-proxy-instance.md) — the single-proxy model requires all callers to route through one endpoint, which the handler facilitates
- [ADR-0005: Environment-adaptive caller-to-service routing](ADR-0005-caller-to-service-routing.md) — the handler sets the `X-Mockery-Service` header that ServiceRouter uses for routing resolution

---

*This ADR is part of the [Architecture Decision Records index](README.md).*
