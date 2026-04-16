# FEAT-009: Environment Portability

> **Version**: 1.1.1<br>
> **Created**: 2026-04-12<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Draft

## Goal

Enable Mockery to operate identically across local workstations and cloud-hosted development environments (AKS) using a single codebase with environment-specific behaviour controlled entirely through the standard ASP.NET Core configuration provider chain. The same Mockery configuration and recorded mocks work without modification regardless of where the developer is running.

## Motivation

Developers working across local workstations and cloud-hosted AKS sandboxes need Mockery to behave consistently without maintaining separate configurations or mock sets per environment. This directly supports [PRD](../PRD.md) Goal 1 (eliminate cascading dependency startup overhead) and the "Environment portability" in-scope item (FR-015). Without this feature, environment-specific branching logic would creep into application code, increasing maintenance burden and the risk of environment-only bugs.

## User Stories

- As a **Service Developer**, I want Mockery to behave the same way on my local workstation and in a cloud-hosted dev sandbox so that I don't need to maintain separate configurations or mock sets for different environments.
- As a **Platform / Developer Experience Team** member, I want environment-specific Mockery behaviour controlled through standard ASP.NET Core configuration so that onboarding teams don't need to learn custom configuration mechanisms.
- As a **Service Developer**, I want `MockeryHttpHandler` to be a complete no-op in Production so that there is zero runtime overhead when Mockery is not needed.

## Acceptance Criteria

- [ ] A request that resolves to the same service, HTTP method, and URL template returns the same recorded status code, response body, and cache-key lookup result in Development (Azurite) and Staging (Azure Blob Storage) when the same mock blob exists in both environments.
- [ ] `ASPNETCORE_ENVIRONMENT` controls which `appsettings.{env}.json` file is loaded, and no custom environment detection logic exists anywhere in the codebase.
- [ ] Configuration loading follows this exact precedence (later wins): `appsettings.json` → `appsettings.{ASPNETCORE_ENVIRONMENT}.json` → user secrets (Development only) → environment variables → command-line arguments.
- [ ] Setting `Mockery:Storage:Type` to `"Azurite"` causes `MockStore` to connect to the Azurite emulator via `"UseDevelopmentStorage=true"`; setting it to `"AzureBlob"` causes `MockStore` to connect to real Azure Blob Storage via the configured connection string or managed identity.
- [ ] Setting `Mockery:Routing:Mode` to `"Header"` causes `ServiceRouter` to resolve target services by checking `X-Mockery-Service` first and then falling back to path-prefix routing; setting it to `"Host"` keeps `X-Mockery-Service` precedence, then matches the `Host` header, then falls back to path-prefix routing; setting it to `"Auto"` checks `X-Mockery-Service`, then `Host`, then path-prefix routing.
- [ ] Setting `Mockery:Enabled` to `false` causes `MockeryHttpHandler` to forward outbound requests with the original URI and non-Mockery headers unchanged, without adding any `X-Mockery-*` headers or intercepting the call.
- [ ] Invalid `Mockery:Storage:Type`, `Mockery:Routing:Mode`, or `Mockery:ProxyUrl` values fail startup with the documented `OptionsValidationException` messages, while valid values allow the host to start normally.
- [ ] No `#if`, `#ifdef`, environment-name string comparisons, or conditional compilation directives exist in application code to branch behaviour by environment — all environment differences are expressed as configuration values bound via `IOptions<T>` or `IConfiguration`.
- [ ] The proxy server starts successfully and passes health checks (`GET /health` returns 200) in both `Development` and `Staging` environments with their respective configuration overrides.
- [ ] Environment variables using the `__` (double-underscore) separator correctly override nested configuration keys (e.g., `Mockery__Storage__Type=AzureBlob` overrides `Mockery:Storage:Type`).

## API / Interface Definition

N/A — this feature defines no new HTTP endpoints or external-facing interfaces. Environment portability is achieved entirely through configuration binding and the existing ASP.NET Core configuration provider chain applied to the components defined in ARCHITECTURE.md (ProxyMiddleware, ServiceRouter, MockStore, MockeryHttpHandler).

### Configuration Contracts

The following configuration sections control environment-specific behaviour. All are bound via `IOptions<T>` / `IOptionsSnapshot<T>` using standard ASP.NET Core configuration binding.

