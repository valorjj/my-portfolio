export type Highlight = {
  title: string;
  body: string;
};

export type ScaleItem = {
  label: string;
  value: string;
};

export type CodeSnippet = {
  language: string;
  caption?: string;
  code: string;
};

export type Project = {
  index: string;
  title: string;
  client: string;
  product?: string;
  period: string;
  role: string;
  team: string;
  context: string;
  diagram?: string;
  highlights: Highlight[];
  tech: string[];
  scale?: ScaleItem[];
  snippet?: CodeSnippet;
  takeaways: string[];
};

export const projectsEn: Project[] = [
  {
    index: '01',
    title: 'KakaoTalk Chatbot for the National Unemployment-Benefits Service',
    client: 'Ministry of Employment and Labor (outsourced)',
    product:
      'KakaoTalk chatbot for the national unemployment-benefits service, built on Kakao i Open Builder.',
    period: '5 months',
    role: 'Backend Developer',
    team: '6 developers',
    context:
      "The Ministry wanted citizens to resolve unemployment-benefit questions — eligibility, application steps, case rulings — through KakaoTalk instead of phone or in-person channels. Because the domain is governed by a thick body of statutes and case rulings, the bot needed broad question coverage from day one.",
    highlights: [
      {
        title: 'NLU corpus authoring.',
        body: "Worked with the team to read the relevant statutes and case precedents and convert them into Kakao i Open Builder artifacts: 1,000+ entities and 9,000+ training expressions. The hardest part was translating legal language into NLU training data with enough phrasing variation to cover real user input.",
      },
      {
        title: 'Admin "chat-room" console.',
        body: "A KakaoTalk-style UI where staff could replay any citizen's full conversation. Clicking a message surfaced cross-referenced records (case status, benefit history, related rulings) pulled from across ~110 tables.",
      },
      {
        title: 'Heavy dynamic SQL with MyBatis.',
        body: 'Read-heavy multi-table joins with many optional filters — my first deep exposure to production-grade dynamic SQL.',
      },
    ],
    tech: ['Java', 'Spring', 'MyBatis', 'MySQL / MariaDB', 'Kakao i Open Builder'],
    snippet: {
      language: 'markup',
      caption: 'MyBatis dynamic SQL · optional filters across a multi-table join',
      code: `<select id="findCases" resultType="CaseRecord">
  SELECT c.case_id, c.status, c.applied_at, c.applicant_id
  FROM   benefit_case c
  <where>
    <if test="status != null">
      AND c.status = #{status}
    </if>
    <if test="from != null">
      AND c.applied_at &gt;= #{from}
    </if>
    <if test="to != null">
      AND c.applied_at &lt; #{to}
    </if>
    <if test="rulingId != null">
      AND EXISTS (
        SELECT 1 FROM case_ruling r
        WHERE  r.case_id   = c.case_id
          AND  r.ruling_id = #{rulingId})
    </if>
  </where>
  ORDER BY c.applied_at DESC
</select>`,
    },
    takeaways: [
      'Bridging unstructured natural-language input to structured backend data — the gap between "how a citizen phrases a question" and "the join I need to run."',
      'Production patterns for dynamic SQL: optional `<if>` filters, null-safe parameter handling, keeping a 9-table join readable.',
      'The discipline of a regulated domain (labor law) where wrong answers carry real consequences for citizens.',
    ],
  },
  {
    index: '02',
    title: 'NIA Public-Data Sharing Pilot',
    client:
      'NIA (한국지능정보사회진흥원 / National Information Society Agency) — pilot project to integrate public data across government institutions.',
    period: '~3 months',
    role: 'Backend Developer',
    team: '2–3 developers',
    context:
      "NIA's goal was to gather and standardize public data from multiple government institutions (5 in the pilot — Korea Forest Service among them) into a unified, machine-readable form. Each institution had its own schema and its own domain vocabulary. NIA delivered a single, very long Excel spreadsheet of mapping rules — written in government-office language — and our job was to build a server that could ingest those rules and execute them at runtime.",
    diagram: `[Institution server]        [Partner Company A]              [Our server]
   holds raw data    →    installs batch agent      →    receives batch
                          in each institution            maps RDF → CSV`,
    highlights: [
      {
        title: 'Mapping engine (Excel rules → runtime config).',
        body: "Translated ~250 mapping rules from the Excel spec into structured YAML the engine could load. Each rule defined how a field in an institution's RDF payload should be transformed into a CSV column.",
      },
      {
        title: 'Asynchronous mapping pipeline with `CompletableFuture`.',
        body: "The volume of incoming batches plus the length of each mapping job exceeded what a single synchronous request could handle. I decomposed the mapping service into 22 pipeline stages, composed as a `CompletableFuture` chain, and introduced explicit transaction propagation / isolation rules so partial failures could be isolated and reported per stage. This was my first time doing server-side async at this depth, and it forced me to learn `CompletableFuture` and Spring's `@Transactional` propagation modes seriously.",
      },
      {
        title: 'Per-stage error reporting.',
        body: 'Because a single batch flowed through 22 stages, "it failed" wasn\'t useful — we needed "stage 14 (the X-mapping step) failed on field Y of record Z." I added structured reporting at each stage so operations could pinpoint the broken rule, not just the broken job.',
      },
      {
        title: 'Dynamic mapping form.',
        body: 'NIA repeatedly changed mapping rules during the pilot. Instead of redeploying for every change, I built a server-rendered (Thymeleaf) admin form that wrote over the YAML config at runtime, so domain users could adjust mappings without a developer in the loop.',
      },
    ],
    tech: [
      'Java',
      'Spring Boot',
      'CompletableFuture',
      'Spring @Transactional (propagation / isolation)',
      'YAML config',
      'RDF → CSV pipeline',
      'Tibero',
      'Thymeleaf',
    ],
    snippet: {
      language: 'java',
      caption: '22-stage CompletableFuture chain with per-stage transaction isolation',
      code: `@Transactional(propagation = REQUIRES_NEW)
public CompletableFuture<BatchResult> runMapping(Batch batch) {
  return CompletableFuture
      .supplyAsync(() -> stage(1,  "validate",  () -> validate(batch)), io)
      .thenApply  (b  -> stage(2,  "normalize", () -> normalize(b)))
      .thenApply  (b  -> stage(3,  "lookup-refs", () -> resolveRefs(b)))
      // ... 18 intermediate stages, each reported per-record ...
      .thenApply  (b  -> stage(22, "emit-csv",  () -> writeCsv(b)))
      .exceptionally(this::reportStageFailure);
}

private <T, R> R stage(int n, String name, Supplier<R> step) {
  try   { return step.get(); }
  catch (Exception e) {
    reporter.fail(n, name, e);   // "stage 14 failed on field Y of record Z"
    throw new StageFailure(n, name, e);
  }
}`,
    },
    takeaways: [
      '**Async-first thinking.** When work is too large for a single request, decompose into stages and compose them — and design observability per stage, not per request.',
      '**Transaction boundaries are a design choice, not a default.** Propagation/isolation behaviors that "just work" synchronously stop working once stages run on different threads.',
      '**Externalize the rules domain users will keep changing.** Hardcoded mapping logic would have meant a redeploy per rule change. A dynamic form + YAML overwrite turned a developer task into a domain-user task.',
    ],
  },
  {
    index: '03',
    title: 'Samsung RPA Portal Renewal',
    client: 'Samsung — internal RPA (Robotic Process Automation) portal renewal.',
    product:
      'Legacy portal on Mendix → new portal integrated with Automation Anywhere A360.',
    period: '~6 months',
    role: 'Backend Developer (joined mid-project)',
    team: '3–5 developers',
    context:
      "Samsung was migrating its RPA platform from a Mendix-based portal to Automation Anywhere A360. Our team owned the new portal (frontend + backend); Samsung owned the A360 server itself. The portal had to drive A360 remotely for every user action — and A360's response time was genuinely unpredictable, sometimes 30 seconds, sometimes 5 minutes, with no way to forecast. A single user-initiated action fanned out into 6–7 backend↔A360 round-trips — legitimacy check, approval check, tenant/folder binding, tenancy validation, execution, status update, logging.",
    diagram: `(portal frontend) → (portal backend) → (engine) → (A360 server)
                                                       ↘ (auth server)

   one user action = 6–7 backend↔A360 round-trips
   A360 latency: 30 s ─ 5 min, unpredictable`,
    highlights: [
      {
        title: 'Multi-tenant UI/UX fixes.',
        body: 'Resolved a backlog of correctness bugs in the multi-tenant flows — making sure each tenant only saw its own folders, processes, approvals, and run history, and that tenant context propagated cleanly from the frontend through to every A360 call.',
      },
      {
        title: 'Process-related query refactor.',
        body: 'Refactored the queries powering the "process" feature, which spanned 9 base tables and 2 view tables. Cleaned up joins and made filtering predictable enough that the multi-tenant constraints could be enforced at the data layer, not just the UI.',
      },
      {
        title: 'RxJava + Stream API on Spring WebFlux for the A360 orchestration layer.',
        body: 'A senior dev had chosen RxJava (instead of `CompletableFuture`, which I had used before) because every user action required composing 6–7 A360 calls with very long, variable timeouts, on a Spring WebFlux reactive stack. My job was to read, understand, and improve that codebase — without prior RxJava experience and without a mentor on it. I learned RxJava operator-by-operator on the job (`flatMap`, `zip`, `merge`, `retryWhen`, `timeout`, error handling, scheduler choice) plus the interop story between RxJava and the underlying Reactor types WebFlux uses; combined RxJava with the Java Stream API for filtering large response bundles (Stream for in-memory transforms, RxJava for the async composition); and tuned generous timeouts and retry policies so the portal could absorb A360\'s unpredictable 30-second-to-5-minute latency without blocking threads.',
      },
    ],
    tech: [
      'Java',
      'Spring Boot',
      'Spring WebFlux',
      'RxJava (with Reactor interop)',
      'Java Stream API',
      'MySQL / MariaDB',
      'Automation Anywhere A360 integration',
      'Multi-tenant model',
    ],
    scale: [
      { label: 'Tenants', value: '6' },
      { label: 'Active processes', value: '~8,000' },
      { label: 'Process feature tables', value: '9 + 2 view' },
    ],
    snippet: {
      language: 'java',
      caption: 'RxJava on WebFlux · composing 6–7 A360 calls with unpredictable upstream latency',
      code: `public Mono<RunResult> runProcess(Action a, TenantCtx ctx) {
  return Single.zip(
        a360.checkLegitimacy(a, ctx),
        a360.checkApproval  (a, ctx),
        a360.bindFolder     (a, ctx),
        a360.validateTenancy(a, ctx),
        (ok, approved, folder, valid) ->
            new Plan(ok, approved, folder, valid))
    .flatMap(plan -> a360.execute(plan)
        .timeout(Duration.ofMinutes(6))                  // A360: 30s–5min
        .retryWhen(backoff(3, Duration.ofSeconds(2))))   // generous, isolated
    .flatMap(a360::recordStatus)
    .subscribeOn(Schedulers.io())
    .as(RxJava3Adapter::singleToMono);                   // hand off to Reactor
}`,
    },
    takeaways: [
      "**Reactive composition is a different mental model from `CompletableFuture`.** Once it clicked — operators as a declarative pipeline rather than a thread-juggling exercise — composing 6–7 async A360 calls per user action became much more readable than the equivalent `CompletableFuture` chain would have been. The WebFlux + RxJava combination forced me to think in terms of *non-blocking end-to-end* instead of \"async wrapper on a blocking stack.\"",
      '**Designing for unpredictable upstream latency.** When an external system can take 30 s or 5 min and you can\'t predict which, your timeout, retry, and thread-isolation choices stop being defaults and become real design decisions.',
      '**Multi-tenancy is a data-layer concern, not a UI one.** Filter at the query level; trust nothing the UI sends about which tenant you are.',
      '**Joining mid-project, learning a stack with no mentor.** Reading an unfamiliar reactive codebase, running experiments, and only then refactoring is itself a skill — and the most useful one I picked up in this project.',
    ],
  },
  {
    index: '04',
    title:
      'Samsung RPA Portal: Private Runner, Educational Sandbox & Legacy Migration',
    client: 'Samsung — second follow-up project on the same RPA portal as Project 03.',
    period: '~3 months',
    role: 'Backend Developer',
    team: '3–5 developers',
    context:
      'With the renewed portal in production (Project 03), the team\'s next mandate was role-based access control for the multi-tenant RPA portal. Automation Anywhere A360 has no concept of a "private runner" — A360 expresses everything related to users, user-groups, and permissions through a single primitive: `role-group`. Our team designed a portal-level abstraction called "private runner" that maps onto A360\'s `role-group` and became the key unit of role-based access per tenant. As in Project 03, every state change had to be reflected on A360 through the same complex API surface, with the same unpredictable A360 latency.',
    highlights: [
      {
        title: 'Multi-tenant private-runner registration into A360.',
        body: "Designed and implemented the path that translates a portal-level \"private runner\" into one or more A360 `role-group` records — scoped per tenant so each tenant's private runners only ever land under that tenant's slice of A360. The mapping went both ways: any change in the portal had to materialize on A360, and any A360-side change had to be reconcilable back to the portal model. By the time I left, the system was managing 500+ private runners across the 6 Samsung tenants.",
      },
      {
        title: 'Periodic sync + force-sync.',
        body: 'Two flavors of reconciliation between portal-side state and A360 role-group state: a periodic batch script (scheduled job to detect drift and apply corrections) and a force-sync (on-demand operator action when "I need this synced right now, not in N minutes"). Both modes had to be idempotent and tenant-isolated.',
      },
      {
        title: 'Educational standalone system with cascading TTL.',
        body: 'The largest piece of the project. Samsung wanted an educational/training environment that bundled the same four entity types — processes, private runners, role-groups, and licenses — but with a valid-until date. After the validation end date, everything in the bundle had to go stale at once: processes become non-executable, the private runner unbound, the role-group revoked, the license invalidated. I built it as a standalone system rather than overloading the production portal, because the lifecycle rules are fundamentally different (production = "valid until revoked", education = "valid until a date"). The hard part wasn\'t any single entity\'s expiry — it was making expiry cascade consistently across all four entity types without leaving any of them half-stale on either the portal side or the A360 side. (I left the project before Samsung ran their first actual educational session, so I don\'t have post-launch numbers — the system was built and ready, Samsung was still setting up their training environment when I rolled off.)',
      },
      {
        title: 'Daily migration from the legacy portal.',
        body: "Wrote long stored procedures to preserve data from the old (Mendix-era) portal into the new portal's schema. The legacy site was still live during cutover and producing 5–10 new records per day, so the migration couldn't be a single one-shot snapshot — it had to run daily to catch the delta. The procedures covered ~70 legacy tables, and the critical payload was the ~8,000 process records that had to land on the new portal intact.",
      },
    ],
    tech: [
      'Java',
      'Spring Boot',
      'Spring WebFlux',
      'RxJava (with Reactor interop)',
      'Java Stream API',
      'MySQL / MariaDB',
      'Automation Anywhere A360 integration',
      'Stored procedures',
    ],
    scale: [
      { label: 'Private runners managed', value: '500+' },
      { label: 'Tenants', value: '6' },
      { label: 'Legacy tables covered', value: '~70' },
      { label: 'Process records migrated', value: '~8,000' },
      { label: 'Daily legacy delta', value: '5–10' },
    ],
    snippet: {
      language: 'sql',
      caption: 'Idempotent daily migration from still-live legacy portal · cascades expiry',
      code: `CREATE OR REPLACE PROCEDURE migrate_processes_delta(IN p_since DATETIME)
BEGIN
  -- 1. pull rows touched since the last run (idempotent upsert)
  INSERT INTO new_portal.process
        (id, tenant_id, name, runner_id, valid_until, updated_at)
  SELECT lp.id, lp.tenant_id, lp.name, lp.runner_id,
         lp.valid_until, lp.updated_at
  FROM   legacy.mendix_process lp
  WHERE  lp.updated_at >= p_since
  ON DUPLICATE KEY UPDATE
    name        = VALUES(name),
    runner_id   = VALUES(runner_id),
    valid_until = VALUES(valid_until),
    updated_at  = VALUES(updated_at);

  -- 2. cascade expiry across coupled entities (educational sandbox path)
  UPDATE new_portal.process p
    LEFT JOIN new_portal.private_runner r ON r.id = p.runner_id
    LEFT JOIN new_portal.role_group     g ON g.id = r.role_group_id
  SET p.status = 'EXPIRED',
      r.status = 'REVOKED',
      g.status = 'REVOKED'
  WHERE p.valid_until < NOW();
END;`,
    },
    takeaways: [
      "**Designing a logical abstraction the upstream system doesn't have.** A360 didn't know what a \"private runner\" was; we had to map it bidirectionally onto `role-group`, then defend that abstraction against every drift case the two systems could produce.",
      '**Sync as a first-class concern.** When two systems hold the same state, reconciliation needs both a scheduled mode and a manual force mode — and both must be idempotent and tenant-scoped.',
      '**Cascading lifecycle across entity types.** A "valid until X" rule that has to propagate consistently across processes, private runners, role-groups, and licenses is much harder than per-entity TTL — it taught me to design the invalidation path before the creation path.',
      '**Migrating from a still-live legacy system.** When the source keeps producing new rows during cutover, "one big migration" stops working — daily idempotent procedures that re-apply cleanly are the right shape.',
    ],
  },
  {
    index: '05',
    title: 'Smilegate Accounting Admin Portal',
    client: 'Smilegate — company-wide internal admin portal.',
    product: 'The accounting module of that portal.',
    period: 'Feb 2025 – May 2025 (~4 months)',
    role: 'Developer',
    team: 'TBD',
    context:
      "Smilegate was building a company-wide internal admin portal, and our team owned the accounting slice. The architectural brief was explicit: structure the codebase as Clean Architecture from day one so the system could be sliced into microservices later without a rewrite. The schedule was tight — roughly four months end-to-end — for a domain (accounting) where numbers have to be exactly right, not approximately right.",
    highlights: [
      {
        title: 'Cross-tab numeric reconciliation.',
        body: 'Several accounting screens were composed of multiple tabs whose totals had to match perfectly — the same figure, reached through different derivations, displayed in different places. Getting every tab to converge on a single source-of-truth number — without one tab silently drifting from another under filtering, refresh, or partial reload — was the single most time-consuming correctness problem in the project.',
      },
      {
        title: 'Polymorphic grid interactions.',
        body: 'A single grid component had to respond differently to clicks depending on which column, header, or row the user touched — different cells in the same grid triggered different actions, different selection rules, and different downstream flows. Encoding all of those behaviors in one component, without it collapsing into a `switch`-statement zoo, was a structural problem in its own right.',
      },
      {
        title: 'Composed lifecycles: filter ↔ grid ↔ Zustand ↔ loader.',
        body: 'Filters, grid state, the Zustand store, and the data loader each had their own lifecycle, and they had to compose cleanly: a filter change had to invalidate the right slice of grid state and trigger the right loader sequence — without re-running everything or showing intermediate, inconsistent numbers along the way.',
      },
      {
        title: 'Loader lifecycle.',
        body: "Long-running, partially-dependent fetches needed a coordinated loader story — when to show what, when to cancel in flight, when one loader's result invalidated another's. Folding that into the Zustand model without leaking transient states into the UI was non-trivial.",
      },
    ],
    tech: ['React', 'Zustand', 'Spring Boot', 'Clean Architecture (MSA-ready)'],
    takeaways: [
      '**"Clean Architecture for a future MSA split" is a frontend constraint too, not just a backend one.** Boundaries between domain logic, view models, and the transport layer have to be drawn on the React side as well — otherwise the eventual service split forces a frontend rewrite.',
      '**Numeric consistency across composed views is a system property, not a screen property.** Once the same figure is reachable through multiple tabs, "this tab is correct in isolation" stops being enough — the source of truth has to live above any single screen.',
      '**A grid with polymorphic cell behavior needs an explicit interaction model.** Dispatching on `(column, header, row, cell-type)` through a defined contract is much more maintainable than one component branching internally on every special case.',
      '**Composed lifecycles need explicit choreography.** When filter, grid, store, and loader each have their own lifecycle, the bugs live in the transitions between them, not inside any one of them — designing those transitions first saves the most time later.',
    ],
  },
  {
    index: '06',
    title: 'Hanwha Aerospace RPA Portal',
    client: 'Hanwha Aerospace — new internal RPA portal.',
    period: 'Sep 2025 – Mar 2026 (~7 months)',
    role: 'Full-stack Developer',
    team: '4 developers',
    context:
      "The most labor-intensive and broadest-scope project of my career so far. Built Hanwha Aerospace's new internal RPA portal on a Svelte + Kotlin/Spring Boot stack, with Camunda as the workflow engine — split into a dedicated engine service and a separate external-task worker service. On a 4-person team I sat across the stack: cross-cutting platform pieces (i18n, RBAC, audit, caching), the Svelte component layer, the CD pipeline, software-certification prep, and the end-user documentation.",
    diagram: `(Svelte frontend) → (Kotlin / Spring Boot portal)
                            ↓
                  (engine service)  ←→  (external-task workers)
                            ↓
                     (Camunda BPMN)`,
    highlights: [
      {
        title: 'In-house multi-language (i18n) library.',
        body: 'Built our own i18n library from scratch instead of adopting an off-the-shelf one — message catalog format, lookup API, fallback semantics, and the framework integration on both Kotlin and Svelte sides. Building it forced me to commit to the kinds of decisions an off-the-shelf library hides: when keys resolve, how missing keys behave in production, how catalogs ship to the client.',
      },
      {
        title: 'Unified caching layer (translations + common codes + per-user permissions).',
        body: "A single backend cache that warms three kinds of data per session: translations (consumed by the i18n library), common-code dictionaries, and the active user's permission list. The user's permission cache is then surfaced into Svelte too — every component that should be conditionally disabled or hidden for RBAC reasons reads from the same cached source instead of refetching or rederiving.",
      },
      {
        title: 'Annotation-based RBAC, end-to-end (backend + frontend).',
        body: 'A unified Spring annotation, `@RequiresIntegratedPermission`, that collapses JWT-based RBAC (feature + resource permissions) and PAT (Personal Access Token) scope checking into one declarative point. The same permission vocabulary is then surfaced into Svelte through a shared `usePermissionDisabled` composable — a button declares its required permission once and the framework decides whether to render it disabled or hidden. A permission name lives in one vocabulary; backend and frontend cannot drift.',
      },
      {
        title: 'Centralized, declarative audit-log system.',
        body: 'An `@AuditLog` annotation with rich SpEL expressions for capturing target IDs, target names, summary keys + args (translated through the same i18n system), and optionally the full response payload — so audit-logging an endpoint becomes a single decorator instead of a hand-rolled service call inside each handler.',
      },
      {
        title: 'Svelte component design.',
        body: 'Designed the overall Svelte component layer — the design-system building blocks the rest of the team writes screens against. Platform concerns (RBAC, i18n, audit) are wired into the components themselves, so screens consume them without having to know how permissions, translations, or audit logging work underneath.',
      },
      {
        title: 'CD pipeline on GitHub Actions.',
        body: 'Set up the continuous-deployment pipeline that takes the project from merge to deploy.',
      },
      {
        title: 'GS Certification prep.',
        body: "Drove the project's preparation for GS인증 (Good Software certification, administered by TTA) — assembling the evidence package, test artifacts, and certifier-required documentation.",
      },
      {
        title: 'The entire end-user manual.',
        body: 'Wrote the full user manual end-to-end.',
      },
    ],
    tech: [
      'Svelte',
      'Kotlin / Spring Boot',
      'Camunda BPM (engine + external-task workers)',
      'Spring AOP + custom annotations',
      'SpEL',
      'GitHub Actions (CD)',
      'In-house i18n library',
      'In-house caching layer',
    ],
    snippet: {
      language: 'kotlin',
      caption:
        'Declarative audit logging · SpEL captures path/result, summary keys route through the in-house i18n system',
      code: `@DeleteMapping("/sessions/{userId}/all")
@AuditLog(
    eventType         = AuditEventType.ADMIN_FORCE_LOGOUT,
    targetDomain      = AuditTargetDomain.SESSION,
    summaryKey        = "audit.admin.force_logout_all",
    summaryArgs       = ["userId", "result.value.username", "result.value.revokedTokenCount"],
    targetIdExpression   = "#path['userId']",
    targetNameExpression = "#result?.value?.username ?: 'User#' + #userId",
    captureResponse   = true,
    handler           = DefaultAuditHandler::class
)
fun forceLogoutAllUserSessions(@PathVariable userId: Long):
    ResponseEntity<Results> = single {
        tenantAdminAuthService.forceLogoutAllUserSessions(userId)
    }

// Companion: @RequiresIntegratedPermission(["ui:connector_create"])
//            collapses JWT-RBAC + PAT scope checking into one annotation,
//            and the same permission name is consumed on the Svelte side
//            via usePermissionDisabled — BE and FE share one vocabulary.`,
    },
    takeaways: [
      "**Cross-cutting concerns belong in annotations.** RBAC, PAT scope checking, and audit-logging are all \"every endpoint touches this\" concerns — once pushed behind a declarative annotation, each handler stays focused on its own logic and the cross-cutting rules stay enforceable in one place.",
      '**Sharing permission vocabulary across the frontend and backend** eliminates the most common class of RBAC bug — UI showing a control the backend rejects, or vice versa. Cached per-user permissions plus a shared permission name means a button knows it is disabled before the user can ever click it.',
      '**Building an in-house i18n library instead of adopting one** is a real tradeoff: you trade "library does this for you" for "your fallback / resolution / loading semantics are exactly what you wanted." Worth it when constraints do not fit off-the-shelf — and the experience of *making* those decisions instead of inheriting them was itself the lesson.',
      "**Owning breadth (platform + UI + DevOps + cert + docs) is a different skill from owning depth.** This has been the largest stretch of scope I have taken on, and the most valuable thing I have learned has been how to keep all of those tracks moving without one falling behind the others.",
    ],
  },
];
