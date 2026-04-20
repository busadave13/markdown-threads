# FEAT-006: Manual Mock Authoring

> **Version**: 1.0.1<br>
> **Created**: 2026-04-12<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Implemented

## Goal

Enable developers to create or upload mock files manually for upstream endpoints that do not yet exist or are not reachable, so development can proceed against planned or in-progress APIs without waiting for the real service. Hand-crafted mocks are indistinguishable from auto-captured mocks at replay time.

## Motivation

When upstream services are not yet deployed or are unreachable, developers need a way to create mock responses ahead of time so they can build and test against planned API contracts. This directly supports [PRD](../PRD.md) Goal 1 (eliminate cascading dependency startup overhead) and Goal 2 (remove manual stub maintenance) by providing a first-class upload path for hand-crafted mocks. Without this feature, teams would be blocked until upstream dependencies are available or would resort to ad-hoc local stubs outside the Mockery ecosystem.

## User Stories

- As a **Service Developer**, I want to upload a hand-crafted mock file for an endpoint that does not yet exist so that I can develop against the planned API contract without waiting for the upstream team to deploy.
- As a **Service Developer**, I want manual mocks to be served with the same replay behaviour as auto-captured mocks so that my service code does not need to distinguish between the two.
- As a **Platform / Developer Experience Team** member, I want manual mocks to follow the same storage conventions and format as auto-captured mocks so that tooling, diagnostics, and observability work uniformly across both mock types.

## Acceptance Criteria

- [ ] A developer can upload a mock file via `PUT /__mock/manual/{serviceName}/{method}/{urlTemplate}` and receive a `201 Created` response confirming storage.
- [ ] A developer can place a mock blob directly into Azure Blob Storage (or Azurite) at the conventional path `{containerName}/{serviceName}/{METHOD}/{urlTemplate}.json` and the proxy serves it on the next matching request.
- [ ] When a request matches a URL pattern that has a manual mock, ProxyMiddleware serves the manual mock directly without forwarding to the upstream service, regardless of upstream availability (FR-018).
- [ ] Manual mocks are served with the same replay behaviour as auto-captured mocks — consumers cannot distinguish between them (FR-017).
- [ ] Manual mocks use the same JSON format as auto-captured mocks (status code, headers, body fields) so that MockStore reads them with a single code path.
- [ ] Manual mocks are not passed through AiTransformAgent — they are stored exactly as submitted, since the author is responsible for pre-sanitising content.
- [ ] The upload endpoint validates that the request body is well-formed JSON conforming to the mock file schema and returns `400 Bad Request` with a descriptive error if validation fails.
- [ ] The upload endpoint returns `409 Conflict` when a mock (manual or auto-captured) already exists for the same cache key, preventing accidental overwrites.
- [ ] The upload endpoint requires the target service to be present in `Mockery:Services` configuration and returns `404 Not Found` if the service name is unrecognised.
- [ ] The `GET /__mock/status` diagnostics endpoint includes manual mock counts alongside auto-captured mock counts per service.
- [ ] When the upload request body is not valid JSON or is missing required fields (`statusCode`, `body`), the endpoint returns HTTP 400 with error code `INVALID_MOCK_FORMAT`.
- [ ] When the `serviceName` path parameter does not match any configured service, the endpoint returns HTTP 404 with error code `SERVICE_NOT_FOUND`.
- [ ] When a mock already exists for the same cache key, the upload endpoint returns HTTP 409 with error code `MOCK_ALREADY_EXISTS` — it does not silently overwrite.

## API / Interface Definition

### Authorization

None — Mockery operates within the development trust boundary. The upload and delete endpoints are not authenticated or authorised; all callers on the local network or within the development cluster are trusted (see ARCHITECTURE.md: Security & Trust Boundary).

### Upload a manual mock

```
PUT /__mock/manual/{serviceName}/{method}/{urlTemplate}
Content-Type: application/json
```

**Path parameters:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `serviceName` | `string` | Yes | Service name matching a configured `Mockery:Services:N:Name` value |
| `method` | `string` | Yes | HTTP method in uppercase: `GET`, `POST`, `PUT`, `PATCH`, `DELETE` |
| `urlTemplate` | `string` | Yes | URL-encoded canonical URL template (e.g. `users%2F%7Bid%7D` for `users/{id}`) |

