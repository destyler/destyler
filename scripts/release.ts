import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path, { dirname } from 'node:path'
import { consola } from 'consola'

async function run() {
  consola.info('Start to release the packages...')
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const rootPath = path.join(__dirname, '..')
  execSync(
    'npx bumpp package.json packages/*/package.json packages/**/*/package.json --commit --push --tag && pnpm -r publish --access public',
    {
      stdio: 'inherit',
      cwd: rootPath,
    },
  )
}

run()
