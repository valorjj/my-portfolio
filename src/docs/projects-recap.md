---
title: Projects Recap — Job Application
description: Polished English versions of project-01/02/03 for resume + portfolio. Korean translation comes after all three are locked.
status:
  project-01: locked (v1)
  project-02: locked (v1)
  project-03: locked (v1)
  project-04: locked (v1)
  project-05: draft (v1)
  project-06: draft (v1)
---

# Project 01 — KakaoTalk Chatbot for the National Unemployment-Benefits Service

**Period:** 5 months · **Role:** Backend Developer · **Team:** 6 developers
**Client:** Ministry of Employment and Labor (outsourced)
**Product:** KakaoTalk chatbot for the national unemployment-benefits service, built on **Kakao i Open Builder**.

### Context

The Ministry wanted citizens to resolve unemployment-benefit questions — eligibility, application steps, case rulings — through KakaoTalk instead of phone or in-person channels. Because the domain is governed by a thick body of statutes and case rulings, the bot needed broad question coverage from day one.

### What I built

- **NLU corpus authoring.** Worked with the team to read the relevant statutes and case precedents and convert them into Kakao i Open Builder artifacts: **1,000+ entities and 9,000+ training expressions**. The hardest part was translating legal language into NLU training data with enough phrasing variation to cover real user input.
- **Admin "chat-room" console.** A KakaoTalk-style UI where staff could replay any citizen's full conversation. Clicking a message surfaced cross-referenced records (case status, benefit history, related rulings) pulled from across **~110 tables**.
- **Heavy dynamic SQL with MyBatis.** Read-heavy multi-table joins with many optional filters — my first deep exposure to production-grade dynamic SQL.

### Tech

Java, Spring, MyBatis, MySQL / MariaDB, Kakao i Open Builder.

### What I took away

- Bridging unstructured natural-language input to structured backend data — the gap between "how a citizen phrases a question" and "the join I need to run."
- Production patterns for dynamic SQL: optional `<if>` filters, null-safe parameter handling, keeping a 9-table join readable.
- The discipline of a regulated domain (labor law) where wrong answers carry real consequences for citizens.

---

# Project 02 — NIA Public-Data Sharing Pilot

**Period:** ~3 months · **Role:** Backend Developer · **Team:** 2–3 developers
**Client:** **NIA (한국지능정보사회진흥원 / National Information Society Agency)** — pilot project to integrate public data across government institutions.

### Context

NIA's goal was to gather and standardize public data from multiple government institutions (5 in the pilot — Korea Forest Service among them) into a unified, machine-readable form. The data pipeline had three actors:

```
[Institution server]                [Partner Company A]                 [Our server]
  - holds raw data        ---->     installs batch agent      ---->     receives batch payload
                                    in each institution                 maps RDF -> CSV
```

Each institution had its own schema and its own domain vocabulary. NIA delivered a single, very long Excel spreadsheet of mapping rules — written in government-office language — and our job was to build a server that could ingest those rules and execute them at runtime.

### What I built

- **Mapping engine (Excel rules → runtime config).** Translated **~250 mapping rules** from the Excel spec into structured **YAML** the engine could load. Each rule defined how a field in an institution's RDF payload should be transformed into a CSV column.
- **Asynchronous mapping pipeline with `CompletableFuture`.** The volume of incoming batches plus the length of each mapping job exceeded what a single synchronous request could handle. I decomposed the mapping service into **22 pipeline stages**, composed as a `CompletableFuture` chain, and introduced explicit **transaction propagation / isolation** rules so partial failures could be isolated and reported per stage. This was my first time doing server-side async at this depth, and it forced me to learn `CompletableFuture` and Spring's `@Transactional` propagation modes seriously.
- **Per-stage error reporting.** Because a single batch flowed through 22 stages, "it failed" wasn't useful — we needed "stage 14 (the X-mapping step) failed on field Y of record Z." I added structured reporting at each stage so operations could pinpoint the broken rule, not just the broken job.
- **Dynamic mapping form.** NIA repeatedly changed mapping rules during the pilot. Instead of redeploying for every change, I built a **server-rendered (Thymeleaf) admin form** that wrote over the YAML config at runtime, so domain users could adjust mappings without a developer in the loop.

### Tech

Java, **Spring Boot**, `CompletableFuture`, Spring `@Transactional` (propagation / isolation), YAML config, RDF → CSV pipeline, **Tibero**, **Thymeleaf**.

### What I took away

