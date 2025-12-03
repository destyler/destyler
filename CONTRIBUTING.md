# Contributing to Destyler

Thank you for helping build unstyled, framework-agnostic components. This document explains how to get a local environment running, the expectations for code contributions, and how to submit changes.

## Code of Conduct

Participation in this project is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before interacting with the community.

## Ways to Contribute

- Report reproducible bugs, performance regressions, or accessibility problems.
- Improve documentation, tutorials, Storybook stories, and examples.
- Implement new primitives, framework adapters, or utilities.
- Add test coverage, profiling scripts, or developer tooling improvements.

If you are unsure whether your idea fits, open a GitHub Discussion or issue before starting any large change.

## Prerequisites

- **Node.js**: v20 or newer is recommended.
- **pnpm**: `10.18.3` (the workspace is pinned via the `packageManager` field).
- **Git**: any modern version that supports worktrees.

Install pnpm globally if you have not already:

```bash
corepack enable pnpm@10.18.3
```

## Repository Overview

Destyler is a pnpm-powered monorepo. Common top-level folders:

- `packages/` – Source for each publishable package (components, shared utilities, docs, types, etc.).
- `document/` & `storybook/` – Documentation site and Storybook playground.
- `examples/` – Integration samples for frameworks (vanilla, Vue, React, Solid, Svelte).
- `scripts/` – Automation such as Typedoc generation, zip bundling, and deployment helpers.
- `templates/` & `plopfile.cjs` – Code generators for new components and examples.

Most commands are orchestrated via root-level pnpm scripts and `--filter` selectors.

## Local Development Workflow

1. **Fork & clone**
   ```bash
   git clone https://github.com/<your-username>/destyler.git
   cd destyler
   ```
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Start developing**
   - Build every package: `pnpm build`
   - Watch all packages for changes: `pnpm dev`
   - Run unit tests: `pnpm test`
   - Lint the repo: `pnpm lint`
   - Develop docs: `pnpm docs:dev`
   - Develop Storybook: `pnpm storybook:dev`

Use `pnpm --filter "./packages/<name>" <command>` to target a specific package or example.

## Coding Guidelines

- **Vue-first parity**: The Vue components are the source of truth. When syncing components across React, Solid, Svelte, Lit, Vanilla, etc., keep the same DOM structure, class names, and portal/teleport rules (`portalled` property).
- **TypeScript events**: When defining custom event interfaces, prefix them with `Synthetic` to avoid clashing with DOM event names (e.g., `SyntheticClipboardEvent`).
- **HTML attributes**: Do not redeclare `onChange` in shared `DOMAttributes`. Extend specific element props instead to prevent conflicts.
- **CSS migrations**: When moving styles out of SFCs or UnoCSS, keep styles component-scoped and prefer CSS custom properties for theming.
- **Comments & readability**: Default to self-explanatory code. Add short comments only when necessary to describe non-obvious logic.
- **Unicode**: Prefer ASCII in new source files unless the existing file already relies on non-ASCII characters.

## Testing Expectations

Quality gates run in CI. Please run the relevant checks locally before opening a PR:

```bash
pnpm lint
pnpm test
pnpm build
```

- Use `pnpm test:dev` for watch mode and `pnpm test:ui` for Vitest UI debugging.
- For browser-based components, consider `pnpm test:deploy` or `pnpm test:coverage` to ensure no regressions.
- Add regression tests whenever you fix a bug or introduce a new feature. Cover normal, boundary, and error cases, especially for utilities like color and date libraries.
- When working on color utilities, follow the testing guidance in `shareds/color` (format conversions, transparency, hue wrapping, etc.).
- For date utilities, include range boundaries (`minValue`, `maxValue`) and navigation behavior in your tests.

## Documentation & Typedocs

- Keep public APIs documented. Update Markdown docs in `document/src`, data files in `document/data`, and snippets as needed.
- Regenerate attribute and API docs when you change component props:
  ```bash
  pnpm docs:attr
  pnpm docs:type
  ```
- Run `pnpm docs:build` or `pnpm storybook:build` before submitting major doc changes to ensure they compile.

## Submitting Changes

1. **Create a topic branch** off `main`.
2. **Make small, focused commits** that explain the “why”.
3. **Keep dependencies scoped**. Do not upgrade tooling or unrelated packages unless required for your change.
4. **Ensure parity** across frameworks if you touch shared components.
5. **Run automated checks** and include any new tests or docs.
6. **Open a Pull Request** with:
   - A summary of the change and motivation.
   - Testing evidence (commands you ran, screenshots for UI changes if possible).
   - Notes about breaking changes or migration steps.

Maintainers may ask for design details, screenshots, or follow-up tests. Please be responsive to review feedback.

## Reporting Issues

When filing an issue, include:

- A clear title and description.
- Steps to reproduce and expected vs actual behavior.
- Framework/environment details (browser, OS, Node version, package version).
- A minimal reproduction (StackBlitz, Codesandbox, or GitHub repo) when possible.

Security issues should be reported privately via email (see below) instead of filing a public issue.

## Questions & Support

- GitHub Discussions – best place for ideas, questions, or design proposals.
- Issues – bug reports and actionable feature requests.
- Email – reach the maintainer at `elonehoo@gmail.com` for sensitive reports.

Thanks for contributing to Destyler! Your help keeps the component ecosystem healthy and expressive.
