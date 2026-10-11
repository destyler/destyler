import { html, nothing, render } from 'lit'
import { describe, expect, it, vi } from 'vitest'
import { spread, spreadEvents } from '../src/directives/spread-props'

describe('lit spread lifecycle', () => {
  it.each(['spread', 'spreadEvents'] as const)('removes omitted event handlers with %s', (kind) => {
    const container = document.createElement('div')
    const click = vi.fn()
    const view = (handler?: () => void) => kind === 'spread'
      ? html`<button ${spread(handler ? { '@click': handler } : {})}></button>`
      : html`<button ${spreadEvents(handler ? { click: handler } : {})}></button>`
    try {
      render(view(click), container)
      const button = container.querySelector('button')!
      button.click()
      expect(click).toHaveBeenCalledTimes(1)
      render(view(), container)
      button.click()
      expect(click).toHaveBeenCalledTimes(1)
    }
    finally {
      render(nothing, container)
    }
  })

  it.each(['spread', 'spreadEvents'] as const)('replaces capture options without leaving a second listener with %s', (kind) => {
    const container = document.createElement('div')
    const first = { handleEvent: vi.fn(), capture: false }
    const next = { handleEvent: vi.fn(), capture: true }
    const view = (handler: typeof first) => kind === 'spread'
      ? html`<button ${spread({ '@click': handler })}></button>`
      : html`<button ${spreadEvents({ click: handler })}></button>`
    try {
      render(view(first), container)
      const button = container.querySelector('button')!
      const remove = vi.spyOn(button, 'removeEventListener')
      button.click()
      expect(first.handleEvent).toHaveBeenCalledTimes(1)
      render(view(next), container)
      expect(remove).toHaveBeenCalledWith('click', expect.anything(), first)
      button.click()
      expect(first.handleEvent).toHaveBeenCalledTimes(1)
      expect(next.handleEvent).toHaveBeenCalledTimes(1)
    }
    finally {
      render(nothing, container)
    }
  })

  it.each(['spread', 'spreadEvents'] as const)('keeps updated handlers inactive while disconnected with %s', (kind) => {
    const container = document.createElement('div')
    const first = vi.fn()
    const next = vi.fn()
    const view = (handler: (() => void) | null) => kind === 'spread'
      ? html`<button ${spread({ '@click': handler })}></button>`
      : html`<button ${spreadEvents({ click: handler })}></button>`
    const part = render(view(first), container)
    const button = container.querySelector('button')!
    try {
      part.setConnected(false)
      render(view(next), container)
      button.click()
      expect(first).not.toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()

      part.setConnected(true)
      button.click()
      expect(first).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledTimes(1)

      render(view(null), container)
      button.click()
      expect(next).toHaveBeenCalledTimes(1)
    }
    finally {
      render(nothing, container)
    }
  })

  it.each(['spread', 'spreadEvents'] as const)('detaches and reattaches listeners with %s', (kind) => {
    const container = document.createElement('div')
    const click = vi.fn()
    const view = () => kind === 'spread'
      ? html`<button ${spread({ '@click': click })}></button>`
      : html`<button ${spreadEvents({ click })}></button>`
    const part = render(view(), container)
    const button = container.querySelector('button')!
    try {
      button.click()
      expect(click).toHaveBeenCalledTimes(1)
      part.setConnected(false)
      button.click()
      expect(click).toHaveBeenCalledTimes(1)
      part.setConnected(true)
      button.click()
      expect(click).toHaveBeenCalledTimes(2)
      render(nothing, container)
      button.click()
      expect(click).toHaveBeenCalledTimes(2)
    }
    finally {
      render(nothing, container)
    }
  })

  it('removes omitted attributes and properties without replacing the element', () => {
    const container = document.createElement('div')
    const view = (props: Record<string, unknown>) => html`<input ${spread(props)}>`
    try {
      render(view({ 'title': 'help', '?disabled': true, '.value': 'draft', '.payload': { count: 1 }, 'data-state': 'open' }), container)
      const input = container.querySelector('input')!
      expect(input.disabled).toBe(true)
      expect(input.value).toBe('draft')
      render(view({}), container)
      expect(container.querySelector('input')).toBe(input)
      expect(input.hasAttribute('title')).toBe(false)
      expect(input.hasAttribute('disabled')).toBe(false)
      expect(input.hasAttribute('data-state')).toBe(false)
      expect((input as HTMLInputElement & { payload?: unknown }).payload).toBeUndefined()
    }
    finally {
      render(nothing, container)
    }
  })

  it('preserves unrelated listeners, attributes and externally changed properties', () => {
    const container = document.createElement('div')
    const ownedClick = vi.fn()
    const externalClick = vi.fn()
    const view = (props: Record<string, unknown>) => html`<input ${spread(props)}>`
    try {
      render(view({ '@click': ownedClick, '.value': 'initial', 'title': 'owned' }), container)
      const input = container.querySelector('input')!
      input.addEventListener('click', externalClick)
      input.setAttribute('data-external', 'keep')
      input.value = 'user edit'

      render(view({}), container)
      input.click()
      expect(ownedClick).not.toHaveBeenCalled()
      expect(externalClick).toHaveBeenCalledTimes(1)
      expect(input.getAttribute('data-external')).toBe('keep')
      expect(input.value).toBe('user edit')
      expect(input.hasAttribute('title')).toBe(false)
    }
    finally {
      render(nothing, container)
    }
  })
})
