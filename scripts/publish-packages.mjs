import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, realpathSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url))
const listArgs = ['list', '--recursive', '--depth', '-1', '--json']

function readJson(filename) {
  return JSON.parse(readFileSync(filename, 'utf8'))
}

function projectPath(root, project) {
  assert.equal(typeof project.path, 'string', 'Workspace project path must be a string')
  assert.ok(path.isAbsolute(project.path), 'Workspace project path must be absolute')
  const absolute = path.resolve(project.path)
  assert.equal(realpathSync(absolute), absolute, `Workspace project must not be a symlink: ${absolute}`)
  const relative = path.relative(root, absolute).split(path.sep).join('/') || '.'
  assert.ok(relative !== '..' && !relative.startsWith('../') && !path.isAbsolute(relative), `Workspace project is outside the repository: ${absolute}`)
  return relative
}

export function createPublishPlan(root, projects, approvedTargets) {
  root = realpathSync(root)
  assert.ok(Array.isArray(projects) && projects.length > 0, 'Workspace discovery must return projects')
  assert.ok(approvedTargets && typeof approvedTargets === 'object' && !Array.isArray(approvedTargets), 'Publish targets must be a path/name map')
  const entries = Object.entries(approvedTargets)
  assert.ok(entries.length > 0, 'Publish target allowlist must not be empty')
  const approvedNames = new Set()
  for (const [directory, name] of entries) {
    assert.match(directory, /^packages\/[a-z0-9-]+(?:\/[a-z0-9-]+)?$/, `Invalid publish target path: ${directory}`)
    assert.equal(typeof name, 'string', `Publish target name must be a string: ${directory}`)
    assert.match(name, /^@destyler\/[a-z0-9-]+$/, `Invalid publish target name: ${name}`)
    assert.ok(!approvedNames.has(name), `Duplicate publish target name: ${name}`)
    approvedNames.add(name)
  }

  const rootManifest = readJson(path.join(root, 'package.json'))
  assert.equal(rootManifest.private, true, 'The repository root must have private: true')
  const version = rootManifest.version
  assert.equal(typeof version, 'string', 'Release version must be a string')
  assert.match(version, /^\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?$/, 'Release version must be a package version')

  const discovered = new Set()
  const names = new Set()
  for (const project of projects) {
    const directory = projectPath(root, project)
    assert.ok(!discovered.has(directory), `Duplicate workspace path: ${directory}`)
    discovered.add(directory)
    const manifest = readJson(path.join(root, directory, 'package.json'))
    assert.equal(typeof manifest.name, 'string', `Workspace name is missing: ${directory}`)
    assert.ok(!names.has(manifest.name), `Duplicate workspace name: ${manifest.name}`)
    names.add(manifest.name)
    assert.equal(project.name, manifest.name, `Workspace name does not match its manifest: ${directory}`)
    assert.ok(!Object.hasOwn(manifest, 'private') || typeof manifest.private === 'boolean', `${directory} must use a boolean private flag`)

    if (Object.hasOwn(approvedTargets, directory)) {
      assert.equal(manifest.name, approvedTargets[directory], `Unexpected public package name: ${directory}`)
      assert.notEqual(manifest.private, true, `Public package is marked private: ${directory}`)
      assert.equal(manifest.version, version, `Public package version does not match release: ${directory}`)
      assert.ok(manifest.publishConfig?.name === undefined || manifest.publishConfig.name === manifest.name, `Publish name override is not allowed: ${directory}`)
      assert.equal(manifest.publishConfig?.directory, undefined, `Publish directory override is not allowed: ${directory}`)
    }
    else {
      assert.equal(manifest.private, true, `Non-public workspace must have private: true: ${directory}`)
    }
  }
  assert.ok(discovered.has('.'), 'Workspace discovery must include the repository root')
  for (const [directory] of entries)
    assert.ok(discovered.has(directory), `Public package is missing from the workspace: ${directory}`)

  const targets = entries.map(([directory, name]) => ({ directory, name }))
  const filters = targets.flatMap(({ directory }) => ['--filter', `./${directory}`])
  const tag = version.includes('beta') ? 'beta' : 'latest'
  return { version, tag, targets, filters }
}

export function publishPackages({ root = repositoryRoot, dryRun = false, run = execFileSync, log = console.log } = {}) {
  root = realpathSync(root)
  const options = { cwd: root, encoding: 'utf8' }
  const projects = JSON.parse(run('pnpm', listArgs, options))
  const plan = createPublishPlan(root, projects, readJson(path.join(root, 'scripts/publish-targets.json')))

  // Check pnpm's actual selection before any publish lifecycle or registry write.
  const selected = JSON.parse(run('pnpm', [...plan.filters, ...listArgs], options))
  assert.ok(Array.isArray(selected), 'Filtered workspace discovery must return projects')
  const actual = selected.map(project => [projectPath(root, project), project.name]).sort()
  const expected = plan.targets.map(({ directory, name }) => [directory, name]).sort()
  assert.deepEqual(actual, expected, 'pnpm publish selection must match the explicit public package allowlist')

  log(`${dryRun ? 'Would publish' : 'Publishing'} ${plan.targets.length} packages at version ${plan.version} with tag "${plan.tag}"`)
  if (dryRun) {
    for (const { directory, name } of plan.targets)
      log(`${name}: ${directory}`)
    return plan
  }

  // The topological build must already have written dependency dist declarations.
  // prepublishOnly would clear and rebuild each package. A rerun skips packages
  // already in the registry, so those declarations never exist and inferred
  // exports collapse to any. Ship the build that the declaration check just saw.
  run('pnpm', ['run', 'check:declarations'], {
    cwd: root,
    stdio: 'inherit',
  })
  run('pnpm', [...plan.filters, 'publish', '--recursive', '--access', 'public', '--no-git-checks', '--ignore-scripts', '--tag', plan.tag], {
    cwd: root,
    stdio: 'inherit',
  })
  return plan
}
