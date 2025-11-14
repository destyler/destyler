import { TestSuite } from '@destyler/shared-private/test'
import { expect } from 'vitest'
import { page, userEvent } from 'vitest/browser'

export class NumberInputTestSuite extends TestSuite {
  async changeStep(step: string) {
    const stepInput = page.getByTestId('step')
    await stepInput.fill(step)
    await this.pressKey('Enter')
  }

  async seeInputHasValue(value: string) {
    const inputEl = page.getByTestId('input')
    await expect.element(inputEl).toHaveValue(value)
  }

  async seeInputIsInvalid() {
    const inputEl = page.getByTestId('input')
    await expect.element(inputEl).toHaveAttribute('aria-invalid', 'true')
  }

  async ShouldAllowTypingEmptyStringValue() {
    await this.type('12')
    await this.pressKey('Backspace', 2)
    await this.seeInputHasValue('')
  }

  async ShouldClampValueWhenBlurred() {
    await this.type('200')
    await this.seeInputIsInvalid()
    await this.clickOutside()
    await this.seeInputHasValue('100')
  }

  async ShouldClampValueWhenInputIsEmpty() {
    await this.type('5')
    await this.pressKey('Backspace')
    await this.clickOutside()
    await this.seeInputHasValue('')
  }

  async ShouldIncrementWithArrowUp() {
    await this.type('5')
    await this.pressKey('ArrowUp')
    await this.seeInputHasValue('6')
  }

  async ClickingIncrement() {
    await this.clickTriggerById('inc')
    await this.seeInputHasValue('1')
  }

  async ShouldDecrementTheValue() {
    await this.type('5')
    await this.pressKey('ArrowDown', 2)
    await this.seeInputHasValue('3')
  }

  async ClickingDecrement() {
    await this.type('5')
    await this.clickTriggerById('dec')
    await this.seeInputHasValue('4')
  }

  async PressingEnterShouldMakeUpDownStillWork() {
    await this.type('5')
    await this.pressKey('Enter')
    await this.pressKey('ArrowDown')
    await this.seeInputHasValue('4')

    await this.pressKey('ArrowUp')
    await this.seeInputHasValue('5')
  }

  async ShouldSetValueToMinOrMaxOnHomeOrEndKeys() {
    await this.type('5')
    await this.pressKey('Home')
    await this.seeInputHasValue('0')

    await this.pressKey('End')
    await this.seeInputHasValue('100')
  }

  async ShiftAndArrowUpShouldChange10Steps() {
    await this.type('0')

    await this.pressKey('ArrowUp')
    await this.seeInputHasValue('1')

    await userEvent.keyboard('{Shift>}{ArrowUp}{/Shift}')
    await this.seeInputHasValue('11')

    await userEvent.keyboard('{Shift>}{ArrowDown}{/Shift}')
    await this.seeInputHasValue('1')

    await this.pressKey('ArrowDown')
    await this.seeInputHasValue('0')
  }

  async CtrlAndArrowUpShouldChangeFor0_1Steps() {
    await this.changeStep('0.1')
    await this.waitFor()

    const inputEl = page.getByTestId('input')
    await inputEl.fill('0.1')

    await userEvent.keyboard('{Control>}{ArrowUp}{/Control}')
    await this.seeInputHasValue('0.11')

    await userEvent.keyboard('{Control>}{ArrowDown}{/Control}')
    await this.seeInputHasValue('0.1')

    await this.pressKey('ArrowDown')
    await this.seeInputHasValue('0')
  }

  async IncClickShouldIncrementValue() {
    await this.clickTriggerById('inc')
    await this.seeInputHasValue('1')
  }

  async DecClickShouldIncrementValue() {
    await this.type('5')
    await this.clickTriggerById('dec')
    await this.seeInputHasValue('4')
  }
}
