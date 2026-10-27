/* eslint-disable no-template-curly-in-string -- GitHub expressions are intentionally literal. */
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Check CI independently of the browser test configuration.
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
import { parseAllDocuments, parseDocument } from 'yaml'

const root = new URL('../../', import.meta.url)
const verifyAction = './.github/actions/verify'
const consumerAction = './.github/actions/verify-supported-consumers'
const sourceMatrix = ['22.22.3', 24]

function readYaml(path) {
  const document = parseDocument(readFileSync(new URL(path, root), 'utf8'))
  assert.deepEqual(document.errors, [], `${path} must be valid YAML`)
  return document.toJS()
}

const workflows = Object.fromEntries(
  readdirSync(new URL('.github/workflows/', root))
    .filter(name => /\.ya?ml$/.test(name))
    .map(name => [name, readYaml(`.github/workflows/${name}`)]),
)
const ci = workflows['ci.yml']
const release = workflows['release.yml']
const verification = readYaml('.github/actions/verify/action.yml')
const consumerVerification = readYaml('.github/actions/verify-supported-consumers/action.yml')

function assertRequired(job, label) {
  assert.equal(job.if, undefined, `${label} must use the default success condition`)
  assert.equal(job['continue-on-error'], undefined, `${label} must fail closed`)
}

function assertConsumerJob(job) {
  assert.ok(job, 'Node 22.22.3 consumers must have an independent job')
  assertRequired(job, 'Node 22.22.3 consumers')
  assert.deepEqual(job.permissions, { contents: 'read' })
  assert.ok(job.steps.some(step => step.uses === consumerAction))
  for (const step of job.steps)
    assertRequired(step, step.name)
  assert.ok(!JSON.stringify(job).includes('secrets.'))
}

function assertConsumerAction(action) {
  assert.equal(action.runs.using, 'composite')
  const steps = action.runs.steps
  assert.deepEqual(steps.map(step => step.uses ?? step.run), [
    'actions/setup-node@v6',
    'echo "node=$(command -v node)" >> "$GITHUB_OUTPUT"\necho "npm=$(realpath "$(command -v npm)")" >> "$GITHUB_OUTPUT"\n',
    'actions/setup-node@v6',
    'pnpm/action-setup@v4',
    'pnpm install --frozen-lockfile',
    'pnpm playwright install --with-deps chromium',
    'pnpm exec node scripts/test-public-package-runtime.mjs\npnpm exec node scripts/test-svelte-package.mjs\npnpm exec node scripts/test-package-entries.mjs\n',
  ])
  assert.equal(steps[0].with['node-version'], '22.22.3')
  assert.equal(steps[1].id, 'consumer')
  assert.equal(steps[2].with['node-version'], '22.22.3')
  assert.deepEqual(steps[6].env, {
    DESTYLER_CONSUMER_NODE: '${{ steps.consumer.outputs.node }}',
    DESTYLER_CONSUMER_NPM: '${{ steps.consumer.outputs.npm }}',
    DESTYLER_CONSUMER_NODE_VERSION: '22.22.3',
  })
  for (const step of steps) {
    assertRequired(step, step.name)
    if (step.run)
      assert.equal(step.shell, 'bash')
  }
}

function assertSourceSupport(workflow) {
  const job = workflow.jobs.test ?? workflow.jobs.verify
  assertRequired(job, 'Source verification')
  assert.deepEqual(job.strategy.matrix.node, sourceMatrix)
  assert.ok(job.steps.some(step => step.uses === verifyAction))
  const setup = job.steps.find(step => step.uses?.startsWith('actions/setup-node@'))
  assert.equal(setup.with['node-version'], '${{ matrix.node }}')
}

test('source support and package-manager contracts are explicit', () => {
  for (const name of ['package.json', 'document/package.json']) {
    const manifest = JSON.parse(readFileSync(new URL(name, root), 'utf8'))
    assert.equal(manifest.engines.node, '^22.22.3 || ^24.16.0 || >=26.3.0')
    assert.equal(manifest.packageManager, 'pnpm@12.11.2')
  }
  for (const workflow of [ci, release]) {
    assertSourceSupport(workflow)
    assertConsumerJob(workflow.jobs['supported-consumer'])
  }
  const svelteSetup = workflows['svelte-package.yml'].jobs['packed-consumer'].steps.find(step => step.uses?.startsWith('actions/setup-node@'))
  assert.equal(svelteSetup.with['node-version'], '22.22.3')
  const report = ci.jobs.test.steps.find(step => step.uses?.startsWith('davelosert/vitest-coverage-report-action@'))
  assert.equal(report.if, 'always() && matrix.node == 24')
  assertConsumerAction(consumerVerification)
})

