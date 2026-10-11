# Packed package entry contract

Run `pnpm exec node scripts/test-package-entries.mjs` from the repository root.
The same command runs in the shared PR/release verification action.

This fixture installs the current checkout's packed Navigation Menu, Scroll Area,
and complete workspace runtime dependency closure. The package lock integrity,
local tarball origins, absence of workspace links and nested registry substitutes,
and dependency resolution paths are checked before testing any entrypoint.

It checks:
- Public package imports through modern `exports`
- Node's legacy package-directory `main` resolution, loading the result as ESM
- Strict TypeScript 5.9.3 with `Node10`, `Bundler`, and `NodeNext` resolution
- Invalid public prop types that must remain errors, preventing an `any` false pass
- Four negative controls: a missing `main` and missing `types` for each package

`Node10` names TypeScript's legacy resolver. It does not assert Node.js 10 runtime
support. Legacy runtime resolution likewise does not add a CommonJS build; these
packages continue to publish ESM. Modern `exports` remains unchanged.
