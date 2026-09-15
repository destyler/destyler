import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Switch'

let mount: HTMLElement | null = null

async function clickSwitch() {
  await userEvent.click(testHook.getRootEl())
}

async function seeChecked() {
  await expect.element(page.getByArticle(testHook.test.hiddenInput)).toBeChecked()
  await expect.element(testHook.getRootEl()).toHaveAttribute('data-state', 'checked')
  await expect.element(testHook.getControlEl()).toHaveAttribute('data-state', 'checked')
  await expect.element(testHook.getLabelEl()).toHaveAttribute('data-state', 'checked')
}

async function seeUnchecked() {
  await expect.element(page.getByArticle(testHook.test.hiddenInput)).not.toBeChecked()
  await expect.element(testHook.getRootEl()).toHaveAttribute('data-state', 'unchecked')
  await expect.element(testHook.getControlEl()).toHaveAttribute('data-state', 'unchecked')
}

async function focusSwitch() {
  await testHook.clickOutside()
  await testHook.pressKey('Tab')
}

async function seeFocused() {
  await expect.element(page.getByArticle(testHook.test.hiddenInput)).toHaveFocus()
  await expect.element(testHook.getControlEl()).toHaveAttribute('data-focus', '')
}

async function seeDisabled() {
  await expect.element(page.getByArticle(testHook.test.hiddenInput)).toBeDisabled()
  await expect.element(testHook.getControlEl()).toHaveAttribute('data-disabled', '')
  await expect.element(testHook.getRootEl()).toHaveAttribute('data-disabled', '')
}

describe('[switch] browser tests', () => {
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

  it('starts unchecked with data-state=unchecked', async () => {
    await seeUnchecked()
  })

  it('should be checked when clicked', async () => {
    await clickSwitch()
    await seeChecked()
  })

  it('should toggle back to unchecked on second click', async () => {
    await clickSwitch()
    await seeChecked()
    await clickSwitch()
    await seeUnchecked()
  })

  it('should be focused when page is tabbed', async () => {
    await focusSwitch()
    await seeFocused()
  })

  it('should be checked when spacebar is pressed while focused', async () => {
    await focusSwitch()
    await testHook.pressKey(' ')
    await seeChecked()
  })

  it('should have disabled attributes when disabled', async () => {
    await page.getByTestId('disabled').click()
    await seeDisabled()
  })

  it('should not be focusable when disabled', async () => {
    await page.getByTestId('disabled').click()
    await focusSwitch()
    await expect.element(page.getByArticle(testHook.test.hiddenInput)).not.toHaveFocus()
  })

  it('should not toggle when readOnly', async () => {
    await page.getByTestId('readOnly').click()
    await clickSwitch()
    await seeUnchecked()
  })
})