function assertPublicEngine(manifest) {
  assert.equal(manifest.engines?.node, '>=22.22.3', `${manifest.name}: public Node support must be explicit`)
}

test('all approved public packages and new-package templates declare the consumer floor', () => {
  const targets = JSON.parse(readFileSync(new URL('scripts/publish-targets.json', root), 'utf8'))
  for (const [directory, name] of Object.entries(targets)) {
    const manifest = JSON.parse(readFileSync(new URL(`${directory}/package.json`, root), 'utf8'))
    assert.equal(manifest.name, name)
    assert.notEqual(manifest.private, true)
    assertPublicEngine(manifest)
  }
  for (const template of ['component', 'shared'])
    assertPublicEngine(JSON.parse(readFileSync(new URL(`templates/${template}/package.json.hbs`, root), 'utf8')))
  for (const engines of [undefined, {}, { node: '>=20' }, { node: '>=22' }, { node: '>=24' }])
    assert.throws(() => assertPublicEngine({ name: 'negative-control', engines }))
})

test('pnpm migration retains strict supply-chain and build boundaries', () => {
  const workspace = readYaml('pnpm-workspace.yaml')
  assert.equal(workspace.engineStrict, true)
  assert.equal(workspace.strictPeerDependencies, true)
  assert.equal(workspace.minimumReleaseAge, 1440)
  assert.equal(workspace.minimumReleaseAgeStrict, true)
  assert.equal(workspace.trustPolicy, 'no-downgrade')
  assert.equal(workspace.trustLockfile, false)
  assert.equal(workspace.strictDepBuilds, true)
  assert.equal(workspace.blockExoticSubdeps, true)
  assert.equal(workspace.verifyDepsBeforeRun, 'error')
  assert.deepEqual(workspace.allowBuilds, { esbuild: true, sharp: true })
  for (const name of ['minimumReleaseAgeExclude', 'trustPolicyExclude', 'trustPolicyIgnoreAfter', 'dangerouslyAllowAllBuilds', 'onlyBuiltDependencies'])
    assert.equal(workspace[name], undefined, `${name} must not bypass the reviewed policies`)
  assert.equal(readFileSync(new URL('.npmrc', root), 'utf8'), 'registry=https://registry.npmjs.org/\n')
})

test('pnpm environment lock and scoped compatibility overrides match the manifests', () => {
  const documents = parseAllDocuments(readFileSync(new URL('pnpm-lock.yaml', root), 'utf8'))
  assert.equal(documents.length, 2)
  for (const document of documents)
    assert.deepEqual(document.errors, [])
  const [environment, graph] = documents.map(document => document.toJS())
  const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'))
  const version = manifest.packageManager.slice('pnpm@'.length)
  assert.deepEqual(environment.importers['.'].packageManagerDependencies, {
    pnpm: { specifier: version, version },
  })
  const parents = [
    '@babel/core@7.29.7',
    '@babel/helper-compilation-targets@7.29.7',
    '@babel/helper-create-class-features-plugin@7.28.5',
    '@babel/helper-create-class-features-plugin@7.29.7',
  ]
  const overrides = Object.fromEntries(parents.map(parent => [`${parent}>semver`, '7.8.5']))
  assert.deepEqual(readYaml('pnpm-workspace.yaml').overrides, overrides)
  assert.deepEqual(graph.overrides, overrides)
  assert.deepEqual(readYaml('node_modules/.pnpm/lock.yaml').patchedDependencies, Object.fromEntries(
    Object.entries(graph.patchedDependencies).map(([name, patch]) => [name, patch.hash]),
  ))
  assert.equal(graph.packages['semver@6.3.1'], undefined)
  assert.equal(graph.snapshots['semver@6.3.1'], undefined)
  for (const parent of parents) {
    const entries = Object.entries(graph.snapshots).filter(([key]) => key === parent || key.startsWith(`${parent}(`))
    assert.ok(entries.length > 0, `Review the override when ${parent} leaves the graph`)
    for (const [, snapshot] of entries)
      assert.equal(snapshot.dependencies.semver, '7.8.5')
  }
})

