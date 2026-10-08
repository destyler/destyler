import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import { createMachine } from '@destyler/xstate'
import { render } from 'svelte/server'
import { compileLifecycle } from '../helpers/compile-lifecycle.mjs'

let component, cleanup
before(async () => {
  ({ component, cleanup } = await compileLifecycle('server'))
})
after(() => cleanup())

function machine() {
  const log = []
  const service = createMachine({
    initial: 'idle',
    context: { value: 0 },
    created: 'created',
    entry: () => log.push('entry'),
    exit: () => log.push('exit'),
    activities: [() => {
      log.push('activity')
      return () => log.push('cleanup')
    }],
    states: { idle: {} },
  }, {
    actions: {
      created: (ctx) => {
        log.push(`created:${ctx.value}`)
        ctx.value++
      },
    },
  })
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
  return { service, log, listeners: () => listeners }
}

test('SSR runs created actions with initial context without starting or stopping the service', () => {
  const { service, log, listeners } = machine()
  let calls = 0
  const { body } = render(component, {
    props: {
      machine: () => {
        calls++
        return service
      },
      initialOptions: { context: { value: 6 } },
      expose() {},
    },
  })
  assert.match(body, /idle:7/)
  assert.deepEqual(log, ['created:6'])
  assert.equal(calls, 1)
  assert.equal(service.status, 'Not Started')
  assert.equal(listeners(), 0)
})

test('SSR actor reads clean up their subscriptions without owning the running service', () => {
  const { service, log, listeners } = machine()
  service.start()
  try {
    for (let index = 0; index < 3; index++) {
      const { body } = render(component, {
        props: {
          machine: service,
          actor: true,
          expose(api) {
            assert.equal(api.state.matches('idle'), true)
          },
        },
      })
      assert.match(body, /idle:0/)
      assert.equal(listeners(), 0)
      assert.equal(service.status, 'Running')
    }
    assert.deepEqual(log, ['activity', 'entry'])
  }
  finally {
    service.stop()
  }
})
