# Portfolio Site — Implementation Plan

> Source of truth for project content: `src/docs/projects-recap.md` (four locked-v1 writeups).
> Goal: a modern, minimalist, engineering-credible portfolio that lets a senior reviewer skim → drill in → trust.

---

## 1. Positioning

A **backend developer** portfolio. Emphasis on:

- Async / reactive composition (`CompletableFuture`, RxJava on WebFlux)
- Multi-tenant data-layer enforcement
- Designing logical abstractions over rigid upstream systems
- Working in regulated domains (labor law, government data sharing)
- Migrating from still-live legacy systems

The visual language should communicate **calm, technical seriousness** — no carousel hero, no marketing gradients. Think: well-typeset documentation site, not landing page.

---

## 2. Visual direction

- **Dark-first**, with a light-mode toggle (respects `prefers-color-scheme`)
- **Two-typeface system**: Inter (UI/body) + JetBrains Mono (labels, code, numbers, metadata)
- **One accent color** — restrained (proposed: `#7c5cff` violet, matching existing scaffold). Single accent across links, hover, active scroll-spy
- **Generous whitespace**, narrow content column (max ~960px)
- **Code-block-like surfaces** for project cards (subtle border, monospaced metadata strip)
- **Minimal motion**: fade-up on scroll-into-view, stagger on lists, hover lift on cards. No parallax, no marquee.
- Fully **responsive** (mobile, tablet, desktop) with a single breakpoint at ~768px

---

## 3. Information architecture (single page, anchor scroll)

```
┌─ Nav (sticky, scroll-spy)
│
├─ #hero
│    Name · Title · 1-line positioning · CTAs (Projects / Contact / GitHub)
│
├─ #about
│    2–3 short paragraphs.
│    Pulled themes: async/reactive, multi-tenant, regulated domains, designing abstractions.
│
├─ #projects
│    4 cards (one per project in projects-recap.md).
│    Each card:
│      ┌────────────────────────────────────────────┐
│      │ 01 · Period · Role · Team                  │
│      │ Title                                      │
│      │ Client · Product (one line)                │
│      │ ─────────                                  │
│      │ Context (2–3 lines)                        │
│      │ ─────────                                  │
│      │ What I built (bulleted highlights w/ scale)│
│      │ Tech chips                                 │
│      │ ▸ Takeaways (collapsible)                  │
│      └────────────────────────────────────────────┘
│
├─ #skills
│    Grouped grid:
│      Languages · Frameworks · Async/Reactive · Data · Integration · Tooling
│
├─ #contact
│    Email · GitHub · LinkedIn · (optional) Resume PDF
│
└─ Footer
     © year · built with React + Vite
```

---

## 4. Tech stack

| Concern         | Choice                                       | Why                                                                |
|-----------------|----------------------------------------------|--------------------------------------------------------------------|
| Framework       | React 19 + TypeScript (existing)             | Already scaffolded                                                 |
| Bundler         | Vite 8 (existing)                            | Already scaffolded                                                 |
| Styling         | CSS Modules + design tokens (CSS vars)       | Keeps deps light; tokens already started in `src/index.css`        |
| Animation       | Framer Motion                                | Industry-standard, tiny API surface for what we need              |
| Icons           | `lucide-react`                               | Lightweight, tree-shaken                                           |
| Fonts           | `@fontsource/inter` + `@fontsource/jetbrains-mono` | Self-hosted, no CDN flash                                    |
| State           | None (props + a single `useTheme` hook)      | Single-page anchor scroll; no router needed                        |

New dependencies to add:
```
framer-motion lucide-react @fontsource/inter @fontsource/jetbrains-mono
```

---

## 5. File layout