test('source and consumer support gates reject runtime drift and bypasses', () => {
  for (const nodes of [[20, 22, 24], [22, 24], ['22.12.0', 24], ['22.22.3']]) {
    const workflow = structuredClone(ci)
    workflow.jobs.test.strategy.matrix.node = nodes
    assert.throws(() => assertSourceSupport(workflow))
  }
  const mutations = [
    action => action.runs.steps[0].with['node-version'] = '20',
    action => action.runs.steps[2].with['node-version'] = '22',
    action => action.runs.steps[1].id = 'wrong',
    action => action.runs.steps.reverse(),
    action => action.runs.steps[6].env.DESTYLER_CONSUMER_NODE = 'node',
    action => action.runs.steps[6].env.DESTYLER_CONSUMER_NODE_VERSION = '20.19.0',
    action => action.runs.steps[6].run = 'echo skipped',
    action => action.runs.steps[6]['continue-on-error'] = true,
    action => action.runs.steps[6].if = 'false',
  ]
  for (const mutate of mutations) {
    const action = structuredClone(consumerVerification)
    mutate(action)
    assert.throws(() => assertConsumerAction(action))
  }
})

function assertReleaseGate(workflow) {
  const { verify, 'supported-consumer': consumer, ...sideEffects } = workflow.jobs
  assertConsumerJob(consumer)
  assert.ok(verify, 'release needs a verification job')
  assertRequired(verify, 'verify')
  assert.deepEqual(verify.permissions, { contents: 'read' })
  assert.deepEqual(verify.strategy.matrix.node, ci.jobs.test.strategy.matrix.node)
  assert.ok(verify.steps.some(step => step.uses === verifyAction))
  for (const step of verify.steps) {
    assert.equal(step['continue-on-error'], undefined, `${step.name} must fail closed`)
    if (step.run !== 'pnpm run lint') {
      assertRequired(step, step.name)
    }
  }
  assert.ok(verify.steps.some(step => step.run === 'pnpm run lint' && step.if === 'matrix.node == 24'))

  for (const [id, job] of Object.entries(sideEffects)) {
    const needs = Array.isArray(job.needs) ? job.needs : [job.needs]
    assert.ok(needs.includes('verify'), `${id} must wait for verification`)
    assert.ok(needs.includes('supported-consumer'), `${id} must wait for Node 22.22.3 consumers`)
    assertRequired(job, id)
  }

  for (const [id, job] of Object.entries(workflow.jobs)) {
    const checkout = job.steps.find(step => step.uses?.startsWith('actions/checkout@'))
    assert.ok(checkout, `${id} must check out the release commit`)
    assert.equal(checkout.with.ref, '${{ github.sha }}', `${id} must use the triggering SHA`)
  }
  const checkout = verify.steps.find(step => step.uses?.startsWith('actions/checkout@'))
  assert.equal(checkout.with['persist-credentials'], false)
  assert.ok(!JSON.stringify(verify).includes('secrets.'), 'verification must not receive release secrets')
}

test('workflows have valid, acyclic job dependencies', () => {
  for (const [file, workflow] of Object.entries(workflows)) {
    function visit(id, ancestors = []) {
      assert.ok(workflow.jobs[id], `${file}: unknown job ${id}`)
      assert.ok(!ancestors.includes(id), `${file}: dependency cycle involving ${id}`)
      const { needs = [] } = workflow.jobs[id]
      for (const dependency of Array.isArray(needs) ? needs : [needs]) {
        visit(dependency, [...ancestors, id])
      }
    }
    for (const id of Object.keys(workflow.jobs)) {
      visit(id)
    }
  }
})

test('every release side effect requires verification of the exact triggering SHA', () => {
  assertReleaseGate(release)
})