**MockeryOptions (proxy server — `Mockery` section):**

```csharp
public class MockeryStorageOptions
{
    public string Type { get; set; } = "Azurite";           // "Azurite" | "AzureBlob"
    public string ConnectionString { get; set; } = "UseDevelopmentStorage=true";
    public string ContainerName { get; set; } = "recorded-mocks";
    public bool UseManagedIdentity { get; set; } = false;
}

public class MockeryRoutingOptions
{
    public string Mode { get; set; } = "Header";            // "Header" | "Host" | "Auto"
}
```

**MockeryHandlerOptions (consuming services — `Mockery` section):**

```csharp
public class MockeryHandlerOptions
{
    public bool Enabled { get; set; } = true;
    public string ProxyUrl { get; set; } = "";              // required when Enabled=true
    public string OnProxyUnavailable { get; set; } = "FailFast"; // "FailFast" | "Bypass"
    public string CallerName { get; set; } = "";
}
```

**Validation rules:**

| Field | Rule | Error on violation |
|---|---|---|
| `Storage:Type` | Must be `"Azurite"` or `"AzureBlob"` (case-insensitive) | Throw `OptionsValidationException` at startup: `"Mockery:Storage:Type must be 'Azurite' or 'AzureBlob', got '{value}'"` |
| `Storage:ConnectionString` | Required when `UseManagedIdentity` is `false` | Throw `OptionsValidationException` at startup: `"Mockery:Storage:ConnectionString is required when UseManagedIdentity is false"` |
| `Routing:Mode` | Must be `"Header"`, `"Host"`, or `"Auto"` (case-insensitive) | Throw `OptionsValidationException` at startup: `"Mockery:Routing:Mode must be 'Header', 'Host', or 'Auto', got '{value}'"` |
| `Enabled` | Boolean; any non-boolean value rejected by config binding | Standard ASP.NET Core binding error at startup |
| `ProxyUrl` | Required and must be a valid absolute URI when `Enabled` is `true` | Throw `OptionsValidationException` at startup: `"Mockery:ProxyUrl is required and must be a valid absolute URI when Mockery:Enabled is true"` |
| `OnProxyUnavailable` | Must be `"FailFast"` or `"Bypass"` (case-insensitive) | Throw `OptionsValidationException` at startup: `"Mockery:OnProxyUnavailable must be 'FailFast' or 'Bypass', got '{value}'"` |

## Data Model

N/A — this feature introduces no new data entities. Environment portability affects how existing components (`MockStore`, `ServiceRouter`, `MockeryHttpHandler`) are configured at startup, not what data they store or process. The recorded mock blob schema defined in ARCHITECTURE.md is unchanged.

## Edge Cases & Error Handling

