import { testHook } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it } from 'vitest'
import { render } from '../examples/vanilla/Checkbox'

let el: HTMLElement

describe('[checkbox] browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  it('should be checked when clicked', async () => {
    const rootEl = testHook.getRootEl()
    await rootEl.click()
    await expect.element(testHook.getLabelEl()).toHaveAttribute('data-state', 'checked')
    await expect.element(testHook.getControlEl()).toHaveAttribute('data-state', 'checked')
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

    await expect.element(testHook.getRootEl()).toHaveAttribute('data-state', 'checked')
    await expect.element(testHook.getLabelEl()).toHaveAttribute('data-state', 'checked')
    await expect.element(testHook.getControlEl()).toHaveAttribute('data-state', 'checked')
  })

  it('should have disabled attributes when disabled', async () => {
    const disabledEl = page.getByArticle(testHook.test.disabledCheck)
    await disabledEl.click()
    await expect.element(page.getByArticle(testHook.test.hiddenInput)).toBeDisabled()
  })

  it('should not be focusable when disabled', async () => {
    const disabledEl = page.getByArticle(testHook.test.disabledCheck)
    await disabledEl.click()
    await userEvent.tab()
    await expect.element(page.getByArticle(testHook.test.hiddenInput)).not.toHaveFocus()
  })
})
