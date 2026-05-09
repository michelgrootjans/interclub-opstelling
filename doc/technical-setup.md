# Technical Setup

## Stack

- **Build tool**: Vite 5
- **Language**: TypeScript (strict mode)
- **Hosting**: GitHub Pages, deployed via GitHub Actions on push to `main`
- **Node version**: 24 (LTS) — see `.nvmrc`

## Tooling

| Tool | Purpose | Command |
|------|---------|---------|
| Vite | Dev server + production build | `npm run dev` / `npm run build` |
| Vitest | Unit testing | `npm test` (watch) / `npm run test:run` (CI) |
| ESLint + typescript-eslint | Linting | `npm run lint` |
| TypeScript | Type checking | included in `npm run build` |

## Project structure

```
src/
  logic/      # Pure functions — no DOM, no localStorage
  ui/         # DOM manipulation
  storage/    # localStorage access
```

## Workflow & code style

- **TDD**: strict red-green-refactor. Write a failing test before writing logic.
- **Pure functions**: all business logic (combination generation, validation) lives in `src/logic/` as pure functions with no side effects.
- **Immutability**: prefer immutable data structures.
- **Infrastructure boundary**: DOM manipulation and localStorage are infrastructure. Logic must never import from `ui/` or `storage/`.
- Tests live next to the code they test (e.g., `compositions.test.ts` alongside `compositions.ts`).
