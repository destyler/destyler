import { TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class CollapseTestSuite extends TestSuite {
  async ShouldBeOpenWhenClicked() {
    await this.triggerEl().click()
    await expect.element(this.contentEl()).toBeVisible()

    await this.triggerEl().click()
    await expect.element(this.contentEl()).not.toBeVisible()
  }

  async ContentShouldNotBeReachableViaTabKey() {
    await this.triggerEl().click()
    await this.triggerEl().click()
    await userEvent.tab()

    await expect.element(page.getByRole('button', { name: 'Open' })).toHaveFocus()
  }
}
