# Build Contract — Portfolio Site

> Shared agreement for the four parallel build agents (A/B/C/D). Each agent owns a disjoint set of files. Do NOT modify files outside your slice. Do NOT run `npm install` or `npm run dev` — the integration pass handles that.

Repo root: `/Users/jeongjin/WebstormProjects/portfolio`
Source of truth for project copy: `src/docs/projects-recap.md` (read it; do not edit it).

---

## 1. Identity (used by Agent A in `data/profile.ts`, consumed elsewhere)

```ts
{
  name: "Jeongjin Kim",
  role: "Backend Developer",
  tagline: "Java & Kotlin backend developer — async composition, multi-tenant systems, and integrations with rigid upstream services.",
  email: "valorjj@gmail.com",
  github: "https://github.com/valorjj",
  linkedin: "https://www.linkedin.com/in/jeongjin-kim/", // placeholder
}
```

---

## 2. Design tokens (Agent A defines in `src/styles/tokens.css`)

```css
:root {
  /* dark theme = default */
  --bg: #0b0b0f;
  --bg-elevated: #131319;
  --bg-code: #16161d;
  --text: #e6e6ea;
  --text-muted: #a1a1aa;
  --text-faint: #71717a;
  --accent: #7c5cff;
  --accent-hover: #9a7eff;
  --accent-soft: rgba(124, 92, 255, 0.12);
  --border: #232329;
  --border-strong: #2f2f37;

  /* type */
  --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Consolas, monospace;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 32px;
  --text-display: clamp(40px, 6vw, 64px);

  /* spacing (4px base) */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px; --space-20: 80px;

  /* radius / motion / layout */
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px;
  --transition: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --max-width: 960px;
}

[data-theme='light'] {
  --bg: #ffffff;
  --bg-elevated: #fafafa;
  --bg-code: #f5f5f7;
  --text: #0b0b0f;
  --text-muted: #52525b;
  --text-faint: #71717a;
  --accent: #6646e6;
  --accent-hover: #5736d6;
  --accent-soft: rgba(102, 70, 230, 0.10);
  --border: #e5e5ea;
  --border-strong: #d4d4d8;
}
```

Theme is set on `<html data-theme="dark|light">` via `useTheme`. Falls back to `prefers-color-scheme` on first load; persists choice in localStorage key `portfolio-theme`.

Responsive breakpoint: `@media (max-width: 768px)` — use as-is everywhere, no CSS variables for media queries.

---

## 3. Shared UI primitives (Agent A defines; B/C/D consume)

```tsx
// src/components/ui/Section.tsx
export function Section({ id, eyebrow, title, children }: {
  id: string;            // anchor id, e.g. "projects"
  eyebrow?: string;      // mono uppercase tiny label, e.g. "02 / WORK"
  title: string;
  children: React.ReactNode;
}): JSX.Element;

// src/components/ui/Chip.tsx
export function Chip({ children, variant }: {
  children: React.ReactNode;
  variant?: 'default' | 'mono';  // 'mono' uses --font-mono
}): JSX.Element;

// src/components/ui/FadeIn.tsx — framer-motion in-view wrapper
export function FadeIn({ children, delay, as }: {
  children: React.ReactNode;
  delay?: number;                       // seconds, default 0
  as?: 'div' | 'section' | 'li' | 'p';  // default 'div'
}): JSX.Element;

// src/components/ui/ThemeToggle.tsx
export function ThemeToggle(): JSX.Element;
```

---

## 4. Section components (B/C/D each export ONE named function)

```tsx
// Each takes no props.
export function Hero(): JSX.Element;     // src/components/Hero/Hero.tsx
export function About(): JSX.Element;    // src/components/About/About.tsx
export function Projects(): JSX.Element; // src/components/Projects/Projects.tsx
export function Skills(): JSX.Element;   // src/components/Skills/Skills.tsx
export function Contact(): JSX.Element;  // src/components/Contact/Contact.tsx
```

Imported in `App.tsx` (owned by Agent A) like:
```ts
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Projects } from './components/Projects/Projects';
import { Skills } from './components/Skills/Skills';
import { Contact } from './components/Contact/Contact';
```

---

## 5. File ownership — DISJOINT, no overlap

### Agent A — Foundation
- `src/styles/tokens.css` (CREATE)
- `src/styles/global.css` (CREATE — reset + base typography, font imports)
- `src/main.tsx` (OVERWRITE — import global.css and fontsource packages)
- `src/App.tsx` (OVERWRITE — Layout shell with Nav + sections + Footer in order)
- `src/components/Layout/Layout.tsx` + `Layout.module.css`
- `src/components/Layout/Footer.tsx` + `Footer.module.css`
- `src/components/Nav/Nav.tsx` + `Nav.module.css`
- `src/hooks/useTheme.ts`
- `src/hooks/useScrollSpy.ts`
- `src/components/ui/Section.tsx` + `Section.module.css`
- `src/components/ui/Chip.tsx` + `Chip.module.css`
- `src/components/ui/FadeIn.tsx`
- `src/components/ui/ThemeToggle.tsx` + `ThemeToggle.module.css`
- `src/data/profile.ts`
- `index.html` (update `<title>` to "Jeongjin Kim — Backend Developer")
- DELETE: `src/App.css`, `src/index.css`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png` (if present)

### Agent B — Hero + About
- `src/components/Hero/Hero.tsx` + `Hero.module.css`
- `src/components/About/About.tsx` + `About.module.css`
- Reads `data/profile.ts` for name/role/tagline/links (knows it exists per §1)

### Agent C — Projects
- `src/data/projects.ts`
- `src/components/Projects/Projects.tsx` + `Projects.module.css`
- `src/components/Projects/ProjectCard.tsx` + `ProjectCard.module.css`
- Reads `src/docs/projects-recap.md` and faithfully encodes ALL FOUR projects

### Agent D — Skills + Contact
- `src/data/skills.ts`
- `src/components/Skills/Skills.tsx` + `Skills.module.css`
- `src/components/Contact/Contact.tsx` + `Contact.module.css`
- Reads `src/docs/projects-recap.md` to extract tech for the Skills grouping; reads `data/profile.ts` for contact details

---

## 6. Rules

- **CSS Modules** for every component. File: `Component.module.css`. Class keys: camelCase. No global classes except in `global.css`.
- **No hardcoded colors or spacings** in component CSS — always reference tokens.
- **No `any` types.** No unused imports. TypeScript strict.
- **No direct `framer-motion` imports** in section components — use `FadeIn`. Agent A may import `motion` inside `FadeIn` itself.
- **Icons via `lucide-react`** (Agent A and D mainly). No raw SVGs except the existing favicon.
- **Don't run `npm install`, `npm run dev`, `tsc`, `vite build`, or any installer.** Just write files. The integration pass installs deps.
- **Don't add a Korean translation.** EN only for v1.
- **Don't add a router** — single page, anchor scroll only.
- **Don't add a backend, form handler, analytics, or tracker.** `mailto:` is fine for v1.

---

## 7. Dependencies the integration pass will install (do not install yourself)

```
framer-motion
lucide-react
@fontsource/inter
@fontsource/jetbrains-mono
```

Reference them via normal `import` statements as if they're already installed.

---

## 8. Acceptance for each slice

Each agent reports back with: (a) the files it created, (b) any contract deviations, (c) anything ambiguous that the integrator needs to resolve.
