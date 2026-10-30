import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const installDir = path.resolve(root, process.env.REACT_18_DIR ?? 'node_modules/.cache/react-18')

mkdirSync(installDir, { recursive: true })
writeFileSync(path.join(installDir, 'package.json'), JSON.stringify({ private: true }))

const install = spawnSync('npm', [
  'install',
  '--ignore-scripts',
  'react@18.3.1',
  'react-dom@18.3.1',
  'react-test-renderer@18.3.1',
], {
  cwd: installDir,
  stdio: 'inherit',
})
if (install.status !== 0)
  process.exit(install.status ?? 1)

const test = spawnSync('pnpm', [
  'exec',
  'vitest',
  'run',
  '--config',
  'vitest.react18.config.ts',
  '--browser.headless',
], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, REACT_18_DIR: installDir },
})
process.exit(test.status ?? 1)
