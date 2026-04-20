# FEAT-005: Mock Store

> **Version**: 1.1.1<br>
> **Created**: 2026-04-12<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Approved

## Goal

Implement the MockStore component that persists captured and sanitised upstream responses as human-readable JSON blobs and retrieves them by deterministic cache key. The store uses Azure Blob Storage as its single backend — Azurite for local development and real Azure Blob Storage in AKS — so that both environments run identical code paths via the `Azure.Storage.Blobs` SDK (ADR-0006). This replaces the original filesystem approach (ADR-0002, superseded).

## Motivation

A reliable and environment-portable storage layer is essential for persisting recorded mocks so that subsequent requests replay without contacting upstream services. This directly fulfils [PRD](../PRD.md) Goal 2 (remove manual stub maintenance) and FR-010 (human-readable mock artifacts). Without a unified storage abstraction, teams would face environment-specific storage bugs and lose the ability to inspect recorded mocks as readable JSON files.

## User Stories

- As a **Service Developer**, I want recorded mocks to be persisted automatically after AI sanitisation so that subsequent requests replay from the store without contacting the upstream service.
- As a **Service Developer**, I want the mock store to work identically on my local workstation (via Azurite) and in AKS (via Azure Blob Storage) so that I never encounter environment-specific storage bugs.
- As a **Platform / Developer Experience Team** member, I want mock storage configuration to be a single `Mockery:Storage:Type` switch so that I can onboard teams without per-environment code changes.
- As a **Security / Compliance** reviewer, I want each stored mock blob to carry `recordedAt`, `aiTransformApplied`, and `originalBodyHash` metadata so that I can audit when a mock was recorded and whether sanitisation was applied.

## Acceptance Criteria

- [ ] Mock files are persisted in human-readable, indented JSON format with UTF-8 encoding and `application/json` content type on the blob.
- [ ] `IMockStore` interface is defined in the `Mockery.Core` project with methods `ExistsAsync`, `GetAsync`, and `SaveAsync`; it has no dependency on `Azure.Storage.Blobs` or any infrastructure package.
- [ ] `BlobMockStore` implements `IMockStore` in the `Mockery.Infrastructure` project using the `Azure.Storage.Blobs` SDK (`BlobServiceClient`, `BlobContainerClient`, `BlobClient`).
- [ ] When `Mockery:Storage:Type` is `"Azurite"`, `BlobMockStore` connects using the connection string (default `"UseDevelopmentStorage=true"`).
- [ ] When `Mockery:Storage:Type` is `"AzureBlob"` and `Mockery:Storage:UseManagedIdentity` is `true`, `BlobMockStore` authenticates using `DefaultAzureCredential`; the Azure Blob service endpoint is supplied by environment-specific startup wiring, and no secret-bearing connection string is used for authentication.
- [ ] When `Mockery:Storage:Type` is `"AzureBlob"` and `Mockery:Storage:UseManagedIdentity` is `false`, `BlobMockStore` connects using the provided `Mockery:Storage:ConnectionString`.
- [ ] The blob container (named by `Mockery:Storage:ContainerName`, default `"recorded-mocks"`) is created automatically on the first `SaveAsync` call if it does not already exist, using `CreateIfNotExistsAsync`.
- [ ] `SaveAsync` sets three blob metadata entries on every write: `recordedAt` (ISO 8601 UTC timestamp), `aiTransformApplied` (`"true"` or `"false"`), and `originalBodyHash` (SHA-256 hex string of the raw upstream response body).
- [ ] `SaveAsync` is append-only during recording: it checks `ExistsAsync` before writing and does not overwrite an existing blob unless the caller explicitly passes `overwrite: true`.
- [ ] When `overwrite` is `false`, `SaveAsync` uses a conditional create (`If-None-Match: *`) so concurrent first-write attempts cannot replace an existing blob.
- [ ] `GetAsync` returns a `MockResponse` containing `statusCode`, `headers`, and `body` deserialised from the stored JSON blob, or throws `MockNotFoundException` (a custom exception in Core) when the blob does not exist.
- [ ] `ExistsAsync` performs a lightweight existence check (HTTP HEAD via `BlobClient.ExistsAsync()`) and returns `bool` without downloading blob content.
- [ ] `BlobMockStore` is registered in the DI container at startup via a `StorageOptions`-driven factory that reads `Mockery:Storage:Type` and binds the appropriate `BlobServiceClient`.
- [ ] When `ExistsAsync` is called and the blob does not exist, it returns `false` without throwing an exception.
- [ ] When `GetAsync` is called for a non-existent cache key, it throws `MockNotFoundException` with the cache key value — not a raw `RequestFailedException`.
- [ ] When Azurite is not running and any `IMockStore` method is called, it throws `RequestFailedException` — the proxy operates in pass-through mode with no recording or replay per ARCHITECTURE.md.