- **Async-first thinking.** When work is too large for a single request, decompose into stages and compose them — and design observability per stage, not per request.
- **Transaction boundaries are a design choice, not a default.** Propagation/isolation behaviors that "just work" synchronously stop working once stages run on different threads.
- **Externalize the rules domain users will keep changing.** Hardcoded mapping logic would have meant a redeploy per rule change. A dynamic form + YAML overwrite turned a developer task into a domain-user task.

---

# Project 03 — Samsung RPA Portal Renewal

**Period:** ~6 months · **Role:** Backend Developer (joined mid-project) · **Team:** 3–5 developers
**Client:** **Samsung** — internal RPA (Robotic Process Automation) portal renewal.
**Migration:** Legacy portal on **Mendix** → new portal integrated with **Automation Anywhere A360**.

### Context

Samsung was migrating its RPA platform from a Mendix-based portal to **Automation Anywhere A360**. Our team owned the **new portal** (frontend + backend); Samsung owned the A360 server itself. The portal had to drive A360 remotely for every user action — and A360's response time was genuinely unpredictable, sometimes **30 seconds, sometimes 5 minutes**, with no way to forecast.

System shape:

```
(portal frontend) -> (portal backend) -> (engine) -> (A360 server) + (auth server)
```

A single user-initiated action (e.g., "run this process") fanned out into **6–7 backend↔A360 round-trips** — legitimacy check, approval check, tenant/folder binding, tenancy validation, execution, status update, logging.

In production the portal served **6 Samsung-internal tenants** and orchestrated **~8,000 active processes**.

I joined mid-project with three concrete responsibilities.

### What I owned

**1. Multi-tenant UI/UX fixes.**
Resolved a backlog of correctness bugs in the multi-tenant flows — making sure each tenant only saw its own folders, processes, approvals, and run history, and that tenant context propagated cleanly from the frontend through to every A360 call.

**2. Process-related query refactor.**
Refactored the queries powering the "process" feature, which spanned **9 base tables and 2 view tables**. Cleaned up joins and made filtering predictable enough that the multi-tenant constraints from (1) could be enforced at the data layer, not just the UI.

**3. RxJava + Stream API on Spring WebFlux for the A360 orchestration layer.**
A senior dev had chosen **RxJava** (instead of `CompletableFuture`, which I had used before) because every user action required composing 6–7 A360 calls with very long, variable timeouts, on a **Spring WebFlux** reactive stack. My job was to read, understand, and improve that codebase — without prior RxJava experience and without a mentor on it.

- Learned RxJava operator-by-operator on the job: `flatMap`, `zip`, `merge`, `retryWhen`, `timeout`, error handling, scheduler choice — and the interop story between RxJava and the underlying Reactor types WebFlux uses.
- Combined **RxJava with the Java Stream API** for filtering large response bundles (Stream for in-memory transforms, RxJava for the async composition).
- Tuned generous timeouts and retry policies so the portal could absorb A360's unpredictable 30-second-to-5-minute latency without blocking threads.

### Tech

Java, **Spring Boot**, **Spring WebFlux**, **RxJava** (with Reactor interop), Java **Stream API**, **MySQL / MariaDB**, **Automation Anywhere A360** integration, multi-tenant model.

### Scale (production)

- **6 tenants** (Samsung business units)
- **~8,000 active RPA processes** orchestrated through the portal
- **9 + 2 view** tables backing the process feature

### What I took away

- **Reactive composition is a different mental model from `CompletableFuture`.** Once it clicked — operators as a declarative pipeline rather than a thread-juggling exercise — composing 6–7 async A360 calls per user action became much more readable than the equivalent `CompletableFuture` chain would have been. The WebFlux + RxJava combination forced me to think in terms of *non-blocking end-to-end* instead of "async wrapper on a blocking stack."
- **Designing for unpredictable upstream latency.** When an external system can take 30 s or 5 min and you can't predict which, your timeout, retry, and thread-isolation choices stop being defaults and become real design decisions.
- **Multi-tenancy is a data-layer concern, not a UI one.** Filter at the query level; trust nothing the UI sends about which tenant you are.
- **Joining mid-project, learning a stack with no mentor.** Reading an unfamiliar reactive codebase, running experiments, and only then refactoring is itself a skill — and the most useful one I picked up in this project.

---

# Project 04 — Samsung RPA Portal: Private Runner, Educational Sandbox & Legacy Migration (follow-up to Project 03)

**Period:** ~3 months · **Role:** Backend Developer · **Team:** 3–5 developers
**Client:** **Samsung** — second follow-up project on the same RPA portal as Project 03.

### Context

