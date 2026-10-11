import assert from 'node:assert/strict'
import { after, afterEach, before, test } from 'node:test'
import { createMachine } from '@destyler/xstate'
import { Window } from 'happy-dom'
import { compileActionOptions } from '../helpers/compile-action-options.mjs'

const window = new Window()
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: window.navigator })
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node', 'Text', 'Comment', 'Document', 'DocumentFragment', 'Event', 'CustomEvent', 'MutationObserver']) {
  globalThis[name] = name === 'window' ? window : window[name]
}
let flushSync, mount, tick, unmount, component, cleanup
before(async () => {
  ({ flushSync, mount, tick, unmount } = await import('svelte'))
  ;({ component, cleanup } = await compileActionOptions('client'))
})
const mounted = new Set()
const services = new Set()

async function settle() {
  await Promise.resolve()
  flushSync()
  await tick()
}

function render(machine, initialOptions = {}, actor = false) {
  const target = document.createElement('div')
  document.body.append(target)
  let api
  const instance = mount(component, {
    target,
    props: { machine, initialOptions, actor, expose: value => api = value },
  })
  mounted.add(instance)
  return {
    target,
    get api() { return api },
    async destroy() {
      await unmount(instance)
      mounted.delete(instance)
      target.remove()
    },
  }
}

function machine() {
  const calls = []
  const service = createMachine({
    initial: 'idle',
    context: { value: 0 },
    created: 'created',
    entry: 'entry',
    on: { REPORT: { actions: 'report' } },
    states: { idle: {}, active: { entry: 'active' } },
  }, {
    actions: {
      created: ctx => calls.push(`default-created:${ctx.value}`),
      entry: ctx => calls.push(`default-entry:${ctx.value}`),
      active: ctx => calls.push(`default-active:${ctx.value}`),
      report: ctx => calls.push(`default-report:${ctx.value}`),
    },
  })
  services.add(service)
  return { service, calls }
}

afterEach(async () => {
  for (const instance of mounted) await unmount(instance)
  mounted.clear()
  for (const service of services) service.stop()
  services.clear()
  document.body.replaceChildren()
})

after(async () => {
  await cleanup()
  await window.happyDOM.close()
})

test('initial overrides run created with initial context, then entry and hydrated-state actions on mount', async () => {
  const { service, calls } = machine()
  const created = ctx => calls.push(`override-created:${ctx.value}`)
  const entry = ctx => calls.push(`override-entry:${ctx.value}`)
  const actions = Object.freeze({ created, entry })
  const context = Object.freeze({ value: 6 })
  const state = Object.freeze({ value: 'active', context: Object.freeze({ value: 9 }) })
  const options = Object.freeze({ actions, context, state })
  const original = Object.getOwnPropertyDescriptors(options)
  const view = render(service, options)

  assert.deepEqual(calls, ['override-created:6'])
  assert.equal(service.status, 'Not Started')
  assert.equal(service.actionMap.created, created)
  assert.equal(service.actionMap.entry, entry)
  await settle()

  assert.deepEqual(calls, ['override-created:6', 'override-entry:6', 'default-active:9'])
  assert.equal(view.target.textContent, 'active:9')
  assert.equal(service.status, 'Running')
  view.api.send('REPORT')
  assert.equal(calls.at(-1), 'default-report:9')
  assert.equal(service.actionMap.created, created)
  assert.equal(service.actionMap.entry, entry)
  assert.deepEqual(Object.getOwnPropertyDescriptors(options), original)
  assert.deepEqual(actions, { created, entry })
  assert.deepEqual(context, { value: 6 })
  assert.deepEqual(state, { value: 'active', context: { value: 9 } })
})

test('absent and empty action overrides preserve machine defaults', async () => {
  for (const actions of [undefined, {}]) {
    const { service, calls } = machine()
    const defaults = { ...service.actionMap }
    const view = render(service, { actions, context: { value: 3 } })
    assert.deepEqual(calls, ['default-created:3'])
    await settle()
    view.api.send('REPORT')
    assert.deepEqual(calls, ['default-created:3', 'default-entry:3', 'default-report:3'])
    assert.deepEqual(service.actionMap, defaults)
    await view.destroy()
  }
})

test('reactive action replacement keeps function identity without recreating or restarting the machine', async () => {
  const { service, calls } = machine()
  const created = ctx => calls.push(`override-created:${ctx.value}`)
  const firstReport = ctx => calls.push(`first-report:${ctx.value}`)
  const actions = Object.freeze({ created, report: firstReport })
  let factories = 0
  let starts = 0
  const start = service.start
  service.start = (...args) => {
    starts++
    return start(...args)
  }
  const view = render(() => {
    factories++
    return service
  }, { actions })
  await settle()
  view.api.send('REPORT')
  const nextReport = ctx => calls.push(`next-report:${ctx.value}`)
  const replacement = Object.freeze({ report: nextReport })
  view.api.setActions(replacement)
  view.api.setContext({ value: 7 })
  await settle()
  view.api.send('REPORT')

  assert.deepEqual(calls, ['override-created:0', 'default-entry:0', 'first-report:0', 'next-report:7'])
  assert.equal(view.api.service, service)
  assert.equal(service.actionMap.created, created)
  assert.equal(service.actionMap.report, nextReport)
  assert.equal(factories, 1)
  assert.equal(starts, 1)
  assert.deepEqual(actions, { created, report: firstReport })
  assert.deepEqual(replacement, { report: nextReport })
})

test('an action override proposes a controlled value until the owner accepts it', async () => {
  const proposals = []
  const service = createMachine({
    initial: 'idle',
    context: { value: 2, onChange: value => proposals.push(value) },
    on: { REQUEST: { actions: 'request' } },
    states: { idle: {} },
  }, { actions: { request: (ctx, event) => ctx.value = event.value } })
  services.add(service)
  const request = (ctx, event) => ctx.onChange(event.value)
  const view = render(service, { context: { value: 2 }, actions: { request } })
  await settle()
  view.api.send({ type: 'REQUEST', value: 5 })
  await settle()
  assert.deepEqual(proposals, [5])
  assert.equal(service.actionMap.request, request)
  assert.equal(service.state.context.value, 2)
  assert.equal(view.target.textContent, 'idle:2')
  view.api.setContext({ value: 5 })
  await settle()
  assert.equal(view.target.textContent, 'idle:5')
  assert.deepEqual(proposals, [5])
})

test('useActor preserves caller-owned action maps and started or unstarted status', async () => {
  for (const running of [false, true]) {
    const { service, calls } = machine()
    if (running)
      service.start()
    const actionMap = service.actionMap
    const defaults = { ...actionMap }
    const status = service.status
    const before = [...calls]
    const view = render(service, {}, true)
    await settle()
    assert.equal(service.actionMap, actionMap)
    assert.deepEqual(service.actionMap, defaults)
    assert.equal(service.status, status)
    assert.deepEqual(calls, before)
    await view.destroy()
    assert.equal(service.actionMap, actionMap)
    assert.equal(service.status, status)
    assert.deepEqual(calls, before)
  }
})