test('npm publish builds the workspace graph and rejects degraded declarations first', () => {
  const steps = release.jobs.release.steps.map(step => step.run).filter(Boolean)
  const build = steps.indexOf('pnpm run --filter "./packages/**" -r build')
  const check = steps.indexOf('pnpm run check:declarations')
  const publish = steps.indexOf('pnpm run publish:ci')
  assert.ok(build !== -1 && check !== -1 && publish !== -1)
  assert.ok(build < check && check < publish)
  for (const run of ['pnpm run --filter "./packages/**" -r build', 'pnpm run check:declarations', 'pnpm run publish:ci']) {
    const step = release.jobs.release.steps.find(candidate => candidate.run === run)
    assertRequired(step, run)
    assert.equal(step.if, undefined)
  }
  assert.ok(ci.jobs.test.steps.some(step => step.uses === verifyAction))
  assert.ok(verification.runs.steps.some(step => step.run === 'pnpm run check:declarations' && step.shell === 'bash'))
})

test('production websites follow version tags only after both website builds pass', () => {
  assert.deepEqual(release.on, { push: { tags: ['v*'] } })
  const promotion = release.jobs['promote-websites']
  assert.deepEqual(promotion.needs, ['verify', 'supported-consumer', 'deploy'])
  assert.deepEqual(promotion.permissions, { contents: 'write' })
  assertRequired(promotion, 'Website promotion')
  assert.deepEqual(release.jobs.deploy.steps.map(step => step.run).filter(Boolean), [
    'pnpm install --frozen-lockfile',
    'pnpm run build',
    'pnpm run docs:build',
    'pnpm run storybook:build',
  ])
  const step = promotion.steps.find(step => step.uses === 'actions/github-script@v8')
  assert.ok(step, 'Use the repository-scoped, short-lived GitHub token')
  assert.ok(!JSON.stringify(promotion).includes('secrets.'))
  assert.ok(!JSON.stringify(release).includes('VERCEL_'))
})

test('website promotion updates only its dedicated branch without overwriting history', async () => {
  const script = release.jobs['promote-websites'].steps.find(step => step.uses === 'actions/github-script@v8').with.script
  const sha = 'a'.repeat(40)
  const repo = { owner: 'destyler', repo: 'destyler' }
  const ref = 'heads/vercel-production'

  async function run({ missing = false, current = 'b'.repeat(40), getError, updateError, eventName = 'push', triggerRef = 'refs/tags/v0.2.14' } = {}) {
    const calls = []
    const github = {
      rest: {
        git: {
          async getRef(args) {
            calls.push(['get', structuredClone(args)])
            if (getError)
              throw getError
            if (missing)
              throw Object.assign(new Error('Not found'), { status: 404 })
            return { data: { object: { sha: current } } }
          },
          async createRef(args) {
            calls.push(['create', structuredClone(args)])
          },
          async updateRef(args) {
            calls.push(['update', structuredClone(args)])
            if (updateError)
              throw updateError
          },
        },
      },
    }
    const result = runInNewContext(`(async () => {\n${script}\n})()`, {
      github,
      context: { eventName, ref: triggerRef, sha, repo },
      core: { info() {} },
    })
    return { calls, result }
  }

  const updated = await run()
  await updated.result
  assert.deepEqual(updated.calls, [
    ['get', { ...repo, ref }],
    ['update', { ...repo, ref, sha, force: false }],
  ])
  const created = await run({ missing: true })
  await created.result
  assert.deepEqual(created.calls, [
    ['get', { ...repo, ref }],
    ['create', { ...repo, ref: `refs/${ref}`, sha }],
  ])
  const unchanged = await run({ current: sha })
  await unchanged.result
  assert.deepEqual(unchanged.calls, [['get', { ...repo, ref }]])

  const unavailable = await run({ getError: Object.assign(new Error('Unavailable'), { status: 503 }) })
  await assert.rejects(unavailable.result, /Unavailable/)
  assert.deepEqual(unavailable.calls, [['get', { ...repo, ref }]])
  const olderRelease = await run({ updateError: Object.assign(new Error('Not a fast forward'), { status: 422 }) })
  await assert.rejects(olderRelease.result, /Not a fast forward/)
  assert.deepEqual(olderRelease.calls, updated.calls)
  for (const trigger of [{ triggerRef: 'refs/heads/main' }, { eventName: 'workflow_dispatch' }]) {
    const denied = await run(trigger)
    await assert.rejects(denied.result, /version tag push/)
    assert.deepEqual(denied.calls, [])
  }
})

