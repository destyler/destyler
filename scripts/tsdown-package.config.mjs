import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'tsdown'
import { missingWorkspaceDeclarations } from './workspace-declarations.mjs'

// Declaration emit infers anatomy, machine(), props and splitProps from workspace
// packages. If those packages have no dist declarations yet, tsdown still exits 0
// and writes `any`. Refuse that before emit.
export default defineConfig({
  entry: [
    'index.ts',
  ],
  dts: true,
  format: ['esm'],
  clean: true,
  failOnWarn: 'ci-only',
  hash: false,
  hooks: {
    'build:prepare': (context) => {
      const cwd = context.options.cwd || process.cwd()
      const missing = missingWorkspaceDeclarations(cwd)
      if (missing.length === 0)
        return
      const manifest = JSON.parse(readFileSync(path.join(cwd, 'package.json'), 'utf8'))
      const details = missing.map(item => `${item.name} (${item.reason})`).join('\n  ')
      throw new Error(`${manifest.name ?? cwd}: workspace dependency declarations are missing, so public types would degrade to any.\n  ${details}`)
    },
  },
})
