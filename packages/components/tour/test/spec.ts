import { TestSuite } from '@destyler/shared-private/test'
import { page } from 'vitest/browser'
import { expect } from 'vitest'

export class ComponentTestSuite extends TestSuite {
  getContent() {
    return page.locatoring('[data-scope=tour][data-part=content]')
  }

  async clickStart() {
    await page.getByRole('button', { name: 'Start' }).click()
  }

  async seeContent() {
    await expect.element(this.getContent()).toBeVisible()
  }

  async dontSeeContent() {
    await expect.element(this.getContent()).not.toBeVisible()
  }

  async ShouldOpenTourOnClickStart() {
    await this.clickStart()
    await this.seeContent()
  }

  async ShouldCloseOnEscape() {
    await this.clickStart()
    await this.seeContent()
    await this.pressKey('Escape')
  }
}
