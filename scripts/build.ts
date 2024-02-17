import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { consola } from 'consola'
import { componentsPackages, rootPackages } from '../meta/packages'

async function run() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  // made shared library imported can resolve correctly
  const packagesRoot = resolve(__dirname, '..', 'packages')
  const packages = [...rootPackages, ...componentsPackages]

  const build = spawn(`pnpm`, ['run', 'build'])
}

run()
