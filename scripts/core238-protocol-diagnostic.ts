// TEMPORARY DIAGNOSTIC: remove before accepting a repair candidate.
// Observe the existing Playwright context; do not change browser/test behavior.
import type { BrowserContext, Page } from 'playwright'
import process from 'node:process'
import { defineBrowserCommand } from '@vitest/browser-playwright'

interface CollectorOptions {
  sessionId: string
  fixturePath: string
  binding: string
}

function installCollector(options: CollectorOptions) {
  const win = window as unknown as Record<string, any>
  const url = new URL(location.href)
  if (url.searchParams.get('sessionId') !== options.sessionId
    || url.searchParams.get('iframeId') !== options.fixturePath
    || win.__core238CollectorInstalled) {
    return
  }
  win.__core238CollectorInstalled = true
  let sequence = 0
  const safeUrl = (value: string) => {
    const parsed = new URL(value, location.href)
    if (parsed.origin !== location.origin || parsed.searchParams.get('sessionId') !== options.sessionId
      || parsed.searchParams.get('iframeId') !== options.fixturePath) {
      return { kind: 'non-fixture-url' }
    }
    return {
      origin: parsed.origin,
      path: parsed.pathname,
      sessionId: parsed.searchParams.get('sessionId'),
      iframeId: parsed.searchParams.get('iframeId'),
      hash: parsed.hash,
    }
  }
  const emit = (event: string, detail: Record<string, unknown> = {}) => {
    if (++sequence > 1001)
      return
    const runner = win.__vitest_browser_runner__
    const record = {
      event: sequence === 1001 ? 'window-telemetry-truncated' : event,
      sequence,
      clock: performance.now(),
      location: safeUrl(location.href),
      embedded: window.self !== window.top,
      hasOpener: Boolean(window.opener),
      runner: runner && {
        type: runner.type,
        sessionId: runner.sessionId,
        iframeId: runner.iframeId,
        testerId: runner.testerId,
      },
      testName: win.__vitest_worker__?.current?.name,
      detail,
    }
    // Only telemetry-delivery failures are caught. Test and runner errors remain untouched.
    try {
      void win[options.binding](record).catch(() => {
        console.error('[core238-observer-error] delivery failed')
      })
    }
    catch {
      console.error('[core238-observer-error] delivery failed')
    }
  }
  emit('window-observed')
  const originalPost = BroadcastChannel.prototype.postMessage
  BroadcastChannel.prototype.postMessage = function (message: any) {
    if (this.name === `vitest:${options.sessionId}` && message?.iframeId === options.fixturePath) {
      emit('protocol-send', {
        channel: this.name,
        protocolEvent: message.event,
        iframeId: message.iframeId,
      })
    }
    // Forward every message, including unknown/recursive events, exactly once.
    return Reflect.apply(originalPost, this, [message])
  }
  // Receive-only observer: never sends acknowledgements/responses or calls runner handlers.
  const observer = new BroadcastChannel(`vitest:${options.sessionId}`)
  observer.addEventListener('message', ({ data }) => {
    if (data?.iframeId === options.fixturePath) {
      emit('protocol-passive-observation', {
        channel: observer.name,
        protocolEvent: data.event,
        iframeId: data.iframeId,
      })
    }
  })
  for (const capture of [true, false]) {
    window.addEventListener('click', (event) => {
      const anchor = event.target instanceof Element ? event.target.closest('a') : null
      if (!anchor)
        return
      emit(capture ? 'anchor-before-handlers' : 'anchor-after-handlers', {
        id: anchor.id,
        destination: safeUrl(anchor.href),
        target: anchor.target,
        button: event.button,
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        trusted: event.isTrusted,
        defaultPrevented: event.defaultPrevented,
      })
    }, capture)
  }
  window.addEventListener('hashchange', () => emit('hashchange'))
  window.addEventListener('beforeunload', () => emit('beforeunload'))
  window.addEventListener('DOMContentLoaded', () => emit('document-ready'), { once: true })
}

