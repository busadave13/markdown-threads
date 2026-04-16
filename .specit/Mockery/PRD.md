<!-- SPECIT -->

# Product Requirements Document

> **Version**: 1.0<br>
> **Created**: 2026-04-01<br>
> **Last Updated**: 2026-04-16<br>
> **Owner**: Dave Harding<br>
> **Project**: Mockery<br>
> **Status**: Approved

---

## 1. Overview

### Product Name
Mockery

### Tagline
> Dependency mocking workspace that captures, sanitises, and reuses upstream service behaviour — locally or in the cloud — for zero-maintenance development in a multi-service repository.

### Problem Statement
In a large multi-service repository, development and testing require running upstream dependency services to satisfy runtime call chains. A developer working on one service needs its direct dependencies running, each of which needs its own dependencies, creating cascading startup overhead and cross-team coordination friction — whether the environment is a local workstation or a cloud-hosted development sandbox. Teams either attempt to run the full dependency tree — impractical at scale — or hand-maintain static stub files for each upstream service. These stubs drift from real service behaviour over time, impose maintenance burden on teams that do not own the upstream, and provide no safeguard against personally identifiable information captured during authoring.

### Solution Summary
Mockery eliminates manual stub maintenance and dependency coordination across local and cloud development environments. It learns reusable dependency behaviour from live upstream interactions, sanitises captured data before it is stored, and then serves those saved behaviours back to developer services during future runs. Mockery fits into existing development workflows and works identically whether running on a developer's workstation or in a cloud-hosted environment. Developers onboard new upstream dependencies through a single configuration addition — no code changes, no cross-team coordination, and no risk of PII in committed artifacts.

---

## 2. Goals & Success Criteria

### Primary Goals
1. Reduce dependency startup overhead so developers can start a service with required upstream behaviour available in under 90 seconds.
2. Remove the need for teams to hand-maintain per-service stub files across the repository.
3. Ensure captured mock data remains free of personally identifiable information when stored locally or committed to source control.
4. Enable configuration-only onboarding of new upstream service dependencies.
5. Improve the day-to-day development experience across local and cloud-hosted development environments.

### Measurable Outcomes

| Goal | Success Criterion |
|---|---|
| Reduce dependency startup overhead | A team's service profile can be started with required upstream behaviour available in under 90 seconds. |
| Remove manual stub maintenance | Zero per-service stub files are maintained manually across the repository 6 months after adoption. |
| Ensure PII-free mock data | No PII incidents are traced to Mockery-captured data stored on workstations or committed to source control. |
| Enable configuration-only onboarding | A new upstream dependency is onboarded to Mockery in under 30 minutes through a configuration-only change. |
| Improve the day-to-day development experience | Developer satisfaction with the development environment reaches at least 4.0 out of 5.0 in the next quarterly survey. |

---

## 3. Users & Personas

### Primary User: Service Developer
- **Context**: Engineer working on one domain service in a multi-service repository who needs upstream dependency responses during development and testing, whether running locally or in a cloud environment.
- **Goal**: Start their service in under two minutes with all dependencies satisfied, without maintaining stubs they do not own.
- **Pain point**: Running upstream services locally is slow and fragile; hand-maintaining static stubs is tedious, error-prone, and drifts from real behaviour.
- **Technical level**: Intermediate to expert in service development and service integrations.

### Secondary User: Platform / Developer Experience Team
- **Context**: Owns the shared repository infrastructure and development tooling. Responsible for making local development fast and reliable across all teams.
- **Goal**: Provide a zero-per-team-maintenance solution for cross-service dependencies in local development.
- **Pain point**: Every team invents its own stub strategy, creating inconsistent tooling, duplicated effort, and support overhead.
- **Technical level**: Expert in development infrastructure, build systems, and shared tooling.

### Secondary User: Security / Compliance
- **Context**: Responsible for ensuring real PII does not appear on developer workstations or in committed artifacts.
- **Goal**: Guarantee that any data captured from upstream services is sanitised before it reaches the filesystem.
- **Pain point**: Manual stub authoring workflows have no systematic PII control — developers may inadvertently capture and commit sensitive data.
- **Technical level**: Expert in data privacy policy and PII classification; not necessarily service developers.

