import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
// eslint-disable-next-line test/no-import-node-test -- Exercise release selection without publishing or browser dependencies.
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { createPublishPlan, publishPackages } from '../publish-packages.mjs'

const repositoryRoot = fileURLToPath(new URL('../../', import.meta.url))
const publicPath = 'packages/components/example'
const privatePaths = ['.', 'shared', 'document', 'storybook']

function readJson(filename) {
  return JSON.parse(readFileSync(filename, 'utf8'))
}

function fixture(t) {
  const root = realpathSync(mkdtempSync(path.join(os.tmpdir(), 'destyler-publish-')))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const manifests = {
    '.': { name: '@destyler/monorepo', version: '0.2.12', private: true },
    'shared': { name: '@destyler/shared-private', version: '0.0.0', private: true },
    'document': { name: '@destyler/document', private: true },
    'storybook': { name: '@destyler/storybook', private: true },
    [publicPath]: { name: '@destyler/example', version: '0.2.12', publishConfig: { access: 'public' } },
  }
  const approved = { [publicPath]: '@destyler/example' }
  function write() {
    for (const [directory, manifest] of Object.entries(manifests)) {
      mkdirSync(path.join(root, directory), { recursive: true })
      writeFileSync(path.join(root, directory, 'package.json'), JSON.stringify(manifest))
    }
    mkdirSync(path.join(root, 'scripts'), { recursive: true })
    writeFileSync(path.join(root, 'scripts/publish-targets.json'), JSON.stringify(approved))
  }
  function projects() {
    return Object.entries(manifests).map(([directory, manifest]) => ({
      path: path.join(root, directory),
      name: manifest.name,
      // pnpm normalizes malformed private flags; the raw manifest is authoritative.
      private: manifest.private === true,
    }))
  }
  function plan() {
    write()
    return createPublishPlan(root, projects(), approved)
  }
  write()
  return { root, manifests, approved, write, projects, plan }
}

function runner(f, selected = () => f.projects().filter(project => project.path === path.join(f.root, publicPath))) {
  const calls = []
  return {
    calls,
    run(command, args, options) {
      assert.equal(command, 'pnpm')
      assert.equal(options.cwd, f.root)
      calls.push({ args: [...args], options })
      if (args.includes('list'))
        return JSON.stringify(args.includes('--filter') ? selected() : f.projects())
      if (args[0] === 'run' && args[1] === 'check:declarations')
        return ''
      // A stub only: no process, lifecycle, package data or registry call is made.
      assert.ok(args.includes('publish'))
      return ''
    },
  }
}

test('only allowlisted public workspaces are selected, never root or site/internal workspaces', (t) => {
  const f = fixture(t)
  const plan = f.plan()
  assert.deepEqual(plan.targets, [{ directory: publicPath, name: '@destyler/example' }])
  assert.deepEqual(plan.filters, ['--filter', `./${publicPath}`])
  assert.equal(plan.version, '0.2.12')
  assert.equal(plan.tag, 'latest')
})

test('boolean false is a valid public private flag and beta tagging is preserved', (t) => {
  const f = fixture(t)
  f.manifests[publicPath].private = false
  f.manifests[publicPath].version = f.manifests['.'].version = '0.3.0-beta.1'
  assert.equal(f.plan().tag, 'beta')
})

for (const directory of [...privatePaths, publicPath]) {
  test(`malformed private flags fail closed for ${directory}`, (t) => {
    const f = fixture(t)
    for (const value of ['true', 'false', null, 0, 1, {}, []]) {
      f.manifests[directory].private = value
      assert.throws(() => f.plan(), /private/)
    }
  })
}

for (const directory of privatePaths) {
  test(`missing or false private fails closed for ${directory}`, (t) => {
    const f = fixture(t)
    delete f.manifests[directory].private
    assert.throws(() => f.plan(), /private: true/)
    f.manifests[directory].private = false
    assert.throws(() => f.plan(), /private: true/)
  })
}

