import { html, nothing, render } from 'lit'
import { AsyncDirective } from 'lit/async-directive.js'
import { directive } from 'lit/directive.js'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { portal } from '../src/components/portal'

const roots: ReturnType<typeof render>[] = []
afterEach(() => {
  for (const root of roots)
    root.setConnected(false)
  roots.length = 0
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}

async function settle() {
  for (let i = 0; i < 10; i++)
    await Promise.resolve()
}

function view(content: unknown, target: Node | Promise<Node>) {
  const host = document.createElement('main')
  document.body.append(host)
  const update = (value: unknown, destination: Node | Promise<Node> = target, disabled = false) => render(html`${portal(value, destination, { disabled, placeholder: 'loading' })}`, host)
  const root = update(content)
  roots.push(root)
  return { root, host, update }
}

function container() {
  const target = document.createElement('section')
  document.body.append(target)
  return target
}

describe('lit portal lifetimes', () => {
  it('does not overwrite newer content when an earlier content promise resolves', async () => {
    const target = container()
    const pending = deferred<string>()
    const { update } = view(pending.promise, target)
    await settle()
    expect(target.textContent).toBe('loading')
    update('latest', target)
    await settle()
    pending.resolve('old')
    await settle()
    expect(target.textContent).toBe('latest')
  })

  it('preserves settled promised content without placeholder churn on repeated reconnect', async () => {
    const calls: string[] = []
    const tracked = directive(class extends AsyncDirective {
      render() { return 'nested' }
      protected disconnected() { calls.push('disconnected') }
      protected reconnected() { calls.push('reconnected') }
    })
    const target = container()
    const { root } = view(Promise.resolve(html`${tracked()}`), target)
    await settle()
    expect(target.textContent).toBe('nested')
    for (let i = 0; i < 2; i++) {
      root.setConnected(false)
      root.setConnected(true)
      await settle()
      expect(target.textContent).toBe('nested')
    }
    expect(calls).toEqual(['disconnected', 'reconnected', 'disconnected', 'reconnected'])
  })

  it('observes newly rejected disabled content while keeping its inline placeholder', async () => {
    const target = container()
    const { update, host } = view('ready', target)
    await settle()
    const pending = deferred<string>()
    update(pending.promise, target, true)
    pending.reject(new Error('disabled content failure'))
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(host.textContent).toBe('loading')
    expect(target.childNodes.length).toBe(0)
  })

  it('observes content rejection while the target is still pending', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const target = container()
    const pendingTarget = deferred<Node>()
    const pendingContent = deferred<string>()
    const { update } = view(pendingContent.promise, pendingTarget.promise)
    pendingContent.reject(new Error('early content failure'))
    // Let unhandled-rejection reporting run before target resolution.
    await new Promise(resolve => setTimeout(resolve, 0))
    pendingTarget.resolve(target)
    await settle()
    expect(error).toHaveBeenCalledTimes(1)
    expect(target.textContent).toBe('loading')
    update('recovered', target)
    await settle()
    expect(target.textContent).toBe('recovered')
  })

  it('observes target and content rejections received in a disconnected render', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const target = container()
    const { root, update } = view('ready', target)
    await settle()
    root.setConnected(false)
    const pendingTarget = deferred<Node>()
    const pendingContent = deferred<string>()
    update(pendingContent.promise, pendingTarget.promise)
    pendingContent.reject(new Error('suspended content failure'))
    pendingTarget.reject(new Error('suspended target failure'))
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(target.childNodes.length).toBe(0)
    update('recovered', target)
    root.setConnected(true)
    await settle()
    expect(error).not.toHaveBeenCalled()
    expect(target.textContent).toBe('recovered')
  })

  it('does not mount an initially disconnected root until it connects', async () => {
    const target = container()
    const host = document.createElement('main')
    const root = render(html`${portal('ready', target)}`, host, { isConnected: false })
    roots.push(root)
    await settle()
    expect(target.childNodes.length).toBe(0)
    root.setConnected(true)
    await settle()
    expect(target.textContent).toBe('ready')
  })

  it('handles repeated disconnect and reconnect cycles without extra containers', async () => {
    const target = container()
    const { root } = view('ready', target)
    await settle()
    const child = target.firstElementChild
    for (let i = 0; i < 3; i++) {
      root.setConnected(false)
      root.setConnected(false)
      await settle()
      expect(target.childNodes.length).toBe(0)
      root.setConnected(true)
      root.setConnected(true)
      await settle()
      expect(target.textContent).toBe('ready')
      expect(Array.from(target.children)).toEqual([child])
    }
  })

  it('keeps the latest disabled render inline after reconnection', async () => {
    const target = container()
    const { root, update, host } = view('portalled', target)
    await settle()
    root.setConnected(false)
    update('inline', target, true)
    root.setConnected(true)
    await settle()
    expect(target.childNodes.length).toBe(0)
    expect(host.textContent).toBe('inline')
  })

  it('disconnects nested directives when replacing a cross-document container', async () => {
    const calls: string[] = []
    const tracked = directive(class extends AsyncDirective {
      render() { return 'nested' }
      protected disconnected() { calls.push('disconnected') }
    })
    const first = container()
    const otherDocument = document.implementation.createHTMLDocument()
    const { update } = view(html`${tracked()}`, first)
    await settle()
    update('new', otherDocument.body)
    await settle()
    expect(calls).toEqual(['disconnected'])
    expect(first.childNodes.length).toBe(0)
    expect(otherDocument.body.textContent).toBe('new')
  })

  it('handles rejected target and content promises without appending stale content', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const target = container()
    const pendingTarget = deferred<Node>()
    const { update } = view('never', pendingTarget.promise)
    pendingTarget.reject(new Error('target failed'))
    await settle()
    expect(error).toHaveBeenCalledTimes(1)
    expect(target.childNodes.length).toBe(0)
    const pendingContent = deferred<string>()
    update(pendingContent.promise, target)
    await settle()
    expect(target.textContent).toBe('loading')
    pendingContent.reject(new Error('content failed'))
    await settle()
    expect(error).toHaveBeenCalledTimes(2)
    expect(target.textContent).toBe('loading')
    update('recovered', target)
    await settle()
    expect(target.textContent).toBe('recovered')
  })

  it('does not append a late target after the directive is removed', async () => {
    const target = container()
    const pending = deferred<Node>()
    const { host } = view('never', pending.promise)
    render(nothing, host)
    pending.resolve(target)
    await settle()
    expect(target.childNodes.length).toBe(0)
  })

  it('resumes a pending target after reconnection without a new render', async () => {
    const target = container()
    const pending = deferred<Node>()
    const { root } = view('ready', pending.promise)
    root.setConnected(false)
    pending.resolve(target)
    await settle()
    expect(target.textContent).toBe('')
    root.setConnected(true)
    await settle()
    expect(target.textContent).toBe('ready')
  })

  it('resumes pending content after reconnection without leaving a stale placeholder', async () => {
    const target = container()
    const pending = deferred<string>()
    const { root } = view(pending.promise, target)
    await settle()
    expect(target.textContent).toBe('loading')
    root.setConnected(false)
    pending.resolve('ready')
    await settle()
    expect(target.textContent).toBe('')
    root.setConnected(true)
    await settle()
    expect(target.textContent).toBe('ready')
  })

  it('keeps updates disconnected and reconnects only the latest content and target', async () => {
    const first = container()
    const second = container()
    const { root, update } = view('first', first)
    await settle()
    root.setConnected(false)
    update('second', second)
    await settle()
    expect(first.textContent).toBe('')
    expect(second.textContent).toBe('')
    root.setConnected(true)
    await settle()
    expect(first.textContent).toBe('')
    expect(second.textContent).toBe('second')
  })

  it('forwards disconnection and reconnection to nested asynchronous directives', async () => {
    const calls: string[] = []
    const tracked = directive(class extends AsyncDirective {
      render() { return 'nested' }
      protected disconnected() { calls.push('disconnected') }
      protected reconnected() { calls.push('reconnected') }
    })
    const target = container()
    const { root, host } = view(html`${tracked()}`, target)
    await settle()
    root.setConnected(false)
    expect(calls).toEqual(['disconnected'])
    root.setConnected(true)
    await settle()
    expect(calls).toEqual(['disconnected', 'reconnected'])
    render(nothing, host)
    expect(calls).toEqual(['disconnected', 'reconnected', 'disconnected'])
  })

  it('disconnects nested asynchronous directives when disabling a portal', async () => {
    const calls: string[] = []
    const tracked = directive(class extends AsyncDirective {
      render() { return 'nested' }
      protected disconnected() { calls.push('disconnected') }
    })
    const target = container()
    const { host, update } = view(html`${tracked()}`, target)
    await settle()
    update('inline', target, true)
    await settle()
    expect(calls).toEqual(['disconnected'])
    expect(target.textContent).toBe('')
    expect(host.textContent).toBe('inline')
  })

  it('cancels pending work after removal and never appends it to a later portal', async () => {
    const target = container()
    const old = deferred<string>()
    const { host, update } = view(old.promise, target)
    await settle()
    render(nothing, host)
    old.resolve('stale')
    await settle()
    expect(target.textContent).toBe('')
    update('new')
    await settle()
    expect(target.textContent).toBe('new')
  })

  it('ignores older content and target promises after a newer render', async () => {
    const first = container()
    const second = container()
    const oldTarget = deferred<Node>()
    const oldContent = deferred<string>()
    const { update } = view(oldContent.promise, oldTarget.promise)
    update('latest', second)
    oldTarget.resolve(first)
    oldContent.resolve('old')
    await settle()
    expect(first.textContent).toBe('')
    expect(second.textContent).toBe('latest')
  })
})
