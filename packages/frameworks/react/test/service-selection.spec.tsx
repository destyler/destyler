import { createMachine } from '@destyler/xstate'
import { act, createElement, StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { useSelector, useService } from '../index'

// @ts-expect-error - React testing flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe.each([false, true])('selector-only service ownership (strict: %s)', (strict) => {
  it('synchronizes live context and actions without a full-snapshot hook', async () => {
    const first = vi.fn()
    const second = vi.fn()
    const service = createMachine({
      initial: 'idle',
      context: { count: 0, other: 0 },
      states: { idle: { on: { PING: { actions: 'report' } } } },
    })
    const stop = vi.spyOn(service, 'stop')
    const container = document.createElement('div')
    const root = createRoot(container)
    const seen: typeof service[] = []
    let renders = 0
    function View({ count, action }: { count: number, action: () => void }) {
      const actor = useService(() => service, { context: { count }, actions: { report: action } })
      seen.push(actor)
      const selected = useSelector(actor, state => state.context.count)
      renders++
      return createElement('button', { onClick: () => actor.send('PING') }, selected)
    }
    const render = (count: number, action: () => void) => {
      const node = createElement(View, { count, action })
      return strict ? createElement(StrictMode, null, node) : node
    }
    try {
      await act(async () => root.render(render(2, first)))
      expect(container.textContent).toBe('2')
      expect(service.status).toBe('Running')
      await act(async () => container.querySelector('button')!.click())
      expect(first).toHaveBeenCalledTimes(1)
      await act(async () => root.render(render(7, second)))
      expect(container.textContent).toBe('7')
      expect(seen.every(actor => actor === service)).toBe(true)
      await act(async () => container.querySelector('button')!.click())
      expect(first).toHaveBeenCalledTimes(1)
      expect(second).toHaveBeenCalledTimes(1)
      const beforeUnrelated = renders
      await act(async () => service.setContext({ other: 1 }))
      expect(renders).toBe(beforeUnrelated)
      const stopsBeforeUnmount = stop.mock.calls.length
      await act(async () => root.unmount())
      expect(stop).toHaveBeenCalledTimes(stopsBeforeUnmount + 1)
      expect(service.status).toBe('Stopped')
    }
    finally {
      stop.mockRestore()
      service.stop()
    }
  })
})

it('hydrates a selected array from matching per-request state and follows client updates', async () => {
  const createService = () => createMachine({ initial: 'idle', context: { items: ['one'] }, states: { idle: {} } })
  const server = createService()
  const client = createService().start()
  const container = document.createElement('div')
  const recover = vi.fn()
  function View({ service }: { service: typeof server }) {
    const items = useSelector(service, state => state.context.items)
    return createElement('span', null, items.join(','))
  }
  container.innerHTML = renderToString(createElement(View, { service: server }))
  const serverNode = container.firstChild
  const root = hydrateRoot(container, createElement(View, { service: client }), { onRecoverableError: recover })
  try {
    await act(async () => {
      await Promise.resolve()
    })
    expect(container.firstChild).toBe(serverNode)
    expect(container.textContent).toBe('one')
    expect(recover).not.toHaveBeenCalled()
    await act(async () => client.setContext({ items: ['two'] }))
    expect(container.textContent).toBe('two')
    expect(server.getState().context.items).toEqual(['one'])
  }
  finally {
    await act(async () => root.unmount())
    client.stop()
  }
})