### Secondary User: Upstream Service Team
- **Context**: Owns a service that other teams depend on. Does not want to be responsible for maintaining per-consumer stubs.
- **Goal**: Declare transform or sanitisation rules in one place rather than supporting each consumer team individually.
- **Pain point**: Consumer teams file requests for stub updates whenever the upstream contract changes, creating coordination overhead.
- **Technical level**: Expert in their own service domain and API contracts; varying familiarity with consumer-side tooling.

---

## 4. Scope

### In Scope (v1 / MVP)
- Learn reusable dependency behaviour from live upstream interactions during development.
- Remove or replace sensitive data before captured mock content is stored or shared.
- Reuse recorded dependency behaviour so developers can run services quickly without starting full upstream stacks.
- Let teams onboard a new dependency through configuration-only setup rather than service code changes.
- Store mock artifacts in a human-readable, reviewable format that teams can create, inspect, and commit.
- Allow developers to author mock artifacts manually for planned, unavailable, or incomplete upstream capabilities.
- Fit into existing local and cloud-hosted development workflows without changing consumer business logic.
- Keep the same dependency-mocking experience across developer workstations and cloud development sandboxes.

### Out of Scope
- Production traffic management or production runtime usage.
- Replacing integration testing, contract testing, or CI pipeline validation.
- Shared team-wide mock libraries with conflict resolution across multiple developers in v1.
- A dedicated graphical experience for browsing or editing mock artifacts in v1.
- Support for dependency types outside the repository's current service-call development model in v1.
- Handling specialised upstream access patterns beyond the repository's standard developer access model in v1.

---

## 5. User Stories & Requirements

| ID | As a… | I want… | So that… | Priority | Acceptance Criteria |
|---|---|---|---|---|---|
| US-001 | Service Developer | to have upstream dependency behaviour captured automatically on my first live interaction | I do not need to hand-maintain static stubs or coordinate with upstream teams | Must-have | See FR-001, FR-002 |
| US-002 | Service Developer | saved mock behaviour returned in sub-millisecond time on repeat runs | my development loop stays fast even when multiple dependencies are involved | Must-have | See FR-003, FR-009 |
| US-003 | Service Developer | to onboard a new upstream dependency by adding a configuration block only | I can start working against a new dependency in under 30 minutes without code changes | Must-have | See FR-011, FR-013 |
| US-004 | Service Developer | to create or upload mock files manually for planned or unavailable upstream capabilities | I can develop against an upstream service that does not yet exist or is temporarily unreachable | Should-have | See FR-016, FR-017, FR-018 |
| US-005 | Service Developer | Mockery to work identically on my local workstation and in cloud-hosted environments | I get the same dependency-mocking experience regardless of where I develop | Must-have | See FR-015 |
| US-006 | Platform / Developer Experience Team | Mockery to start and stop as a managed resource in our development orchestrator | teams adopt it without a separate install or changes to the existing workflow | Must-have | See FR-012 |
| US-007 | Platform / Developer Experience Team | mock artifacts stored as human-readable, committable files | we can review, audit, and version-control captured dependency behaviour alongside service code | Should-have | See FR-010 |
| US-008 | Security / Compliance | all captured dependency data sanitised of PII before it reaches developer-controlled storage | no personally identifiable information is stored on workstations or committed to source control | Must-have | See FR-004, FR-005 |
| US-009 | Security / Compliance | sanitisation handled by the organisation-approved AI service | data privacy controls are consistent with the organisation's existing PII screening standards | Must-have | See FR-008 |
| US-010 | Upstream Service Team | to declare transform or sanitisation rules in one place | I do not need to support each consumer team individually when my contract changes | Nice-to-have | See FR-006, FR-007 |

---

## 6. Features & Capabilities

### Core Features (MVP)

