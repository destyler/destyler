import assert from 'node:assert/strict'
import { after, afterEach, before, test } from 'node:test'
import { createMachine } from '@destyler/xstate'
import { Window } from 'happy-dom'
import { compileLifecycle } from '../helpers/compile-lifecycle.mjs'

const window = new Window()
for (const name of ['window', 'document', 'Element', 'HTMLElement', 'SVGElement', 'Node', 'Text', 'Comment', 'Document', 'DocumentFragment', 'Event', 'CustomEvent', 'MutationObserver']) {
  globalThis[name] = name === 'window' ? window : window[name]
}
// Always use the DOM navigator; Node 20 has none and newer Node versions expose a getter.
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: window.navigator })
let flushSync, mount, tick, unmount, component, cleanup
before(async () => {
  ({ flushSync, mount, tick, unmount } = await import('svelte'))
  ;({ component, cleanup } = await compileLifecycle('client'))
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

function machine(options = {}) {
  const log = []
  const service = createMachine({
    initial: 'idle',
    context: { value: 0, details: { count: 0 } },
    created: 'created',
    entry: 'entry',
    exit: 'exit',
    activities: ['track'],
    on: { INCREMENT: { actions: 'increment' }, REPORT: { actions: 'report' } },
    states: { idle: {}, active: {} },
  }, {
    actions: {
      created: ctx => log.push(`created:${ctx.value}`),
      entry: ctx => log.push(`entry:${ctx.value}`),
      exit: () => log.push('exit'),
      increment: ctx => ctx.value++,
      report: ctx => log.push(`report:${ctx.value}`),
    },
    activities: {
      track: () => {
        log.push('activity')
        return () => log.push('cleanup')
      },
    },
    ...options,
  })
  services.add(service)
  return { service, log }
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

test('created actions run during initialization; entry/activity wait for mount and clean up on unmount', async () => {
  const { service, log } = machine()
  let calls = 0
  const view = render(() => {
    calls++
    return service
  }, { context: { value: 2 }, state: 'active' })
  assert.equal(calls, 1)
  assert.deepEqual(log, ['created:2'])
  assert.equal(service.status, 'Not Started')
  await settle()
  assert.equal(service.status, 'Running')
  assert.equal(view.target.textContent, 'active:2')
  assert.deepEqual(log, ['created:2', 'activity', 'entry:2'])
  view.api.send('INCREMENT')
  await settle()
  assert.equal(view.target.textContent, 'active:3')
  assert.equal(view.api.state.matches('active'), true)
  await view.destroy()
  assert.equal(service.status, 'Stopped')
  assert.deepEqual(log, ['created:2', 'activity', 'entry:2', 'exit', 'cleanup'])
})

test('reactive context and action updates do not recreate or restart the service', async () => {
  const { service, log } = machine()
  let calls = 0
  const view = render(() => {
    calls++
    return service
  })
  await settle()
  view.api.setContext({ value: 7 })
  view.api.setActions({ report: ctx => log.push(`updated:${ctx.value}`) })
  await settle()
  assert.equal(view.target.textContent, 'idle:7')
  view.api.send('REPORT')
  assert.equal(log.at(-1), 'updated:7')
  assert.equal(calls, 1)
  assert.equal(log.filter(value => value.startsWith('created:')).length, 1)
  assert.equal(log.filter(value => value.startsWith('entry:')).length, 1)
  assert.equal(log.filter(value => value === 'activity').length, 1)
})

test('actor subscriptions update the view and unmount without stopping an externally owned actor', async () => {
  const { service, log } = machine()
  service.start()
  const subscribe = service.subscribe
  let listeners = 0
  service.subscribe = (listener) => {
    listeners++
    const unsubscribe = subscribe(listener)
    return () => {
      listeners--
      unsubscribe()
    }
  }
  const first = render(service, {}, true)
  const second = render(service, {}, true)
  await settle()
  assert.equal(listeners, 2)
  assert.equal(first.api.state.matches('idle'), true)
  first.api.send('INCREMENT')
  await settle()
  assert.equal(first.target.textContent, 'idle:1')
  assert.equal(second.target.textContent, 'idle:1')
  const previousContext = first.api.state.context
  const previousDetails = first.api.state.context.details
  service.state.context.details = { count: 7 }
  await settle()
  assert.notEqual(first.api.state.context, previousContext)
  assert.notEqual(first.api.state.context.details, previousDetails)
  assert.equal(first.api.state.context.details.count, 7)
  assert.equal(second.api.state.context.details.count, 7)
  assert.equal(previousDetails.count, 0)
  await first.destroy()
  assert.equal(listeners, 1)
  assert.equal(service.status, 'Running')
  second.api.send('INCREMENT')
  await settle()
  assert.equal(second.target.textContent, 'idle:2')
  await second.destroy()
  assert.equal(listeners, 0)
  assert.equal(service.status, 'Running')
  assert.deepEqual(log, ['activity', 'entry:0'])
})

test('an actor subscribed before start observes startup and later updates without taking ownership', async () => {
  const { service, log } = machine()
  const view = render(service, {}, true)
  await settle()
  assert.equal(service.status, 'Not Started')
  assert.equal(view.target.textContent, 'idle:0')
  assert.deepEqual(log, [])
  service.start('active')
  await settle()
  assert.equal(view.target.textContent, 'active:0')
  service.setContext({ value: 9 })
  await settle()
  assert.equal(view.target.textContent, 'active:9')
  assert.equal(view.api.state.matches('active'), true)
  await view.destroy()
  assert.equal(service.status, 'Running')
  assert.deepEqual(log, ['activity', 'entry:0'])
})

test('controlled requests remain deferred until reactive owner acceptance', async () => {
  const requests = []
  const service = createMachine({
    initial: 'idle',
    context: { value: 2, onChange: value => requests.push(value) },
    on: { REQUEST: { actions: 'request' } },
    states: { idle: {} },
  }, { actions: { request: (ctx, event) => ctx.onChange(event.value) } })
  services.add(service)
  const view = render(service, { context: { value: 2 } })
  await settle()
  view.api.send({ type: 'REQUEST', value: 5 })
  await settle()
  assert.deepEqual(requests, [5])
  assert.equal(service.state.context.value, 2)
  assert.equal(view.target.textContent, 'idle:2')
  view.api.setContext({ value: 5 })
  await settle()
  assert.equal(view.target.textContent, 'idle:5')
  assert.deepEqual(requests, [5])
  view.api.send({ type: 'REQUEST', value: 8 })
  await settle()
  assert.equal(view.target.textContent, 'idle:5')
  assert.deepEqual(requests, [5, 8])
  await view.destroy()
  view.api.setContext({ value: 8 })
  await settle()
  assert.equal(service.state.context.value, 5)
})
