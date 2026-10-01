/* eslint-disable no-template-curly-in-string -- GitHub expressions are intentionally literal. */
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
// eslint-disable-next-line test/no-import-node-test -- Check CI independently of the browser test configuration.
import { test } from 'node:test'
import { parseDocument } from 'yaml'

const root = new URL('../../', import.meta.url)
const verifyAction = './.github/actions/verify'

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

function assertRequired(job, label) {
  assert.equal(job.if, undefined, `${label} must use the default success condition`)
  assert.equal(job['continue-on-error'], undefined, `${label} must fail closed`)
}

function assertReleaseGate(workflow) {
  const { verify, ...sideEffects } = workflow.jobs
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
    'pnpm run test:types',
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
