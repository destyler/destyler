# Svelte adapter packed consumer

Run `pnpm exec node scripts/test-svelte-package.mjs` from the repository root.
It builds the adapter and its workspace dependencies, packs the actual artifact,
then installs the tarball into independent external npm consumers. Svelte 5.0.0
(the public peer minimum) and 5.46.0 (the current workspace release) are exact pins.

Both consumers check public declarations with strict TypeScript and
`skipLibCheck: false` in Bundler and NodeNext modes. There are no source aliases,
worktree links or declaration shims. They also verify all advertised files and
import both public entries under Node, browser and Svelte export conditions.
The browser-condition import installs HappyDOM globals before loading Svelte;
this is an import contract check, not a claim of real-browser component coverage.

The source uses the runtime `.js` suffix for normal modules and `.svelte.js` for
rune modules, allowing Svelte's package emitter to preserve correct references
in both JavaScript and declarations. Publishing is outside this test's scope.
Downstream UI NodeNext users need a published adapter release containing the fix.
