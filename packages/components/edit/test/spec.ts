import { TestSuite } from '@destyler/shared-private/test'
import { expect } from 'vitest'
import { page, userEvent } from 'vitest/browser'

export class EditTestSuite extends TestSuite {
  previewEl() {
    return page.getByTestId('preview')
  }

  inputEl() {
    return page.getByTestId('input')
  }

  async inputMaxLength(maxLength: number) {
    const maxLengthEl = page.getByTestId('maxLength')
    await maxLengthEl.fill(maxLength.toString())
    await this.pressKey('Enter')
  }

  async selectActivationMode(value: string) {
    const activationModeEl = page.getByTestId('activationMode')
    await activationModeEl.selectOptions(value)
  }

  async dblClickPreview() {
    const previewEl = this.previewEl()
    await userEvent.dblClick(previewEl)
  }

  async seeInput() {
    const inputEl = this.inputEl()
    await expect.element(inputEl).toBeVisible()
  }

  async dontSeeInput() {
    const inputEl = this.inputEl()
    await expect.element(inputEl).not.toBeVisible()
  }

  async seeInputFocused() {
    const inputEl = this.inputEl()
    await expect.element(inputEl).toHaveFocus()
  }

  async focusPreview() {
    await this.previewEl().click()
    await this.waitFor()
  }

  async seeInputHasValue(value: string) {
    return expect.element(this.inputEl()).toHaveValue(value)
  }

  async seePreviewHasValue(value: string) {
    return expect.element(this.previewEl()).toHaveTextContent(value)
  }

  async OnFocusInputShouldBeVisibleAndFocus() {
    await this.focusPreview()
    await this.seeInput()
    await this.seeInputFocused()
  }

  async OnFocusAndBlurShouldRetaionCurrentValue() {
    await this.focusPreview()
    await this.pressKey('Escape')
    await this.seeInputHasValue('Hello World')
  }

  async OnTypeShouldCommitInputValue() {
    await this.focusPreview()
    await this.type('World!')
    await this.pressKey('Enter')

    await this.seePreviewHasValue('World!')
    await this.dontSeeInput()
  }

  async OnTypeAndEscShouldRevertValue() {
    await this.focusPreview()
    await this.type('World!')
    await this.pressKey('Escape')

    await this.seePreviewHasValue('Hello World')
    await this.dontSeeInput()
  }

  async OnTypeAndClickSubmitShouldCommitValue() {
    await this.focusPreview()

    await this.type('World!')
    await this.clickTriggerById('save')

    await this.seePreviewHasValue('World!')
  }

  async OnTypeAndClickOutsideShouldCommitValue() {
    await this.focusPreview()

    await this.type('World!')
    await this.clickOutside()

    await this.seePreviewHasValue('World!')
  }

  async MaxLength4ShouldRespectMaxLength() {
    await this.inputMaxLength(4)

    await this.focusPreview()

    await userEvent.keyboard('Worlds')

    await this.seeInputHasValue('Worl')

    await this.pressKey('Backspace')

    await this.type('d')

    await this.seeInputHasValue('Word')
  }

  async ActivationModeDblClickOnFocusAndBlurShouldRetainCurrentValue() {
    await this.selectActivationMode('dblclick')

    await this.dblClickPreview()

    await this.pressKey('Escape')

    await this.seePreviewHasValue('Hello World')
  }

  async OnClickEditShouldEnterEditMode() {
    await this.clickTriggerById('edit')

    await this.seeInput()

    await this.seeInputFocused()
  }
}
