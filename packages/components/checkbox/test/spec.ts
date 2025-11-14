import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from 'vitest/browser'
import { expect } from 'vitest'

export class CheckboxTestSuite extends TestSuite {
  input = testid('hidden-input')

  disabledCheck = testid('disabled')

  async ShouldBeCheckedWhenClicked() {
    const rootEL = this.rootEl()
    await rootEL.click()
    await expect.element(this.labelEl()).toHaveAttribute('data-state', 'checked')
    await expect.element(this.labelEl()).toHaveAttribute('data-state', 'checked')
    await expect.element(this.controlEl()).toHaveAttribute('data-state', 'checked')
  }

  async ShouldBeFocusedWhenPageIsTabbed() {
    await userEvent.click(page.getByRole('main'))
    await userEvent.tab()
    await expect.element(page.getByArticle(this.input)).toHaveFocus()
    await expect.element(this.controlEl()).toHaveAttribute('data-focus', '')
  }

  async ShouldBeCheckedWhenSpacebarIsPressedWhileFocused() {
    await userEvent.tab()

    await this.pressKey('Space')

    await expect.element(this.rootEl()).toHaveAttribute('data-state', 'checked')
    await expect.element(this.labelEl()).toHaveAttribute('data-state', 'checked')
    await expect.element(this.controlEl()).toHaveAttribute('data-state', 'checked')
  }

  async ShouldHaveDisabledAttributesWhenDisabled() {
    const disabledEl = page.getByArticle(this.disabledCheck)
    await disabledEl.click()
    await expect.element(page.getByArticle(this.input)).toBeDisabled()
  }

  async ShouldNotBeFocusableWhenDisabled() {
    const disabledEl = page.getByArticle(this.disabledCheck)
    await disabledEl.click()
    await userEvent.tab()
    await expect.element(page.getByArticle(this.input)).not.toHaveFocus()
  }
}