| Scenario | Expected behaviour |
|---|---|
| `Mockery:Storage:Type` is set to an unrecognised value (e.g., `"S3"`) | Proxy fails to start. `OptionsValidationException` is thrown during host startup with message: `"Mockery:Storage:Type must be 'Azurite' or 'AzureBlob', got 'S3'"`. The error is logged at `Critical` level. |
| `Mockery:Routing:Mode` is set to an unrecognised value (e.g., `"PathPrefix"`) | Proxy fails to start. `OptionsValidationException` is thrown during host startup with message: `"Mockery:Routing:Mode must be 'Header', 'Host', or 'Auto', got 'PathPrefix'"`. The error is logged at `Critical` level. |
| `Mockery:Enabled` is `false` and `Mockery:ProxyUrl` is empty | Valid configuration. `MockeryHttpHandler` is a no-op; `ProxyUrl` is not required when Mockery is disabled. No validation error. |
| `Mockery:Enabled` is `true` and `Mockery:ProxyUrl` is empty or not a valid URI | Consuming service fails to start. `OptionsValidationException` is thrown: `"Mockery:ProxyUrl is required and must be a valid absolute URI when Mockery:Enabled is true"`. |
| `Mockery:Storage:Type` is `"Azurite"` but the Azurite emulator is not running during a replay/read path | Proxy starts successfully (configuration is valid). The `MockStore` read fails at runtime with `RequestFailedException`, and the proxy degrades to pass-through mode with no recording or replay until Azurite is restored. Requests continue to the real upstream, the outage is logged at `Error` level, and no mock data is persisted during the outage. |
| `Mockery:Storage:Type` is `"Azurite"` but the Azurite emulator is not running during a first-record/write path | Proxy can still call the real upstream and sanitise the response, but `MockStore.SaveAsync` fails with `RequestFailedException`. The sanitised response is returned to the caller, the response is not persisted, and the failure is logged at `Error` level so the next identical request will re-record after storage is restored. |
| `Mockery:Storage:UseManagedIdentity` is `true` but `DefaultAzureCredential` cannot acquire a token (e.g., local dev without Azure CLI login) | Proxy starts successfully. First `MockStore` operation fails at runtime with `AuthenticationFailedException`. `ProxyMiddleware` returns HTTP 500. Logged at `Error` level with guidance to run `az login` or set `UseManagedIdentity` to `false`. |
| Environment variable `Mockery__Storage__Type=AzureBlob` conflicts with `appsettings.Development.json` value of `"Azurite"` | Environment variable wins per the configuration precedence chain. `MockStore` connects to Azure Blob Storage. No error — this is by design. |
| `ASPNETCORE_ENVIRONMENT` is not set | ASP.NET Core defaults to `"Production"` and loads `appsettings.Production.json` if present. If `Mockery:Enabled` remains `true` in `appsettings.json`, the handler will attempt interception — teams should set `Mockery:Enabled=false` in `appsettings.json` base defaults or ensure the environment variable is always set in non-development contexts. |

## Preservation Constraints

This is a brownfield update. Preserve the following existing behavior and contracts:

- Keep the existing `Mockery` configuration contract intact, including `Mockery:Enabled`, `Mockery:Storage:Type`, `Mockery:Storage:ConnectionString`, `Mockery:Storage:UseManagedIdentity`, `Mockery:Routing:Mode`, and `Mockery:OnProxyUnavailable`.
- Keep standard ASP.NET Core configuration precedence unchanged: `appsettings.json` → `appsettings.{ASPNETCORE_ENVIRONMENT}.json` → user secrets (Development only) → environment variables → command-line arguments.
- Keep routing precedence from ADR-0005 unchanged: `X-Mockery-Service` header first, then `Host` header matching, then path-prefix fallback.
- Keep the Azure Blob Storage/Azurite split from ADR-0006 unchanged, including identical `Azure.Storage.Blobs` code paths across local and AKS environments.
- Keep `MockeryHttpHandler` a true no-op when `Mockery:Enabled` is `false`, with no URL rewriting, interception, or extra request headers.
- Keep the existing `/health` endpoint, `GET /__mock/status` diagnostics endpoint, and the blob-backed mock schema/metadata conventions defined in ARCHITECTURE.md.

## Out of Scope

- Production deployment configuration — Mockery is a dev/staging tool; production environments set `Mockery:Enabled=false` and no further production config is specified.
- Environment-specific mock data — the same recorded mocks are used in all environments; no per-environment mock variants are supported.
- Infrastructure provisioning (Terraform, Bicep) for cloud environments — deploying Azurite containers, AKS clusters, or Azure Storage accounts is outside this feature's scope.
- CI/CD pipeline configuration — how `ASPNETCORE_ENVIRONMENT` is set in build/deploy pipelines is a deployment concern, not a Mockery feature.
- Custom configuration providers — only the standard ASP.NET Core provider chain is used; no Azure App Configuration, Consul, or other external config stores.

## Dependencies

- Requires: [ADR-0005](../adr/ADR-0005-caller-to-service-routing.md) — Environment-adaptive caller-to-service routing (defines Header vs Host routing modes)
- Requires: [ADR-0006](../adr/ADR-0006-azure-blob-storage-mock-store.md) — Azure Blob Storage mock store with Azurite emulation (defines storage backend abstraction)
- Requires: [ADR-0007](../adr/ADR-0007-mockery-http-handler-multi-hop.md) — MockeryHttpHandler (defines the `Mockery:Enabled` toggle and handler behaviour)
- Requires: ASP.NET Core configuration system (`Microsoft.Extensions.Configuration`) — standard framework dependency, no external service

## Open Questions

None.
