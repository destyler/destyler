import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
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
    await page.locator(this.first).fill('1')
    await expect.element(page.locator(this.second)).toHaveFocus()
    await page.locator(this.second).fill('2')
    await expect.element(page.locator(this.third)).toHaveFocus()
    await page.locator(this.third).fill('3')
  }

  async OnTypeShouldNotAllowMultipleKeysAtOnce() {
    await page.locator(this.first).fill('12')
    await expect.element(page.locator(this.first)).toHaveValue('2')
  }

  async OnBackspaceShouldClearValueAndMoveFocusToPrevInput() {
    await page.locator(this.first).fill('1')
    await expect.element(page.locator(this.second)).toHaveFocus()
    await page.locator(this.second).fill('2')
    await expect.element(page.locator(this.third)).toHaveFocus()
    await this.pressKey('Backspace')
    await expect.element(page.locator(this.second)).toHaveFocus()
    await expect.element(page.locator(this.second)).toHaveValue('')
  }

  async OnArrowShouldChangeFocusBetweenInputs() {
    // fill out all fields
    await page.locator(this.first).fill('1')
    await page.locator(this.second).fill('2')
    await page.locator(this.third).fill('3')

    // navigate with arrow keys
    await this.pressKey('ArrowLeft')
    await expect.element(page.locator(this.second)).toHaveFocus()
    await this.pressKey('ArrowRight')
    await expect.element(page.locator(this.third)).toHaveFocus()
  }

  async OnClearShouldClearValuesAndFocusFirst() {
    // fill out all fields
    await page.locator(this.first).fill('1')
    await page.locator(this.second).fill('2')
    await page.locator(this.third).fill('3')

    // click clear
    await page.locator(testid('clear')).click()
    await expect.element(page.locator(this.first)).toHaveFocus()
    await expect.element(page.locator(this.first)).toHaveValue('')
    await expect.element(page.locator(this.second)).toHaveValue('')
    await expect.element(page.locator(this.third)).toHaveValue('')
  }

  async OnPasteShouldAutofillAllFields() {
    await this.paste('123')

    await page.locator(this.first).click()

    await userEvent.paste()

    await expect.element(page.locator(this.first)).toHaveValue('1')
    await expect.element(page.locator(this.second)).toHaveValue('2')
    await expect.element(page.locator(this.third)).toHaveValue('3')
    await expect.element(page.locator(this.third)).toHaveFocus()
  }

  async OnPasteShouldAutofillAllFieldsIfFocusedFieldIsNotEmpty() {
    await this.paste('123')

    await page.locator(this.first).fill('1')

    await page.getByTestId('focus').click()

    await userEvent.paste()

    await expect.element(page.locator(this.first)).toHaveValue('1')
    await expect.element(page.locator(this.second)).toHaveValue('2')
    await expect.element(page.locator(this.third)).toHaveValue('3')
    await expect.element(page.locator(this.third)).toHaveFocus()
  }

  async DifferentShouldAllowOnlySingleCharacter() {
    await page.locator(this.first).fill('1')
    await page.locator(this.second).fill('2')
    await page.getByTestId('focus').click()
    await page.locator(this.first).fill('3')
    await expect.element(page.locator(this.first)).toHaveValue('3')
  }

  async SameShouldAllowOnlySingleCharacter() {
    await page.locator(this.first).fill('1')
    await page.locator(this.first).click()
    await page.locator(this.first).fill('1')
    await expect.element(page.locator(this.first)).toHaveValue('1')
  }
}