**Request body** (mock file JSON — same schema as auto-captured mocks):

```typescript
{
  statusCode:    number;            // HTTP status code to replay (e.g. 200, 404)
  headers:       Record<string, string>; // Response headers to replay (optional — defaults to empty object)
  body:          object | string | null; // Response body to replay
  metadata: {
    recordedAt:       string;       // ISO 8601 timestamp — set by the upload endpoint to the current time
    source:           "manual";     // Always "manual" for hand-crafted mocks
    aiTransformApplied: false;      // Always false — manual mocks skip AI sanitisation
  }
}
```

**Required fields in request body:** `statusCode`, `body`. All other fields are optional and will be populated with defaults by the endpoint.

**Response `201 Created`:**

```typescript
{
  service: string;                 // Required. Configured service name for the stored mock.
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"; // Required. Uppercase HTTP method used in the cache key.
  urlTemplate: string;             // Required. Canonical URL template for the mock.
  cacheKey: string;                // Required. Deterministic composite key used for storage and replay.
  storedAt: string;                // Required. ISO 8601 timestamp when the blob write completed.
}
```

**Error responses:**

| Status | Error code | Message |
|---|---|---|
| `400 Bad Request` | `INVALID_MOCK_FORMAT` | `Request body must be valid JSON with required fields: statusCode (number), body (object, string, or null).` |
| `400 Bad Request` | `INVALID_METHOD` | `Method must be one of: GET, POST, PUT, PATCH, DELETE. Received: '{method}'.` |
| `404 Not Found` | `SERVICE_NOT_FOUND` | `Service '{serviceName}' is not configured in Mockery:Services. Add a configuration entry before uploading mocks.` |
| `409 Conflict` | `MOCK_ALREADY_EXISTS` | `A mock already exists for cache key '{cacheKey}'. Delete the existing mock before uploading a replacement.` |
| `500 Internal Server Error` | `STORAGE_WRITE_FAILED` | `Failed to write mock to blob storage: {detail}.` |

### Delete a manual mock

```
DELETE /__mock/manual/{serviceName}/{method}/{urlTemplate}
```

**Path parameters:** Same as the upload endpoint.

**Response `204 No Content`:** Mock deleted successfully.

**Error responses:**

| Status | Error code | Message |
|---|---|---|
| `404 Not Found` | `MOCK_NOT_FOUND` | `No mock exists for cache key '{cacheKey}'.` |
| `404 Not Found` | `SERVICE_NOT_FOUND` | `Service '{serviceName}' is not configured in Mockery:Services.` |
| `500 Internal Server Error` | `STORAGE_DELETE_FAILED` | `Failed to delete mock from blob storage: {detail}.` |

### Updated diagnostics endpoint

```
GET /__mock/status
```

**Response `200 OK`**:

```typescript
{
  storage: {
    type: "Azurite" | "AzureBlob";   // Required. Active storage backend.
    containerName: string;           // Required. Blob container name used for mocks.
  };
  services: Array<{
    name: string;                    // Required. Configured service name.
    totalMockCount: number;          // Required. Total mocks for the service.
    autoCapturedCount: number;       // Required. Count of captured mocks.
    manualMockCount: number;         // Required. Count of manual mocks.
  }>;
}
```

## Data Model

Manual mocks use the same blob schema and storage path conventions as auto-captured mocks. No new data entities are introduced.

**Mock blob (unchanged schema, shared by auto-captured and manual mocks):**

```typescript
MockBlob {
  statusCode:    number;                   // HTTP status code to replay
  headers:       Record<string, string>;   // Response headers to replay
  body:          object | string | null;    // Response body
  metadata: {
    recordedAt:         string;            // ISO 8601 timestamp of when the mock was created
    source:             "captured" | "manual"; // Origin of the mock — "captured" for auto-recorded, "manual" for hand-crafted
    aiTransformApplied: boolean;           // true for captured mocks that passed through AiTransformAgent; always false for manual mocks
    originalBodyHash?:  string;            // SHA-256 hash of the original upstream response body (captured mocks only; absent for manual mocks)
  }
}
```

