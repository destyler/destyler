import { TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from 'vitest/browser'
import { expect } from 'vitest'

export class HoverCardTestSuite extends TestSuite {
  async focusTrigger() {
    await this.clickOutside()
    await userEvent.tab()
  }

  testEl() {
    return page.getByTestId('hover-card-test-click')
  }

  async clickMain() {
    const el = page.getByTestId('hover-card-test-click')
    await userEvent.click(el)
  }

  async ContentShouldBeHiddenByDefault() {
    await expect.element(this.contentEl()).not.toBeVisible()
  }

  async ShouldBeOpenedAfterHoveringTrigger() {
    await this.clickMain()
    const trigger = this.triggerEl()
    await userEvent.hover(trigger)
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

  async ShouldBeClosedAfterBlurringTriggerWithKeyboard() {
    await this.clickMain()
    await userEvent.tab()
    await this.waitFor()
    await expect.element(this.contentEl()).toBeVisible()

    await userEvent.tab()
    await expect.element(this.contentEl()).not.toBeVisible()
  }

  async ShouldRemainOPenAfterBlurringTriggerIfPointerOpensCard() {
    const trigger = this.triggerEl()
    await userEvent.hover(trigger)
    await this.waitFor()
    await expect.element(this.contentEl()).toBeVisible()

    await this.focusTrigger()
    await this.waitFor()
    await expect.element(this.contentEl()).toBeVisible()

    await userEvent.unhover(trigger)
    await this.waitFor()
    await expect.element(this.contentEl()).toBeVisible()

    const testEl = this.testEl()
    await userEvent.hover(testEl)
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
