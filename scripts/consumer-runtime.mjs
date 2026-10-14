import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

const { DESTYLER_CONSUMER_NODE: node, DESTYLER_CONSUMER_NPM: npm, DESTYLER_CONSUMER_NODE_VERSION: version } = process.env
const configured = [node, npm, version].filter(Boolean).length
assert.ok(configured === 0 || configured === 3, 'Consumer Node, npm CLI and exact Node version must be configured together')
export const consumerNode = node ?? process.execPath

export function pnpmCommand(args) {
  const executable = process.env.npm_execpath || (process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm')
  return /\.[cm]?js$/.test(executable)
    ? [process.execPath, [executable, ...args]]
    : [executable, args]
}

function execute(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, env: process.env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  process.stdout.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')
  if (result.error)
    throw result.error
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`)
  return result.stdout.trim()
}

if (configured) {
  assert.ok(path.isAbsolute(node) && path.isAbsolute(npm), 'Consumer executables must be absolute paths')
  assert.match(version, /^\d+\.\d+\.\d+$/)
  assert.equal(execute(node, ['--version']), `v${version}`, 'Wrong consumer Node runtime')
  execute(node, [npm, '--version'])
}

export function installConsumer(directory) {
  const args = ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--package-lock=true']
  // Only the isolated tarball installation runs under the selected consumer Node.
  // Build/pack and the locked development/browser tools keep their own runtime.
  if (configured)
    return execute(node, [npm, ...args, '--engine-strict'], directory)
  return execute(process.platform === 'win32' ? 'npm.cmd' : 'npm', args, directory)
}