**Blob storage path convention (unchanged):**

```
{containerName}/{serviceName}/{METHOD}/{urlTemplate}.json
```

Example: `recorded-mocks/orders-api/GET/orders/{id}.json`

The `metadata.source` field is the only distinguishing marker between manual and auto-captured mocks. MockStore reads and serves both using the same `GetAsync(key)` code path — no branching based on source.

## Edge Cases & Error Handling

| Scenario | Expected behaviour |
|---|---|
| Upload body is not valid JSON | Return `400 Bad Request` with error code `INVALID_MOCK_FORMAT` and a message describing the parse failure. Do not write to blob storage. |
| Upload body is valid JSON but missing `statusCode` | Return `400 Bad Request` with error code `INVALID_MOCK_FORMAT` listing the missing required field. |
| `serviceName` path parameter does not match any configured service | Return `404 Not Found` with error code `SERVICE_NOT_FOUND`. Do not attempt blob storage writes. |
| A mock (manual or auto-captured) already exists for the same cache key | Return `409 Conflict` with error code `MOCK_ALREADY_EXISTS` including the conflicting cache key. Do not overwrite. |
| `method` path parameter is not a valid HTTP method | Return `400 Bad Request` with error code `INVALID_METHOD`. |
| Blob storage is unreachable during upload (Azurite not running or Azure outage) | Catch `RequestFailedException` from the Azure SDK and return `500 Internal Server Error` with error code `STORAGE_WRITE_FAILED` and the exception message as detail. |
| `urlTemplate` path parameter contains path separators after URL decoding | Accept and normalise — the blob path uses `/` separators naturally. CacheKey.Build produces the same key regardless of whether the template was submitted URL-encoded or not. |
| A request arrives that matches both a manual mock and an auto-captured mock (should not happen due to 409 guard) | MockStore.ExistsAsync returns true for the single blob at that cache key. The 409 guard on upload prevents this state. If it occurs due to direct blob placement, the single blob at the path is served — last-write-wins semantics in blob storage. |
| DELETE request targets a cache key that does not exist | Return `404 Not Found` with error code `MOCK_NOT_FOUND`. |
| Manual mock blob placed directly in blob storage with missing or malformed `metadata` | MockStore.GetAsync reads the blob and returns it. ProxyMiddleware serves whatever `statusCode`, `headers`, and `body` are present. Missing `metadata` fields default to `source: "manual"`, `aiTransformApplied: false` at read time. |

## Preservation Constraints

- Auto-captured mock replay behaviour must remain unchanged — `MockStore.GetAsync` serves both auto-captured and manual mocks via the same code path with no branching on `metadata.source`.
- Existing `GET /__mock/status` response shape must remain backward-compatible — `manualMockCount` and `autoCapturedCount` are additive fields; existing consumers that do not expect them must not break.
- The auto-capture recording flow (upstream call → AiTransformAgent → MockStore.SaveAsync) must not be altered by the introduction of manual mock endpoints.

## Out of Scope

- Graphical interface for browsing or editing mocks (PRD out of scope).
- Mock validation against upstream API schemas — manual mocks are trusted as-is.
- Versioning or history for manual mocks — a single blob per cache key, no revision tracking.
- Conflict resolution between manual and auto-captured mocks for the same URL pattern — the `409 Conflict` guard prevents duplicate keys.
- Bulk upload of multiple mocks in a single request.
- Authentication or authorisation on the upload/delete endpoints — Mockery operates within the development trust boundary (see Architecture: Security & Trust Boundary).

## Dependencies

- Requires: MockStore (`IMockStore`) — existing storage abstraction for reading and writing mock blobs (ARCHITECTURE.md)
- Requires: CacheKey — existing deterministic key builder from service name, method, and URL template (ARCHITECTURE.md)
- Requires: ServiceRouter — existing service name validation against `Mockery:Services` configuration (ARCHITECTURE.md)
- Requires: `/__mock/status` diagnostics endpoint — existing endpoint extended with manual mock counts

## Open Questions

None.
