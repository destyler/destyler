import { createNormalizer } from '@destyler/types'
import { createMachine } from '@destyler/xstate'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { connect, machine } from '../index'

const normalize = createNormalizer(props => props)
const services: ReturnType<typeof machine>[] = []
const hosts: Element[] = []
beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  services.splice(0).reverse().forEach(service => service.stop())
  // Public CLOSE also resets ownership on the original implementation.
  const reset = machine({ id: 'public-reset', defaultOpen: true }).start()
  reset.send('CLOSE')
  reset.stop()
  hosts.splice(0).reverse().forEach(host => host.remove())
  vi.restoreAllMocks()
  vi.clearAllTimers()
  vi.useRealTimers()
})

function prepare(id: string, open = true, controlled = false) {
  const service = machine({ id, ...(controlled ? { open } : { defaultOpen: open }), openDelay: 40 })
  services.push(service)
  const api = () => connect(service.getState(), service.send, normalize)
  const host = document.createElement('div')
  hosts.push(host)
  for (const props of [api().getTriggerProps(), api().getPositionerProps(), api().getContentProps()]) {
    const el = document.createElement('div')
    el.id = props.id!
    host.append(el)
  }
  document.body.append(host)
  return {
    service,
    host,
    api,
    start() {
      service.start()
      return this
    },
  }
}

function expectWarm(expected: boolean) {
  const probe = prepare('public-probe', false).start()
  probe.service.send('POINTER_MOVE')
  expect(probe.api().open).toBe(expected)
  probe.service.send('CLOSE')
  probe.service.stop()
}
for (const controlled of [false, true]) {
  for (const oldOpen of [false, true]) {
    it(`public package sequential-DOM replacement controlled=${controlled} oldOpen=${oldOpen}`, () => {
      const old = prepare('replacement', oldOpen, controlled).start()
      old.host.remove()
      const newer = prepare('replacement', true, controlled).start()
      expect(document.querySelectorAll('[id="tooltip:replacement:trigger"]')).toHaveLength(1)
      old.service.stop()
      expect(newer.api().open).toBe(true)
      expectWarm(true)
    })
  }
}

it('public newer-first release does not restore the old owner', () => {
  const old = prepare('replacement').start()
  old.host.remove()
  const next = prepare('replacement').start()
  next.service.stop()
  old.service.stop()
  expectWarm(false)
})

it('public sequential stop then replacement preserves ordinary ownership', () => {
  const old = prepare('replacement').start()
  old.service.stop()
  expectWarm(false)
  old.host.remove()
  prepare('replacement').start()
  old.service.stop()
  expectWarm(true)
})

it('public no-op setGlobalId override acquires no replacement ownership', () => {
  const old = prepare('replacement').start()
  old.host.remove()
  const next = prepare('replacement')
  next.service.setOptions({ actions: { setGlobalId: () => {} } })
  next.start()
  next.service.stop()
  expectWarm(true)
})

it('public default-delegating action keeps bare receiver and live context', () => {
  const old = prepare('replacement').start()
  old.host.remove()
  const next = prepare('replacement')
  const original = next.service.options.actions!.setGlobalId
  const observations: unknown[] = []
  next.service.setOptions({ actions: { setGlobalId(this: unknown, ctx, event, meta) {
    observations.push([this, ctx === next.service.state.context])
    original(ctx, event, meta)
  } } })
  next.start()
  expect(observations).toEqual([[undefined, true]])
  old.service.stop()
  expectWarm(true)
})

it('public configuration reconstruction keeps distinct actor contexts', () => {
  const old = prepare('replacement').start()
  old.host.remove()
  const newer = createMachine({ ...old.service.config, context: { ...old.service.config.context! } }, old.service.options)
  services.push(newer)
  expect(newer.state.context).not.toBe(old.service.state.context)
  expect(newer.options.actions!.setGlobalId).toBe(old.service.options.actions!.setGlobalId)
  newer.start()
  old.service.stop()
  expectWarm(true)
})

it('public synchronous nested acquisition remains owned by the newer actor', () => {
  const old = prepare('replacement')
  const original = old.service.options.actions!.setGlobalId
  old.service.setOptions({ actions: { setGlobalId(ctx, event, meta) {
    original(ctx, event, meta)
    old.host.remove()
    prepare('replacement').start()
  } } })
  old.start()
  old.service.stop()
  expectWarm(true)
})

it('stop before start cannot release an already running replacement', () => {
  const dormant = prepare('replacement', false)
  dormant.host.remove()
  prepare('replacement').start()
  dormant.service.stop()
  expectWarm(true)
})