test('unapproved workspaces are never silently published, including new packages under packages/', (t) => {
  const f = fixture(t)
  for (const directory of ['internal', 'packages/internal']) {
    f.manifests[directory] = { name: '@destyler/internal', version: '0.2.12' }
    assert.throws(() => f.plan(), /Non-public workspace/)
    f.manifests[directory].private = true
    assert.equal(f.plan().targets.length, 1)
    delete f.manifests[directory]
  }
})

test('every approved package must exist, be public and retain its approved identity and release version', (t) => {
  const f = fixture(t)
  f.write()
  assert.throws(() => createPublishPlan(f.root, f.projects().filter(project => project.path !== path.join(f.root, publicPath)), f.approved), /missing from the workspace/)
  f.manifests[publicPath].private = true
  assert.throws(() => f.plan(), /Public package is marked private/)
  delete f.manifests[publicPath].private
  f.manifests[publicPath].version = '0.2.11'
  assert.throws(() => f.plan(), /version does not match/)
  f.manifests[publicPath].version = '0.2.12'
  f.manifests[publicPath].name = '@destyler/unapproved'
  assert.throws(() => f.plan(), /Unexpected public package name/)
})

test('publishConfig cannot redirect an approved package name or artifact directory', (t) => {
  const f = fixture(t)
  for (const name of ['@destyler/unapproved', '', null, false]) {
    f.manifests[publicPath].publishConfig.name = name
    assert.throws(() => f.plan(), /Publish name override/)
  }
  f.manifests[publicPath].publishConfig.name = '@destyler/example'
  assert.equal(f.plan().targets.length, 1)
  f.manifests[publicPath].publishConfig.directory = '../../shared'
  assert.throws(() => f.plan(), /Publish directory override/)
})

test('allowlist rejects empty sets, private paths, traversal, globs and duplicate identities', (t) => {
  const f = fixture(t)
  assert.throws(() => createPublishPlan(f.root, f.projects(), {}), /must not be empty/)
  for (const directory of ['.', 'shared', 'document', 'storybook', '../packages/example', 'packages/../shared', 'packages/*', 'packages/example...', '/packages/example'])
    assert.throws(() => createPublishPlan(f.root, f.projects(), { [directory]: '@destyler/example' }), /Invalid publish target path/)
  assert.throws(() => createPublishPlan(f.root, f.projects(), { ...f.approved, 'packages/duplicate': '@destyler/example' }), /Duplicate publish target name/)
})

test('workspace discovery rejects missing root, duplicates, inconsistent names and outside/symlink paths', (t) => {
  const f = fixture(t)
  const projects = f.projects()
  assert.throws(() => createPublishPlan(f.root, [], f.approved), /must return projects/)
  assert.throws(() => createPublishPlan(f.root, projects.slice(1), f.approved), /must include the repository root/)
  assert.throws(() => createPublishPlan(f.root, [...projects, projects[0]], f.approved), /Duplicate workspace path/)
  assert.throws(() => createPublishPlan(f.root, [{ ...projects[0], name: '@destyler/wrong' }, ...projects.slice(1)], f.approved), /does not match its manifest/)
  assert.throws(() => createPublishPlan(f.root, [...projects, { path: path.dirname(f.root) }], f.approved), /outside the repository/)
  symlinkSync(path.join(f.root, 'shared'), path.join(f.root, 'alias'), 'junction')
  assert.throws(() => createPublishPlan(f.root, [...projects, { path: path.join(f.root, 'alias') }], f.approved), /must not be a symlink/)
})

test('publishing uses exact validated path filters and preserves existing public release flags', (t) => {
  const f = fixture(t)
  const stub = runner(f)
  publishPackages({ root: f.root, run: stub.run, log() {} })
  assert.equal(stub.calls.length, 4)
  assert.deepEqual(stub.calls[0].args, ['list', '--recursive', '--depth', '-1', '--json'])
  assert.deepEqual(stub.calls[1].args, ['--filter', `./${publicPath}`, ...stub.calls[0].args])
  assert.deepEqual(stub.calls[2].args, ['run', 'check:declarations'])
  assert.deepEqual(stub.calls[2].options, { cwd: f.root, stdio: 'inherit' })
  assert.deepEqual(stub.calls[3].args, ['--filter', `./${publicPath}`, 'publish', '--recursive', '--access', 'public', '--no-git-checks', '--ignore-scripts', '--tag', 'latest'])
  assert.deepEqual(stub.calls[3].options, { cwd: f.root, stdio: 'inherit' })
})

