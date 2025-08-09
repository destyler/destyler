import { part, TestSuite } from '@destyler/shared-private/test'
import { page } from '@vitest/browser/context'
import { expect } from 'vitest'

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

  async seeItemInViewport(item: string) {
    const itemEl = this.getItem(item)
    
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
    await this.seeItemIsHighlighted('Afghanistan')
  }
}