```
src/
├── App.tsx                         # mounts <Layout> with sections in order
├── main.tsx                        # existing
├── styles/
│   ├── tokens.css                  # CSS vars: colors (light+dark), spacing, type scale, radii
│   └── global.css                  # reset + base typography
├── components/
│   ├── Layout/
│   │   ├── Layout.tsx
│   │   └── Layout.module.css
│   ├── Nav/
│   │   ├── Nav.tsx                 # sticky, scroll-spy active link, theme toggle
│   │   └── Nav.module.css
│   ├── Hero/
│   │   ├── Hero.tsx
│   │   └── Hero.module.css
│   ├── About/
│   │   ├── About.tsx
│   │   └── About.module.css
│   ├── Projects/
│   │   ├── Projects.tsx            # section wrapper
│   │   ├── ProjectCard.tsx         # one card; collapsible takeaways
│   │   └── Projects.module.css
│   ├── Skills/
│   │   ├── Skills.tsx
│   │   └── Skills.module.css
│   ├── Contact/
│   │   ├── Contact.tsx
│   │   └── Contact.module.css
│   └── ui/
│       ├── Section.tsx             # consistent section header + id + anchor target
│       ├── Chip.tsx                # tech chips
│       ├── FadeIn.tsx              # framer-motion in-view wrapper
│       └── ThemeToggle.tsx
├── hooks/
│   ├── useTheme.ts                 # dark/light persistence + system pref
│   └── useScrollSpy.ts             # active section id for nav
├── data/
│   ├── profile.ts                  # name, role, blurb, links
│   ├── projects.ts                 # typed adaptation of projects-recap.md (4 entries)
│   └── skills.ts                   # grouped skills
└── docs/
    └── projects-recap.md           # existing, do not edit
```

---

## 6. Data shape — `data/projects.ts`

```ts
export type Project = {
  index: string;              // "01", "02", ...
  title: string;
  client: string;
  product?: string;
  period: string;
  role: string;
  team: string;
  context: string;            // 2-3 sentence summary
  highlights: Highlight[];    // "What I built" bullets
  tech: string[];             // chips
  scale?: { label: string; value: string }[]; // numbers worth surfacing
  takeaways: string[];        // collapsible
};

export type Highlight = {
  title: string;              // bold lead
  body: string;               // 1-3 sentences
};
```

Four entries populated verbatim-faithful to `projects-recap.md`.

---

## 7. Build plan — agent fan-out

Four agents run in **parallel** (single message, multiple tool calls). Each agent owns a vertical slice and writes only files in its slice. No agent touches another's files.

| Agent | Owns                                                                                          | Outputs                                                                                                       |
|-------|-----------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------|
| **A — Foundation** | Design tokens, global CSS, fonts, theme hook, Layout shell, Nav + scroll-spy, ui/Section, ui/Chip, ui/FadeIn, ThemeToggle | `styles/tokens.css`, `styles/global.css`, `App.tsx` (skeleton w/ section anchors), `Layout/`, `Nav/`, `hooks/useTheme.ts`, `hooks/useScrollSpy.ts`, `ui/*`, `data/profile.ts`, updates `main.tsx` + `index.html` |
| **B — Hero + About** | `Hero/`, `About/` sections                                                              | Composed copy emphasizing the positioning in §1                                                               |
| **C — Projects**     | `data/projects.ts` (4 entries from recap), `Projects/Projects.tsx`, `Projects/ProjectCard.tsx`, `Projects.module.css` | Four cards with collapsible takeaways                                                                         |
| **D — Skills + Contact** | `data/skills.ts`, `Skills/`, `Contact/`, footer                                       | Grouped skills grid, contact links, footer                                                                    |

**Foundation contract** (Agent A publishes; B/C/D consume):

- Token names (e.g. `--bg`, `--bg-elevated`, `--text`, `--text-muted`, `--accent`, `--border`, `--radius-md`, `--space-*`)
- `<Section id title eyebrow>` API
- `<Chip>` API
- `<FadeIn delay?>` wrapper
- Class-naming convention: CSS Modules, kebab-case files, camelCase class keys

Agent A finishes first conceptually, but in practice all four can write in parallel because each owns disjoint files and the contract is fixed in this plan.

After all four agents finish, I'll do an integration pass: install deps, run `npm run dev`, fix any wiring bugs, verify responsive layout, verify dark/light toggle, verify scroll-spy.

---

## 8. Acceptance checklist

- [ ] `npm install && npm run dev` boots without errors
- [ ] Sections appear in order: Hero → About → Projects (×4) → Skills → Contact
- [ ] Nav scroll-spy highlights the section currently in view
- [ ] Theme toggle persists in localStorage and respects `prefers-color-scheme` on first load
- [ ] All four projects render with full content from `projects-recap.md`
- [ ] Takeaways collapse/expand per card
- [ ] Mobile (≤768px) layout reflows cleanly; no horizontal scroll
- [ ] Lighthouse-style sanity: text contrast passes AA, no layout shift on font load
- [ ] No console errors, no unused imports, strict TS passes
- [ ] `npm run build` produces a deployable `dist/`

---

## 9. Out of scope (for v1)

- Korean translation (recap doc says translation comes after EN is locked — defer)
- Blog / writing section
- Resume PDF generation (link an existing PDF if available; otherwise placeholder)
- Analytics, contact form backend (mailto: is fine for v1)
- i18n framework
