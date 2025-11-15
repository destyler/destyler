import { TestSuite } from '@destyler/shared-private/test'
import { expect } from 'vitest'
import { page } from 'vitest/browser'

export class PaginationTestSuite extends TestSuite {
  getItem(text: string) {
    return page.getByTestId(`pagination-item-${text}`)
  }

  async clickItem(text: string) {
    const item = this.getItem(text)
    await item.click()
  }

  async seeItemIsCurrent(text: string) {
    const item = this.getItem(text)
    await expect.element(item).toHaveAttribute('aria-current', 'page')
  }

  async seeItemIsSelected(text: string) {
    const item = this.getItem(text)
    await expect.element(item).toHaveAttribute('data-selected')
  }

  async ShouldUpdatePageWhenItemIsClicked() {
    await this.clickItem('2')
    await this.seeItemIsCurrent('2')
    await this.clickItem('5')
    await this.seeItemIsSelected('5')
  }

  async ShouldUPdatePageWhenNextButtonIsClicked() {
    await this.clickTriggerById('next')
    await this.seeItemIsCurrent('2')
    await this.clickTriggerById('next', {
      times: 3,
    })
    await this.clickItem('5')
    await this.seeItemIsSelected('5')
  }

  async ShouldUpdatePageWhenPrevButtonIsClicked() {
    await this.clickTriggerById('next', {
      times: 4,
    })

    await this.seeItemIsSelected('5')

    await this.clickTriggerById('next')
    await this.clickTriggerById('prev')
    await this.seeItemIsSelected('5')
    await this.clickTriggerById('prev', {
      times: 3,
    })
    await this.seeItemIsCurrent('2')
  }
}
