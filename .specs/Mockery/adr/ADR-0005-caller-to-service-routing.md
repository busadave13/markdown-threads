# ADR-0005: Use Environment-Adaptive Routing for Caller-to-Service Requests

> **Version**: 2.0.1<br>
> **Created**: 2026-04-10<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Approved

---

## 1. Context

Because Mockery runs as a single shared proxy instance (ADR-0001), every inbound request must identify which upstream service it targets. The routing mechanism must work without modifying the caller's request path (so that the same code works against real upstreams and the proxy), must be easy to configure in HTTP client libraries and Aspire service references, and must support callers that cannot set custom headers. The mechanism directly affects developer ergonomics — a cumbersome routing model would undermine the zero-code onboarding goal.

The routing challenge differs significantly between local development and AKS deployment. Locally, callers point their `HttpClient` base URL at `http://localhost:{port}`, so the `Host` header carries no upstream identity — it is always `localhost`. In AKS, the proxy is fronted by Kubernetes Services with real DNS names (e.g. `orders-api.mockery.svc.cluster.local`), so the `Host` header naturally identifies the target upstream without any caller-side configuration.

---

## 2. Decision

> We will use environment-adaptive routing: the `X-Mockery-Service` request header for local development (where the Host header is always `localhost`), the `Host` header for AKS/live environments (where each upstream is mapped to a distinct hostname), and path-prefix routing (`/mock/{serviceName}/...`) as a universal fallback for callers that cannot use either mechanism.

---

## 3. Rationale

A dual-mode strategy plays to the strengths of each environment. Locally, developers cannot control DNS — `HttpClient` base URLs point at `localhost`, and configuring hosts-file entries for every upstream would contradict the zero-infrastructure onboarding goal. The `X-Mockery-Service` header is a one-line `HttpClient` configuration in Aspire and carries no infrastructure cost. In AKS, Kubernetes Services and internal DNS already assign distinct hostnames to each upstream. Routing on the `Host` header means callers require **no mock-specific configuration at all** — they call the upstream hostname as normal, and DNS resolves it to the proxy. This eliminates the `X-Mockery-Service` header requirement in live environments, making Mockery truly transparent to application code running in AKS. Resolution priority is explicit header → host match → path-prefix, so callers that set the routing header always override environment-derived routing.

The `X-Mockery-Service` header is always checked first regardless of mode, providing an explicit override mechanism and ensuring backward compatibility with callers already configured to set the header.

The path-prefix alternative (`/mock/{serviceName}/...`) remains as a universal fallback for tools, scripts, and clients that cannot set custom headers or be pointed at specific hostnames (e.g. browser-based testing, curl one-liners).

ServiceRouter resolves the target service using the following precedence:

1. **`X-Mockery-Service` header** — if present, used directly as the service name (any environment)
2. **`Host` header** — matched against `services[].hostname` in configuration; used when `routing.mode` is `host` or `auto` (intended for AKS)
3. **Path-prefix** (`/mock/{serviceName}/...`) — the prefix is stripped before forwarding; universal fallback

The `routing.mode` configuration key controls which resolution steps are active:

| `routing.mode` | `X-Mockery-Service` header | `Host` header match | Path-prefix | Intended environment |
|---|---|---|---|---|
| `header` (default) | ✅ checked | ❌ skipped | ✅ fallback | Local development |
| `host` | ✅ checked | ✅ checked | ✅ fallback | AKS / live |
| `auto` | ✅ checked | ✅ checked | ✅ fallback | Either (auto-detect) |

In `auto` mode, the `X-Mockery-Service` header always takes precedence, so callers that set it explicitly will behave identically in both environments.

---

## 4. Alternatives Considered

### X-Mockery-Service header only (v1 of this ADR)
**Why rejected:** The header-only approach worked locally but required every caller in AKS to be configured with the `X-Mockery-Service` header. In AKS, Kubernetes DNS already provided per-service hostnames, so requiring an additional header on top of a correctly routed hostname added redundant configuration and onboarding friction.

### Path-prefix routing only (`/mock/{serviceName}/...`)
**Why rejected:** Path-prefix routing requires callers to modify their request URLs, which means application code must be aware of whether it is talking to the proxy or the real upstream. This leaks proxy awareness into service code, complicates environment switching, and requires URL rewriting logic in the proxy to strip the prefix before forwarding. It also conflicts with upstream services that have path segments matching the prefix pattern.

### Host-based routing only (virtual hosts per service)
**Why rejected:** Host-based routing provided clean separation in AKS but required DNS or hosts-file configuration for every upstream service locally. That added per-service infrastructure setup on every developer workstation, directly contradicting the zero-infrastructure onboarding goal. Aspire's service discovery did not natively support dynamic virtual host registration, so host-based routing could not stand alone.

### Query parameter routing (`?mock-service=orders`)
**Why rejected:** Query parameters are visible in URLs, may be forwarded to upstream services if the proxy fails to strip them, and can interfere with cache keys or upstream routing logic. They are also awkward to configure as defaults in HTTP client factories compared to headers. Query parameters are semantically intended for resource identification, not request metadata.

---

## 5. Consequences

### Positive Consequences
- Caller request paths remain unchanged in all environments — the same application code works against real upstreams and the proxy without modification
- Local development uses the lightweight `X-Mockery-Service` header — a one-line `HttpClient` configuration in Aspire, no DNS setup required
- AKS deployment uses the `Host` header — callers require zero mock-specific configuration, making Mockery transparent to application code
- The `X-Mockery-Service` header is always checked first, providing an explicit override in any environment and full backward compatibility
- Path-prefix fallback ensures no caller is blocked regardless of header or DNS capabilities
- `routing.mode` configuration makes the active resolution strategy explicit and auditable

### Trade-offs Accepted
- Three routing modes (`header`, `host`, `auto`) increase the test surface for ServiceRouter compared to a single mode; mitigated by the strict precedence order which makes behaviour deterministic
- AKS deployments require Kubernetes Service and DNS configuration to map upstream hostnames to the proxy; this is standard Kubernetes practice but adds an infrastructure prerequisite specific to the `host` routing mode
- `services[].hostname` must be kept in sync with the actual Kubernetes Service DNS names; a mismatch causes routing failures that surface as HTTP 400 (no matching service)
- In `auto` mode, a request without an `X-Mockery-Service` header that arrives with an unexpected `Host` value (e.g. a health check from a load balancer) will fail to route; mitigated by excluding health and diagnostics endpoints from routing

---

## 6. Related Decisions

- [ADR-0001: Single shared proxy instance](ADR-0001-single-shared-proxy-instance.md) — the single-instance architecture creates the need for a per-request routing mechanism

---

*This ADR is part of the [Architecture Decision Records index](README.md).*
