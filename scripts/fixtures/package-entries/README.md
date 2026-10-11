# Packed package entry contract

Run `pnpm exec node scripts/test-package-entries.mjs` from the repository root.
The same command runs in the shared PR/release verification action.

This fixture installs the current checkout's packed Navigation Menu, Scroll Area,
Date, and complete workspace runtime dependency closure into separate consumers
with exact `@internationalized/date` peers `3.0.0`, `3.10.1`, and `3.12.4` (the
current development version). The package lock integrity,
local tarball origins, absence of workspace links and nested registry substitutes,
dependency resolution paths, and installed peer versions are checked before
testing any entrypoint. The same tarballs are used for all three consumers.

It checks:
- Public package imports through modern `exports`
- Node's legacy package-directory `main` resolution, loading the result as ESM
- Strict TypeScript 5.9.3 with `Node10`, `Bundler`, and `NodeNext` resolution
- Invalid public prop types that must remain errors, preventing an `any` false pass
- Date's 216 ISO parser cases across host zones, frozen clocks, locales, and requested zones
- Public Date formatter, range, mutation, month, and constructor identity assertions
- Numeric Date weekday overrides at all three peers, including month row counts,
  year and calendar-era boundaries, BC clamping, and DST start-then-add semantics
- Typed Date parsing and inferred CalendarDate, DateFormatter, and CalendarDateTime
  results, including invalid input/return assignments that must remain errors
- Six negative controls per peer: a missing `main` and missing `types` for each package
- A static Date named import restored in each disposable installed entry: the
  minimum peer must reject it, while both modern peers must run successfully.
  Exact entry bytes are restored in `finally`, followed by another runtime check.
- A Vite browser-targeted ESM bundle of the packed public Date entry with each
  peer, using the repository's locked Astro/Vite dependency and no project config.
  Its module graph must include the installed Date package and peer, with no
  external imports. The emitted bundle's public ISO parsing is checked too.
- A missing namespace member in Date's CalendarDate binding must be rejected by
  the warning check; a missing named peer import must make Vite fail. Each control
  restores exact entry bytes in `finally`, followed by bundling and parsing.
- Chromium execution of the Vite output for each peer: all 216 ISO parser cases
  across three browser time zones, frozen clocks, locales, and requested zones;
  public formatter, range, mutation, month, and constructor identity assertions
  cover the 19 private bridge bindings against the same bundled peer module.
  Selected weekday overrides and boundary cases from the native runtime fixture
  run in each browser time zone too, including a check that `getDayOfWeek` stays private.

Captured stdout and stderr are printed unchanged, including expected negative
control errors. Every Vite warning is forwarded through its normal handler. The
only accepted `MISSING_EXPORT` is the optional `.default` probe at its exact source
position in the installed Date entry, against the installed peer's ESM entry.
Any other missing export fails the browser bundle check. Native runtime checks use
the invoking Node binary, with no bundler or loader. All checks use installed
tarballs, with no source alias or workspace dependency fallback.

The native/type probes and Vite controls run for all three peers before Chromium starts.
Chromium is required: install the repository's Playwright browsers before running
the command (the shared CI/release workflows already do this). Browser launch,
runtime, console, and page errors fail the gate; there is no browser skip or Node
fallback. The small parser-only bundle and broader browser-runtime fixture stay
separate so the latter does not change parser-only bundle-size evidence.

This gate covers module interoperability and the listed public operations, not
complete minimum-peer behavioral compatibility. Date's numeric `firstDayOfWeek`
overrides are checked at all three peers, including a browser subset using 0, 1, and 6.
Existing weekday-override unit expectations remain unchanged; these packed-package
checks add consumer and browser coverage.

`Node10` names TypeScript's legacy resolver. It does not assert Node.js 10 runtime
support. Legacy runtime resolution likewise does not add a CommonJS build; these
packages continue to publish ESM. Modern `exports` remains unchanged.
