# ADR-0006: Replace the filesystem mock store with Azure Blob Storage and Azurite emulation

> **Version**: 1.0.0<br>
> **Created**: 2026-04-10<br>
> **Last Updated**: 2026-04-12<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Approved

---

## 1. Context

Mockery originally stored recorded mocks as JSON files on the local filesystem (ADR-0002). This worked well for single-developer local workflows but created a divergence between local development and cloud-hosted environments running in Azure Kubernetes Service (AKS). In AKS, pod-local filesystem storage is ephemeral — mocks would be lost on pod restart or rescheduling. The team needed a storage backend that works identically in both environments, supports persistent storage in AKS without external volume provisioning, and minimises code path divergence between local and cloud development. The chosen solution must avoid introducing separate storage implementations or test matrices for local vs. cloud behaviour.

---

## 2. Decision

> We will use Azure Blob Storage as the single MockStore backend, with Azurite for local development and Azure Blob Storage for AKS deployments.

---

## 3. Rationale

Azure Blob Storage provides durable, scalable object storage that works natively in AKS. Azurite is Microsoft's official local emulator for Azure Storage, implementing the same Blob Storage API on localhost with no cloud credentials required. By using the same `Azure.Storage.Blobs` SDK against both targets — differentiated only by connection string — MockStore runs identical code paths in local and cloud environments. This eliminates the class of bugs where storage behaviour differs between development and deployment. The `UseDevelopmentStorage=true` connection string convention makes Azurite configuration zero-effort. The tradeoff of requiring Azurite as a local dependency is acceptable because most teams in the repository already run Docker for other development services.

---

## 4. Alternatives Considered

### Keep filesystem storage with a separate AKS storage adapter
**Why rejected:** Maintaining two storage implementations (filesystem for local, blob for AKS) doubles the test surface and risks behavioural divergence. Bugs could appear in one environment but not the other. The MockStore interface would need to abstract over fundamentally different I/O semantics (directory trees vs. flat blob namespaces), increasing complexity for no runtime benefit. The whole point of environment portability is a single code path.

### Azure Files (SMB mount) in both environments
**Why rejected:** Azure Files provides a POSIX-compatible filesystem layer over Azure Storage, which would allow the existing filesystem MockStore to work unchanged. However, SMB mounts in AKS add latency and operational complexity (persistent volume claims, storage class configuration, mount propagation). Local development would still require either Azurite with an SMB adapter or a real Azure Files share, neither of which is as simple as a connection string swap. Azure Files also adds cost for the always-on file share in AKS compared to pay-per-operation blob storage.

### Embedded database (SQLite or LiteDB) with cloud sync
**Why rejected:** An embedded database would provide structured querying and atomic operations, but introduces a separate storage engine that does not align with Azure-native persistence in AKS. Syncing an embedded database to cloud storage adds reconciliation complexity. Mock data does not require relational queries — lookups are single-key by design, making blob storage a natural fit. The reviewability benefit of individual files is retained as individual blobs with meaningful names.

---

## 5. Consequences

### Positive Consequences
- Identical MockStore code path in local development and AKS — no environment-specific branches or conditional logic
- Persistent mock storage in AKS survives pod restarts and rescheduling without volume provisioning
- Azurite provides a fast, zero-cost local emulation with no cloud credentials needed for development
- Azure Blob Storage scales to large mock stores without filesystem performance degradation (no directory listing bottlenecks)
- Managed identity support in AKS avoids connection string management in production

### Trade-offs Accepted
- Developers must run Azurite locally (typically as a Docker container) before starting Mockery — this adds one infrastructure prerequisite to the local setup
- Mocks are no longer committable to source control as individual files in the repository; teams lose pull-request reviewability of recorded mock changes and must use the manual mock authoring workflow for reviewable mock definitions
- Local replay latency increases from sub-millisecond (filesystem) to low-millisecond (Azurite over localhost HTTP) — still well under perceptible thresholds for development workflows
- The `Azure.Storage.Blobs` NuGet package becomes a required runtime dependency, increasing the dependency footprint

---

## 6. Related Decisions

- [ADR-0002: Filesystem mock store](ADR-0002-filesystem-mock-store.md) — the original storage decision that this ADR supersedes; ADR-0002 remains as historical context

---

*This ADR is part of the [Architecture Decision Records index](README.md).*
