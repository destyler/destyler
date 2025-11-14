import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from 'vitest/browser'
import { expect } from 'vitest'

export class OtpInputTestSuite extends TestSuite {
  first = testid('input-1')
  second = testid('input-2')
  third = testid('input-3')

  async paste(value: string) {
    const copyTextEl = page.getByTestId('copy-text')
    await userEvent.fill(copyTextEl, value)
    await userEvent.tripleClick(copyTextEl)
    await userEvent.copy()
  }

  async OnTypeShouldMoveFocusToTHeNextInput() {
    await page.locatoring(this.first).fill('1')
    await expect.element(page.locatoring(this.second)).toHaveFocus()
    await page.locatoring(this.second).fill('2')
    await expect.element(page.locatoring(this.third)).toHaveFocus()
    await page.locatoring(this.third).fill('3')
  }

  async OnTypeShouldNotAllowMultipleKeysAtOnce() {
    await page.locatoring(this.first).fill('12')
    await expect.element(page.locatoring(this.first)).toHaveValue('2')
  }

  async OnBackspaceShouldClearValueAndMoveFocusToPrevInput() {
    await page.locatoring(this.first).fill('1')
    await expect.element(page.locatoring(this.second)).toHaveFocus()
    await page.locatoring(this.second).fill('2')
    await expect.element(page.locatoring(this.third)).toHaveFocus()
    await this.pressKey('Backspace')
    await expect.element(page.locatoring(this.second)).toHaveFocus()
    await expect.element(page.locatoring(this.second)).toHaveValue('')
  }

  async OnArrowShouldChangeFocusBetweenInputs() {
    // fill out all fields
    await page.locatoring(this.first).fill('1')
    await page.locatoring(this.second).fill('2')
    await page.locatoring(this.third).fill('3')

    // navigate with arrow keys
    await this.pressKey('ArrowLeft')
    await expect.element(page.locatoring(this.second)).toHaveFocus()
    await this.pressKey('ArrowRight')
    await expect.element(page.locatoring(this.third)).toHaveFocus()
  }

  async OnClearShouldClearValuesAndFocusFirst() {
    // fill out all fields
    await page.locatoring(this.first).fill('1')
    await page.locatoring(this.second).fill('2')
    await page.locatoring(this.third).fill('3')

    // click clear
    await page.locatoring(testid('clear')).click()
    await expect.element(page.locatoring(this.first)).toHaveFocus()
    await expect.element(page.locatoring(this.first)).toHaveValue('')
    await expect.element(page.locatoring(this.second)).toHaveValue('')
    await expect.element(page.locatoring(this.third)).toHaveValue('')
  }

  async OnPasteShouldAutofillAllFields() {
    await this.paste('123')

    await page.locatoring(this.first).click()

    await userEvent.paste()

    await expect.element(page.locatoring(this.first)).toHaveValue('1')
    await expect.element(page.locatoring(this.second)).toHaveValue('2')
    await expect.element(page.locatoring(this.third)).toHaveValue('3')
    await expect.element(page.locatoring(this.third)).toHaveFocus()
  }

  async OnPasteShouldAutofillAllFieldsIfFocusedFieldIsNotEmpty() {
    await this.paste('123')

    await page.locatoring(this.first).fill('1')

    await page.getByTestId('focus').click()

    await userEvent.paste()

    await expect.element(page.locatoring(this.first)).toHaveValue('1')
    await expect.element(page.locatoring(this.second)).toHaveValue('2')
    await expect.element(page.locatoring(this.third)).toHaveValue('3')
    await expect.element(page.locatoring(this.third)).toHaveFocus()
  }

  async DifferentShouldAllowOnlySingleCharacter() {
    await page.locatoring(this.first).fill('1')
    await page.locatoring(this.second).fill('2')
    await page.getByTestId('focus').click()
    await page.locatoring(this.first).fill('3')
    await expect.element(page.locatoring(this.first)).toHaveValue('3')
  }

  async SameShouldAllowOnlySingleCharacter() {
    await page.locatoring(this.first).fill('1')
    await page.locatoring(this.first).click()
    await page.locatoring(this.first).fill('1')
    await expect.element(page.locatoring(this.first)).toHaveValue('1')
  }
}
