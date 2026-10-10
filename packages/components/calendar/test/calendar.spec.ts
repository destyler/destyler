import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Calendar'

let mount: HTMLElement | null = null
let cleanup: (() => void) | undefined

async function seeContent() {
  await expect.element(testHook.getContent('calendar')).toBeVisible()
}

async function dontSeeContent() {
  await expect.element(testHook.getContent('calendar')).not.toBeVisible()
}

function getInRangeDayCell() {
  return page.getByArticle(`${testHook.part('table-cell-trigger')}:not([data-outside-range])`).first()
}

async function selectInRangeDay() {
  const dayCell = getInRangeDayCell()
  const el = await dayCell.element()
  const label = el.textContent?.trim() ?? ''
  // Avoid Playwright hit-testing: vanilla grid re-renders on pointermove and detaches nodes
  el.click()
  return label
}

async function setSelectionMode(mode: 'single' | 'multiple' | 'range') {
  const el = page.getByTestId('selectionMode')
  // userEvent.selectOptions matches existing suites; avoid page.selectOptions('multiple') ambiguity
  await userEvent.selectOptions(el, mode)
}

function getDayTable() {
  return page.getByTestId('calendar:day-table')
}

function getSelectedOutput() {
  return page.getByTestId('calendar:selected')
}

function getFocusedOutput() {
  return page.getByTestId('calendar:focused')
}

