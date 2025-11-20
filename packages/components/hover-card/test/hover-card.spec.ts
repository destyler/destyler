import { part, testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/HoverCard'

let mount: HTMLElement | null = null

const triggerEl = () => page.getByArticle(part('trigger'))
const contentEl = () => page.getByArticle(part('content'))
const testClickEl = () => page.getByTestId('hover-card-test-click')

const clickOutside = () => testHook.clickOutside()

async function focusTrigger() {
  await clickOutside()
  await userEvent.tab()
}

async function clickMain() {
  await userEvent.click(testClickEl())
}

async function waitForStability(interval = 350) {
  await vi.waitFor(async () => true, {
    timeout: 5000,
    interval,
  })
}

describe('hover-card browser tests', () => {
  beforeEach(() => {
    if (mount) {
      document.body.removeChild(mount)
    }
    mount = document.createElement('div')
    document.body.appendChild(mount)
    render(mount)
  })

  it('content should be hidden by default', async () => {
    await expect.element(document.body).not.toContainElement(contentEl())
  })

  it('should be opened after hovering trigger', async () => {
    await clickMain()
    await userEvent.hover(triggerEl())
    await waitForStability()
    await expect.element(contentEl()).toBeVisible()
  })

  it('should be opened after focusing trigger', async () => {
    await focusTrigger()
    await waitForStability()
    await expect.element(contentEl()).toBeVisible()
  })

  it('should be closed after blurring trigger', async () => {
    await focusTrigger()
    await waitForStability()
    await expect.element(contentEl()).toBeVisible()

    await userEvent.tab()
    await waitForStability()
    await expect.element(document.body).not.toContainElement(contentEl())
  })

  it('should be closed after blurring trigger with keyboard', async () => {
    await clickMain()
    await userEvent.tab()
    await waitForStability()
    await expect.element(contentEl()).toBeVisible()

    await userEvent.tab()
    await waitForStability()
    await expect.element(document.body).not.toContainElement(contentEl())
  })

  it('should remain open after blurring trigger if pointer opens card', async () => {
    const trigger = triggerEl()
    await userEvent.hover(trigger)
    await waitForStability()
    await expect.element(contentEl()).toBeVisible()

    await focusTrigger()
    await waitForStability()
    await expect.element(contentEl()).toBeVisible()

    await userEvent.unhover(trigger)
    await waitForStability()
    await expect.element(contentEl()).toBeVisible()

    await userEvent.hover(testClickEl())
    await waitForStability()
    await expect.element(document.body).not.toContainElement(contentEl())
  })

  it('should remain open after moving from trigger to content', async () => {
    const trigger = triggerEl()
    const content = contentEl()

    await trigger.hover()
    await waitForStability()
    await expect.element(content).toBeVisible()

    await content.hover()
    await expect.element(content).toBeVisible()
  })
})