With the renewed portal in production (Project 03), the team's next mandate was **role-based access control for the multi-tenant RPA portal**. **Automation Anywhere A360 has no concept of a "private runner"** — A360 expresses everything related to users, user-groups, and permissions through a single primitive: **`role-group`**.

Our team designed a portal-level abstraction called **"private runner"** — a logical grouping that maps onto A360's `role-group`. The private runner became the **key unit of role-based access per tenant**: who in which tenant can execute which RPA processes.

As in Project 03, every state change had to be reflected on the A360 side through the same complex backend API surface (`portal → engine → A360`), with the same unpredictable A360 latency.

### What I built

**1. Multi-tenant private-runner registration into A360.**
Designed and implemented the path that translates a portal-level "private runner" into one or more A360 `role-group` records — scoped per tenant so each tenant's private runners only ever land under that tenant's slice of A360. The mapping went both ways: any change in the portal had to materialize on A360, and any A360-side change had to be reconcilable back to the portal model. By the time I left, the system was managing **500+ private runners** across the 6 Samsung tenants.

**2. Periodic sync + force-sync.**
Two flavors of reconciliation between portal-side state and A360 role-group state:
- **Periodic batch script** — scheduled job to detect drift and apply corrections.
- **Force-sync** — on-demand operator action when "I need this synced right now, not in N minutes."

Both modes had to be idempotent and tenant-isolated.

**3. Educational standalone system with cascading TTL** _(the largest piece of the project)_.
Samsung wanted an **educational/training environment** that bundled the same four entity types — **processes, private runners, role-groups, and licenses** — but with a **valid-until date**. After the validation end date, **everything in the bundle had to go stale at once**: processes become non-executable, the private runner unbound, the role-group revoked, the license invalidated.

I built it as a **standalone system** rather than overloading the production portal, because the lifecycle rules are fundamentally different (production = "valid until revoked", education = "valid until a date"). The hard part wasn't any single entity's expiry — it was making expiry **cascade consistently across all four entity types** without leaving any of them half-stale on either the portal side or the A360 side.

_I left the project before Samsung ran their first actual educational session, so I don't have post-launch numbers — the system was built and ready, Samsung was still setting up their training environment when I rolled off._

**4. Daily migration from the legacy portal.**
Wrote long **stored procedures** to preserve data from the old (Mendix-era) portal into the new portal's schema. The legacy site was **still live during cutover and producing 5–10 new records per day**, so the migration couldn't be a single one-shot snapshot — it had to **run daily** to catch the delta. The procedures covered **~70 legacy tables**, and the critical payload was the **~8,000 process records** that had to land on the new portal intact.

### Tech

Java, **Spring Boot**, **Spring WebFlux**, **RxJava** (with Reactor interop), Java Stream API, **MySQL / MariaDB**, **Automation Anywhere A360** integration, **stored procedures** on the DB side for the migration.

### Scale

- **500+** private runners managed (across 6 Samsung tenants)
- **~70** legacy tables covered by the migration
- **~8,000** legacy process records migrated to the new portal
- **5–10** legacy records produced daily during cutover — handled by daily delta runs

### What I took away

- **Designing a logical abstraction the upstream system doesn't have.** A360 didn't know what a "private runner" was; we had to map it bidirectionally onto `role-group`, then defend that abstraction against every drift case the two systems could produce.
- **Sync as a first-class concern.** When two systems hold the same state, reconciliation needs both a scheduled mode and a manual force mode — and both must be idempotent and tenant-scoped.
- **Cascading lifecycle across entity types.** A "valid until X" rule that has to propagate consistently across processes, private runners, role-groups, and licenses is much harder than per-entity TTL — it taught me to design the invalidation path before the creation path.
- **Migrating from a still-live legacy system.** When the source keeps producing new rows during cutover, "one big migration" stops working — daily idempotent procedures that re-apply cleanly are the right shape.

---

# Project 05 — Smilegate Accounting Admin Portal (Clean-Architecture build)

**Period:** Feb 2025 – May 2025 (~4 months) · **Role:** Developer · **Team:** _TBD_
**Client:** **Smilegate** — company-wide internal admin portal.
**Our scope:** the **accounting** module of that portal.
**Stack:** **React (frontend) + Spring Boot (backend)**.

### Context

Smilegate was building a **company-wide internal admin portal**, and our team owned the **accounting** slice of it. The architectural brief was explicit: structure the codebase as **Clean Architecture** from day one so the system could be sliced into **microservices** later without a rewrite. The schedule was tight — roughly four months end-to-end — for a domain (accounting) where numbers have to be exactly right, not approximately right.

