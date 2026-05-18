export type Locale = 'en' | 'ko';

export type SkillGroup = {
  label: string;
  items: string[];
};

export type NoteEntry = {
  index: string;
  title: string;
  body: string;
};

export type Translation = {
  nav: { about: string; projects: string; notes: string; skills: string; contact: string };
  hero: {
    eyebrow: string;
    tagline: string;
    ctaProjects: string;
    ctaContact: string;
    ctaResume: string;
    stats: { projects: string; tenants: string; processes: string; runners: string; stages: string };
    status: {
      stack: { key: string; value: string };
      focus: { key: string; value: string };
      experience: { key: string; value: string };
    };
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    problemsLabel: string;
    problems: string[];
  };
  projects: {
    eyebrow: string;
    title: string;
    cardCode: string;
    cardTakeaways: string;
  };
  notes: {
    eyebrow: string;
    title: string;
    items: NoteEntry[];
  };
  skills: {
    eyebrow: string;
    title: string;
    groups: SkillGroup[];
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    labels: { email: string; github: string; linkedin: string; resume: string };
  };
  footer: { builtWith: string };
  a11y: { themeToggle: string; localeToggle: string };
};

const en: Translation = {
  nav: { about: 'About', projects: 'Projects', notes: 'Notes', skills: 'Skills', contact: 'Contact' },
  hero: {
    eyebrow: 'BACKEND DEVELOPER · SEOUL',
    tagline:
      'Java & Kotlin backend developer — async composition, multi-tenant systems, and integrations with rigid upstream services.',
    ctaProjects: 'View projects',
    ctaContact: 'Get in touch',
    ctaResume: 'Resume',
    stats: {
      projects: 'projects',
      tenants: 'tenants',
      processes: 'processes',
      runners: 'runners',
      stages: 'async stages',
    },
    status: {
      stack: { key: 'stack', value: 'Java · Kotlin · Spring Boot · WebFlux · RxJava' },
      focus: { key: 'focus', value: 'async pipelines · multi-tenant · regulated domains' },
      experience: { key: 'experience', value: '4+ years · enterprise & government clients' },
    },
  },
  about: {
    eyebrow: '01 / ABOUT',
    title: 'Backend work in regulated, multi-tenant systems.',
    paragraphs: [
      "I'm a Java and Kotlin backend developer with four years across government and enterprise clients — the Ministry of Employment and Labor, NIA, and Samsung. Most of that time has been spent in regulated or operationally critical domains, where the wrong answer isn't a UX paper-cut — it's a citizen denied a benefit or a tenant seeing another tenant's data.",
      "The same patterns keep showing up in the work I find interesting: async composition (`CompletableFuture` pipelines, then RxJava on Spring WebFlux against upstream services that can take anywhere from thirty seconds to five minutes), multi-tenancy enforced at the data layer rather than the UI, and designing logical abstractions when the upstream system doesn't have the concept you need — for example, a portal-level \"private runner\" mapped bidirectionally onto Automation Anywhere's `role-group` primitive.",
      "I'm drawn to systems with awkward seams: rigid upstream APIs, still-live legacy databases mid-cutover, mapping rules that domain users keep editing. I'm looking for backend roles where the interesting problem is the design of the seam, not just the code that sits on either side of it.",
    ],
    problemsLabel: 'Signature problems solved',
    problems: [
      '22-stage CompletableFuture pipeline with per-stage transaction boundaries',
      'RxJava on WebFlux orchestrating 6–7 calls against 30s–5min upstream latency',
      '"Private runner" abstraction layered over A360 role-groups, 500+ in production',
      'Daily idempotent migration from a still-live legacy portal, ~8,000 records',
    ],
  },
  projects: {
    eyebrow: '02 / WORK',
    title: 'Selected projects',
    cardCode: 'Code',
    cardTakeaways: 'Takeaways',
  },
  notes: {
    eyebrow: '03 / NOTES',
    title: 'How I think about the work.',
    items: [
      {
        index: '/01',
        title: 'Decompose the work, then design observability per stage.',
        body: 'When a unit of work outgrows a single request — a 22-stage mapping pipeline, a 6–7-call A360 orchestration — `"it failed"` stops being useful. Designing for `"stage 14 failed on field Y of record Z"` from day one is what makes async systems actually operable in production.',
      },
      {
        index: '/02',
        title: 'Multi-tenancy is a data-layer concern, not a UI one.',
        body: "Filtering by tenant in the UI is the kind of safety that breaks the day someone hits the API directly. The cleanest fix I've shipped — six Samsung tenants sharing the same RPA portal — was enforcing tenant scope at the query level and trusting nothing else.",
      },
      {
        index: '/03',
        title: 'Design the invalidation path before the creation path.',
        body: 'Per-entity TTL is easy. A `valid-until` rule that has to cascade consistently across four coupled entity types — processes, runners, role-groups, licenses — is much harder, and almost always reveals the real shape of the system. I now sketch how things expire before I sketch how they get made.',
      },
      {
        index: '/04',
        title: "When the upstream system doesn't have the concept you need, design the abstraction yourself.",
        body: "Automation Anywhere A360 only knows `role-group`. We needed a tenant-scoped \"private runner\" — so we built one, mapped it bidirectionally onto A360's primitives, and defended the abstraction against every drift case the two systems could produce. The reconciliation surface is the hard part, not the model.",
      },
    ],
  },
  skills: {
    eyebrow: '04 / SKILLS',
    title: 'Stack',
    groups: [
      { label: 'Languages', items: ['Java', 'Kotlin'] },
      { label: 'Frameworks', items: ['Spring Boot', 'Spring WebFlux', 'MyBatis', 'JPA', 'Thymeleaf'] },
      {
        label: 'Async / Reactive',
        items: [
          'CompletableFuture',
          'RxJava',
          'Reactor (WebFlux)',
          'Spring @Transactional (propagation / isolation)',
          'Java Stream API',
        ],
      },
      { label: 'Data', items: ['MySQL', 'MariaDB', 'Tibero', 'Stored Procedures', 'Dynamic SQL (MyBatis)'] },
      {
        label: 'Integration / Platform',
        items: [
          'Kakao i Open Builder',
          'Automation Anywhere A360',
          'RDF → CSV pipelines',
          'YAML config',
          'Multi-tenant orchestration',
        ],
      },
      {
        label: 'Domain',
        items: ['Government / regulated systems', 'Enterprise multi-tenant', 'Legacy migration'],
      },
    ],
  },
  contact: {
    eyebrow: '05 / CONTACT',
    title: "Let's talk.",
    intro:
      'Open to backend roles working on async pipelines, multi-tenant platforms, or thorny system integrations. Reach out — I respond fast.',
    labels: { email: 'Email', github: 'GitHub', linkedin: 'LinkedIn', resume: 'Resume' },
  },
  footer: { builtWith: 'built with React + Vite' },
  a11y: { themeToggle: 'Toggle theme', localeToggle: 'Switch language' },
};

