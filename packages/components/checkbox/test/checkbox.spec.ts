import { testHook } from '@destyler/shared-private/test'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Checkbox'

let mount: HTMLElement | null = null

async function seeChecked() {
  await expect.element(testHook.getRootEl()).toHaveAttribute('data-state', 'checked')
  await expect.element(testHook.getLabelEl()).toHaveAttribute('data-state', 'checked')
  await expect.element(testHook.getControlEl()).toHaveAttribute('data-state', 'checked')
  await expect.element(page.getByArticle(testHook.test.hiddenInput)).toBeChecked()
}

async function seeUnchecked() {
  await expect.element(testHook.getRootEl()).toHaveAttribute('data-state', 'unchecked')
  await expect.element(testHook.getLabelEl()).toHaveAttribute('data-state', 'unchecked')
  await expect.element(testHook.getControlEl()).toHaveAttribute('data-state', 'unchecked')
  await expect.element(page.getByArticle(testHook.test.hiddenInput)).not.toBeChecked()
}

describe('[checkbox] browser tests', () => {
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
    await testHook.getRootEl().click()
    await seeChecked()
  })

  it('should toggle back to unchecked on second click', async () => {
    await testHook.getRootEl().click()
    await seeChecked()

    await testHook.getRootEl().click()
    await seeUnchecked()
  })

  it('should be focused when page is tabbed', async () => {
    await userEvent.click(page.getByRole('main'))
    await userEvent.tab()
    await expect.element(page.getByArticle(testHook.test.hiddenInput)).toHaveFocus()
    await expect.element(testHook.getControlEl()).toHaveAttribute('data-focus', '')
  })

  it('should be checked when spacebar is pressed while focused', async () => {
    await userEvent.tab()
    await testHook.pressKey('Space')
    await seeChecked()
  })

  it('should have disabled attributes when disabled', async () => {
    const disabledEl = page.getByArticle(testHook.test.disabledCheck)
    await disabledEl.click()
    await expect.element(page.getByArticle(testHook.test.hiddenInput)).toBeDisabled()
    await expect.element(testHook.getControlEl()).toHaveAttribute('data-disabled', '')
    await expect.element(testHook.getRootEl()).toHaveAttribute('data-disabled', '')
  })

  it('should not be focusable when disabled', async () => {
    const disabledEl = page.getByArticle(testHook.test.disabledCheck)
    await disabledEl.click()
    await userEvent.tab()
    await expect.element(page.getByArticle(testHook.test.hiddenInput)).not.toHaveFocus()
  })

  it('should not toggle when readOnly', async () => {
    await page.getByTestId('readOnly').click()
    await testHook.getRootEl().click()
    await seeUnchecked()
  })
})
