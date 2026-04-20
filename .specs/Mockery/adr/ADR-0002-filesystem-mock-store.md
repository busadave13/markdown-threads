# ADR-0002: Filesystem Mock Store with Human-Readable JSON Files

> **Version**: 1.0.0<br>
> **Created**: 2026-04-10<br>
> **Last Updated**: 2026-04-10<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Draft

---

## 1. Context

Recorded mock responses must be stored in a way that supports three critical workflows: sub-millisecond replay for developer productivity, code review so teams can inspect what their mocks contain, and source control so mocks travel with the repository and are available on any workstation or cloud sandbox without external setup. The storage mechanism must not introduce external dependencies (databases, caches, cloud services) that would undermine Mockery's zero-infrastructure promise. Mocks must also be safe to commit — meaning PII has been stripped before write — and easy to author manually for endpoints that do not yet exist.

---

## 2. Decision

> We will store all recorded mock responses as human-readable JSON files on the local filesystem, organised by service name and keyed by HTTP method and normalised URL template.

---

## 3. Rationale

The filesystem is universally available on every developer workstation and cloud sandbox with zero provisioning. JSON files are human-readable, diff-friendly, and reviewable in standard code review tools. The directory layout (`recorded-mocks/{serviceName}/{METHOD}__{template-path}.json`) makes it immediately obvious which endpoints have recordings, supports manual authoring by creating files directly, and integrates naturally with `.gitignore` patterns for selective exclusion. No external runtime dependency means the proxy starts instantly without connection handshakes or schema migrations.

---

## 4. Alternatives Considered

### SQLite embedded database
**Why rejected:** SQLite provides structured querying and atomic writes, but mock files would not be individually reviewable in pull requests. Merging binary database files across branches is error-prone. Developers cannot create a mock by simply dropping a JSON file into a directory. The structured query capability is unnecessary — lookups are single-key by design.

### Redis or in-memory cache
**Why rejected:** An in-memory store provides the fastest read performance but loses all state on process restart, requiring re-recording from upstream services every session. Redis introduces an external dependency that must be provisioned on every workstation and cloud sandbox, directly contradicting the zero-infrastructure constraint. Neither option supports committable, reviewable mock artifacts.

### Cloud-hosted shared store (e.g. Azure Blob Storage)
**Why rejected:** A shared store would enable multi-developer mock sharing but introduces network latency on every read (breaking the sub-millisecond replay requirement), requires cloud credentials and provisioning, and creates a single point of failure external to the developer's environment. Multi-developer sharing is explicitly out of scope for v1.

---

## 5. Consequences

### Positive Consequences
- Zero external dependencies — works on any machine with a filesystem
- Mocks are individually reviewable in pull requests and diffs
- Manual mock authoring is as simple as creating a JSON file in the correct directory
- Mocks are portable via source control — clone the repo and all recordings are available immediately
- Directory structure provides a natural, browsable index of recorded endpoints

### Trade-offs Accepted
- Concurrent writes to the same cache key are not atomic — last write wins, which may cause a redundant AI transform call in the rare case of simultaneous first-call recordings for the same endpoint
- Filesystem performance depends on the host OS and storage medium; on very large mock stores (thousands of files), directory listing may slow down, though individual file reads remain fast
- No built-in query capability — finding mocks requires directory traversal or grep rather than structured queries; acceptable because lookups are single-key operations

---

## 6. Related Decisions

- [ADR-0003: URL template normalisation strategy](ADR-0003-url-template-normalisation-strategy.md) — normalised templates produce the file names used in the mock store layout

---

## 7. Superseded By

- [ADR-0006: Azure Blob Storage Mock Store with Azurite Emulation](ADR-0006-azure-blob-storage-mock-store.md) — replaces filesystem storage with Azure Blob Storage backed by Azurite for local development

---

*This ADR is part of the [Architecture Decision Records index](README.md).*