test('offline dry-run only lists projects and never invokes publishing or package lifecycle scripts', (t) => {
  const f = fixture(t)
  const stub = runner(f)
  const output = []
  const plan = publishPackages({ root: f.root, dryRun: true, run: stub.run, log: line => output.push(line) })
  assert.equal(plan.targets.length, 1)
  assert.equal(stub.calls.length, 2)
  assert.ok(stub.calls.every(call => call.args.includes('list') && !call.args.includes('publish')))
  assert.match(output[0], /Would publish 1 packages/)
  assert.ok(output.includes(`@destyler/example: ${publicPath}`))
})

test('malformed private flags stop before filtered discovery or the publish runner', (t) => {
  const f = fixture(t)
  f.manifests.shared.private = 'true'
  f.write()
  const stub = runner(f)
  assert.throws(() => publishPackages({ root: f.root, run: stub.run, log() {} }), /boolean private/)
  assert.equal(stub.calls.length, 1)
})

test('missing, extra, duplicate or renamed selected targets stop before publishing', (t) => {
  const f = fixture(t)
  const publicProject = f.projects().find(project => project.path === path.join(f.root, publicPath))
  for (const selection of [[], f.projects(), [publicProject, publicProject], [{ ...publicProject, name: '@destyler/wrong' }]]) {
    const stub = runner(f, () => selection)
    assert.throws(() => publishPackages({ root: f.root, run: stub.run, log() {} }), /selection must match/)
    assert.equal(stub.calls.length, 2)
    assert.ok(stub.calls.every(call => !call.args.includes('publish')))
  }
})

test('discovery failures abort without attempting publication', (t) => {
  const f = fixture(t)
  let calls = 0
  assert.throws(() => publishPackages({
    root: f.root,
    log() {},
    run() {
      calls++
      throw new Error('discovery failed')
    },
  }), /discovery failed/)
  assert.equal(calls, 1)
})

function packageDirectories(directory, prefix = 'packages') {
  const result = []
  if (readdirSync(directory).includes('package.json'))
    result.push(prefix)
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist')
      result.push(...packageDirectories(path.join(directory, entry.name), `${prefix}/${entry.name}`))
  }
  return result
}

test('repository allowlist contains every intended public package and no internal workspace', () => {
  const approved = readJson(path.join(repositoryRoot, 'scripts/publish-targets.json'))
  const directories = packageDirectories(path.join(repositoryRoot, 'packages'))
  const expected = Object.fromEntries(directories.flatMap((directory) => {
    const manifest = readJson(path.join(repositoryRoot, directory, 'package.json'))
    return manifest.private === true ? [] : [[directory, manifest.name]]
  }))
  assert.deepEqual(approved, expected)
  assert.equal(Object.keys(approved).length, 76)
  const projects = [...privatePaths, ...directories].map(directory => ({
    path: path.join(repositoryRoot, directory),
    name: readJson(path.join(repositoryRoot, directory, 'package.json')).name,
  }))
  const plan = createPublishPlan(repositoryRoot, projects, approved)
  assert.equal(plan.targets.length, 76)
  assert.ok(plan.targets.some(target => target.name === '@destyler/docs'), 'The public docs library must remain included')
  for (const directory of privatePaths)
    assert.ok(!plan.targets.some(target => target.directory === directory))
  const scripts = readJson(path.join(repositoryRoot, 'package.json')).scripts
  assert.ok(scripts['test:workflows'].includes('scripts/test/publish.test.mjs'), 'Both PR and release verification must run publish regression tests')
  assert.equal(scripts['publish:ci'], 'tsx ./scripts/publish.ts')
})
