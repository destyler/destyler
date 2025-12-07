import { execSync } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { version } = require('../package.json')

function getTag(version: string): string {
  if (version.includes('beta')) {
    return 'beta'
  }
  return 'latest'
}

const tag = getTag(version)

console.log(`Publishing version ${version} with tag "${tag}"`)

execSync(`pnpm -r publish --access public --no-git-checks --tag ${tag}`, {
  stdio: 'inherit',
})