## API / Interface Definition

External API: N/A — this feature exposes no external-facing HTTP API. The internal `IMockStore` contract is consumed by `ProxyMiddleware` within the proxy process.

### Authorization

None — `IMockStore` is an internal storage abstraction with no external-facing surface. Access control to the underlying Azure Blob Storage is managed at the infrastructure level via connection strings or managed identity (see Configuration Reference).

| Method | Parameters | Returns | Errors |
|---|---|---|---|
| `ExistsAsync` | `cacheKey: string` (required); `cancellationToken: CancellationToken = default` (optional) | `Task<bool>` | Returns `false` when the blob is missing; `RequestFailedException` on storage connectivity or authorization failure |
| `GetAsync` | `cacheKey: string` (required); `cancellationToken: CancellationToken = default` (optional) | `Task<MockResponse>` | Throws `MockNotFoundException` when the blob is missing or cannot be deserialised; `RequestFailedException` on storage connectivity or authorization failure |
| `SaveAsync` | `cacheKey: string` (required); `response: MockResponse` (required); `metadata: MockMetadata` (required); `overwrite: bool = false` (optional); `cancellationToken: CancellationToken = default` (optional) | `Task` | Throws `RequestFailedException` on storage connectivity or authorization failure; `InvalidOperationException` on startup misconfiguration |

```csharp
// Mockery.Core — no infrastructure dependencies
namespace Mockery.Core.Storage;

public interface IMockStore
{
    /// <summary>
    /// Checks whether a recorded mock exists for the given cache key.
    /// Performs a lightweight HEAD request — does not download content.
    /// </summary>
    Task<bool> ExistsAsync(string cacheKey, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves the recorded mock for the given cache key.
    /// Throws MockNotFoundException if the blob does not exist.
    /// </summary>
    Task<MockResponse> GetAsync(string cacheKey, CancellationToken cancellationToken = default);

    /// <summary>
    /// Persists a sanitised response as a JSON blob.
    /// Append-only by default: creates the blob only if it does not already exist
    /// unless overwrite is true.
    /// </summary>
    Task SaveAsync(string cacheKey, MockResponse response, MockMetadata metadata, bool overwrite = false, CancellationToken cancellationToken = default);
}
```

```csharp
// Mockery.Core — value objects
namespace Mockery.Core.Storage;

public sealed record MockResponse
{
    public required int StatusCode { get; init; }                       // HTTP status code of the upstream response
    public required Dictionary<string, string[]> Headers { get; init; } // Response headers (multi-value)
    public required string Body { get; init; }                          // Serialised response body (JSON string)
}

public sealed record MockMetadata
{
    public required DateTimeOffset RecordedAt { get; init; }   // UTC timestamp when the mock was recorded
    public required bool AiTransformApplied { get; init; }     // Whether AI sanitisation was applied
    public required string OriginalBodyHash { get; init; }     // SHA-256 hex hash of the raw upstream body
}
```

```csharp
// Mockery.Core — custom exception
namespace Mockery.Core.Exceptions;

public sealed class MockNotFoundException : Exception
{
    public string CacheKey { get; }

    public MockNotFoundException(string cacheKey)
        : base($"No recorded mock found for cache key '{cacheKey}'.")
    {
        CacheKey = cacheKey;
    }
}
```

```csharp
// Mockery.Infrastructure — configuration options
namespace Mockery.Infrastructure.Storage;

public sealed class StorageOptions
{
    public const string SectionName = "Mockery:Storage";

    public string Type { get; set; } = "Azurite";                                 // "Azurite" or "AzureBlob"
    public string ConnectionString { get; set; } = "UseDevelopmentStorage=true";   // Azure Storage connection string when connection-string authentication is used
    public string ContainerName { get; set; } = "recorded-mocks";                  // Blob container name
    public bool UseManagedIdentity { get; set; } = false;                          // Use DefaultAzureCredential in AKS
}
```

**DI Registration (Infrastructure startup):**

```csharp
// Mockery.Infrastructure — service registration
namespace Mockery.Infrastructure.Storage;

public static class StorageServiceExtensions
{
    public static IServiceCollection AddMockStore(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<StorageOptions>(configuration.GetSection(StorageOptions.SectionName));
        services.AddSingleton<IMockStore, BlobMockStore>();
        return services;
    }
}
```

#### Operation contract summary

The transport-level identifiers for this internal interface are the method names on `IMockStore`.

