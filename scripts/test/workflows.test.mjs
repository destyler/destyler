/* eslint-disable no-template-curly-in-string -- GitHub expressions are intentionally literal. */
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Check CI independently of the browser test configuration.
import { test } from 'node:test'
import { parseDocument } from 'yaml'

const root = new URL('../../', import.meta.url)
const verifyAction = './.github/actions/verify'
const consumerAction = './.github/actions/verify-node20-consumers'
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
const consumerVerification = readYaml('.github/actions/verify-node20-consumers/action.yml')

function assertRequired(job, label) {
  assert.equal(job.if, undefined, `${label} must use the default success condition`)
  assert.equal(job['continue-on-error'], undefined, `${label} must fail closed`)
}

function assertConsumerJob(job) {
  assert.ok(job, 'Node 20 consumers must have an independent job')
  assertRequired(job, 'Node 20 consumers')
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
  assert.equal(steps[0].with['node-version'], '20.19.0')
  assert.equal(steps[1].id, 'consumer')
  assert.equal(steps[2].with['node-version'], '22.22.3')
  assert.deepEqual(steps[6].env, {
    DESTYLER_CONSUMER_NODE: '${{ steps.consumer.outputs.node }}',
    DESTYLER_CONSUMER_NPM: '${{ steps.consumer.outputs.npm }}',
    DESTYLER_CONSUMER_NODE_VERSION: '20.19.0',
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
    assert.equal(manifest.packageManager, name === 'package.json' ? 'pnpm@10.26.1' : 'pnpm@10.13.1')
  }
  for (const workflow of [ci, release]) {
    assertSourceSupport(workflow)
    assertConsumerJob(workflow.jobs['node20-consumer'])
  }
  const svelteSetup = workflows['svelte-package.yml'].jobs['packed-consumer'].steps.find(step => step.uses?.startsWith('actions/setup-node@'))
  assert.equal(svelteSetup.with['node-version'], '22.22.3')
  const report = ci.jobs.test.steps.find(step => step.uses?.startsWith('davelosert/vitest-coverage-report-action@'))
  assert.equal(report.if, 'always() && matrix.node == 24')
  assertConsumerAction(consumerVerification)
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
    action => action.runs.steps[6].env.DESTYLER_CONSUMER_NODE_VERSION = '22.22.3',
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
  const { verify, 'node20-consumer': consumer, ...sideEffects } = workflow.jobs
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
    assert.ok(needs.includes('node20-consumer'), `${id} must wait for Node 20 consumers`)
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

test('release gates reject bypasses and moving-ref checkouts', () => {
  const mutations = [
    workflow => delete workflow.jobs.release.needs,
    workflow => workflow.jobs.release.needs = ['verify'],
    workflow => delete workflow.jobs['node20-consumer'],
    workflow => workflow.jobs['node20-consumer']['continue-on-error'] = true,
    workflow => workflow.jobs['node20-consumer'].steps[1].if = 'false',
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
    'pnpm run build',
    'pnpm run docs:build && pnpm exec node scripts/test-docs-search.mjs',
    'pnpm exec node scripts/test-docs-browser.mjs',
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
