import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/Switch'

let el: HTMLElement

async function clickCheckbox() {
  const rootEl = testHook.getRootEl()
  await userEvent.click(rootEl)
}

async function seeCheckboxIsChecked() {
  const inputEl = page.getByArticle(testHook.test.hiddenInput)
  await expect.element(inputEl).toBeChecked()
}

async function focusCheckbox() {
  await testHook.clickOutside()
  await testHook.pressKey('Tab')
}

async function seeCheckboxIsFocused() {
  const inputEl = page.getByArticle(testHook.test.hiddenInput)
  await expect.element(inputEl).toHaveFocus()
  const controlEl = testHook.getControlEl()
  await expect.element(controlEl).toHaveAttribute('data-focus', '')
}

async function seeCheckboxIsDisabled() {
  const inputEl = page.getByArticle(testHook.test.hiddenInput)
  await expect.element(inputEl).toBeDisabled()
  const controlEl = testHook.getControlEl()
  await expect.element(controlEl).toHaveAttribute('data-disabled', '')
}

async function clickDisabled() {
  const el = page.getByTestId('disabled')
  await userEvent.click(el)
}

describe('[switch] browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  it('should be checked when clicked', async () => {
    await clickCheckbox()
    await seeCheckboxIsChecked()
  })

  it('should be focused when page is tabbed', async () => {
    await focusCheckbox()
    await seeCheckboxIsFocused()
  })

  it('should be checked when spacebar is pressed while focused', async () => {
    await focusCheckbox()
    await testHook.pressKey(' ')
    await seeCheckboxIsChecked()
  })

  it('should have disabled attributes when disabled', async () => {
    await clickDisabled()
    await seeCheckboxIsDisabled()
  })
})
