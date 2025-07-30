import { TestSuite } from '@destyler/shared-private/test'
import { userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class HoverCardTestSuite extends TestSuite {
  async focusTrigger() {
    await this.clickOutside()
    await userEvent.tab()
  }

  async ContentShouldBeHiddenByDefault() {
    await expect.element(this.contentEl()).not.toBeVisible()
  }

  async ShouldBeOpenedAfterHoveringTrigger() {
    const trigger = this.triggerEl()
    await trigger.hover()
    await this.waitFor()
    await expect.element(this.contentEl()).toBeVisible()
  }

  async ShouldBeOpenedAfterFocusingTrigger() {
    await this.focusTrigger()
    await this.waitFor()
    await expect.element(this.contentEl()).toBeVisible()
  }

  async ShouldBeClosedAfterBlurringTrigger() {
    await this.focusTrigger()
    await this.waitFor()
    await expect.element(this.contentEl()).toBeVisible()

    await userEvent.tab()
    await this.waitFor()
    await expect.element(this.contentEl()).not.toBeVisible()
  }

  async ShouldRemainOpenAfterMovingFromTriggerToContent() {
    const trigger = this.triggerEl()
    const content = this.contentEl()

    await trigger.hover()
    await this.waitFor()
    await expect.element(content).toBeVisible()

    await content.hover()
    await expect.element(content).toBeVisible()
  }

  async ShouldRemainOpenAfterMovingFromContentBackToTrigger() {
    const trigger = this.triggerEl()
    const content = this.contentEl()

    await trigger.hover()
    await this.waitFor()
    await expect.element(content).toBeVisible()

    await content.hover()
    await expect.element(content).toBeVisible()

    await trigger.hover()
    await expect.element(content).toBeVisible()
  }
}
