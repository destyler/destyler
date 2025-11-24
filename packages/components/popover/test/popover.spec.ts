import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Popover'

let mount: HTMLElement | null = null
let cleanup: (() => void) | undefined

async function seeContentIsNotFocused() {
  await expect.element(testHook.getContent('popover')).not.toHaveFocus()
}

async function seeContent() {
  await expect.element(testHook.getContent('popover')).toBeVisible()
}

async function dontSeeContent() {
  await expect.element(testHook.getContent('popover')).not.toBeVisible()
}

async function seeLinkIsFocused() {
  const el = page.getByTestId('focusable-link')
  await expect.element(el).toHaveFocus()
}

async function autoFocusToggle() {
  const el = page.getByTestId('autoFocus')
  await el.click()
}

async function focusTrigger() {
  await testHook.clickOutside()
  await userEvent.tab()
}

async function seeTriggerIsFocused() {
  await expect.element(testHook.getTrigger('popover')).toHaveFocus()
}

async function modalToggle() {
  const el = page.getByTestId('modal')
  await el.click()
}

async function seeButtonAfterIsFocused() {
  const el = page.getByTestId('button-after')
  await expect.element(el).toHaveFocus()
}

describe('popover browser tests', () => {
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

  it('[autoFocus=true] should move focus inside the popover content to the first focusable element', async () => {
    await testHook.clickTrigger('popover')
    await seeContentIsNotFocused()
    await seeLinkIsFocused()
  })

  it('[autoFocus=false] should not focus the content', async () => {
    await autoFocusToggle()
    await testHook.clickTrigger('popover')
    await seeContentIsNotFocused()
  })

  it('[keyboard] should open the Popover on press `Enter`', async () => {
    await focusTrigger()
    await testHook.pressKey('Enter')
    await seeContent()
  })

  it('[keyboard] should close the Popover on press `Escape`', async () => {
    await focusTrigger()
    await testHook.pressKey('Enter')
    await seeContent()
    await testHook.pressKey('Escape')
    await seeContentIsNotFocused()
    await seeTriggerIsFocused()
  })

  it('[keyboard / modal] on tab: should trap focus within popover content', async () => {
    await modalToggle()
    await focusTrigger()
    await testHook.pressKey('Enter')
    await seeLinkIsFocused()
    await testHook.pressKey('Tab', 3)
    await seeLinkIsFocused()
  })

  it('[keyboard / non-modal] on tab outside: should move focus to next tabbable element after button', async () => {
    await focusTrigger()
    await testHook.pressKey('Enter')
    await testHook.pressKey('Tab', 3)
    await seeButtonAfterIsFocused()
  })

  it('[keyboard / non-modal] on shift-tab outside: should move focus to trigger', async () => {
    await focusTrigger()
    await testHook.pressKey('Enter')
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    await seeTriggerIsFocused()
    await seeContent()
  })

  it('[pointer] close the popover on click close button', async () => {
    await testHook.clickTrigger('popover')
    await testHook.clickTrigger('close')
    await dontSeeContent()
    await seeTriggerIsFocused()
  })

  it('[pointer] should to open/close a popover on trigger click', async () => {
    await testHook.clickTrigger('popover')
    await seeContent()
    await testHook.clickTrigger('popover')
    await dontSeeContent()
  })

  it('[pointer] when clicking outside on focusable element, should not re-focus the button', async () => {
    await testHook.clickTrigger('popover')
    await page.getByTestId('button-after').click()

    await expect.element(page.getByTestId('button-after')).toHaveFocus()
    await dontSeeContent()
  })
})