| Feature | Description |
|---|---|
| **Live Capture & Reuse** | Learns dependency behaviour from a developer's first live interaction with an upstream service and reuses that behaviour on later runs. |
| **Sensitive Data Sanitisation** | Removes or replaces PII and other sensitive data before captured dependency content is stored or shared with developers. |
| **Reusable Pattern Matching** | Groups similar dependency interactions so one recorded mock can cover repeated variations of the same behaviour. |
| **Fast Local Replay** | Returns saved mock behaviour with sub-millisecond latency during repeat development runs. |
| **Config-Only Onboarding** | Teams add new upstream dependencies by adding a configuration block — no code changes, no stub authoring, no cross-team coordination. |
| **Committable Mock Files** | Stores recorded and hand-crafted mocks as human-readable files that can be reviewed, audited, and committed to source control alongside the service code. |
| **Manual Mock Authoring** | Allows developers to create or upload mock files manually for dependency behaviours that do not yet exist or are not reachable, enabling development against planned or in-progress upstream capabilities without waiting for the real service. |
| **Development Workflow Integration** | Fits into an existing service development workflow through declarative setup, so teams can adopt Mockery without changing consumer business logic. |
| **Environment Portability** | Works identically on a developer's local workstation and in cloud-hosted development environments using the same configuration and recorded mocks. |

### Future / Stretch Features
- Mock refresh policies to force re-recording after a configurable period.
- Mock drift detection process allowing teams to flag when a stored mock no longer reflects the real upstream contract.
- Support for additional dependency types beyond the v1 service-call model.
- Multi-developer shared mock stores with merge and conflict resolution.
- Graphical mock browser integrated with the development dashboard.

---

## 7. Functional Requirements

> Format: `FR-NNN: The system shall {behavior} when {condition}.`

| ID | Requirement |
|---|---|
| FR-001 | The system shall obtain live dependency behaviour from the configured upstream service when a developer interaction has no reusable mock yet. **AC:** A dependency call with no existing mock triggers a live upstream request and returns the upstream's response to the caller. |
| FR-002 | The system shall store captured dependency behaviour as a sanitised mock artifact when a live upstream interaction succeeds. **AC:** After a successful live capture, a sanitised mock file exists on disk and can be replayed without a second live call. |
| FR-003 | The system shall return the saved mock artifact instead of requiring another live upstream interaction when an equivalent dependency interaction has already been recorded. **AC:** A repeated dependency call is served from the local mock store without any network call to the upstream service. |
| FR-004 | The system shall remove or replace all personally identifiable information in captured dependency data before it is written to developer-controlled storage. **AC:** No field classified as PII by the organisation's policy remains in the stored mock artifact. |
| FR-005 | The system shall complete sensitive-data sanitisation before any captured dependency data is persisted. **AC:** If the sanitisation step fails, no captured data is written to disk. |
| FR-006 | The system shall recognise repeated variations of the same dependency behaviour so one recorded mock can be reused across equivalent interactions. **AC:** Variations differing only in non-significant parameters (e.g., timestamps, request IDs) match the same recorded mock. |
| FR-007 | The system shall apply configured matching rules when determining whether a recorded mock can satisfy a dependency interaction. **AC:** Adding or modifying a matching rule in configuration changes which interactions are matched without a code change. |
| FR-008 | The system shall use the organisation-approved sanitisation and matching service when configured matching rules are insufficient to classify a dependency interaction. **AC:** An unclassifiable interaction is sent to the AI service and the returned classification is applied and persisted. |
| FR-009 | The system shall return saved mock behaviour with sub-millisecond latency when a reusable mock exists in local storage. **AC:** The 95th-percentile response time for a cached mock replay is below 1 ms in a local development environment. |
| FR-010 | The system shall persist mock artifacts in a human-readable format suitable for code review and source control when writing captured dependency behaviour to disk. **AC:** A stored mock file can be opened in a text editor, understood by a reviewer, and diffed meaningfully in source control. |
| FR-011 | The system shall begin serving a newly added upstream dependency through configuration-only setup when a team registers that dependency with Mockery. **AC:** Adding a dependency configuration block and restarting the service profile causes Mockery to proxy or replay that dependency with no code changes. |
| FR-012 | The system shall start and stop alongside the developer's service profile when added to the team's development workflow through declarative configuration. **AC:** Mockery starts automatically when the service profile is launched and stops when the profile is shut down. |
| FR-013 | The system shall satisfy configured dependency interactions without requiring changes to the consumer service's business logic. **AC:** A consumer service runs its normal code paths against Mockery without any conditional logic or Mockery-specific imports. |
| FR-014 | The system shall distinguish saved mock behaviour by the characteristics needed to keep different dependency actions from being confused with one another during replay. **AC:** Two semantically different dependency calls produce distinct cache keys and return their respective mock responses. |
| FR-015 | The system shall operate with the same user-visible behaviour and configuration in cloud-hosted development environments as on a developer's local workstation. **AC:** The same configuration file and mock store produce identical replay behaviour locally and in a cloud sandbox. |
| FR-016 | The system shall use a manually created mock artifact when a developer has supplied one for a matching dependency interaction, even if no live upstream interaction has been recorded. **AC:** A hand-authored mock file placed in the mock store is served for matching requests without a prior live capture. |
| FR-017 | The system shall treat manually created and automatically captured mock artifacts as equivalent replay sources when they represent the same dependency behaviour. **AC:** The system selects a mock based on matching rules regardless of whether it was captured automatically or authored manually. |
| FR-018 | The system shall allow developers to continue working from a manually created mock artifact when the corresponding upstream capability is unavailable. **AC:** With the upstream service offline, a developer's service starts and functions using the manually created mock. |

