# Packed package entry contract

Run `pnpm exec node scripts/test-package-entries.mjs` from the repository root.
The same command runs in the shared PR/release verification action.

This fixture installs the current checkout's packed Navigation Menu, Scroll Area,
Date, and complete workspace runtime dependency closure into separate consumers
with exact `@internationalized/date` peers `3.0.0` and `3.10.1`. The package lock integrity,
local tarball origins, absence of workspace links and nested registry substitutes,
dependency resolution paths, and installed peer versions are checked before
testing any entrypoint. The same tarballs are used for both consumers.

It checks:
- Public package imports through modern `exports`
- Node's legacy package-directory `main` resolution, loading the result as ESM
- Strict TypeScript 5.9.3 with `Node10`, `Bundler`, and `NodeNext` resolution
- Invalid public prop types that must remain errors, preventing an `any` false pass
- Date's 216 ISO parser cases across host zones, frozen clocks, locales, and requested zones
- Public Date formatter, range, mutation, month, and constructor identity assertions
- Typed Date parsing and inferred CalendarDate, DateFormatter, and CalendarDateTime
  results, including invalid input/return assignments that must remain errors
- Six negative controls per peer: a missing `main` and missing `types` for each package
- A static Date named import restored in each disposable installed entry: the
  minimum peer must reject it, while the current peer must run successfully.
  Exact entry bytes are restored in `finally`, followed by another runtime check.

Captured stdout and stderr are printed unchanged, including expected negative
control errors. Runtime checks use the invoking native Node binary, with no
bundler, loader, source alias, or workspace dependency fallback.

This gate covers module interoperability and the listed public operations, not
complete minimum-peer behavioral compatibility. Explicit `firstDayOfWeek`
overrides have a separate known gap with peer 3.0.0, which ignores the newer
third peer-function argument. Existing weekday-override unit expectations remain
unchanged and are not replaced by this gate's locale-default checks.

`Node10` names TypeScript's legacy resolver. It does not assert Node.js 10 runtime
support. Legacy runtime resolution likewise does not add a CommonJS build; these
packages continue to publish ESM. Modern `exports` remains unchanged.
