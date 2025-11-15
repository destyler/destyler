import { TestSuite } from '@destyler/shared-private/test'
import { expect } from 'vitest'
import { page } from 'vitest/browser'

export class ComboboxTestSuite extends TestSuite {
  getItem(text: string) {
    return this.itemEls().filter({ hasText: text })
  }

  async hoverItem(text: string) {
    const itemEl = this.getItem(text)
    await itemEl.hover()
  }

  async clickItem(text: string) {
    const itemEl = this.getItem(text)
    await itemEl.click()
  }

  async clickClearTrigger() {
    const clearTriggerEl = this.clearEl()
    await clearTriggerEl.click()
  }

  async seeDropdown() {
    const contentEl = this.contentEl()
    await expect.element(contentEl).toBeVisible()
  }

  async dontSeeDropdown() {
    const contentEl = this.contentEl()
    await expect.element(contentEl).not.toBeVisible()
  }

  async seeInputIsFocused() {
    const inputEl = this.inputEl()

    await expect.element(inputEl).toHaveFocus()
  }

  async seeItemIsHighlighted(text: string) {
    const itemEl = this.getItem(text)

    await expect.element(itemEl).toHaveAttribute('data-highlighted', '')
  }

  async seeItemIsNotChecked(text: string) {
    const itemEl = this.getItem(text)
    await expect.element(itemEl).not.toHaveAttribute('data-state', 'checked')
  }

  async seeInputHasValue(text: string) {
    const inputEl = this.inputEl()
    await expect.element(inputEl).toHaveValue(text)
  }

  async seeItemIsChecked(text: string) {
    const itemEl = this.getItem(text)
    await expect.element(itemEl).toHaveAttribute('data-state', 'checked')
  }

  async ShouldOpenComboboxMenuWhenArrowIsClicked() {
    await this.clickTrigger()

    await this.seeDropdown()

    await this.seeInputIsFocused()
  }

  async EscapeShouldCloseContent() {
    await this.clickTrigger()

    await this.seeDropdown()

    await this.pressKey('Escape')

    await this.dontSeeDropdown()
  }

  async ShouldOpenComboboxMenuWhenTyping() {
    await this.type('can')
    await this.seeDropdown()
    await this.seeItemIsHighlighted('Canada')

    await this.pressKey('Enter')
    await this.seeInputHasValue('Canada')
    await this.dontSeeDropdown()
  }

  async PointerAndSelection() {
    await this.clickTrigger()

    await this.hoverItem('Zambia')

    await this.seeItemIsHighlighted('Zambia')

    await this.clickItem('Zambia')

    await this.seeInputHasValue('Zambia')

    await this.dontSeeDropdown()
  }

  async SelectAndSelectAgain() {
    await this.clickTrigger()

    await this.clickItem('Zambia')
    await this.seeInputHasValue('Zambia')

    await this.clickTrigger()
    await this.clickItem('Canada')
    await this.seeInputHasValue('Canada')
  }

  async OnArrowDownOpenAndHighlightFirstEnabledOption() {
    await this.focusInput()

    await this.pressKey('ArrowDown')

    await this.seeDropdown()
    await this.seeItemIsHighlighted('Zambia')

    await this.pressKey('ArrowUp')
    await this.seeItemIsHighlighted('Tunisia')
  }

  async NoLoopOnArrowDownOpenAndHighlightFirstEnabledOption() {
    await page.getByTestId('loopFocus').click()

    await this.focusInput()

    await this.pressKey('ArrowDown')

    await this.seeDropdown()
    await this.seeItemIsHighlighted('Zambia')

    await this.pressKey('ArrowUp')
    await this.seeItemIsHighlighted('Zambia')
  }

  async OnArrowUpOpenAndHighlightLastEnabledOption() {
    await this.focusInput()

    await this.pressKey('ArrowUp')

    await this.seeDropdown()
    await this.seeItemIsHighlighted('Tunisia')
  }

  async NoLoopOnArrowUpOpenAndHighlightLastEnabledOption() {
    await page.getByTestId('loopFocus').click()

    await this.focusInput()

    await this.pressKey('ArrowUp')

    await this.seeDropdown()
    await this.seeItemIsHighlighted('Tunisia')
  }

  async OnHomeAndEndFocusFirstAndLastOption() {
    await this.clickTrigger()

    await this.pressKey('ArrowDown')
    await this.pressKey('ArrowDown')
    await this.pressKey('ArrowDown')

    await this.seeItemIsHighlighted('Canada')

    await this.pressKey('Home')
    await this.seeItemIsHighlighted('Zambia')

    await this.pressKey('End')
    await this.seeItemIsHighlighted('Tunisia')
  }

  async KeyBoardArrowDownLoop() {
    await this.type('mal')

    await this.pressKey('ArrowDown')
    await this.pressKey('ArrowDown')
    await this.pressKey('ArrowDown')
    await this.pressKey('ArrowDown')

    await this.seeItemIsHighlighted('Malta')

    await this.pressKey('ArrowDown')
    await this.seeItemIsHighlighted('Malawi')
  }

  async KeyBoardArrowDownNoLoop() {
    await page.getByTestId('loopFocus').click()

    await this.type('mal')

    await this.pressKey('ArrowDown')
    await this.pressKey('ArrowDown')
    await this.pressKey('ArrowDown')
    await this.pressKey('ArrowDown')

    await this.seeItemIsHighlighted('Malta')

    await this.pressKey('ArrowDown')
    await this.seeItemIsHighlighted('Malta')
  }

  async KeyBoardArrowUpLoop() {
    await this.type('mal')

    await this.pressKey('ArrowUp')
    await this.seeItemIsHighlighted('Malta')
  }

  async KeyBoardArrowUpNoLoop() {
    await page.getByTestId('loopFocus').click()

    await this.type('mal')

    await this.pressKey('ArrowUp')
    await this.seeItemIsHighlighted('Malawi')
  }

  async PointerOpenOnClick() {
    await page.getByTestId('openOnClick').click()

    await this.clickInput()

    await this.seeDropdown()
  }

  async SelectsValueOnClick() {
    await this.clickTrigger()
    await this.clickItem('Zambia')

    await this.seeItemIsChecked('Zambia')
  }

  async CanClearValue() {
    await this.clickTrigger()
    await this.clickItem('Zambia')

    await this.clickTrigger()
    await this.clickClearTrigger()
    await this.seeInputHasValue('')
    await this.seeItemIsNotChecked('Zambia')
  }

  async ShouldClearInputValue() {
    const selectionBehaviorEl = page.getByTestId('selectionBehavior')
    await selectionBehaviorEl.selectOptions('clear')

    await this.type('mal')
    await this.pressKey('Enter')
    await this.seeInputHasValue('')
  }

  async EnterBehaviorForCustomValues() {
    const selectionBehaviorEl = page.getByTestId('inputBehavior')
    await selectionBehaviorEl.selectOptions('none')

    await this.type('foo')
    await this.pressKey('Enter')
    await this.seeInputHasValue('')
  }
}
