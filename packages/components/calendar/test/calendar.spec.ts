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

  it('should switch between day, month, and year views', async ({ task }) => {
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
          inMount: mount?.contains(element) ?? false,
          hidden: element instanceof HTMLElement ? element.hidden : null,
          state: element.getAttribute('data-state')?.slice(0, 120) ?? null,
          ariaHidden: element.getAttribute('aria-hidden')?.slice(0, 120) ?? null,
        })
        const elements = ['content', 'day-view', 'month-view', 'year-view', 'view-trigger', 'month-trigger'].map((part) => {
          const matches = document.querySelectorAll(`[data-testid="calendar:${part}"]`)
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
          mount: { connected: mount?.isConnected ?? false, children: mount?.childElementCount ?? 0, cleanupPresent: typeof cleanup === 'function', changed: mount !== attemptMount, attemptConnected: attemptMount?.isConnected ?? false },
          calendarRoots: document.querySelectorAll('[data-calendar-root]').length,
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

    try {
      record('click-calendar-trigger')
      await testHook.clickTrigger('calendar')
      record('see-content')
      await seeContent()

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
  })
})