test('release gates reject bypasses and moving-ref checkouts', () => {
  const mutations = [
    workflow => delete workflow.jobs.release.needs,
    workflow => workflow.jobs.release.needs = ['verify'],
    workflow => delete workflow.jobs['supported-consumer'],
    workflow => workflow.jobs['supported-consumer']['continue-on-error'] = true,
    workflow => workflow.jobs['supported-consumer'].steps[1].if = 'false',
    workflow => workflow.jobs.changelog.if = 'always()',
    workflow => workflow.jobs.deploy['continue-on-error'] = true,
    workflow => workflow.jobs.verify['continue-on-error'] = true,
    workflow => workflow.jobs.verify.permissions['id-token'] = 'write',
    workflow => workflow.jobs.verify.steps.find(step => step.uses === verifyAction).if = 'false',
    workflow => workflow.jobs.verify.steps.find(step => step.run === 'pnpm run lint')['continue-on-error'] = true,
    workflow => workflow.jobs.verify.steps[0].with.ref = 'main',
    workflow => workflow.jobs.release.steps[0].with.ref = '${{ github.ref }}',
    workflow => workflow.jobs.deploy.steps[0].with.ref = 'main',
  ]
  for (const mutate of mutations) {
    const workflow = structuredClone(release)
    mutate(workflow)
    assert.throws(() => assertReleaseGate(workflow))
  }
})

test('pull requests exercise the same non-publishing build and tests as releases', () => {
  assert.ok(ci.on.pull_request)
  assert.ok(ci.jobs.test.steps.some(step => step.uses === verifyAction))
  assert.equal(verification.runs.using, 'composite')
  assert.deepEqual(verification.runs.steps.map(step => step.run), [
    'pnpm run test:workflows',
    'node scripts/release-compatibility.mjs',
    'pnpm run build',
    'pnpm run check:declarations',
    'pnpm run docs:build && pnpm exec node scripts/test-docs-search.mjs',
    'pnpm exec node scripts/test-docs-browser.mjs',
    'pnpm exec node scripts/test-node-modules-inspector.mjs',
    'pnpm run storybook:build && pnpm exec node scripts/test-storybook-browser.mjs',
    'pnpm run test:types',
    'pnpm exec node scripts/test-svelte-package.mjs',
    'pnpm exec node scripts/test-package-entries.mjs',
    'pnpm run test',
  ])
  for (const step of verification.runs.steps) {
    assertRequired(step, step.name)
    assert.equal(step.shell, 'bash')
  }
})

test('CI and release install workspace dependencies from the frozen lockfile', () => {
  let installs = 0
  for (const workflow of Object.values(workflows)) {
    for (const job of Object.values(workflow.jobs)) {
      for (const step of job.steps ?? []) {
        if (/\bpnpm install\b/.test(step.run ?? '')) {
          assert.equal(step.run, 'pnpm install --frozen-lockfile')
          installs++
        }
      }
    }
  }
  assert.ok(installs > 0)
})

test('PR metadata edits rerun the read-only declared-break communication gate', () => {
  const workflow = workflows['release-communication.yml']
  assert.deepEqual(workflow.on.pull_request.types, ['opened', 'synchronize', 'reopened', 'edited', 'ready_for_review'])
  assert.deepEqual(workflow.permissions, { contents: 'read' })
  const job = workflow.jobs.communication
  assertRequired(job, 'Declared-break communication')
  const [checkout, setup, check] = job.steps
  assert.equal(checkout.uses, 'actions/checkout@v6')
  assert.equal(checkout.with['fetch-depth'], 0)
  assert.equal(checkout.with['persist-credentials'], false)
  assert.equal(setup.with['node-version'], 24)
  assert.equal(check.run, 'node scripts/release-compatibility.mjs')
  for (const step of job.steps)
    assertRequired(step, step.name)
  assert.ok(!JSON.stringify(workflow).includes('pull_request_target'))
  assert.ok(!JSON.stringify(workflow).includes('secrets.'))
  assert.ok(!JSON.stringify(check).includes('${{'))
  const config = readFileSync(new URL('changelogithub.config.mjs', root), 'utf8')
  assert.match(config, /import \{ changelogConfig \} from '\.\/scripts\/release-compatibility\.mjs'/)
  assert.match(config, /export default changelogConfig\(\)/)
  assert.ok(release.jobs.changelog.steps.some(step => step.run === 'npx changelogithub'))
})
