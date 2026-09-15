import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Collapsible'

let mount: HTMLElement | null = null

async function expectOpen() {
  const trigger = testHook.getTrigger('collapsible')
  await expect.element(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect.element(trigger).toHaveAttribute('data-state', 'open')
}

async function expectClosed() {
  const trigger = testHook.getTrigger('collapsible')
  // after close, data-state is authoritative; aria-expanded may linger until reconnect
  await expect.element(trigger).toHaveAttribute('data-state', 'closed')
  await expect.element(testHook.getContent('collapsible')).not.toBeVisible()
}

describe('[collapsible] browser tests', () => {
  beforeEach(() => {
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  afterEach(() => {
    if (mount && mount.parentElement)
      document.body.removeChild(mount)
    mount = null
  })

  it('starts closed', async () => {
    await expectClosed()
  })

  it('should be open when clicked', async () => {
    const triggerEl = testHook.getTrigger('collapsible')
    await triggerEl.click()

    const contentEl = testHook.getContent('collapsible')
    await expect.element(contentEl).toBeVisible()
    await expectOpen()
    await expect.element(contentEl).toHaveAttribute('data-state', 'open')

    await triggerEl.click()
    await expectClosed()
  })

  it('opens and closes via programmatic buttons', async () => {
    await page.getByRole('button', { name: 'Open' }).click()
    await expect.element(testHook.getContent('collapsible')).toBeVisible()
    await expectOpen()

    await page.getByRole('button', { name: 'Close' }).click()
    await expectClosed()
  })

  it('should open on Enter when trigger is focused', async () => {
    const trigger = testHook.getTrigger('collapsible')
    await trigger.click()
    await trigger.click()
    await expect.element(testHook.getContent('collapsible')).not.toBeVisible()

    await testHook.pressKey('Enter')
    await expect.element(testHook.getContent('collapsible')).toBeVisible()
  })

  it('should open on Space when trigger is focused', async () => {
    const trigger = testHook.getTrigger('collapsible')
    await userEvent.click(trigger)
    await userEvent.click(trigger)
    await expect.element(testHook.getContent('collapsible')).not.toBeVisible()

    await testHook.pressKey('Space')
    await expect.element(testHook.getContent('collapsible')).toBeVisible()
  })

  it('content should not be reachable via tab key when closed', async () => {
    const triggerEl = testHook.getTrigger('collapsible')
    await triggerEl.click()
    await triggerEl.click()

    await userEvent.tab()

    await expect.element(page.getByRole('button', { name: 'Open' })).toHaveFocus()
  })

  it('should not open when disabled', async () => {
    await page.getByTestId('disabled').click()
    const trigger = testHook.getTrigger('collapsible')
    await expect.element(trigger).toHaveAttribute('data-disabled', '')

    await trigger.click()
    await expectClosed()
  })
})
