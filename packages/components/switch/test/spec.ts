import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class SwitchTestSuite extends TestSuite {
  async clickDisabled() {
    const el = page.getByTestId('disabled')
    await userEvent.click(el)
  }

  async clickCheckbox() {
    const rootEl = this.rootEl()
    await userEvent.click(rootEl)
  }

  async focusCheckbox() {
    const clickEl = page.getByTestId('click')
    await clickEl.click()
    await this.pressKey('Tab')
  }

  async seeCheckboxIsFocused() {
    const inputEl = page.getByTestId('input')
    await expect.element(inputEl).toHaveFocus()
    const controlEl = page.getByTestId('control')
    await expect.element(controlEl).toHaveAttribute('data-focus', '')
  }

  async seeCheckboxIsNotFocused() {
    const inputEl = page.getByTestId('input')
    await expect.element(inputEl).not.toHaveFocus()
    const controlEl = page.getByTestId('control')
    await expect.element(controlEl).not.toHaveAttribute('data-focus', '')
  }

  async seeCheckboxIsDisabled() {
    const inputEl = page.getByTestId('input')
    await expect.element(inputEl).toBeDisabled()
    const controlEl = page.getByTestId('control')
    await expect.element(controlEl).toHaveAttribute('data-disabled', '')
  }

  async seeCheckboxIsChecked() {
    const inputEl = page.getByTestId('input')
    await expect.element(inputEl).toBeChecked()
  }

  async ShouldBeCheckedWhenClicked() {
    await this.clickCheckbox()
    await this.seeCheckboxIsChecked()
  }

  async ShouldBeFOcusedWhenPageIsTabbed() {
    await this.focusCheckbox()
    await this.seeCheckboxIsFocused()
  }

  async ShouldBeCheckedWhenSpacebarIsPressedWhileFocused() {
    await this.focusCheckbox()
    await this.pressKey(' ')
    await this.seeCheckboxIsChecked()
  }

  async ShouldHaveDisabledAttributesWhenDisabled() {
    await this.clickDisabled()
    await this.seeCheckboxIsDisabled()
  }
}