it('ordinary running CLOSE retains its existing public-ID policy', () => {
  const old = prepare('replacement').start()
  old.host.remove()
  const next = prepare('replacement').start()
  old.service.send('CLOSE')
  expect(next.api().open).toBe(true)
  expectWarm(false)
})

it('ordinary different-ID CLOSE preserves the current visible owner', () => {
  const old = prepare('old').start()
  prepare('newer').start()
  old.service.send('CLOSE')
  expectWarm(true)
})

it('a controlled open veto and stop do not acquire or release another owner', () => {
  prepare('visible').start()
  const pending = prepare('controlled', false, true)
  const change = vi.fn()
  pending.service.setContext({ onOpenChange: change })
  pending.start()
  pending.service.send('OPEN')
  expect(pending.api().open).toBe(false)
  expect(change).toHaveBeenCalledExactlyOnceWith({ open: true })
  pending.service.stop()
  expectWarm(true)
})

it('delayed controlled acceptance acquires ownership and a vetoed close stays parent-owned', async () => {
  const older = prepare('old-visible').start()
  const controlled = prepare('controlled', false, true)
  const change = vi.fn()
  controlled.service.setContext({ onOpenChange: change })
  controlled.start()
  controlled.service.send('OPEN')
  await vi.advanceTimersByTimeAsync(0)
  expect(controlled.api().open).toBe(false)
  controlled.service.setContext({ open: true })
  await vi.advanceTimersByTimeAsync(0)
  expect(controlled.api().open).toBe(true)
  older.service.stop()
  controlled.service.send('CLOSE')
  expect(controlled.api().open).toBe(true)
  expect(change.mock.calls).toEqual([[{ open: true }], [{ open: false }]])
  controlled.service.stop()
  expectWarm(false)
})

it('a throwing setGlobalId override before delegation acquires nothing', () => {
  const older = prepare('replacement').start()
  older.host.remove()
  const failed = prepare('replacement')
  const error = new Error('set override')
  failed.service.setOptions({ actions: { setGlobalId: () => {
    throw error
  } } })
  expectThrown(() => failed.start(), error)
  failed.service.stop()
  expectWarm(true)
})

it('delegation before a throwing setGlobalId override keeps the new acquisition', () => {
  const older = prepare('replacement').start()
  older.host.remove()
  const next = prepare('replacement')
  const error = new Error('after delegation')
  const original = next.service.options.actions!.setGlobalId
  next.service.setOptions({ actions: { setGlobalId: (ctx, event, meta) => {
    original(ctx, event, meta)
    throw error
  } } })
  expectThrown(() => next.start(), error)
  older.service.stop()
  expectWarm(true)
})

it('a throwing clearGlobalId override keeps its exception and existing authority', () => {
  const service = prepare('throw-clear').service
  const original = service.options.actions!.clearGlobalId
  const error = new Error('clear override')
  const clear = vi.fn(() => {
    throw error
  })
  service.setOptions({ actions: { clearGlobalId: clear } })
  service.start()
  let caught: unknown
  try {
    service.stop()
  }
  catch (value) {
    caught = value
  }
  finally {
    service.setOptions({ actions: { clearGlobalId: original } })
  }
  expect(caught).toBe(error)
  expect(clear).toHaveBeenCalledTimes(1)
  expectWarm(true)
})

it('a no-op clearGlobalId override retains its receiver, stop metadata and ignored return', () => {
  const instance = prepare('noop-clear')
  const returned = vi.fn()
  const observed: unknown[] = []
  instance.service.setOptions({ actions: { clearGlobalId(this: unknown, ctx, event, meta) {
    observed.push([this, ctx === instance.service.state.context, event.type, meta.state.value])
    return returned
  } } })
  instance.start()
  instance.service.stop()
  instance.service.stop()
  expect(observed).toEqual([[undefined, true, 'machine.stop', 'open']])
  expect(returned).not.toHaveBeenCalled()
  expectWarm(true)
})

it('default-delegating setGlobalId still ignores a function-valued action return', () => {
  const instance = prepare('returned-action')
  const original = instance.service.options.actions!.setGlobalId
  const returned = vi.fn()
  instance.service.setOptions({ actions: { setGlobalId: (ctx, event, meta) => {
    original(ctx, event, meta)
    return returned
  } } })
  instance.start()
  instance.service.stop()
  expect(returned).not.toHaveBeenCalled()
  expectWarm(false)
})

function expectThrown(run: () => unknown, error: Error) {
  let caught: unknown
  try {
    run()
  }
  catch (value) {
    caught = value
  }
  expect(caught).toBe(error)
}
