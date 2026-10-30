import { createMachine } from '@destyler/xstate'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { useSelector } from '../index'

it('selects immutable structured server state without owning the actor lifecycle', () => {
  expect(typeof document).toBe('undefined')
  const service = createMachine({ initial: 'idle', context: { items: ['first'] }, states: { idle: {} } })
  const start = vi.spyOn(service, 'start')
  const stop = vi.spyOn(service, 'stop')
  const error = vi.spyOn(console, 'error').mockImplementation(() => {})
  function View() {
    const selected = useSelector(service, state => ({ items: state.context.items }), (previous, next) => previous.items === next.items)
    expect(Object.isFrozen(selected.items)).toBe(true)
    return createElement('span', null, selected.items.join(','))
  }
  try {
    expect(renderToString(createElement(View))).toBe('<span>first</span>')
    service.setContext({ items: ['second'] })
    expect(renderToString(createElement(View))).toBe('<span>second</span>')
    expect(error).not.toHaveBeenCalled()
    expect(start).not.toHaveBeenCalled()
    expect(stop).not.toHaveBeenCalled()
    expect(service.status).toBe('Not Started')
  }
  finally {
    error.mockRestore()
  }
})
