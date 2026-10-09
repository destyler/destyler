import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createMachine } from '@destyler/xstate'
import { Window } from 'happy-dom'
import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'
import { render } from 'solid-js/web'
import { actionOptionsConfig } from '../../../test/action-options.ts'
import { useActor } from '../../src/hooks/use-actor.ts'
import { useMachine } from '../../src/hooks/use-machine.ts'

function actionOptionsFixture() {
  const fixture = actionOptionsConfig()
  return { ...fixture, service: createMachine(fixture.config, { actions: fixture.defaultActions }) }
}

const window = new Window()
Object.defineProperty(globalThis, 'navigator', { configurable: true, value: window.navigator })
Object.assign(globalThis, { window, document: window.document })
after(() => window.happyDOM.close())

for (const source of ['instance', 'factory']) {
  test(`initializes ${source} actions before created and hydrated entry`, () => {
    const { service, calls, actions, defaultActions } = actionOptionsFixture()
    let factories = 0
    const factory = () => {
      factories++
      return service
    }
    const options = Object.freeze({ actions, context: () => ({ value: 2 }), state: { value: 'hydrated', context: { ...service.contextSnapshot, value: 7 } } })
    const dispose = render(() => {
      const [, , current] = useMachine(source === 'factory' ? factory : service, options)
      assert.equal(current, service)
      return null
    }, document.createElement('div'))
    try {
      assert.deepEqual(calls, ['created:2', 'entry:2', 'hydrated:7'])
      assert.equal(service.state.value, 'hydrated')
      assert.equal(service.options.actions.created, defaultActions.created)
      assert.equal(options.actions.created, actions.created)
      assert.equal(factories, source === 'factory' ? 1 : 0)
    }
    finally {
      dispose()
      assert.equal(service.status, 'Stopped')
    }
  })
}

test('preserves default actions and later reactive overrides without recreation or restart', () => {
  const { service, calls, requests, actions } = actionOptionsFixture()
  let factories = 0
  let reports = 0
  let setContext, setActions
  const dispose = render(() => {
    const [context, updateContext] = createSignal({ value: 0 })
    const [actionMap, updateActions] = createStore({ report: actions.report, request: actions.request })
    setContext = updateContext
    setActions = updateActions
    useMachine(() => {
      factories++
      return service
    }, { context, actions: actionMap })
    return null
  }, document.createElement('div'))
  try {
    assert.deepEqual(calls, ['default created:0', 'default entry:0'])
    setActions('report', () => () => reports++)
    service.send('REPORT')
    service.send('REQUEST')
    assert.equal(reports, 1)
    assert.deepEqual(requests, [1])
    assert.equal(service.contextSnapshot.value, 0)
    setContext({ value: 1 })
    assert.equal(service.contextSnapshot.value, 1)
    assert.equal(factories, 1)
    assert.deepEqual(calls, ['default created:0', 'default entry:0'])
  }
  finally {
    dispose()
  }
})

test('leaves externally owned actor actions and lifecycle intact', () => {
  const { service, calls } = actionOptionsFixture()
  let reports = 0
  service.setOptions({ actions: { report: () => reports++ } })
  service.start()
  const dispose = render(() => {
    useActor(service)
    return null
  }, document.createElement('div'))
  try {
    dispose()
    service.send('REPORT')
    assert.equal(reports, 1)
    assert.deepEqual(calls, ['default entry:0'])
    assert.equal(service.status, 'Running')
  }
  finally {
    service.stop()
  }
})
