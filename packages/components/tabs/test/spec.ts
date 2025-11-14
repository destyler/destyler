import { TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from 'vitest/browser'
import { expect } from 'vitest'

export class TabsTestSuite extends TestSuite {
  getTabTrigger(id: string) {
    const el = page.getByTestId(`${id}-tab`)
    return el
  }

  getTabPanel(id: string) {
    const el = page.getByTestId(`${id}-tab-panel`)
    return el
  }

  async setTabIsFocused(id: string) {
    const el = this.getTabTrigger(id)
    await expect.element(el).toHaveFocus()
  }

  async clickTab(id: string) {
    const el = this.getTabTrigger(id)
    await userEvent.click(el)
  }

  async seeTabContent(id: string) {
    const el = this.getTabPanel(id)
    await expect.element(el).toBeVisible()
  }

  async dontSeeTabContent(id: string) {
    const el = this.getTabPanel(id)
    await expect.element(el).not.toBeVisible()
  }

  async openDeselect() {
    const el = page.getByTestId('deselectable')
    await userEvent.click(el)
  }

  async closeLoopFocus() {
    const el = page.getByTestId('loopFocus')
    await userEvent.click(el)
  }

  async selectManual(value: string) {
    const el = page.getByTestId('activationMode') as any
    await userEvent.selectOptions(el, value)
  }

  async onHomeKeySelectsFirstTab() {
    await this.clickTab('item-2')
    await this.pressKey('Home')

    await this.setTabIsFocused('item-1')
    await this.seeTabContent('item-1')
  }

  async onEndKeySelectsLastTab() {
    await this.clickTab('item-1')
    await this.pressKey('End')

    await this.setTabIsFocused('item-3')
    await this.seeTabContent('item-3')
  }

  async ClickTabSelectsTab() {
    await this.clickTab('item-2')
    await this.seeTabContent('item-2')
  }

  async ShouldDeselect() {
    await this.openDeselect()

    await this.clickTab('item-2')
    await this.seeTabContent('item-2')

    await this.clickTab('item-2')
    await this.dontSeeTabContent('item-2')

    await this.clickTab('item-2')
    await this.seeTabContent('item-2')
  }

  async AutomaticShouldSelectTheCorrectTabOnClick() {
    await this.clickTab('item-1')
    await this.seeTabContent('item-1')

    await this.clickTab('item-2')
    await this.seeTabContent('item-2')

    await this.clickTab('item-3')
    await this.seeTabContent('item-3')
  }

  async AutomaticOnArrowRightSelectPlusFocusNextTab() {
    await this.clickTab('item-1')
    await this.pressKey('ArrowRight')

    await this.setTabIsFocused('item-2')
    await this.seeTabContent('item-2')
  }

  async AutomaticOnArrowRightLoopFocusPlusSelection() {
    await this.clickTab('item-3')
    await this.pressKey('ArrowRight', 3)

    await this.setTabIsFocused('item-3')
    await this.seeTabContent('item-3')
  }

  async AutomaticOnArrowLeftSelectPlusFocusThePreviousTab() {
    await this.clickTab('item-1')
    await this.pressKey('ArrowLeft')

    await this.setTabIsFocused('item-3')
    await this.seeTabContent('item-3')
  }

  async ManualOnArrowRightFocusButNotSelectTab() {
    await this.selectManual('manual')

    await this.clickTab('item-1')
    await this.pressKey('ArrowRight')

    await this.setTabIsFocused('item-2')
    await this.dontSeeTabContent('item-2')
  }

  async ManualOnHomeKeyFocusButNotSelectTab() {
    await this.selectManual('manual')

    await this.clickTab('item-2')
    await this.pressKey('Home')

    await this.setTabIsFocused('item-1')
    await this.dontSeeTabContent('item-1')
  }

  async ManualOnNavigateSelectOnEnter() {
    await this.selectManual('manual')

    await this.clickTab('item-1')
    await this.pressKey('ArrowRight')
    await this.pressKey('Enter')

    await this.setTabIsFocused('item-2')
    await this.seeTabContent('item-2')
  }

  async LoopFocusFalse() {
    await this.closeLoopFocus()

    await this.clickTab('item-3')
    await this.pressKey('ArrowRight')

    await this.setTabIsFocused('item-3')
  }
}
