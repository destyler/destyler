# Outside-month day selection (0.3.5, pending release)

`allowOutsideDays?: boolean` opts into selecting rendered days outside a month's
visible range. Omitted/false preserves the existing 0.3.4 behavior. It does not
change the shared date utility, min/max, unavailable dates or explicit cell
`disabled`. Outside markers and duplicate-cell tab-stop exclusion remain intact.

This is not an exact DayPicker behavior clone: clicking an outside day moves
focus and the visible month to that date. While choosing a range end, hovering an
outside day also moves the visible month using the existing state transitions.
The UI framework adapters must forward the new option; released UI 0.0.4 and
Calendar 0.3.4 do not provide this capability. The change targets core 0.3.5,
with UI adapters and downstream designs updated after publication.

## Verification

The 18 regression cases cover default compatibility, opt-in,
min/max/unavailable/disabled guards, dynamic context, single/multiple/range
selection, controlled values, props splitting, cross-year navigation, duplicate
cells in two-month displays and range-hover navigation.

The tests use Vitest's Node project with happy-dom, not a browser. They are
included by the existing `packages/**/*.test.{js,ts,jsx,tsx}` discovery pattern.
After installing the workspace and building package dependencies, run only the
non-browser project with:

```sh
pnpm exec vitest run --config vitest.utils.config.ts packages/components/calendar/test/calendar.outside-days.test.ts
```

Passing these checks verifies the state-machine and property contract, not
browser rendering, focus appearance or visual equivalence with shadcn. Normal
release checks remain required before publishing.
