import { part, TestSuite } from '@destyler/shared-private/test'
import { expect } from 'vitest'
import { page, userEvent } from 'vitest/browser'

export class SelectTestSuite extends TestSuite {
  clearTrigger = part('clear-trigger')

  clearTriggerEl() {
    return page.locatoring(this.clearTrigger)
  }

  async clickClearTrigger() {
    await this.clearTriggerEl().click()
  }

  getItem(item: string) {
    return page.getByTestId(`item-${item}`)
  }

  async clickLabel() {
    await this.labelEl().click()
  }

  async seeItemIsHighlighted(item: string) {
    await expect.element(this.getItem(item)).toHaveAttribute('data-highlighted', '')
  }

  async seeTriggerIsFocused() {
    await expect.element(this.triggerEl()).toHaveFocus()
  }

  async seeDropdown() {
    await expect.element(this.contentEl()).toBeVisible()
  }

  async dontSeeDropdown() {
    await expect.element(this.contentEl()).not.toBeVisible()
  }

  async seeTriggerHasText(text: string) {
    await expect.element(this.triggerEl()).toHaveTextContent(text)
  }

  async clickItem(test: string) {
    await this.getItem(test).click()
  }

  async hoverItem(test: string) {
    await this.getItem(test).hover()
  }

  async clickDeselectable() {
    const deselectable = page.getByTestId('deselectable')
    await deselectable.click()
  }

  async clickLoopFocus() {
    const loopFocus = page.getByTestId('loopFocus')
    await loopFocus.click()
  }

  async clickCloseOnSelect() {
    const closeOnSelect = page.getByTestId('closeOnSelect')
    await closeOnSelect.click()
  }

  async seeItemIsChecked(item: string) {
    const itemEl = this.getItem(item)
    await expect.element(itemEl).toHaveAttribute('data-state', 'checked')
  }

  async ClickingTheLabelShouldFocusControl() {
    await this.clickLabel()
    await this.seeTriggerIsFocused()
  }

  async ShouldToggleSelect() {
    await this.clickTrigger()
    await this.seeDropdown()

    await this.clickTrigger()
    await this.dontSeeDropdown()
  }

  async ShouldDeselect() {
    await this.clickDeselectable()

    await this.clickTrigger()
    await this.clickItem('Albania')
    await this.seeTriggerHasText('Albania')

    await this.clickTrigger()
    await this.clickItem('Albania')
    await this.seeTriggerHasText('Select option')
  }

  async ClickingClearTriggerShouldReturnFocus() {
    await this.clickTrigger()
    await this.clickItem('Albania')
    await this.seeTriggerHasText('Albania')

    await this.clickClearTrigger()

    await this.seeTriggerIsFocused()
    await this.seeTriggerHasText('Select option')
  }

  async ShouldHighlightOnHover() {
    await this.clickTrigger()

    await this.hoverItem('Albania')
    await this.seeItemIsHighlighted('Albania')

    await this.hoverItem('Algeria')
    await this.seeItemIsHighlighted('Algeria')
  }

  async ShouldNavigateOnArrowDown() {
    await this.clickTrigger()
    await this.pressKey('ArrowDown', 3)
    await this.seeItemIsHighlighted('Canada')
  }

  async ShouldNavigateOnArrowUp() {
    await this.clickTrigger()
    await this.pressKey('ArrowUp', 3)
    await this.seeItemIsHighlighted('Tonga')
  }

  async ShouldNavigateOnHomeAndEnd() {
    await this.clickTrigger()
    await this.pressKey('End')

    await this.seeItemIsHighlighted('Tunisia')

    await this.pressKey('Home')
    await this.seeItemIsHighlighted('Zambia')
  }

  async ShouldNavigateOnTypeahed() {
    await this.clickTrigger()
    await userEvent.keyboard('Ca')
    await this.seeItemIsHighlighted('Canada')
  }

  async ShouldLoopThroughOptionsWhenLoopIsEnabled() {
    await this.clickLabel()
    await this.pressKey('Enter')

    await this.pressKey('ArrowUp')
    await this.seeItemIsHighlighted('Tunisia')

    await this.pressKey('ArrowDown')
    await this.seeItemIsHighlighted('Zambia')
  }

  async ShouldCloseOnEscape() {
    await this.clickTrigger()
    await this.seeDropdown()

    await this.pressKey('Escape')
    await this.dontSeeDropdown()
  }

  async ShouldSelectOnEnter() {
    await this.clickTrigger()
    await this.pressKey('ArrowDown')
    await this.pressKey('Enter')
    await this.seeTriggerHasText('Zambia')
    await this.seeTriggerIsFocused()
  }

  async ShouldSelectOnSpace() {
    await this.clickTrigger()
    await this.pressKey('ArrowDown')
    await this.pressKey(' ')
    await this.seeTriggerHasText('Zambia')
    await this.seeTriggerIsFocused()
  }

  async ShouldCloseOnSelect() {
    await this.clickTrigger()
    await this.pressKey('ArrowDown')
    await this.pressKey('Enter')
    await this.dontSeeDropdown()
    await this.seeTriggerIsFocused()
  }

  async ShouldNotCloseOnCloseOnSelectFalse() {
    await this.clickCloseOnSelect()
    await this.clickTrigger()
    await this.pressKey('ArrowDown')
    await this.pressKey('Enter')

    await this.seeDropdown()
  }

  async ShouldCloseOnOutsideClick() {
    await this.clickTrigger()
    await this.seeDropdown()

    await this.clickOutside()
    await this.dontSeeDropdown()
  }

  async ShouldCloseOnBlurNoSelection() {
    await this.clickTrigger()
    await this.pressKey('ArrowDown', 3)
    await this.clickOutside()
    await this.dontSeeDropdown()
    await this.seeTriggerHasText('Select option')
  }

  async ShouldOpenSelectWithEnterKey() {
    await this.clickLabel()
    await this.pressKey('Enter')
    await this.seeDropdown()
  }

  async ShouldOpenSelectWithSpaceKey() {
    await this.clickLabel()
    await this.pressKey(' ')
    await this.seeDropdown()
  }

  async ShouldOpenWithDownArrowKeysAndHighlightFirstOption() {
    await this.clickLabel()
    await this.pressKey('ArrowDown')
    await this.seeDropdown()
    await this.seeItemIsHighlighted('Zambia')
  }

  async ShouldOpenWithUpArrowKeysAndHighlightLastOption() {
    await this.clickLabel()
    await this.pressKey('ArrowUp')
    await this.seeDropdown()
    await this.seeItemIsHighlighted('Tunisia')
  }

  async ShouldSelectLastOptionOnArrowLeft() {
    await this.clickLabel()
    await this.pressKey('ArrowLeft')
    await this.seeItemIsChecked('Tunisia')
  }

  async ShouldSelectFirstOptionOnArrowRight() {
    await this.clickLabel()
    await this.pressKey('ArrowRight')
    await this.seeItemIsChecked('Zambia')
  }

  async ShouldSelectNextOptionsOnArrowRight() {
    await this.clickLabel()
    await this.pressKey('ArrowRight')
    await this.seeItemIsChecked('Zambia')

    await this.pressKey('ArrowRight')
    await this.seeItemIsChecked('Benin')

    await this.pressKey('ArrowRight')
    await this.seeItemIsChecked('Canada')
  }

  async ShouldSelectWithTypeahead() {
    await this.clickLabel()
    await userEvent.keyboard('Nigeri')
    await this.seeItemIsChecked('Nigeria')
  }
}