| Operation | Request fields | Success result | Failure contract |
|---|---|---|---|
| `ExistsAsync` | `cacheKey: string` (**required**), `cancellationToken: CancellationToken` (**optional**) | Returns `bool`; `true` when the blob exists, `false` when it does not | If Azure Blob Storage / Azurite is unreachable or authentication fails, throws `RequestFailedException` with error code `StorageUnavailable` and message equivalent to `Unable to check whether recorded mock '{cacheKey}' exists.` |
| `GetAsync` | `cacheKey: string` (**required**), `cancellationToken: CancellationToken` (**optional**) | Returns `MockResponse` with `statusCode: int`, `headers: Dictionary<string, string[]>`, and `body: string` | If the blob does not exist, throws `MockNotFoundException` with error code `MockNotFound` and message `No recorded mock found for cache key '{cacheKey}'.` If stored JSON is malformed, logs a warning and throws the same `MockNotFoundException`. If storage read/auth fails, throws `RequestFailedException` with error code `StorageUnavailable` and message equivalent to `Unable to read recorded mock '{cacheKey}'.` |
| `SaveAsync` | `cacheKey: string` (**required**), `response: MockResponse` (**required**), `metadata: MockMetadata` (**required**), `overwrite: bool` (**optional**, default `false`), `cancellationToken: CancellationToken` (**optional**) | Returns `Task` with no response payload; on success the blob content and metadata are persisted | If the blob already exists and `overwrite` is `false`, the call is a no-op and does not throw. If container creation, upload, or storage authentication fails, throws `RequestFailedException` with error code `StorageUnavailable` and message equivalent to `Unable to persist recorded mock '{cacheKey}'.` |

**Blob naming convention:**

Blobs are named using the cache key directly. Cache keys are produced by the `CacheKey` component (separate feature) and follow the pattern:

```
{serviceName}/{METHOD}__{normalised-template-path}.json
```

Example: `orders-api/GET__users__{id}.json`

**Blob content format (human-readable JSON):**

```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": ["application/json"],
    "X-Request-Id": ["abc-123"]
  },
  "body": "{ \"id\": \"u-001\", \"name\": \"Jane Doe\" }"
}
```

**Blob metadata (set on each write, not part of JSON body):**

| Key | Value format | Example |
|---|---|---|
| `recordedAt` | ISO 8601 UTC | `"2026-04-12T14:30:00.0000000Z"` |
| `aiTransformApplied` | `"true"` or `"false"` | `"true"` |
| `originalBodyHash` | SHA-256 lowercase hex (64 chars) | `"a1b2c3d4..."` |

#### Error contract equivalents

| Operation | Error code | Exception type | Human-readable message |
|---|---|---|---|
| `ExistsAsync` | `StorageUnavailable` | `RequestFailedException` | `Unable to check whether recorded mock '{cacheKey}' exists.` |
| `GetAsync` | `MockNotFound` | `MockNotFoundException` | `No recorded mock found for cache key '{cacheKey}'.` |
| `GetAsync` | `StorageUnavailable` | `RequestFailedException` | `Unable to read recorded mock '{cacheKey}'.` |
| `SaveAsync` | `StorageUnavailable` | `RequestFailedException` | `Unable to persist recorded mock '{cacheKey}'.` |

**Write concurrency rule:**

- `overwrite: false` uses a create-only upload with `BlobRequestConditions.IfNoneMatch = ETag.All`.
- If another caller wins the race and Azure Blob Storage returns HTTP 412 Precondition Failed, `BlobMockStore` treats it as "already exists" and completes without overwriting.
- `overwrite: true` uses an unconditional upload and intentionally replaces the existing blob.

## Data Model

This feature does not introduce a database entity. The persisted artifact is an Azure Blob Storage blob.

**Blob:**

```
Container:  {StorageOptions.ContainerName}  (default: "recorded-mocks")
Blob name:  {cacheKey}                      (e.g. "orders-api/GET__users__{id}.json")
Content:    UTF-8 JSON (MockResponse serialised with indentation)
ContentType: "application/json"
Metadata:
  recordedAt:          DateTimeOffset (ISO 8601 UTC string)
  aiTransformApplied:  string ("true" | "false")
  originalBodyHash:    string (SHA-256 lowercase hex, 64 characters)
```

**Relationship to other components:**

- `CacheKey` (FEAT — separate) produces the blob name string
- `ProxyMiddleware` (FEAT — separate) calls `IMockStore.SaveAsync` on the record path and `GetAsync`/`ExistsAsync` on the replay path
- `AiTransformAgent` (FEAT — separate) produces the `MockMetadata.AiTransformApplied` flag and the sanitised body; `ProxyMiddleware` computes `OriginalBodyHash` from the raw response before sanitisation

## Edge Cases & Error Handling

