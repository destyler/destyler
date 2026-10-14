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

- **Node.js for development**: `^22.22.3 || ^24.16.0 || >=26.3.0`. The full source/build/test matrix runs on exact `22.22.3` and current `24.x` (at least `24.16.0`). The declared `26.3.0+` branch is not exercised by that matrix.
- **Published package consumers**: Node.js `20.19.0` remains independently checked. Packages are built and packed on Node.js 22, then installed with engine checks and exercised in isolated Node.js 20 consumers. This does not require development tools to support Node.js 20.
- **pnpm**: `12.11.2` (the workspace is pinned via the `packageManager` field).
- **Git**: any modern version that supports worktrees.

Install pnpm globally if you have not already:

```bash
npm install --global pnpm@12.11.2
```

## Repository Overview

Destyler is a pnpm-powered monorepo. Common top-level folders:

- `packages/` – Source for each publishable package (components, shared utilities, docs, types, etc.).
- `document/` & `storybook/` – Documentation site and Storybook playground.
- `examples/` – Integration samples for frameworks (vanilla, Vue, React, Solid, Svelte).
- `scripts/` – Automation such as Typedoc generation, zip bundling, and deployment helpers.
- `templates/` & `plopfile.cjs` – Code generators for new components and examples.

Most commands are orchestrated via root-level pnpm scripts and `--filter` selectors.

pnpm settings live in `pnpm-workspace.yaml`; `.npmrc` retains the registry setting. Installs enforce engine and peer compatibility, a strict 24-hour release delay, no trust downgrade, and the reviewed build-script allowlist. pnpm’s default still skips release-age and trust checks, with a warning, when registry publish times are unavailable. A failed policy check must be resolved before continuing; commands fail on stale dependencies instead of implicitly reinstalling them.

Four exact Babel 7 dependency edges temporarily use `semver@7.8.5` because their requested `semver@6.3.1` fails the no-downgrade policy. These scoped overrides intentionally exceed the upstream dependency range; keep compatibility and full build/test verification when changing them, and remove them when supported upstream versions resolve the conflict. Do not replace them with a trust-policy exemption.

## Local Development Workflow

1. **Fork & clone**
   ```bash
   git clone https://github.com/<your-username>/destyler.git
   cd destyler
   ```
2. **Install dependencies**
   ```bash
   pnpm install --frozen-lockfile
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

- **Framework-agnostic core**: Machines and shared utilities are the source of truth. Framework adapters should offer equal glue (`useMachine` / `normalizeProps` / `mergeProps`) rather than privileging one UI framework.
- **Example DOM parity**: Where framework *examples* demonstrate the same primitive, keep DOM structure, class names, and `portalled` behavior consistent across React, Solid, Svelte, Lit, Vanilla, Vue, etc.
- **Portal**: Vue and Solid use the framework’s native portal/teleport. Other adapters may export Destyler `Portal`. Do not add thin wrappers for Vue/Solid — see [CONTROLLED-API.md](./CONTROLLED-API.md).
- **Controlled open / value**: Follow the MACHINE-layer conventions in [CONTROLLED-API.md](./CONTROLLED-API.md) (Phase 3 HARD: live-prop presence controls ownership; `default*` seeds uncontrolled state; explicit `*.controlled` flags are removed). See the [end-user migration guide](./document/src/content/guide/controllable-state.mdx). Raw machine props and UI wrapper props have different `undefined` normalization rules; follow the contract of the layer you are changing.
- **Polished component examples**: Vue-as-source-of-truth for polished, product-ready component examples lives in [destyler/ui](https://github.com/destyler/ui), not this core repo.
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
pnpm test:types
pnpm build
pnpm test:workflows
```

- `pnpm test:types` runs the native TypeScript 7 compiler against the public type-contract projects, including `packages/types/test/*.test-d.ts`; runtime tests do not execute these files.
- Tooling that needs the JavaScript compiler API uses the official TypeScript 6 compatibility package installed under the `typescript` alias. The `@typescript/native` alias supplies the TypeScript 7 `tsc` executable; `tsc6` is available for API-tooling diagnostics.
- Packed consumers keep their isolated TypeScript 5.9.3 checks, including the legacy `Node10` resolver. They do not use either workspace compiler alias.
- Use `pnpm test:dev` for watch mode and `pnpm test:ui` for Vitest UI debugging.
- For browser-based components, consider `pnpm test:deploy` or `pnpm test:coverage` to ensure no regressions.
- Add regression tests whenever you fix a bug or introduce a new feature. Cover normal, boundary, and error cases, especially for utilities like color and date libraries.
- When working on color utilities, follow the testing guidance in `shareds/color` (format conversions, transparency, hue wrapping, etc.).
- For date utilities, include range boundaries (`minValue`, `maxValue`) and navigation behavior in your tests.

### Release verification

Pull requests and tag releases share the non-publishing build and test action in
`.github/actions/verify`. Release verification runs against the exact commit that
triggered the tag push, using the same Node.js matrix as CI, and also requires
lint on Node.js 24. A separate required Node.js `20.19.0` job checks all packed public package entries and the existing minimum/current Date and Svelte consumer contracts; build, pack and browser tooling run on Node.js `22.22.3`. Publishing packages, generating the GitHub changelog, and
deploying release sites wait for every verification job to succeed and check out
that same commit. A failed, skipped, or cancelled verification prevents those
release jobs from starting.

The packed Svelte consumer gate builds and packs the adapter's complete runtime
workspace dependency closure from the same checkout. Isolated npm consumers use
those tarballs, verify package identity, version, integrity and dependency origin,
and reject workspace symlinks or registry fallback. Strict Bundler/NodeNext type
checks and runtime imports run with Svelte 5.0.0 and 5.57.2. The same checks repeat
with a disposable unpublished-version workspace to cover a lockstep release bump
before any packages exist on npm; the checkout's versions are never changed.
Run this gate locally with `pnpm exec node scripts/test-svelte-package.mjs`.

`pnpm exec node scripts/test-public-package-runtime.mjs` builds every public
package, installs local tarballs in an isolated consumer with exact installed
framework peers, and checks explicit import/require and legacy main/module
entries. The dedicated Node 20 job also runs the existing Date and Svelte gates.
Set all three of `DESTYLER_CONSUMER_NODE` (absolute Node binary path),
`DESTYLER_CONSUMER_NPM` (absolute npm CLI JavaScript path), and
`DESTYLER_CONSUMER_NODE_VERSION` (exact version) to run their consumer processes
on a different Node installation. The invoking development Node still builds,
packs, and runs the locked browser tooling. An incomplete selection, version
mismatch, or incompatible consumer dependency engine fails the dedicated check.

All workflow workspace installs use the frozen pnpm lockfile. When editing
workflows, run `pnpm test:workflows` to check YAML parsing, the job dependency graph,
exact-SHA checkouts, and the shared verification contract. This command does not
publish packages or deploy sites; browser tests still run separately in CI.

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