const ko: Translation = {
  nav: { about: '소개', projects: '프로젝트', notes: '노트', skills: '스택', contact: '연락' },
  hero: {
    eyebrow: '백엔드 개발자 · 서울',
    tagline:
      '비동기 처리, 멀티테넌트 시스템, 그리고 제약이 많은 외부 시스템과의 통합에 집중하는 Java & Kotlin 백엔드 개발자입니다.',
    ctaProjects: '프로젝트 보기',
    ctaContact: '연락하기',
    ctaResume: '이력서',
    stats: {
      projects: '프로젝트',
      tenants: '테넌트',
      processes: '프로세스',
      runners: '러너',
      stages: '비동기 스테이지',
    },
    status: {
      stack: { key: '스택', value: 'Java · Kotlin · Spring Boot · WebFlux · RxJava' },
      focus: { key: '분야', value: '비동기 파이프라인 · 멀티테넌트 · 규제 산업' },
      experience: { key: '경력', value: '4년+ · 엔터프라이즈 및 정부 고객' },
    },
  },
  about: {
    eyebrow: '01 / 소개',
    title: '규제 산업과 멀티테넌트 시스템에서의 백엔드 작업.',
    paragraphs: [
      '고용노동부, NIA, 삼성 등 정부 및 기업 고객을 4년간 경험한 Java/Kotlin 백엔드 개발자입니다. 그 시간 대부분을 규제 산업이나 운영상 중요한 도메인에서 보냈고, 그곳에서 잘못된 응답은 UI 흠집 정도가 아니라 시민이 실업 급여를 받지 못하거나 다른 테넌트의 데이터가 노출되는 사고로 직결됩니다.',
      '흥미를 느끼는 작업에서는 같은 패턴이 반복됩니다. 비동기 컴포지션(`CompletableFuture` 파이프라인, 그리고 응답시간이 30초에서 5분까지 걸리는 외부 시스템을 Spring WebFlux 위에서 RxJava로 다루는 일), UI가 아니라 데이터 계층에서 강제되는 멀티테넌시, 그리고 외부 시스템에 원하는 개념이 없을 때 직접 추상화를 설계하는 일 — 예를 들어 Automation Anywhere의 `role-group` 위에 양방향으로 매핑되는 포털 차원의 "private runner" 같은 것.',
      '제가 끌리는 시스템은 이음새가 까다로운 곳입니다. 경직된 외부 API, 마이그레이션 중에도 살아있는 레거시 DB, 현업 사용자가 계속 수정하는 매핑 규칙 같은 것들. 이음새 자체의 설계가 흥미로운 문제인 백엔드 역할을 찾고 있습니다.',
    ],
    problemsLabel: '대표적으로 해결한 문제들',
    problems: [
      '스테이지별 트랜잭션 경계를 갖춘 22단계 CompletableFuture 파이프라인',
      '30초~5분의 외부 지연을 견디며 6~7회 호출을 조합하는 WebFlux 위 RxJava',
      'A360 role-group 위에 얹은 "private runner" 추상화 — 운영 500개 이상',
      '운영 중인 레거시 포털에서 일일 단위로 멱등하게 동작하는 ~8,000건 마이그레이션',
    ],
  },
  projects: {
    eyebrow: '02 / 프로젝트',
    title: '주요 프로젝트',
    cardCode: '코드',
    cardTakeaways: '회고',
  },
  notes: {
    eyebrow: '03 / 노트',
    title: '작업을 바라보는 관점.',
    items: [
      {
        index: '/01',
        title: '작업을 분해하고, 스테이지 단위로 관측 가능성을 설계하라.',
        body: '한 번의 요청에 담을 수 없는 작업 단위 — 22단계 매핑 파이프라인, 6~7회의 A360 호출 오케스트레이션 — 에서는 `"실패했다"`만으로는 부족합니다. 처음부터 `"14번 스테이지가 레코드 Z의 Y 필드에서 실패"`를 설계해 두어야 비동기 시스템이 운영 환경에서 실제로 다룰 수 있는 것이 됩니다.',
      },
      {
        index: '/02',
        title: '멀티테넌시는 UI가 아니라 데이터 계층의 문제다.',
        body: 'UI에서만 테넌트를 필터링하는 방식은 누군가 API를 직접 호출하는 순간 무너집니다. 6개의 삼성 테넌트가 같은 RPA 포털을 공유하던 환경에서 가장 깔끔했던 해법은 쿼리 레벨에서 테넌트 범위를 강제하고 그 외 어떤 것도 신뢰하지 않는 것이었습니다.',
      },
      {
        index: '/03',
        title: '생성 경로보다 무효화 경로를 먼저 설계하라.',
        body: '단일 엔티티의 TTL은 쉽습니다. 프로세스·러너·`role-group`·라이선스 네 종류의 엔티티에 일관되게 전파되어야 하는 `valid-until` 규칙은 훨씬 어렵고, 거의 항상 시스템의 실제 모양을 드러냅니다. 이제는 어떻게 만들어지는지를 그리기 전에 어떻게 만료되는지부터 그립니다.',
      },
      {
        index: '/04',
        title: '외부 시스템에 필요한 개념이 없다면, 추상화를 직접 설계하라.',
        body: 'Automation Anywhere A360은 `role-group`만 알고 있습니다. 우리에게는 테넌트 단위로 스코프된 "private runner"가 필요했고, 그래서 직접 만들고, A360의 원시 타입과 양방향으로 매핑하고, 두 시스템이 만들어내는 모든 드리프트 상황에 대해 그 추상화를 방어해야 했습니다. 어려운 부분은 모델이 아니라 동기화 표면입니다.',
      },
    ],
  },
  skills: {
    eyebrow: '04 / 스택',
    title: '기술 스택',
    groups: [
      { label: '언어', items: ['Java', 'Kotlin'] },
      { label: '프레임워크', items: ['Spring Boot', 'Spring WebFlux', 'MyBatis', 'JPA', 'Thymeleaf'] },
      {
        label: '비동기 / 리액티브',
        items: [
          'CompletableFuture',
          'RxJava',
          'Reactor (WebFlux)',
          'Spring @Transactional (propagation / isolation)',
          'Java Stream API',
        ],
      },
      { label: '데이터', items: ['MySQL', 'MariaDB', 'Tibero', 'Stored Procedures', 'Dynamic SQL (MyBatis)'] },
      {
        label: '통합 / 플랫폼',
        items: [
          'Kakao i Open Builder',
          'Automation Anywhere A360',
          'RDF → CSV 파이프라인',
          'YAML 설정',
          '멀티테넌트 오케스트레이션',
        ],
      },
      {
        label: '도메인',
        items: ['정부 / 규제 산업', '엔터프라이즈 멀티테넌트', '레거시 마이그레이션'],
      },
    ],
  },
  contact: {
    eyebrow: '05 / 연락',
    title: '함께 이야기해요.',
    intro:
      '비동기 파이프라인, 멀티테넌트 플랫폼, 까다로운 시스템 통합을 다루는 백엔드 역할을 찾고 있습니다. 편하게 연락 주세요 — 빠르게 답변드립니다.',
    labels: { email: '이메일', github: 'GitHub', linkedin: 'LinkedIn', resume: '이력서' },
  },
  footer: { builtWith: 'React + Vite로 제작' },
  a11y: { themeToggle: '테마 전환', localeToggle: '언어 전환' },
};

export const translations: Record<Locale, Translation> = { en, ko };
