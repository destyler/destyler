// TEMPORARY DIAGNOSTIC: remove before accepting a repair candidate.
// Observe the existing Playwright context; the readiness command deliberately changes scheduling.
import type { BrowserContext, Page } from 'playwright'
import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'
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
const collectors = new WeakMap<BrowserContext, {
  sessionId: string
  fixturePath: string
  origin: string
  page: Page
  id: (value: Page) => number | undefined
  emit: (event: string, detail: Record<string, unknown>) => void
}>()
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
  const fixtureFrame = await frame()
  await fixtureFrame.evaluate(installCollector, options)
  // Native navigation provenance remains available even for a no-opener new tab.
  const cdp = await context.newCDPSession(page)
  cdp.on('Page.windowOpen', (event) => {
    const location = safeUrl(event.url)
    if (location && !('kind' in location)) {
      emit('native-window-open', {
        sourcePage: id(page),
        location,
        userGesture: event.userGesture,
      })
    }
  })
  cdp.on('Page.frameRequestedNavigation', (event) => {
    const location = safeUrl(event.url)
    if (location && !('kind' in location)) {
      emit('native-navigation-request', {
        sourcePage: id(page),
        frameId: event.frameId,
        reason: event.reason,
        disposition: event.disposition,
        location,
      })
    }
  })
  await cdp.send('Page.enable')
  const frameTree = await cdp.send('Page.getFrameTree')
  const recordFrame = (tree: { frame: { id: string, url: string }, childFrames?: typeof tree[] }) => {
    const location = safeUrl(tree.frame.url)
    if (location && !('kind' in location))
      emit('native-frame-map', { page: id(page), frameId: tree.frame.id, location })
    tree.childFrames?.forEach(recordFrame)
  }
  recordFrame(frameTree.frameTree)
  collectors.set(context, {
    sessionId,
    fixturePath: testPath,
    origin: new URL(fixtureFrame.url()).origin,
    page,
    id,
    emit,
  })
  emit('collector-armed', {
    page: id(page),
    browserVersion: context.browser()?.version(),
    node: process.version,
    timing: 'Before #238 tests; retained through execute/cleanup until context closure.',
  })
})

// Deliberate scheduling experiment: retain the existing fixture until a naturally
// created matching tester has initialized. This is never a canonical timing claim.
export const core238ProtocolWaitForDuplicate = defineBrowserCommand(async ({ context, sessionId, testPath }) => {
  const state = collectors.get(context)
  if (!state || state.sessionId !== sessionId || state.fixturePath !== testPath)
    throw new Error('Inconclusive #238 diagnostic: no matching armed collector.')
  const started = Date.now()
  const totalBudget = 5000
  const discoveryBudget = 1000
  state.emit('readiness-barrier-discovery-start', {
    deliberateSchedulingExperiment: true,
    totalBudget,
    discoveryBudget,
    action: 'Observe only pages naturally created by the original fixture clicks.',
  })
  let duplicate: Page | undefined
  while (Date.now() - started < discoveryBudget) {
    duplicate = context.pages().find((target) => {
      if (target === state.page || target.isClosed())
        return false
      const url = new URL(target.url())
      return url.origin === state.origin
        && url.searchParams.get('sessionId') === sessionId
        && url.searchParams.get('iframeId') === testPath
    })
    if (duplicate)
      break
    await delay(20)
  }
  if (!duplicate) {
    state.emit('readiness-barrier-inconclusive', { phase: 'discovery', elapsed: Date.now() - started })
    throw new Error('Inconclusive #238 diagnostic: no naturally created matching duplicate page within discovery budget.')
  }
  state.emit('readiness-barrier-initialization-start', {
    page: state.id(duplicate),
    elapsed: Date.now() - started,
    remainingBudget: totalBudget - (Date.now() - started),
  })
  try {
    // In pinned Vitest 4.0.16, iframeId is assigned after the tester's channel listener is registered.
    const identity = await duplicate.waitForFunction(({ sessionId, fixturePath }) => {
      const runner = (window as unknown as Record<string, any>).__vitest_browser_runner__
      if (window.self !== window.top || runner?.type !== 'tester'
        || runner.sessionId !== sessionId || runner.iframeId !== fixturePath) {
        return false
      }
      return {
        type: runner.type,
        sessionId: runner.sessionId,
        iframeId: runner.iframeId,
        testerId: runner.testerId,
        embedded: false,
      }
    }, { sessionId, fixturePath: state.fixturePath }, {
      polling: 20,
      timeout: Math.max(1, totalBudget - (Date.now() - started)),
    })
    const observed = await identity.jsonValue()
    await identity.dispose()
    state.emit('readiness-barrier-release', {
      page: state.id(duplicate),
      elapsed: Date.now() - started,
      identity: observed,
      deliberateSchedulingExperiment: true,
    })
  }
  catch {
    // This catches only the diagnostic readiness wait; normal runner errors stay enabled.
    state.emit('readiness-barrier-inconclusive', { phase: 'initialization', elapsed: Date.now() - started })
    throw new Error('Inconclusive #238 diagnostic: the naturally created duplicate did not become ready within total budget.')
  }
})

declare module 'vitest/browser' {
  interface BrowserCommands {
    core238ProtocolStart: () => Promise<void>
    core238ProtocolWaitForDuplicate: () => Promise<void>
  }
}
