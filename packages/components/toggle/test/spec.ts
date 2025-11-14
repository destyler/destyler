import { part, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from 'vitest/browser'
import { expect } from 'vitest'

type Item = 'bold' | 'italic' | 'underline'

export class ComponentTestSuite extends TestSuite {
  getItem(item: Item) {
    return page.locatoring(part('item')).nth(['bold', 'italic', 'underline'].indexOf(item))
  }

  async clickItem(item: Item) {
    await this.getItem(item).click()
  }

  async seeSelected(item: Item) {
    await expect.element(this.getItem(item)).toHaveAttribute('data-state', 'on')
  }

  async seeNotSelected(item: Item) {
    await expect.element(this.getItem(item)).toHaveAttribute('data-state', 'off')
  }

  async seeItemIsSelected(items: Item[]) {
    await Promise.all(items.map(item => this.seeSelected(item)))
  }

  async seeItemIsNotSelected(items: Item[]) {
    await Promise.all(items.map(item => this.seeNotSelected(item)))
  }

  async openMultiple() {
    const el = page.getByTestId('multiple')
    await userEvent.click(el)
  }

  async SingleShouldSelectOnClick() {
    await this.clickItem('bold')
    await this.seeItemIsSelected(['bold'])

    await this.clickItem('italic')
    await this.seeItemIsSelected(['italic'])
    await this.seeItemIsNotSelected(['bold'])
  }

  async SingleShouldSelectAndDeselect() {
    await this.clickItem('bold')
    await this.seeItemIsSelected(['bold'])

    await this.clickItem('bold')
    await this.seeItemIsNotSelected(['bold'])
  }

  async MultipleShouldSelectMultiple() {
    await this.openMultiple()
    await this.clickItem('bold')
    await this.clickItem('italic')

    await this.seeItemIsSelected(['bold', 'italic'])
  }
}