const armed = new WeakSet<BrowserContext>()
export const core238ProtocolStart = defineBrowserCommand(async ({ context, page, frame, sessionId, testPath }) => {
  if (!testPath?.endsWith('/packages/__tests__/combobox/interaction-guards.spec.ts'))
    throw new Error('The #238 collector may only be armed by its browser fixture.')
  if (armed.has(context))
    return
  armed.add(context)
  const ids = new Map<Page, number>()
  const id = (value: Page) => {
    if (!ids.has(value))
      ids.set(value, ids.size + 1)
    return ids.get(value)
  }
  let records = 0
  const emit = (event: string, detail: Record<string, unknown>) => {
    if (++records > 3001)
      return
    console.log('[core238-protocol]', JSON.stringify({
      event: records === 3001 ? 'session-telemetry-truncated' : event,
      sequence: records,
      at: new Date().toISOString(),
      sessionId,
      fixturePath: testPath,
      detail,
    }))
  }
  const safeUrl = (value: string) => {
    if (!value)
      return null
    const parsed = new URL(value)
    if (parsed.searchParams.get('sessionId') !== sessionId
      || parsed.searchParams.get('iframeId') !== testPath) {
      return { kind: 'non-fixture-url' }
    }
    return {
      origin: parsed.origin,
      path: parsed.pathname,
      sessionId: parsed.searchParams.get('sessionId'),
      iframeId: parsed.searchParams.get('iframeId'),
      hash: parsed.hash,
    }
  }
  const observePage = (target: Page) => {
    emit('page-observed', { page: id(target), location: safeUrl(target.url()) })
    void target.opener().then(opener => emit('page-opener', {
      page: id(target),
      opener: opener ? id(opener) : null,
    })).catch(() => emit('observer-error', { operation: 'read-opener', page: id(target) }))
    target.on('popup', popup => emit('popup', { page: id(target), popup: id(popup) }))
    target.on('framenavigated', navigated => emit('frame-navigation', {
      page: id(target),
      topLevel: navigated === target.mainFrame(),
      location: safeUrl(navigated.url()),
    }))
    target.on('close', () => emit('page-closed', { page: id(target) }))
    const protocolEvent = (text: string) => text.match(/(?:Unknown event|Unexpected event): ((?:response:)*(?:execute|cleanup|prepare))\b/)?.[1]
    target.on('console', (message) => {
      const text = message.text()
      const event = protocolEvent(text)
      if (event || text.includes('[core238-observer-error]')) {
        emit('page-console-diagnostic', {
          page: id(target),
          level: message.type(),
          protocolEvent: event || null,
          observerFailure: text.includes('[core238-observer-error]'),
        })
      }
    })
    target.on('pageerror', error => emit('page-error-observed', {
      page: id(target),
      protocolEvent: protocolEvent(error.message) || null,
      classification: protocolEvent(error.message) ? 'runner-protocol' : 'unclassified-message-withheld',
    }))
  }
  context.on('page', observePage)
  for (const existing of context.pages())
    observePage(existing)
  const binding = '__core238ProtocolObservation'
  await context.exposeBinding(binding, (source, observation: unknown) => {
    emit('window-record', {
      page: id(source.page),
      topLevel: source.frame === source.page.mainFrame(),
      observation,
    })
  })
  const options = { sessionId, fixturePath: testPath, binding }
  // Future popups receive this before Vitest's tester modules initialize.
  await context.addInitScript(installCollector, options)
  // The test iframe already exists; instrument it before the first assertion runs.
  await (await frame()).evaluate(installCollector, options)
  emit('collector-armed', {
    page: id(page),
    browserVersion: context.browser()?.version(),
    node: process.version,
    timing: 'Before #238 tests; retained through execute/cleanup until context closure.',
  })
})

declare module 'vitest/browser' {
  interface BrowserCommands {
    core238ProtocolStart: () => Promise<void>
  }
}