| Scenario | Expected behaviour |
|---|---|
| Azurite is not running when `Mockery:Storage:Type` is `"Azurite"` | `BlobMockStore` throws `RequestFailedException` (connection refused). All store operations fail — the proxy operates in pass-through mode with no recording or replay per ARCHITECTURE.md. |
| `SaveAsync` called for a cache key that already exists and `overwrite` is `false` | `SaveAsync` calls `ExistsAsync` first; if the blob exists, it returns immediately without writing (no-op). No exception is thrown. The existing blob is preserved. |
| `SaveAsync` called for a cache key that already exists and `overwrite` is `true` | `SaveAsync` uploads the new content, replacing the existing blob. Blob metadata is updated to reflect the new recording. |
| `GetAsync` called for a cache key with no corresponding blob | `BlobMockStore` catches the `RequestFailedException` with status 404 from the Azure SDK and throws `MockNotFoundException` with the cache key. |
| Container does not exist on first `SaveAsync` call | `BlobMockStore` calls `BlobContainerClient.CreateIfNotExistsAsync()` before uploading. If the container already exists, the call is a no-op. If creation fails due to permissions, `RequestFailedException` propagates. |
| `Mockery:Storage:UseManagedIdentity` is `true` but startup wiring does not provide a valid Azure Blob service endpoint | Application startup fails fast with `InvalidOperationException` and message `"Managed identity mode requires a configured Azure Blob service endpoint."` |
| Blob content is malformed JSON (e.g. manually edited with syntax errors) | `GetAsync` catches `JsonException` during deserialisation and throws `MockNotFoundException` with the cache key, logging a warning that includes the original `JsonException` message. The corrupt blob is not deleted — the developer must fix or remove it manually. |
| `SaveAsync` write fails mid-upload (network error, Azurite crash) | `RequestFailedException` propagates to `ProxyMiddleware`, which logs the storage failure, skips persistence, and still returns the already sanitised upstream response to the caller. The write is not considered persisted; a later retry may record successfully. |
| Cache key contains characters invalid for blob names (e.g. backslashes on Windows path generation) | `BlobMockStore` normalises the cache key: forward slashes are preserved as blob virtual directory separators; any other invalid characters are percent-encoded. |
| Concurrent `SaveAsync` calls for the same cache key (rare: two simultaneous first-call recordings) | `BlobMockStore` performs a conditional create with `BlobRequestConditions.IfNoneMatch = ETag.All` when `overwrite` is `false`. The first upload succeeds; later concurrent uploads receive HTTP 412 Precondition Failed, which the store treats as a no-op so the original blob is preserved. |

## Preservation Constraints

- Preserve the single backend model mandated by ADR-0006: `BlobMockStore` must continue to use Azure Blob Storage in AKS and Azurite locally through the same `Azure.Storage.Blobs` code path.
- Preserve the `IMockStore` contract in `Mockery.Core` with `ExistsAsync`, `GetAsync`, and `SaveAsync`; keep infrastructure references out of Core.
- Preserve human-readable JSON blob content with UTF-8 encoding and `application/json` content type so recorded mocks remain easy to inspect and debug.
- Preserve append-only recording semantics by default: existing blobs are not overwritten unless the caller explicitly passes `overwrite: true`.
- Preserve append-only behavior under concurrent first-write races: the first successful create wins and later non-overwrite attempts become no-ops rather than replacing the blob.
- Preserve the blob metadata contract on every write: `recordedAt`, `aiTransformApplied`, and `originalBodyHash` must remain present and correctly typed.
- Preserve the current failure mode when local Azurite is unavailable: store operations fail with `RequestFailedException` and the proxy falls back to pass-through behavior with no recording or replay.

## Out of Scope

- Mock expiry / TTL mechanism — future feature; no automatic deletion or re-recording based on age.
- Mock drift detection — future feature; `originalBodyHash` metadata is stored now to enable future drift comparison, but no detection logic is implemented.
- Multi-developer shared mock stores with merge/conflict resolution — future feature; each environment has its own blob container.
- Filesystem-based storage — superseded by ADR-0006; no fallback to filesystem is provided.
- Blob lifecycle management or archival policies — no Azure Blob Storage lifecycle rules are configured or managed by MockStore.
- Blob versioning or soft-delete configuration — not managed by MockStore; can be enabled at the storage account level independently.
- Mock querying or listing (e.g. "list all mocks for service X") — lookups are single-key only; listing is out of scope for v1.

## Dependencies

- Requires: [ADR-0006](../adr/ADR-0006-azure-blob-storage-mock-store.md) — architectural decision mandating Azure Blob Storage with Azurite emulation
- Requires: `Azure.Storage.Blobs` NuGet package (SDK for blob operations)
- Requires: `Azure.Identity` NuGet package (for `DefaultAzureCredential` when `UseManagedIdentity` is `true`)
- Requires: `CacheKey` component (separate feature) to produce deterministic blob names
- Requires: Azurite emulator running for local development (Docker container or standalone)

## Open Questions

None.