describe('calendar browser tests', () => {
  beforeEach(() => {
    mount = document.createElement('div')
    document.body.appendChild(mount)
    cleanup = render(mount)
  })

  afterEach(() => {
    cleanup?.()
    cleanup = undefined

    if (mount && mount.parentElement)
      document.body.removeChild(mount)

    mount = null
  })

  it('should open the calendar on trigger click', async () => {
    await dontSeeContent()
    await testHook.clickTrigger('calendar')
    await seeContent()
    await expect.element(testHook.getContent('calendar')).toHaveAttribute('data-state', 'open')
  })

  it('should render day cells when open', async () => {
    await testHook.clickTrigger('calendar')
    await seeContent()

    const dayCell = getInRangeDayCell()
    await expect.element(dayCell).toBeVisible()
  })

  it('should select a day, update output, and clear', async () => {
    await testHook.clickTrigger('calendar')
    await seeContent()

    const dayLabel = await selectInRangeDay()

    const selected = page.getByTestId('calendar:selected')
    await expect.element(selected).not.toHaveTextContent('-')
    if (dayLabel)
      await expect.element(selected).toHaveTextContent(dayLabel)

    await userEvent.click(testHook.getClearEl('calendar'), { force: true })
    // cleared valueAsString is '' (render falls back to '-' only for nullish)
    await expect.poll(async () => (await selected.element()).textContent?.trim() ?? '').toMatch(/^(-)?$/)
  })

  it('should close on Escape', async () => {
    await testHook.clickTrigger('calendar')
    await seeContent()
    await testHook.pressKey('Escape')
    await dontSeeContent()
  })

  it('should move focus with Arrow keys on the day table', async () => {
    await testHook.clickTrigger('calendar')
    await seeContent()

    const table = getDayTable()
    const tableEl = await table.element()
    tableEl.focus()
    await expect.element(table).toHaveFocus()

    await expect.poll(async () => ((await getFocusedOutput().element()).textContent?.trim() ?? '').length > 0).toBe(true)
    const before = (await getFocusedOutput().element()).textContent?.trim() ?? ''

    await testHook.pressKey('ArrowRight')
    await expect.poll(async () => {
      const after = (await getFocusedOutput().element()).textContent?.trim() ?? ''
      return after !== '' && after !== before
    }, { timeout: 5000, interval: 50 }).toBe(true)

    await testHook.pressKey('ArrowDown')
    await expect.poll(async () => {
      const text = (await getFocusedOutput().element()).textContent?.trim() ?? ''
      return text.length > 0
    }).toBe(true)
  })

  it('[selectionMode=multiple] should allow selecting multiple days', async () => {
    await setSelectionMode('multiple')
    // Keep the picker open across sequential picks
    await page.getByTestId('closeOnSelect').click()
    await testHook.clickTrigger('calendar')
    await seeContent()

    await expect.element(getDayTable()).toHaveAttribute('aria-multiselectable', 'true')

    const cellSelector = `${testHook.part('table-cell-trigger')}:not([data-outside-range])`
    const first = await page.getByArticle(cellSelector).nth(1).element()
    first.click()
    const second = await page.getByArticle(cellSelector).nth(3).element()
    second.click()

    await expect.poll(() => document.querySelectorAll(`${testHook.part('table-cell-trigger')}[data-selected]`).length)
      .toBeGreaterThanOrEqual(2)

    const selected = getSelectedOutput()
    await expect.poll(async () => ((await selected.element()).textContent ?? '').includes(',')).toBe(true)
  })

  it('[selectionMode=range] should select a start and end day', async () => {
    await setSelectionMode('range')
    await testHook.clickTrigger('calendar')
    await seeContent()

    await expect.element(getDayTable()).toHaveAttribute('aria-multiselectable', 'true')

    const cells = page.getByArticle(`${testHook.part('table-cell-trigger')}:not([data-outside-range])`)
    const start = await cells.nth(0).element()
    start.click()
    const end = await page.getByArticle(`${testHook.part('table-cell-trigger')}:not([data-outside-range])`).nth(4).element()
    end.click()

    const selected = getSelectedOutput()
    await expect.poll(async () => {
      const text = (await selected.element()).textContent?.trim() ?? ''
      return text !== '-' && text.length > 0
    }).toBe(true)

    await expect.poll(async () => {
      return document.querySelectorAll(`${testHook.part('table-cell-trigger')}[data-selected]`).length >= 1
    }).toBe(true)
  })

  it('should switch between day, month, and year views', async ({ task, signal }) => {
    // Temporary observation only: retain the original operations and retry policy.
    const retryCount = task.result?.retryCount ?? null
    const repeatCount = task.result?.repeatCount ?? null
    const startedAt = performance.now()
    const attemptMount = mount
    let stage = 'start'

    function record(nextStage: string, event: 'stage' | 'pass' | 'failure' = 'stage', error?: unknown) {
      stage = nextStage
      try {
        const elementState = (element: Element | null) => element && ({
          tag: element.tagName,
          id: element.id.slice(0, 120),
          testId: element.getAttribute('data-testid')?.slice(0, 120) ?? null,
          connected: element.isConnected,
          inMount: attemptMount?.contains(element) ?? false,
          hidden: element instanceof HTMLElement ? element.hidden : null,
          state: element.getAttribute('data-state')?.slice(0, 120) ?? null,
          ariaHidden: element.getAttribute('aria-hidden')?.slice(0, 120) ?? null,
        })
        const elements = ['content', 'day-view', 'month-view', 'year-view', 'view-trigger', 'month-trigger'].map((part) => {
          const matches = attemptMount?.querySelectorAll(`[data-testid="calendar:${part}"]`) ?? []
          return { part, count: matches.length, firstTwo: Array.from(matches).slice(0, 2).map(elementState) }
        })
        const failure = error !== null && typeof error === 'object'
          ? error as { name?: unknown, message?: unknown, stack?: unknown }
          : null
        console.warn('[calendar-view-retry]', JSON.stringify({
          taskId: task.id,
          retryCount,
          repeatCount,
          event,
          stage,
          at: new Date().toISOString(),
          elapsedMs: performance.now() - startedAt,
          mount: { connected: attemptMount?.isConnected ?? false, children: attemptMount?.childElementCount ?? 0, cleanupPresent: typeof cleanup === 'function', changed: mount !== attemptMount, attemptConnected: attemptMount?.isConnected ?? false },
          calendarRoots: attemptMount?.querySelectorAll('[data-calendar-root]').length ?? 0,
          elements,
          activeElement: elementState(document.activeElement),
          retainedErrorsAtEntry: stage === 'click-calendar-trigger' && event === 'stage'
            ? { count: task.result?.errors?.length ?? 0, firstThree: task.result?.errors?.slice(0, 3).map(({ name, message, stack }) => ({ name, message, stack })) ?? [] }
            : undefined,
          error: event === 'failure'
            ? { name: String(failure?.name ?? typeof error), message: String(failure?.message ?? error), stack: failure?.stack == null ? null : String(failure.stack) }
            : undefined,
        }))
      }
      catch {
        // Telemetry failure must not replace an original test result or error.
      }
    }

    function startInitialOpenObservation() {
      const observations: Record<string, unknown>[] = []
      const gaps = new Map<string, number>()
      const registrations: { type: string, listener: EventListener, capture: boolean }[] = []
      let fixedTrigger: HTMLElement | null = null
      let fixedContent: HTMLElement | null = null
      let observer: MutationObserver | undefined
      let disposed = false
      let abortRegistered = false
      let observed = 0
      let omitted = 0
      let mutationBatch = 0

      function gap(code: string) {
        gaps.set(code, (gaps.get(code) ?? 0) + 1)
      }

      function append(kind: string, values: Record<string, unknown>) {
        observed++
        if (observations.length === 64) {
          omitted++
          gap('record-overflow')
          return
        }
        observations.push({ sequence: observed, elapsedMs: performance.now() - startedAt, kind, ...values })
      }

      function identity(element: EventTarget | null) {
        if (!(element instanceof Element))
          return null
        return {
          tag: element.tagName,
          id: element.id.slice(0, 120),
          testId: element.getAttribute('data-testid')?.slice(0, 120) ?? null,
          connected: element.isConnected,
          inFixedMount: attemptMount?.contains(element) ?? false,
          isFixedTrigger: element === fixedTrigger,
          isFixedContent: element === fixedContent,
        }
      }

      function state() {
        const triggerMatches = attemptMount?.querySelectorAll('[data-testid="calendar:trigger"]')
        const contentMatches = attemptMount?.querySelectorAll('[data-testid="calendar:content"]')
        const triggerStillResolved = triggerMatches?.length === 1 && triggerMatches[0] === fixedTrigger
        const contentStillResolved = contentMatches?.length === 1 && contentMatches[0] === fixedContent
        if (!attemptMount?.isConnected || mount !== attemptMount)
          gap('fixed-mount-detached-or-changed')
        if (!fixedTrigger?.isConnected || !triggerStillResolved)
          gap('fixed-trigger-missing-or-replaced')
        if (!fixedContent?.isConnected || !contentStillResolved)
          gap('fixed-content-missing-or-replaced')
        return {
          triggerStillResolved,
          contentStillResolved,
          trigger: identity(fixedTrigger),
          triggerDisabled: fixedTrigger?.hasAttribute('disabled') ?? null,
          triggerAriaDisabled: fixedTrigger?.getAttribute('aria-disabled')?.slice(0, 120) ?? null,
          triggerDataDisabled: fixedTrigger?.getAttribute('data-disabled')?.slice(0, 120) ?? null,
          triggerState: fixedTrigger?.getAttribute('data-state')?.slice(0, 120) ?? null,
          content: identity(fixedContent),
          contentHidden: fixedContent?.hidden ?? null,
          contentState: fixedContent?.getAttribute('data-state')?.slice(0, 120) ?? null,
          activeElement: identity(document.activeElement),
        }
      }

      function captureMutations(changes: MutationRecord[], delivery: string) {
        const batch = ++mutationBatch
        for (const change of changes) {
          append('attribute', {
            batch,
            delivery,
            target: identity(change.target),
            attribute: change.attributeName,
            oldValue: change.oldValue?.slice(0, 120) ?? null,
            // Delivery-time values are not per-mutation new values or paint evidence.
            deliveredState: state(),
          })
        }
      }

      function captureEvent(event: Event, phase: 'capture' | 'bubble') {
        if (disposed)
          return
        try {
          append('event', {
            type: event.type,
            phase,
            eventPhase: event.eventPhase,
            eventTimeStamp: event.timeStamp,
            isTrusted: event.isTrusted,
            // A sampled canceled default does not establish handler delivery or attribution.
            defaultPrevented: event.defaultPrevented,
            targetInsideFixedTrigger: !!fixedTrigger && event.target instanceof Node && fixedTrigger.contains(event.target),
            eventPathContainsFixedTrigger: !!fixedTrigger && event.composedPath().includes(fixedTrigger),
            target: identity(event.target),
            relatedTarget: identity(event instanceof MouseEvent || event instanceof FocusEvent ? event.relatedTarget : null),
            button: event instanceof MouseEvent ? event.button : null,
            buttons: event instanceof MouseEvent ? event.buttons : null,
            detail: event instanceof MouseEvent ? event.detail : null,
            pointerType: event instanceof PointerEvent ? event.pointerType : null,
            state: state(),
          })
        }
        catch {
          gap('event-callback-error')
        }
      }

      function emit(values: Record<string, unknown>) {
        try {
          console.warn('[calendar-initial-open]', JSON.stringify({ taskId: task.id, retryCount, repeatCount, ...values }))
        }
        catch {
          gap('log-output-error')
        }
      }

      function dispose(reason: string) {
        if (disposed)
          return
        disposed = true
        try {
          if (observer)
            captureMutations(observer.takeRecords(), 'dispose-drain')
        }
        catch {
          gap('observer-drain-error')
        }
        try {
          observer?.disconnect()
        }
        catch {
          gap('observer-disconnect-error')
        }
        for (const registration of registrations) {
          try {
            attemptMount?.removeEventListener(registration.type, registration.listener, registration.capture)
          }
          catch {
            gap('listener-removal-error')
          }
        }
        if (abortRegistered) {
          try {
            signal.removeEventListener('abort', onAbort)
          }
          catch {
            gap('abort-listener-removal-error')
          }
        }
        try {
          append('final-state', { reason, state: state() })
        }
        catch {
          gap('final-snapshot-error')
        }
        for (let offset = 0; offset < observations.length; offset += 16)
          emit({ kind: 'records', reason, chunk: offset / 16, records: observations.slice(offset, offset + 16) })
        emit({ kind: 'summary', reason, observed, recorded: observations.length, omitted, gaps: Array.from(gaps, ([code, count]) => ({ code, count })), incomplete: gaps.size > 0, scope: 'fixed-attempt event/attribute observations; no handler, machine, or painted-visibility verdict' })
      }

      function onAbort() {
        gap('context-aborted')
        dispose('context-aborted')
      }

      try {
        if (signal.aborted) {
          gap('context-already-aborted')
          dispose('unavailable')
          return dispose
        }
        fixedTrigger = attemptMount?.querySelector<HTMLElement>('[data-testid="calendar:trigger"]') ?? null
        fixedContent = attemptMount?.querySelector<HTMLElement>('[data-testid="calendar:content"]') ?? null
        append('initial-state', { state: state() })
        if (!attemptMount || !fixedTrigger || !fixedContent || gaps.size) {
          gap('setup-nodes-unavailable')
          dispose('unavailable')
          return dispose
        }
        observer = new MutationObserver((changes) => {
          if (disposed)
            return
          try {
            captureMutations(changes, 'observer-callback')
          }
          catch {
            gap('mutation-callback-error')
          }
        })
        observer.observe(fixedContent, { attributes: true, attributeOldValue: true, attributeFilter: ['hidden', 'data-state'] })
        observer.observe(fixedTrigger, { attributes: true, attributeOldValue: true, attributeFilter: ['disabled', 'aria-disabled', 'data-disabled', 'data-state'] })
        for (const type of ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'focusin', 'focusout']) {
          for (const capture of [true, false]) {
            const listener: EventListener = event => captureEvent(event, capture ? 'capture' : 'bubble')
            // Track before installation so partial setup can remove every attempted listener.
            registrations.push({ type, listener, capture })
            attemptMount.addEventListener(type, listener, { capture, passive: true })
          }
        }
        abortRegistered = true
        signal.addEventListener('abort', onAbort, { once: true })
        if (signal.aborted)
          onAbort()
      }
      catch {
        gap('setup-error')
        dispose('setup-error')
      }
      return dispose
    }

    const stopInitialOpenObservation = startInitialOpenObservation()

    try {
      record('click-calendar-trigger')
      await testHook.clickTrigger('calendar')
      record('see-content')
      await seeContent()
      stopInitialOpenObservation('initial-open-complete')

      record('create-view-locators')
      const dayView = page.getByTestId('calendar:day-view')
      const monthView = page.getByTestId('calendar:month-view')
      const yearView = page.getByTestId('calendar:year-view')

      record('expect-initial-day-visible')
      await expect.poll(async () => (await dayView.element()).hidden).toBe(false)
      record('expect-initial-month-hidden')
      await expect.poll(async () => (await monthView.element()).hidden).toBe(true)

      record('click-day-view-trigger')
      await page.getByTestId('calendar:view-trigger').click()
      record('expect-day-hidden')
      await expect.poll(async () => (await dayView.element()).hidden).toBe(true)
      record('expect-month-visible')
      await expect.poll(async () => (await monthView.element()).hidden).toBe(false)

      record('click-month-view-trigger')
      await page.getByTestId('calendar:month-trigger').click()
      record('expect-month-hidden')
      await expect.poll(async () => (await monthView.element()).hidden).toBe(true)
      record('expect-year-visible')
      await expect.poll(async () => (await yearView.element()).hidden).toBe(false)
      record('complete', 'pass')
    }
    catch (error) {
      record(stage, 'failure', error)
      throw error
    }
    finally {
      stopInitialOpenObservation('callback-exit')
    }
  })
})
