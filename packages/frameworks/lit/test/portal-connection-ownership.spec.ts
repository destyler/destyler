import { portal } from '@destyler/lit'
import { html, nothing, render } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'
import { describe, expect, it } from 'vitest'

async function settle() {
  for (let i = 0; i < 10; i++)
    await Promise.resolve()
}

function fixture(onDisconnect: (root: ReturnType<typeof render>) => void) {
  const host = document.createElement('main')
  const target = document.createElement('section')
  document.body.append(host, target)
  const calls: string[] = []
  const listener = () => calls.push('event')
  let cleanup = false
  let root: ReturnType<typeof render>
  const tracked = directive(class extends AsyncDirective {
    render() {
      target.addEventListener('portal-probe', listener)
      return 'nested'
    }

    protected disconnected() {
      calls.push('disconnected')
      target.removeEventListener('portal-probe', listener)
      if (!cleanup)
        onDisconnect(root)
    }

    protected reconnected() {
      calls.push('reconnected')
      target.addEventListener('portal-probe', listener)
    }
  })
  const update = (content: unknown, destination: Node = target) => render(html`${portal(content, destination)}`, host)
  root = update(html`${tracked()}`)
  return {
    root,
    target,
    calls,
    update,
    dispatch: () => target.dispatchEvent(new Event('portal-probe')),
    dispose() {
      cleanup = true
      render(nothing, host)
      target.removeEventListener('portal-probe', listener)
      host.remove()
      target.remove()
    },
  }
}

describe('lit portal connection ownership', () => {
  it('keeps the container and nested listener owned by a synchronous reconnect', async () => {
    let reconnect = true
    const view = fixture((root) => {
      if (reconnect) {
        reconnect = false
        root.setConnected(true)
      }
    })
    try {
      await settle()
      const child = view.target.firstElementChild
      expect(view.target.textContent).toBe('nested')
      view.root.setConnected(false)
      view.root.setConnected(true)
      await settle()
      expect(view.target.textContent).toBe('nested')
      expect(Array.from(view.target.children)).toEqual([child])
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'event'])

      view.root.setConnected(false)
      expect(view.target.childNodes).toHaveLength(0)
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'event', 'disconnected'])
      view.root.setConnected(true)
      await settle()
      expect(Array.from(view.target.children)).toEqual([child])
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'event', 'disconnected', 'reconnected', 'event'])
    }
    finally {
      view.dispose()
    }
  })

  it('detaches when nested reentry finishes disconnected and later restores the same container', async () => {
    let cycle = true
    const view = fixture((root) => {
      if (cycle) {
        cycle = false
        root.setConnected(true)
        root.setConnected(false)
      }
    })
    try {
      await settle()
      const child = view.target.firstElementChild
      view.root.setConnected(false)
      await settle()
      expect(view.target.childNodes).toHaveLength(0)
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'disconnected'])
      view.root.setConnected(true)
      await settle()
      expect(Array.from(view.target.children)).toEqual([child])
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'disconnected', 'reconnected', 'event'])
    }
    finally {
      view.dispose()
    }
  })

  it('keeps the final reconnect after a nested reconnect, disconnect, and reconnect', async () => {
    let cycle = true
    const view = fixture((root) => {
      if (cycle) {
        cycle = false
        root.setConnected(true)
        root.setConnected(false)
        root.setConnected(true)
      }
    })
    try {
      await settle()
      const child = view.target.firstElementChild
      view.root.setConnected(false)
      await settle()
      expect(view.target.textContent).toBe('nested')
      expect(Array.from(view.target.children)).toEqual([child])
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'disconnected', 'reconnected', 'event'])
      view.root.setConnected(false)
      expect(view.target.childNodes).toHaveLength(0)
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'disconnected', 'reconnected', 'event', 'disconnected'])
    }
    finally {
      view.dispose()
    }
  })

  it('preserves a nested callback error after synchronous reconnect', async () => {
    const failure = new Error('nested disconnect failed')
    let reconnect = true
    const view = fixture((root) => {
      if (reconnect) {
        reconnect = false
        root.setConnected(true)
        throw failure
      }
    })
    try {
      await settle()
      const child = view.target.firstElementChild
      let caught: unknown
      try {
        view.root.setConnected(false)
      }
      catch (error) {
        caught = error
      }
      expect(caught).toBe(failure)
      expect(Array.from(view.target.children)).toEqual([child])
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'event'])
      view.root.setConnected(false)
      expect(view.target.childNodes).toHaveLength(0)
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'event', 'disconnected'])
    }
    finally {
      view.dispose()
    }
  })

  it('preserves the disconnected resources and container when a nested callback throws', async () => {
    const failure = new Error('nested disconnect failed')
    let fail = true
    const view = fixture(() => {
      if (fail) {
        fail = false
        throw failure
      }
    })
    try {
      await settle()
      const child = view.target.firstElementChild
      let caught: unknown
      try {
        view.root.setConnected(false)
      }
      catch (error) {
        caught = error
      }
      expect(caught).toBe(failure)
      expect(Array.from(view.target.children)).toEqual([child])
      view.dispatch()
      expect(view.calls).toEqual(['disconnected'])
      view.root.setConnected(true)
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'event'])
      view.root.setConnected(false)
      expect(view.target.childNodes).toHaveLength(0)
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'event', 'disconnected'])
    }
    finally {
      view.dispose()
    }
  })

  it('preserves newer content and target selected by a nested reconnect callback', async () => {
    const destination = document.createElement('section')
    document.body.append(destination)
    let replace = true
    const view = fixture((root) => {
      if (replace) {
        replace = false
        root.setConnected(true)
        view.update('replacement', destination)
      }
    })
    try {
      await settle()
      const child = view.target.firstElementChild
      view.root.setConnected(false)
      await settle()
      expect(view.target.childNodes).toHaveLength(0)
      expect(destination.textContent).toBe('replacement')
      expect(Array.from(destination.children)).toEqual([child])
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'disconnected'])
      view.root.setConnected(false)
      expect(destination.childNodes).toHaveLength(0)
      view.root.setConnected(true)
      await settle()
      expect(destination.textContent).toBe('replacement')
      expect(Array.from(destination.children)).toEqual([child])
      view.dispatch()
      expect(view.calls).toEqual(['disconnected', 'reconnected', 'disconnected'])
    }
    finally {
      view.dispose()
      destination.remove()
    }
  })
})
