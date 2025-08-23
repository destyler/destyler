import { TestSuite } from '@destyler/shared-private/test'
import { page } from '@vitest/browser/context'
import { expect } from 'vitest'

export class CollapseTestSuite extends TestSuite {
  async arrowDownFocusNextTrigger() {
    const trigger = this.getTrigger('watercraft')
    await trigger.click()
    await this.pressKey('ArrowDown')
    await expect.element(this.getTrigger('automobiles')).toHaveFocus()
  }

  async arrowUpFocusPreviousTrigger() {
    const trigger = this.getTrigger('automobiles')
    await trigger.click()

    await this.pressKey('ArrowDown')
    await this.pressKey('ArrowUp')
    await expect.element(trigger).toHaveFocus()
  }

  async homeKeyFocusFirstTrigger() {
    const trigger = this.getTrigger('automobiles')
    await trigger.click()
    await this.pressKey('Home')
    await expect.element(this.getTrigger('watercraft')).toHaveFocus()
  }

  async endKeyFocusLastTrigger() {
    const trigger = this.getTrigger('watercraft')
    await trigger.click()
    await this.pressKey('End')
    await expect.element(this.getTrigger('aircraft')).toHaveFocus()
  }

  async shouldShowContent() {
    const trigger = this.getTrigger('watercraft')
    await trigger.click()
    await expect.element(this.getContent('watercraft')).toBeVisible()
  }

  async ShouldNotCloseTheContent() {
    const trigger = this.getTrigger('watercraft')
    await trigger.dblClick()

    await expect.element(this.getContent('watercraft')).not.toBeVisible()
  }

  async ShouldCloseThePreviousContent() {
    await this.getTrigger('watercraft').click()
    await this.getTrigger('automobiles').click()
    await expect.element(this.getContent('automobiles')).toBeVisible()
    await expect.element(this.getContent('watercraft')).not.toBeVisible()
  }

  async OnArrowDownFocusNextTrigger() {
    await page.getByTestId('multiple').click()
    const trigger = this.getTrigger('watercraft')
    await trigger.dblClick()

    await this.pressKey('Enter')

    await this.pressKey('ArrowDown')

    await this.pressKey('Enter')

    await expect.element(this.getContent('watercraft')).toBeVisible()
    await expect.element(this.getContent('automobiles')).toBeVisible()
  }

  async clickingAnotherTriggerShouldCloseThePreviousContent() {
    await page.getByTestId('multiple').click()
    await this.getTrigger('watercraft').click()
    await this.getTrigger('automobiles').click()

    await expect.element(this.getContent('watercraft')).toBeVisible()
    await expect.element(this.getContent('automobiles')).toBeVisible()
  }
}