---

## 8. Non-Functional Requirements

### Performance
- Saved mock behaviour shall be returned with sub-millisecond latency during repeat development runs.
- The additional delay introduced during first-use capture shall not exceed 100 milliseconds beyond the upstream service's own response time, excluding sanitisation processing time.

### Security
- PII sanitisation shall be applied to every captured interaction before any data is written to developer-controlled storage.
- The product shall not require upstream credentials to be stored on developer machines beyond what is already used for existing staging access.
- Recorded mock files shall not contain personally identifiable information, credential material, or other sensitive data after sanitisation.

### Availability
- Development tool — no production uptime SLA required.
- The system shall start and stop as a managed resource within the development orchestrator's lifecycle, both locally and in cloud-hosted environments.

### Compliance
- Captured data must pass the organisation's PII screening standards before storage.
- No external regulatory compliance requirements are currently identified beyond internal PII policy.

### Reliability
- The system shall recover gracefully from transient upstream failures during live capture without corrupting the mock store.
- A failed sanitisation pass shall prevent the captured data from being persisted, ensuring data integrity of the mock store.
- The system shall not leave partial or invalid mock artifacts on disk if a capture or write operation is interrupted.

### Scalability
- The system shall support concurrent proxy sessions for all services defined in a developer's service profile without resource contention.
- The mock store shall handle growth to thousands of recorded artifacts per service without degrading replay latency below the sub-millisecond target.
- Adding a new upstream dependency configuration shall not affect the performance of existing mock replay paths.

### Maintainability
- All behaviour-controlling settings (matching rules, sanitisation policies, URL templates) shall be driven by configuration files rather than hard-coded values.
- The codebase shall follow the repository's established code conventions and target framework version (.NET 10 / latest LTS).
- Mock artifact format and configuration schema changes shall be versioned so that older artifacts remain readable after upgrades.

### Portability
- The system shall operate with the same user-visible behaviour on developer workstations and in cloud-hosted development environments using a single configuration set.
- Mock store persistence shall abstract the underlying storage layer so that local filesystem and cloud-based blob storage (e.g., Azurite) can be used interchangeably.
- No environment-specific configuration shall be required to switch between local and cloud-hosted development.

---

