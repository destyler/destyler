import { TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from 'vitest/browser'
import { expect } from 'vitest'

export class PopoverTestSuite extends TestSuite {
  async focusTrigger() {
    await this.clickOutside()
    await userEvent.tab()
  }

  async seeTriggerIsFocused() {
    await expect.element(this.triggerEl()).toHaveFocus()
  }

  async seeContent() {
    await expect.element(this.contentEl()).toBeVisible()
  }

  async dontSeeContent() {
    await expect.element(this.contentEl()).not.toBeVisible()
  }

  async seeContentIsNotFocused() {
    await expect.element(this.contentEl()).not.toHaveFocus()
  }

  async seeLinkIsFocused() {
    const el = page.getByTestId('focusable-link')
    await expect.element(el).toHaveFocus()
  }

  async seeButtonAfterIsFocused() {
    const el = page.getByTestId('button-after')
    await expect.element(el).toHaveFocus()
  }

  async autoFocusToggle() {
    const el = page.getByTestId('autoFocus')
    await el.click()
  }

  async modalToggle() {
    const el = page.getByTestId('modal')
    await el.click()
  }

  async AutoFocusShouldMoveFocusInsideThePopoverContentToTheFirstFocusableElement() {
    await this.clickTrigger()
    await this.seeContent()
    await this.seeLinkIsFocused()
  }

  async AutoFocusFalseShouldNotFocusTheContent() {
    await this.autoFocusToggle()
    await this.clickTrigger()
    await this.seeContentIsNotFocused()
  }

  async KeyboardShouldOpenThePopoverOnPressEnter() {
    await this.focusTrigger()
    await this.pressKey('Enter')
    await this.seeContent()
  }

  async KeyboardShouldCloseThePopoverOnPressEscape() {
    await this.focusTrigger()
    await this.pressKey('Enter')
    await this.seeContent()
    await this.pressKey('Escape')
    await this.seeContentIsNotFocused()
    await this.seeTriggerIsFocused()
  }

  async KeyboardModalOnTabShouldTrapFocusWithinPopoverContent() {
    await this.modalToggle()

    await this.focusTrigger()
    await this.pressKey('Enter')
    await this.seeLinkIsFocused()
    await this.pressKey('Tab', 3)
    await this.seeLinkIsFocused()
  }

  async KeyboardNonModalOnTabShouldMoveFocusToNextTabbableElementAfterButton() {
    await this.focusTrigger()
    await this.pressKey('Enter')
    await this.pressKey('Tab', 3)
    await this.seeButtonAfterIsFocused()
  }

  async KeyboardNonModalOnShiftTabShouldMoveFocusToTrigger() {
    await this.focusTrigger()
    await this.pressKey('Enter')
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    await this.seeTriggerIsFocused()
    await this.seeContent()
  }

  async PointerCloseThePopoverOnClickCloseButton() {
    await this.clickTrigger()
    await this.clickClose()
    await this.dontSeeContent()
    await this.seeTriggerIsFocused()
  }

  async PointerShouldToOPenOrCloseAPopoverOnTriggerClick() {
    await this.clickTrigger()
    await this.seeContent()
    await this.clickTrigger()
    await this.dontSeeContent()
  }

  async PointerWhenClickingOutsideOnFocusableElementShouldNotReFocusTheButton() {
    await this.clickTrigger()
    await page.getByTestId('button-after').click()

    await expect.element(page.getByTestId('button-after')).toHaveFocus()
    await this.dontSeeContent()
  }
}
