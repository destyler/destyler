import { createMachine } from '@destyler/xstate'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { useActor } from '../src/hooks/use-actor'

describe('react server snapshot observation', () => {
  it('reads each current server snapshot without starting or stopping the actor', () => {
    const service = createMachine({ initial: 'idle', context: { count: 4 }, states: { idle: {} } })
    const start = vi.spyOn(service, 'start')
    const stop = vi.spyOn(service, 'stop')
    function View() {
      const [state] = useActor(service)
      return createElement('span', null, `${state.value}:${state.context.count}`)
    }
    expect(renderToString(createElement(View))).toBe('<span>idle:4</span>')
    service.setContext({ count: 9 })
    expect(renderToString(createElement(View))).toBe('<span>idle:9</span>')
    expect(start).not.toHaveBeenCalled()
    expect(stop).not.toHaveBeenCalled()
    expect(service.status).toBe('Not Started')
  })
})
