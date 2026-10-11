import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createMachine } from '@destyler/xstate'
import { render } from 'svelte/server'
import { compileActionOptions } from '../helpers/compile-action-options.mjs'

let component, cleanup
before(async () => {
  ({ component, cleanup } = await compileActionOptions('server'))
})
after(() => cleanup())

test('SSR installs initial action overrides before created without starting the machine', () => {
  const calls = []
  const service = createMachine({
    initial: 'idle',
    context: { value: 0 },
    created: 'created',
    entry: 'entry',
    states: { idle: {}, active: { entry: 'active' } },
  }, {
    actions: {
      created: () => calls.push('default-created'),
      entry: () => calls.push('default-entry'),
      active: () => calls.push('active-entry'),
    },
  })
  const defaults = { ...service.actionMap }
  const created = (ctx) => {
    calls.push(`override-created:${ctx.value}`)
    ctx.value++
  }
  const entry = () => calls.push('override-entry')
  const actions = Object.freeze({ created, entry })
  const context = Object.freeze({ value: 6 })
  const options = Object.freeze({ actions, context, state: 'active' })
  const original = Object.getOwnPropertyDescriptors(options)
  let factories = 0
  let starts = 0
  const start = service.start
  service.start = (...args) => {
    starts++
    return start(...args)
  }
  const { body } = render(component, {
    props: {
      machine: () => {
        factories++
        return service
      },
      initialOptions: options,
      expose() {},
    },
  })

  assert.deepEqual(calls, ['override-created:6'])
  assert.match(body, /idle:7/)
  assert.equal(service.status, 'Not Started')
  assert.equal(starts, 0)
  assert.equal(factories, 1)
  assert.equal(service.actionMap.created, created)
  assert.equal(service.actionMap.entry, entry)
  assert.equal(service.actionMap.active, defaults.active)
  assert.deepEqual(Object.getOwnPropertyDescriptors(options), original)
  assert.deepEqual(actions, { created, entry })
  assert.deepEqual(context, { value: 6 })
})

test('SSR without action overrides retains created defaults and does not run entry', () => {
  const calls = []
  const created = ctx => calls.push(`default-created:${ctx.value}`)
  const entry = () => calls.push('entry')
  const service = createMachine({
    initial: 'idle',
    context: { value: 0 },
    created: 'created',
    entry: 'entry',
    states: { idle: {} },
  }, { actions: { created, entry } })
  const { body } = render(component, {
    props: { machine: service, initialOptions: { context: { value: 4 } }, expose() {} },
  })
  assert.deepEqual(calls, ['default-created:4'])
  assert.match(body, /idle:4/)
  assert.equal(service.actionMap.created, created)
  assert.equal(service.actionMap.entry, entry)
  assert.equal(service.status, 'Not Started')
})
