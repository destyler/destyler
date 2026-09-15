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


  it('should switch between day, month, and year views', async () => {
    await testHook.clickTrigger('calendar')
    await seeContent()

    const dayView = page.getByTestId('calendar:day-view')
    const monthView = page.getByTestId('calendar:month-view')
    const yearView = page.getByTestId('calendar:year-view')

    await expect.poll(async () => (await dayView.element()).hidden).toBe(false)
    await expect.poll(async () => (await monthView.element()).hidden).toBe(true)

    await page.getByTestId('calendar:view-trigger').click()
    await expect.poll(async () => (await dayView.element()).hidden).toBe(true)
    await expect.poll(async () => (await monthView.element()).hidden).toBe(false)

    await page.getByTestId('calendar:month-trigger').click()
    await expect.poll(async () => (await monthView.element()).hidden).toBe(true)
    await expect.poll(async () => (await yearView.element()).hidden).toBe(false)
  })
})
