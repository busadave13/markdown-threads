<!-- SPECIT -->

# ADR-0001: Single Shared Proxy Instance for All Upstream Services

> **Version**: 1.0.0<br>
> **Created**: 2026-04-10<br>
> **Last Updated**: 2026-04-10<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Draft

---

## 1. Context

Mockery must proxy requests to multiple upstream services within a multi-service repository. Each team's service may depend on several upstreams, and the total number of upstream services will grow over time. The deployment model — whether local workstation or cloud sandbox — must remain simple enough that onboarding a new upstream requires only a configuration change. Running the proxy infrastructure must not impose per-service operational overhead that scales linearly with the number of upstream dependencies.

---

## 2. Decision

> We will run a single shared proxy instance that serves all upstream services, using the `X-Mockery-Service` request header to route each request to the correct upstream.

---

## 3. Rationale

A single process keeps the operational footprint constant regardless of how many upstream services are configured. Configuration is centralised in one `proxy-config.json` file, so adding a new upstream is a single config entry rather than deploying and wiring a new proxy instance. This aligns with the Aspire hosting model, where `AddMockProxy()` registers one resource that all services reference as a dependency. The routing header approach avoids URL path conflicts and keeps each service's request paths unchanged.

---

## 4. Alternatives Considered

### Per-service proxy instances
**Why rejected:** Each upstream service would require its own proxy process, port allocation, and Aspire resource registration. This creates linear scaling of infrastructure overhead with the number of upstreams — exactly the cascading startup cost Mockery is designed to eliminate. Configuration would be scattered across multiple files, making onboarding harder and increasing the chance of misconfiguration.

### Sidecar proxy per calling service
**Why rejected:** A sidecar model attaches a proxy to each calling service rather than each upstream. While this reduces upstream-side overhead, it still multiplies proxy instances by the number of calling services, duplicates mock storage across sidecars, and complicates the Aspire integration model. Shared mocks would require a coordination layer, adding the external dependency the filesystem store decision explicitly avoids.

---

## 5. Consequences

### Positive Consequences
- Constant infrastructure overhead — one process, one port, one configuration file regardless of upstream count
- Zero-code onboarding of new upstreams: add a `services[]` entry to `proxy-config.json`
- Natural fit with Aspire's single-resource hosting model via `AddMockProxy()`
- Centralised logging and diagnostics for all proxy traffic through one process

### Trade-offs Accepted
- Single process becomes a throughput bottleneck under high concurrent load from many services; acceptable for development workloads where request volume is low
- All upstream routing logic lives in one process, so a bug in routing configuration for one service could theoretically affect others; mitigated by per-service config isolation within the `services[]` array
- Callers must set the `X-Mockery-Service` header (or use path-prefix routing), adding a small integration requirement

---

## 6. Related Decisions

- [ADR-0005: Caller-to-service routing mechanism](ADR-0005-caller-to-service-routing.md) — defines how callers specify the target service on the shared proxy instance

---

*This ADR is part of the [Architecture Decision Records index](README.md).*