### What I built

- **Cross-tab numeric reconciliation.** Several accounting screens were composed of multiple tabs whose totals had to **match perfectly** — the same figure, reached through different derivations, displayed in different places. Getting every tab to converge on a single source-of-truth number — without one tab silently drifting from another under filtering, refresh, or partial reload — was the single most time-consuming correctness problem in the project.
- **Polymorphic grid interactions.** A single grid component had to respond differently to clicks depending on which **column**, **header**, or **row** the user touched — different cells in the same grid triggered different actions, different selection rules, and different downstream flows. Encoding all of those behaviors in one component, without it collapsing into a `switch`-statement zoo, was a structural problem in its own right.
- **Composed lifecycles: filter ↔ grid ↔ Zustand ↔ loader.** Filters, grid state, the Zustand store, and the data loader each had their own lifecycle, and they had to compose cleanly: a filter change had to invalidate the right slice of grid state and trigger the right loader sequence — without re-running everything or showing intermediate, inconsistent numbers along the way.
- **Loader lifecycle.** Long-running, partially-dependent fetches needed a coordinated loader story — when to show what, when to cancel in flight, when one loader's result invalidated another's. Folding that into the Zustand model without leaking transient states into the UI was non-trivial.

### Tech

**React**, **Zustand** (state), **Spring Boot** (backend) — designed against **Clean Architecture** for a future **MSA migration**.

### What I took away

- **"Clean Architecture for a future MSA split" is a frontend constraint too, not just a backend one.** Boundaries between domain logic, view models, and the transport layer have to be drawn on the React side as well — otherwise the eventual service split forces a frontend rewrite.
- **Numeric consistency across composed views is a system property, not a screen property.** Once the same figure is reachable through multiple tabs, "this tab is correct in isolation" stops being enough — the source of truth has to live above any single screen.
- **A grid with polymorphic cell behavior needs an explicit interaction model.** Dispatching on `(column, header, row, cell-type)` through a defined contract is much more maintainable than one component branching internally on every special case.
- **Composed lifecycles need explicit choreography.** When filter, grid, store, and loader each have their own lifecycle, the bugs live in the **transitions between them**, not inside any one of them — designing those transitions first saves the most time later.
- **Tight schedule + regulated-feeling domain (accounting) + an architectural mandate (Clean Architecture for MSA-readiness)** is a real constraint triangle. The discipline of holding the architectural line under deadline pressure was a project-shaped lesson on its own.

---

# Project 06 — Hanwha Aerospace RPA Portal (broadest-scope project to date)

**Period:** Sep 2025 – Mar 2026 (~7 months) · **Role:** Full-stack Developer · **Team:** 4 developers
**Client:** **Hanwha Aerospace** — new internal RPA portal.
**Stack:** **Svelte** (frontend) + **Kotlin / Spring Boot** (backend) + **Camunda BPM** — both the **engine** service and the **external-task worker** service.

### Context

The most recent, most labor-intensive, and broadest-scope project of my career so far. Built Hanwha Aerospace's new internal RPA portal on a Svelte + Kotlin/Spring Boot stack, with **Camunda** as the workflow engine — split into a dedicated **engine** service and a separate **external** worker service. Compared to my previous RPA work at Samsung (Projects 03 and 04), this one had me sit much further across the stack on a 4-person team: cross-cutting platform pieces (i18n, RBAC, audit, caching), the Svelte component layer, the CD pipeline, software-certification prep, and the end-user documentation — all mine.

### What I built

**1. In-house multi-language (i18n) library — no off-the-shelf i18n library used.**
Built our own i18n library from scratch instead of adopting one of the standard libraries: message catalog format, lookup API, fallback semantics, and the integration on both the Kotlin and Svelte sides. Building it forced me to commit to the kinds of decisions an off-the-shelf library hides — when keys resolve, how missing keys behave in production, how catalogs are shipped to the client.

**2. Unified caching layer (translations + common codes + per-user permissions).**
A single backend caching layer that warms three different kinds of data per session: translations (consumed by the i18n library), common-code dictionaries (the enum-like values every internal portal needs), and the active user's **permission list**. The user's permission cache is then surfaced into Svelte too — every component that should be conditionally **disabled or hidden** for RBAC reasons reads from the same cached source instead of refetching or rederiving.

**3. Annotation-based RBAC, end-to-end (backend + frontend).**
A unified Spring annotation, `@RequiresIntegratedPermission`, that collapses two previously-separate concerns — **JWT-based RBAC** (feature + resource permissions) and **PAT (Personal Access Token) scope checking** — into a single declarative point. The same call site works under both auth modes:

```kotlin
@RequiresIntegratedPermission(["ui:connector_create"])
@PostMapping
override fun createConnector(@RequestBody request: ConnectorCreateRequestDto): ResponseEntity<Results> =
    created { connectorService.createConnector(request) }
```

The annotation supports several composition patterns — a shared permission list checked under both modes, RBAC-only `features`/`resources`, and PAT-only `patScopes` — with AND/OR semantics on the combined list. The same permission vocabulary is then surfaced into Svelte via a shared composable, so a button or control declares its required permission once and the framework decides whether to render it disabled or hidden:

```svelte
const permissionState = usePermissionDisabled({
  disabled: () => disabled,
  permission: () => permission,
  componentName: 'EcoletreeButton'
});

<Button.Root
  class={buttonClass}
  aria-label={ariaLabel}
  disabled={permissionState.isDisabled}
  {onclick}
  {type}
  bind:ref
/>
```

The combined effect: a permission name lives in **one** vocabulary. The backend rejects unauthorized requests at the annotation, the frontend renders the correct affordance from the same cached permission list, and the two **cannot drift**.

**4. Centralized, declarative audit-log system.**
An `@AuditLog` annotation with rich SpEL expressions for capturing target IDs, target names, summary keys + args (translated through the same i18n system), and optionally the full response payload — so audit-logging an endpoint becomes a single decorator instead of a hand-rolled service call inside each handler.

```kotlin
@DeleteMapping("/sessions/{userId}/all")
@AuditLog(
    eventType = AuditEventType.ADMIN_FORCE_LOGOUT,
    targetDomain = AuditTargetDomain.SESSION,
    summaryKey = "audit.admin.force_logout_all",
    summaryArgs = ["userId", "result.value.username", "result.value.revokedTokenCount"],
    targetIdExpression = "#path['userId']",
    targetNameExpression = "#result?.value?.username ?: 'User#' + #userId",
    captureResponse = true,
    handler = DefaultAuditHandler::class
)
fun forceLogoutAllUserSessions(@PathVariable userId: Long): ResponseEntity<Results> = ...
```

**5. Svelte component design — the design-system layer the rest of the team writes screens against.**
Designed the overall Svelte component layer so the platform concerns (RBAC, i18n, audit) are wired into the building-block components themselves — screens consume `EcoletreeButton` and friends without having to know how permissions, translations, or audit logging work.

**6. CD pipeline on GitHub Actions.**
Set up the continuous-deployment pipeline that takes the project from merge to deploy.

**7. GS Certification prep.**
Drove the project's preparation for **GS인증** (Good Software certification, administered by TTA) — the evidence package, test artifacts, and certifier-required documentation.

**8. The entire end-user manual.**
Wrote the full user manual end-to-end.

### Tech

**Svelte** (frontend), **Kotlin / Spring Boot** (backend), **Camunda BPM** (engine + external-task worker services), Spring AOP + custom annotations (RBAC, PAT, audit log), GitHub Actions (CD), in-house i18n library, in-house caching layer, SpEL for declarative audit metadata.

### What I took away

- **Cross-cutting concerns belong in annotations.** RBAC, PAT scope checking, and audit-logging are all "every endpoint touches this" concerns — once pushed behind a declarative annotation, each handler stays focused on its own logic and the cross-cutting rules stay enforceable in one place rather than re-implemented per call site.
- **Unifying two auth modes (JWT + PAT) behind one decorator** is much cleaner than asking every controller to know about both. The combinator lives in the annotation; the call site stays single-purpose.
- **Sharing permission vocabulary across the frontend and backend** eliminates the most common class of RBAC bug — UI showing a control the backend rejects, or vice versa. Cached per-user permissions plus a shared permission name means a button knows it's disabled before the user can ever click it.
- **Building an in-house i18n library instead of adopting one** is a real tradeoff: you trade "library does this for you" for "your fallback / resolution / loading semantics are exactly what you wanted." Worth it when constraints don't fit off-the-shelf, expensive otherwise — and the experience of *making* those decisions instead of inheriting them was itself the lesson.
- **Camunda's engine + external-task split reshapes backend design.** Long-running, externally-orchestrated work has a different shape than request/response — and an engine + worker split forces those shapes to be explicit.
- **Owning breadth (platform + UI + DevOps + cert + docs) is a different skill than owning depth.** This has been the largest stretch of scope I have taken on, and the most valuable thing I have learned has been how to keep all of those tracks moving without one falling behind the others.
