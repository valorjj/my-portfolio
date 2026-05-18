import type { Project } from './projects';

export const projectsKo: Project[] = [
  {
    index: '01',
    title: '국가 실업급여 서비스 카카오톡 챗봇',
    client: '고용노동부 (외주 사업)',
    product:
      'Kakao i Open Builder 기반으로 구축된 국가 실업급여 서비스용 카카오톡 챗봇.',
    period: '5개월',
    role: '백엔드 개발자',
    team: '6인 개발팀',
    context:
      '고용노동부는 국민이 실업급여 관련 문의 — 수급 자격, 신청 절차, 판례 — 를 전화나 방문 대신 카카오톡으로 해결할 수 있게 하고자 했습니다. 이 도메인은 두꺼운 법령과 판례로 통제되기 때문에, 챗봇은 출시 첫날부터 넓은 질의 범위를 다룰 수 있어야 했습니다.',
    highlights: [
      {
        title: 'NLU 코퍼스 구축.',
        body: '팀과 함께 관련 법령과 판례를 읽어 Kakao i Open Builder 자산 — 1,000개 이상의 엔티티와 9,000개 이상의 학습 표현 — 으로 변환했습니다. 가장 어려운 부분은 법률 언어를 실제 사용자 입력을 커버할 만큼 다양한 표현 변형이 있는 NLU 학습 데이터로 옮기는 일이었습니다.',
      },
      {
        title: '관리자 "채팅방" 콘솔.',
        body: '담당자가 시민의 전체 대화를 재생할 수 있는 카카오톡 스타일 UI. 메시지를 클릭하면 약 110개 테이블에서 끌어온 교차 참조 레코드 (사례 상태, 수급 이력, 관련 판례) 가 표시됩니다.',
      },
      {
        title: 'MyBatis 기반 대규모 동적 SQL.',
        body: '다수의 선택적 필터를 가진 읽기 중심 다중 테이블 조인 — 운영 수준의 동적 SQL을 깊이 있게 다룬 첫 경험.',
      },
    ],
    tech: ['Java', 'Spring', 'MyBatis', 'MySQL / MariaDB', 'Kakao i Open Builder'],
    snippet: {
      language: 'markup',
      caption: 'MyBatis 동적 SQL · 다중 테이블 조인에 걸친 선택적 필터',
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
      '비정형 자연어 입력과 정형화된 백엔드 데이터 사이의 다리 놓기 — "시민이 질문을 어떻게 표현하는가"와 "내가 실행해야 하는 조인" 사이의 간극.',
      '동적 SQL의 운영 패턴: 선택적 `<if>` 필터, null 안전한 파라미터 처리, 9개 테이블 조인을 가독성 있게 유지하기.',
      '잘못된 답이 시민에게 실질적 결과를 초래하는 규제 도메인 (노동법) 의 규율.',
    ],
  },
  {
    index: '02',
    title: 'NIA 공공 데이터 공유 파일럿',
    client:
      '한국지능정보사회진흥원 (NIA) — 정부 기관 전반의 공공 데이터를 통합하는 파일럿 프로젝트.',
    period: '약 3개월',
    role: '백엔드 개발자',
    team: '2~3인 개발팀',
    context:
      'NIA의 목표는 여러 정부 기관 (파일럿 단계에서 5곳 — 그 중 산림청 포함) 의 공공 데이터를 통합된 기계 가독 형태로 수집·표준화하는 것이었습니다. 각 기관은 자체 스키마와 도메인 어휘를 가지고 있었습니다. NIA는 단 하나의 매우 긴 — 그리고 공무원 어투로 작성된 — 엑셀 매핑 규칙 명세를 전달했고, 우리의 일은 그 규칙을 받아들여 런타임에 실행할 수 있는 서버를 만드는 것이었습니다.',
    diagram: `[기관 서버]              [협력사 A]                       [우리 서버]
   원본 데이터    →    각 기관에 배치 에이전트 설치   →   배치 페이로드 수신
                                                          RDF → CSV 매핑`,
    highlights: [
      {
        title: '매핑 엔진 (엑셀 규칙 → 런타임 설정).',
        body: '엑셀 명세의 약 250개 매핑 규칙을 엔진이 로드할 수 있는 구조화된 YAML로 변환했습니다. 각 규칙은 기관 RDF 페이로드의 한 필드가 CSV 컬럼으로 어떻게 변환되어야 하는지를 정의합니다.',
      },
      {
        title: '`CompletableFuture` 기반 비동기 매핑 파이프라인.',
        body: '유입되는 배치 수와 각 매핑 작업의 길이가 단일 동기 요청으로 처리할 수 있는 범위를 넘어섰습니다. 매핑 서비스를 22개 파이프라인 스테이지로 분해해 `CompletableFuture` 체인으로 조합했고, 부분 실패가 스테이지 단위로 격리되어 보고될 수 있도록 명시적인 트랜잭션 전파 / 격리 규칙을 도입했습니다. 이 정도 깊이의 서버 사이드 비동기를 다룬 첫 경험이었고, `CompletableFuture`와 Spring의 `@Transactional` 전파 모드를 본격적으로 학습하게 만든 계기였습니다.',
      },
      {
        title: '스테이지별 에러 리포팅.',
        body: '하나의 배치가 22개 스테이지를 거치기 때문에 "실패했다"만으로는 부족했습니다 — "14번 스테이지 (X 매핑 단계) 가 레코드 Z의 Y 필드에서 실패"가 필요했습니다. 운영팀이 깨진 작업이 아니라 깨진 규칙을 정확히 짚을 수 있도록 각 스테이지에 구조화된 리포팅을 추가했습니다.',
      },
      {
        title: '동적 매핑 폼.',
        body: 'NIA는 파일럿 기간 동안 매핑 규칙을 반복적으로 변경했습니다. 변경마다 재배포하는 대신, 런타임에 YAML 설정을 덮어쓰는 서버 렌더링 (Thymeleaf) 관리자 폼을 만들어, 개발자 개입 없이 도메인 사용자가 직접 매핑을 조정할 수 있게 했습니다.',
      },
    ],
    tech: [
      'Java',
      'Spring Boot',
      'CompletableFuture',
      'Spring @Transactional (전파 / 격리)',
      'YAML 설정',
      'RDF → CSV 파이프라인',
      'Tibero',
      'Thymeleaf',
    ],
    snippet: {
      language: 'java',
      caption: '스테이지별 트랜잭션 격리를 갖춘 22단계 CompletableFuture 체인',
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
      '**비동기 우선 사고.** 한 번의 요청에 담을 수 없는 작업은 스테이지로 분해해 조합하라 — 그리고 관측 가능성은 요청 단위가 아니라 스테이지 단위로 설계하라.',
      '**트랜잭션 경계는 기본값이 아니라 설계 선택이다.** 동기 환경에서 "그냥 동작"하는 전파/격리 동작은 스테이지들이 다른 스레드에서 실행되는 순간 더는 동작하지 않는다.',
      '**도메인 사용자가 계속 바꿀 규칙은 외부화하라.** 매핑 로직을 하드코딩했다면 규칙 변경마다 재배포가 필요했을 것이다. 동적 폼 + YAML 덮어쓰기 조합은 개발자의 일을 도메인 사용자의 일로 옮겼다.',
    ],
  },
  {
    index: '03',
    title: '삼성 RPA 포털 리뉴얼',
    client: '삼성 — 사내 RPA (Robotic Process Automation) 포털 리뉴얼.',
    product:
      'Mendix 기반 레거시 포털 → Automation Anywhere A360과 통합된 신규 포털.',
    period: '약 6개월',
    role: '백엔드 개발자 (프로젝트 중간 합류)',
    team: '3~5인 개발팀',
    context:
      '삼성은 RPA 플랫폼을 Mendix 기반 포털에서 Automation Anywhere A360으로 이관 중이었습니다. 우리 팀은 신규 포털 (프론트엔드 + 백엔드) 을, 삼성은 A360 서버 자체를 담당했습니다. 포털은 모든 사용자 액션마다 A360을 원격으로 구동해야 했고, A360의 응답시간은 30초가 될 때도 있고 5분이 될 때도 있는 — 예측할 방법이 없는 — 진짜 의미로 불규칙한 값이었습니다. 사용자 액션 하나가 6~7회의 백엔드↔A360 왕복으로 펼쳐졌습니다 — 정당성 확인, 결재 확인, 테넌트/폴더 바인딩, 테넌시 검증, 실행, 상태 갱신, 로깅.',
    diagram: `(포털 프론트엔드) → (포털 백엔드) → (엔진) → (A360 서버)
                                                       ↘ (인증 서버)

   사용자 액션 1회 = 6~7회의 백엔드↔A360 왕복
   A360 지연시간: 30초 ─ 5분, 예측 불가`,
    highlights: [
      {
        title: '멀티테넌트 UI/UX 수정.',
        body: '멀티테넌트 흐름의 정확성 버그 잔여 목록을 해소했습니다 — 각 테넌트가 자신의 폴더, 프로세스, 결재, 실행 이력만 보도록 보장하고, 테넌트 컨텍스트가 프론트엔드부터 모든 A360 호출까지 깔끔하게 전파되도록 했습니다.',
      },
      {
        title: '프로세스 관련 쿼리 리팩토링.',
        body: '9개 기본 테이블과 2개 뷰 테이블에 걸친 "프로세스" 기능의 쿼리를 리팩토링했습니다. 조인을 정리하고 필터링을 예측 가능하게 만들어, 멀티테넌트 제약이 UI가 아니라 데이터 계층에서 강제될 수 있도록 했습니다.',
      },
      {
        title: 'A360 오케스트레이션 계층용 Spring WebFlux 위 RxJava + Stream API.',
        body: '선임 개발자는 `CompletableFuture` (제가 이전에 사용했던) 대신 RxJava를 선택했는데, 모든 사용자 액션이 Spring WebFlux 리액티브 스택 위에서 매우 길고 가변적인 타임아웃을 가진 6~7회의 A360 호출을 조합해야 했기 때문입니다. 저의 일은 그 코드베이스를 — 이전 RxJava 경험도, 멘토도 없이 — 읽고, 이해하고, 개선하는 것이었습니다. RxJava를 오퍼레이터 단위로 (`flatMap`, `zip`, `merge`, `retryWhen`, `timeout`, 에러 처리, 스케줄러 선택) 실무 속에서 학습했고, WebFlux가 사용하는 기반 Reactor 타입들과의 상호운용 양상을 익혔으며, 대용량 응답 번들 필터링에서는 RxJava와 Java Stream API를 결합 (인메모리 변환은 Stream, 비동기 조합은 RxJava) 했고, 포털이 A360의 30초~5분 불규칙 지연을 스레드 블로킹 없이 흡수할 수 있도록 넉넉한 타임아웃과 재시도 정책을 튜닝했습니다.',
      },
    ],
    tech: [
      'Java',
      'Spring Boot',
      'Spring WebFlux',
      'RxJava (Reactor 상호운용)',
      'Java Stream API',
      'MySQL / MariaDB',
      'Automation Anywhere A360 통합',
      '멀티테넌트 모델',
    ],
    scale: [
      { label: '테넌트', value: '6' },
      { label: '활성 프로세스', value: '~8,000' },
      { label: '프로세스 기능 테이블', value: '9 + 2 뷰' },
    ],
    snippet: {
      language: 'java',
      caption: 'WebFlux 위 RxJava · 예측 불가한 외부 지연 속에서 6~7개 A360 호출 조합',
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
      '**리액티브 컴포지션은 `CompletableFuture`와 다른 사고 모델이다.** 일단 감을 잡은 후 — 오퍼레이터를 스레드 저글링이 아니라 선언적 파이프라인으로 바라본 후 — 사용자 액션당 6~7개의 비동기 A360 호출 조합은 동등한 `CompletableFuture` 체인보다 훨씬 가독성이 좋아졌다. WebFlux + RxJava 조합은 "블로킹 스택 위의 비동기 래퍼"가 아니라 *엔드-투-엔드 논블로킹* 으로 사고하게 만들었다.',
      '**예측 불가한 외부 지연을 위한 설계.** 외부 시스템이 30초가 될지 5분이 될지 예측할 수 없을 때, 타임아웃·재시도·스레드 격리 선택은 더 이상 기본값이 아니라 실제 설계 결정이 된다.',
      '**멀티테넌시는 UI가 아니라 데이터 계층의 문제다.** 쿼리 수준에서 필터링하라; UI가 보내오는 "어느 테넌트인가"는 아무것도 신뢰하지 마라.',
      '**프로젝트 중간 합류, 멘토 없이 새 스택 학습.** 낯선 리액티브 코드베이스를 읽고, 실험을 돌리고, 그 다음에야 리팩토링하는 것 자체가 하나의 기술이며 — 이 프로젝트에서 얻은 가장 유용한 기술이었다.',
    ],
  },
  {
    index: '04',
    title: '삼성 RPA 포털: Private Runner, 교육용 샌드박스 & 레거시 마이그레이션',
    client: '삼성 — 프로젝트 03과 동일한 RPA 포털의 두 번째 후속 프로젝트.',
    period: '약 3개월',
    role: '백엔드 개발자',
    team: '3~5인 개발팀',
    context:
      '리뉴얼된 포털이 운영에 올라간 후 (프로젝트 03), 팀의 다음 과제는 멀티테넌트 RPA 포털을 위한 역할 기반 접근 제어였습니다. Automation Anywhere A360에는 "private runner"라는 개념이 없습니다 — A360은 사용자·사용자 그룹·권한과 관련된 모든 것을 하나의 원시 타입인 `role-group`으로 표현합니다. 우리 팀은 "private runner"라 부르는 포털 레벨의 추상화를 설계했고, 이는 A360의 `role-group`에 매핑되어 테넌트별 역할 기반 접근의 핵심 단위가 되었습니다. 프로젝트 03에서처럼, 모든 상태 변화는 동일하게 복잡한 API 표면을 통해, 동일하게 예측 불가한 A360 지연 속에서 A360 측에 반영되어야 했습니다.',
    highlights: [
      {
        title: 'A360에 멀티테넌트 private runner 등록.',
        body: '포털 레벨의 "private runner"를 하나 이상의 A360 `role-group` 레코드로 변환하는 경로를 설계·구현했고 — 테넌트 단위로 스코프되어 각 테넌트의 private runner는 오직 그 테넌트의 A360 슬라이스 아래에만 위치합니다. 매핑은 양방향이었습니다: 포털의 변경은 A360에 구체화되어야 했고, A360 측의 변경은 다시 포털 모델로 정합되어야 했습니다. 제가 떠날 무렵, 시스템은 6개의 삼성 테넌트에 걸쳐 500개 이상의 private runner를 관리하고 있었습니다.',
      },
      {
        title: '주기적 동기화 + 강제 동기화.',
        body: '포털 측 상태와 A360 role-group 상태 간 정합화를 두 가지 방식으로 제공: 주기적 배치 스크립트 (드리프트를 감지하고 수정을 적용하는 스케줄 작업) 와 강제 동기화 ("N분 후가 아니라 지금 당장 동기화돼야 한다"는 상황을 위한 운영자 온디맨드 액션). 두 모드 모두 멱등하고 테넌트 격리되어야 했습니다.',
      },
      {
        title: '캐스케이딩 TTL을 갖춘 교육용 독립 시스템.',
        body: '이 프로젝트의 가장 큰 부분. 삼성은 동일한 네 종류의 엔티티 — 프로세스, private runner, role-group, 라이선스 — 를 묶되 유효기한이 붙은 교육/학습 환경을 원했습니다. 검증 종료일이 지나면 묶음 안의 모든 것이 일제히 만료되어야 했습니다: 프로세스는 실행 불가, private runner는 언바인드, role-group은 회수, 라이선스는 무효화. 이를 운영 포털에 얹지 않고 독립 시스템으로 만들었는데, 라이프사이클 규칙이 근본적으로 달랐기 때문입니다 (운영 = "회수 전까지 유효", 교육 = "특정 날짜까지 유효"). 어려운 부분은 개별 엔티티의 만료가 아니라, 만료가 네 종류 엔티티 전체에 일관되게 전파되어 포털 측·A360 측 어느 쪽에도 반쯤 만료된 상태가 남지 않게 하는 일이었습니다. (삼성이 첫 실제 교육 세션을 진행하기 전에 프로젝트에서 빠졌기 때문에 런칭 후 수치는 가지고 있지 않습니다 — 시스템은 만들어져 준비된 상태였고, 삼성은 교육 환경을 설정하던 단계였습니다.)',
      },
      {
        title: '레거시 포털로부터의 일일 마이그레이션.',
        body: '구 (Mendix 시기) 포털의 데이터를 신규 포털 스키마로 보존하기 위해 긴 저장 프로시저를 작성했습니다. 레거시 사이트는 컷오버 중에도 살아 있었고 하루에 5~10건의 새 레코드를 생성했기 때문에, 마이그레이션은 한 번의 스냅샷으로는 불가능했습니다 — 변경분을 잡기 위해 일일 단위로 실행되어야 했습니다. 프로시저는 약 70개의 레거시 테이블을 다루었고, 핵심 페이로드는 신규 포털에 온전히 안착해야 하는 약 8,000건의 프로세스 레코드였습니다.',
      },
    ],
    tech: [
      'Java',
      'Spring Boot',
      'Spring WebFlux',
      'RxJava (Reactor 상호운용)',
      'Java Stream API',
      'MySQL / MariaDB',
      'Automation Anywhere A360 통합',
      'Stored Procedures',
    ],
    scale: [
      { label: '운영 중 private runner', value: '500+' },
      { label: '테넌트', value: '6' },
      { label: '다룬 레거시 테이블', value: '~70' },
      { label: '마이그레이션된 프로세스 레코드', value: '~8,000' },
      { label: '일일 레거시 변경분', value: '5–10' },
    ],
    snippet: {
      language: 'sql',
      caption: '운영 중인 레거시 포털로부터의 멱등한 일일 마이그레이션 · 만료 전파',
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
      '**외부 시스템이 갖지 못한 논리적 추상화 설계.** A360은 "private runner"가 무엇인지 몰랐다; 우리는 그것을 `role-group`에 양방향으로 매핑한 뒤, 두 시스템이 만들어내는 모든 드리프트 케이스에 대해 그 추상화를 방어해야 했다.',
      '**동기화는 1급 관심사다.** 두 시스템이 동일한 상태를 보유할 때, 정합화는 스케줄 모드와 수동 강제 모드 둘 다 필요하며 — 두 모드 모두 멱등하고 테넌트 단위 스코프여야 한다.',
      '**엔티티 종류를 가로지르는 캐스케이딩 라이프사이클.** 프로세스·private runner·role-group·라이선스에 걸쳐 일관되게 전파되어야 하는 "X까지 유효" 규칙은 개별 엔티티 TTL보다 훨씬 어렵다 — 이는 생성 경로보다 무효화 경로를 먼저 설계해야 한다는 것을 가르쳤다.',
      '**운영 중인 레거시 시스템에서의 마이그레이션.** 컷오버 동안에도 소스가 새 행을 계속 만들어낼 때, "한 번의 큰 마이그레이션"은 더 이상 동작하지 않는다 — 깔끔하게 다시 적용되는 멱등한 일일 프로시저가 올바른 형태다.',
    ],
  },
];
