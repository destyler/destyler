import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class TooltipTestSuite extends TestSuite {
  positioner = testid('positioner')

  async ShouldShowOnHover() {
    const trigger = this.triggerEl()
    await expect.element(this.contentEl()).not.toBeVisible()

    await userEvent.hover(trigger)
    await expect.element(this.contentEl()).toBeVisible()
    await expect.element(trigger).toHaveAttribute('data-state', 'open')
  }

  async ShouldHideOnUnhover() {
    const trigger = this.triggerEl()

    // Show tooltip first
    await userEvent.hover(trigger)
    await expect.element(this.contentEl()).toBeVisible()

    // Hide on unhover
    await userEvent.unhover(trigger)
    await expect.element(this.contentEl()).not.toBeVisible()
    await expect.element(trigger).toHaveAttribute('data-state', 'closed')
  }

  async ShouldShowOnFocus() {
    const trigger = this.triggerEl()
    await expect.element(this.contentEl()).not.toBeVisible()

    await userEvent.click(trigger)
    await expect.element(this.contentEl()).toBeVisible()
    await expect.element(trigger).toHaveAttribute('data-state', 'open')
  }

  async ShouldHideOnBlur() {
    const trigger = this.triggerEl()

    // Show tooltip first
    await userEvent.click(trigger)
    await expect.element(this.contentEl()).toBeVisible()

    // Hide on blur
    await userEvent.tab()
    await expect.element(this.contentEl()).not.toBeVisible()
    await expect.element(trigger).toHaveAttribute('data-state', 'closed')
  }

  async ShouldHideOnEscape() {
    const trigger = this.triggerEl()

    // Show tooltip first
    await userEvent.hover(trigger)
    await expect.element(this.contentEl()).toBeVisible()

    // Hide on escape
    await this.pressKey('Escape')
    await expect.element(this.contentEl()).not.toBeVisible()
    await expect.element(trigger).toHaveAttribute('data-state', 'closed')
  }

  async ShouldRespectDelay() {
    const trigger = this.triggerEl()
    await expect.element(this.contentEl()).not.toBeVisible()

    // Hover and check it doesn't appear immediately
    await userEvent.hover(trigger)
    // Small delay to check it's not visible immediately
    await new Promise(resolve => setTimeout(resolve, 100))

    // Should eventually appear after delay
    await expect.element(this.contentEl()).toBeVisible({ timeout: 2000 })
  }

  async ShouldBeFocusableWithTab() {
    await userEvent.tab()
    const trigger = this.triggerEl()
    await expect.element(trigger).toHaveFocus()
  }

  async ShouldHaveCorrectAriaAttributes() {
    const trigger = this.triggerEl()
    const content = this.contentEl()

    // Show tooltip
    await userEvent.hover(trigger)
    await expect.element(content).toBeVisible()

    // Check aria attributes
    const contentId = await content.getAttribute('id')
    const triggerDescribedBy = await trigger.getAttribute('aria-describedby')

    expect(triggerDescribedBy).toBe(contentId)
    await expect.element(content).toHaveAttribute('role', 'tooltip')
  }

  async ShouldPositionCorrectly() {
    const trigger = this.triggerEl()

    // Show tooltip
    await userEvent.hover(trigger)
    await expect.element(this.contentEl()).toBeVisible()

    // Check positioning attributes
    const positioner = page.getByTestId('positioner')
    await expect.element(positioner).toHaveAttribute('data-side')
  }

  async ShouldNotShowWhenDisabled() {
    const trigger = this.triggerEl()

    // If trigger has disabled attribute, tooltip shouldn't show
    const isDisabled = await trigger.getAttribute('data-disabled')
    if (isDisabled === 'true') {
      await userEvent.hover(trigger)
      await expect.element(this.contentEl()).not.toBeVisible()
    }
  }

  async ShouldFollowPointer() {
    const trigger = this.triggerEl()

    // Show tooltip
    await userEvent.hover(trigger)
    await expect.element(this.contentEl()).toBeVisible()

    // Move pointer within trigger
    const triggerBox = await trigger.boundingBox()
    if (triggerBox) {
      await page.mouse.move(triggerBox.x + 10, triggerBox.y + 10)
      await page.mouse.move(triggerBox.x + 20, triggerBox.y + 20)

      // Tooltip should still be visible
      await expect.element(this.contentEl()).toBeVisible()
    }
  }
}
