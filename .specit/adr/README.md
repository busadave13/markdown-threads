# Architecture Decision Records

This index lists all ADRs for this project. ADRs document *why* significant architectural
decisions were made. Read relevant ADRs before proposing changes to established patterns.

> **For AI agents**: Do not suggest alternatives to established decisions without
> referencing the relevant ADR and explaining why the recorded rejection reasons
> no longer apply.

---

## Index

| ADR | Title | Created |
|---|---|---|
| [ADR-0001](ADR-0001-single-shared-proxy-instance.md) | Single Shared Proxy Instance for All Upstream Services | 2026-04-10 |
| [ADR-0002](ADR-0002-filesystem-mock-store.md) | Filesystem Mock Store with Human-Readable JSON Files | 2026-04-10 |
| [ADR-0003](ADR-0003-url-template-normalisation-strategy.md) | Use a Hybrid URL Template Normalisation Strategy | 2026-04-10 |
| [ADR-0004](ADR-0004-ai-transform-agent-for-sanitisation.md) | AI Transform Agent for Response Sanitisation via GitHub Copilot SDK | 2026-04-10 |
| [ADR-0005](ADR-0005-caller-to-service-routing.md) | Use Environment-Adaptive Routing for Caller-to-Service Requests | 2026-04-10 |
| [ADR-0006](ADR-0006-azure-blob-storage-mock-store.md) | Replace the filesystem mock store with Azure Blob Storage and Azurite emulation | 2026-04-10 |
| [ADR-0007](ADR-0007-mockery-http-handler-multi-hop.md) | Use MockeryHttpHandler to Route Multi-Hop HttpClient Calls Through the Mockery Proxy | 2026-04-11 |

---

*New ADRs are added here when written. Superseded ADRs remain in the index — never delete entries.*
