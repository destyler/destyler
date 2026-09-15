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
})
