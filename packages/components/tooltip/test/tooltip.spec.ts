import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Tooltip'

let mountEl: HTMLElement
let cleanup: (() => void) | undefined

async function seeContent(id: string) {
  await expect.element(testHook.getContent(id).first()).toBeVisible()
}

async function dontSeeContent(id: string) {
  await expect.element(testHook.getContent(id).first()).not.toBeVisible()
}

async function focusPage() {
  await userEvent.click(page.getByTestId('focus'))
}

async function setNumberControl(id: string, value: number) {
  const control = page.getByTestId(id)
  await control.fill(String(value))
  const el = await control.element()
  el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
}

async function seeTriggerIsFocused(id: string) {
  await expect.element(testHook.getTrigger(id).first()).toHaveFocus()
}

describe('[tooltip] browser tests', () => {
  beforeEach(() => {
    mountEl = document.createElement('div')
    document.body.appendChild(mountEl)
    cleanup = render(mountEl)
  })

  afterEach(() => {
    cleanup?.()
    cleanup = undefined

    if (mountEl && mountEl.parentElement) {
      document.body.removeChild(mountEl)
    }
  })

  it('trigger starts with data-state=closed', async () => {
    await expect.element(testHook.getTrigger('tip-1').first()).toHaveAttribute('data-state', 'closed')
  })

  it('should open tooltip on hover interaction', async () => {
    await testHook.hoverTrigger('tip-1')
    await seeContent('tip-1')
    await expect.element(testHook.getTrigger('tip-1').first()).toHaveAttribute('data-state', 'open')
    await expect.element(testHook.getContent('tip-1').first()).toHaveAttribute('data-state', 'open')
    await expect.element(testHook.getContent('tip-1').first()).toHaveAttribute('role', 'tooltip')

    await testHook.unhoverTrigger('tip-1')
    await dontSeeContent('tip-1')
    await expect.element(testHook.getTrigger('tip-1').first()).toHaveAttribute('data-state', 'closed')
  })

  it('sets aria-describedby on trigger while open', async () => {
    await testHook.hoverTrigger('tip-1')
    await seeContent('tip-1')

    const trigger = await testHook.getTrigger('tip-1').first().element()
    const content = await testHook.getContent('tip-1').first().element()
    expect(trigger.getAttribute('aria-describedby')).toBe(content.id)

    await testHook.unhoverTrigger('tip-1')
    await dontSeeContent('tip-1')
    expect(trigger.getAttribute('aria-describedby')).toBeNull()
  })

  it('should show only one tooltip at a time', async () => {
    await testHook.hoverTrigger('tip-1')
    await testHook.hoverTrigger('tip-2')
    await dontSeeContent('tip-1')
    await seeContent('tip-2')
  })

  it('should work with focus/blur', async () => {
    await focusPage()
    await testHook.pressKey('Tab')

    await seeContent('tip-1')

    await testHook.clickOutside()
    await dontSeeContent('tip-1')
  })

  it('should work with focus/blur for multiple tooltips', async () => {
    await focusPage()
    await testHook.pressKey('Tab')

    await seeContent('tip-1')

    await testHook.pressKey('Tab')
    await seeTriggerIsFocused('tip-2')

    await dontSeeContent('tip-1')
    await seeContent('tip-2')
  })

  it('closes on esc press', async () => {
    await focusPage()
    await testHook.pressKey('Tab')

    await seeContent('tip-1')

    await testHook.pressKey('Escape')
    await dontSeeContent('tip-1')
    await expect.element(testHook.getTrigger('tip-1').first()).toHaveAttribute('data-state', 'closed')
  })

  it('[disabled] does not open on hover', async () => {
    await page.getByTestId('disabled').click()
    await testHook.hoverTrigger('tip-1')
    await expect.element(testHook.getContent('tip-1').first(), { timeout: 300 }).not.toBeVisible()
  })

  it('[interactive=true] keeps content open while hovering tooltip content', async () => {
    await page.getByTestId('interactive').click()
    await setNumberControl('closeDelay', 200)

    await testHook.hoverTrigger('tip-1')
    await seeContent('tip-1')

    await page.getByTestId('tip-1:content').first().hover()
    await vi.waitFor(async () => {
      await expect.element(testHook.getContent('tip-1').first()).toBeVisible()
    }, { timeout: 1000 })
    await expect.element(testHook.getContent('tip-1').first()).toHaveAttribute('data-state', 'open')
  })

  it('[openDelay] waits before opening on hover', async () => {
    await setNumberControl('openDelay', 300)

    await testHook.hoverTrigger('tip-1')
    await expect.element(testHook.getContent('tip-1').first(), { timeout: 80 }).not.toBeVisible()
    await seeContent('tip-1')
  })

  it('[closeOnPointerDown=false][closeOnClick=false] keeps tooltip open on trigger click', async () => {
    await page.getByTestId('closeOnPointerDown').click()
    await page.getByTestId('closeOnClick').click()

    await testHook.hoverTrigger('tip-1')
    await seeContent('tip-1')

    await testHook.clickTrigger('tip-1')
    await seeContent('tip-1')
  })
})