## 9. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| AI sanitisation fails to detect or remove PII in captured upstream responses | PII stored on developer workstations or committed to source control, creating a data-privacy incident | Medium | Enforce a deny-by-default policy — unsanitised content is never persisted. Run periodic PII audits on committed mock artifacts. |
| Proxy introduces noticeable latency during live capture, degrading the developer experience | Developers bypass Mockery and revert to manual stubs or running full upstream stacks | Low | Cap additional proxy overhead at 100 ms beyond upstream response time. Profile the capture path and optimise serialisation. |
| Azurite / local blob storage behaves differently from cloud blob storage | Mocks that replay correctly locally fail in cloud-hosted environments or vice-versa | Medium | Maintain an integration test suite that runs the same mock scenarios against both Azurite and the cloud storage target. |
| Upstream API breaking changes invalidate recorded mocks silently | Developers work against stale mocks that no longer reflect real upstream behaviour, causing late-discovered integration failures | High | Implement mock staleness detection — timestamp-based expiry warnings and optional re-record policies. Surface warnings when a mock's age exceeds a configured threshold. |
| Mock staleness accumulates across teams, reducing overall mock-store trustworthiness | Teams lose confidence in Mockery and return to manual stub maintenance | Medium | Provide a mock freshness dashboard and support team-level refresh policies. Plan mock-drift detection in a future release. |

---

## 10. Integrations & Dependencies

| Integration | Purpose | Version / Notes |
|---|---|---|
| Configured upstream service environments | Provide the live dependency behaviour used to create the first reusable mock artifacts | Developer-accessible, non-production environments only; existing developer access is reused |
| Repository development workflow tooling | Starts Mockery with the selected service profile in local and cloud-hosted development environments | Must support declarative setup within the repository's standard developer workflow |
| Organisation-approved sanitisation and classification service | Removes sensitive data from captured dependency content and helps classify reusable interaction patterns | Must be reachable during capture sessions; unsanitised captured content cannot be stored |
| Developer workspace storage and source control | Store mock artifacts for replay, review, and collaboration | Working storage is per developer; approved sanitised artifacts may be committed to the repository |

---

## 11. Assumptions & Constraints

### Assumptions
- Upstream services used for initial recording are accessible from the developer's local environment with existing credentials or network access.
- Captured dependency content can be sanitised without breaking the behaviour expected by the consuming service.
- Developers have sufficient local disk space to store recorded mock files for their service's dependency set.
- Most dependency interactions follow repeatable patterns that can be grouped for reliable mock reuse.
- The organisation-approved classification service produces reusable interaction groupings with minimal manual correction.

### Constraints
- Must integrate with the repository's existing development orchestrator as a managed resource — no separate install or toolchain.
- Must operate identically in local and cloud-hosted development environments without environment-specific configuration.
- Must target .NET 10 or the latest LTS release to align with the repository's target framework version.
- Must use the organisation-approved AI capability for sanitisation and interaction classification.
- Recorded mocks must be stored as human-readable text artifacts suitable for code review and auditing.
- PII sanitisation must complete before any captured data reaches developer-controlled storage — not as a post-processing step.
- Upstream dependencies that require specialised access patterns beyond the repository's standard developer access model are excluded from v1 until dedicated support is added.

---

*This PRD is the source of truth for **what** is being built. For **how**, see `.docs/ARCHITECTURE.md`.*

---

## 12. Glossary

| Term | Definition |
|---|---|
| **Mock Store** | The local or cloud-based storage location where sanitised mock artifacts are persisted for replay, review, and source-control commitment. |
| **URL Template** | A parameterised URL pattern used to match incoming dependency requests to the correct upstream service configuration and recorded mock. |
| **Cache Key** | A composite identifier derived from request characteristics (method, path, significant headers/body fields) that uniquely distinguishes one recorded mock from another. |
| **Transform Instructions** | Configuration-driven rules that describe how to modify, redact, or replace specific fields in captured dependency data during sanitisation. |
| **Upstream Service** | An external or internal service that a developer's service depends on at runtime for data or behaviour. |
| **Proxy** | The Mockery component that intercepts outgoing dependency calls, routing them to the mock store for replay or forwarding them to the upstream service for live capture. |
| **Replay Mode** | The operating state in which Mockery serves dependency responses entirely from the mock store without contacting the upstream service. |
| **Record Mode** | The operating state in which Mockery forwards dependency calls to the live upstream service, captures the response, sanitises it, and stores it as a mock artifact. |
| **Service Router** | The routing layer within Mockery that maps incoming dependency requests to the correct upstream service configuration based on URL templates and matching rules. |
| **Azurite** | A lightweight, open-source emulator for Azure Blob, Queue, and Table storage used to provide cloud-compatible mock-store persistence in local development environments. |
