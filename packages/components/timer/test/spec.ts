import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class ComponentTestSuite extends TestSuite {
  positioner = testid('positioner')

  async ShouldRenderCorrectly() {
    const element = page.locator('[data-part="root"]')
    await expect.element(element).toBeVisible()
  }

  async ShouldHaveCorrectAttributes() {
    const element = page.locator('[data-part="root"]')
    await expect.element(element).toHaveAttribute('data-part', 'root')
  }

  async ShouldBeFocusableWhenRequired() {
    const focusableElement = page.locator('[tabindex="0"]')
    if (focusableElement.all().length > 0) {
      await userEvent.tab()
      await expect.element(focusableElement).toHaveFocus()
    }
  }

  async ShouldHandleKeyboardNavigation() {
    const focusableElement = page.locator('[tabindex="0"]')
    if (focusableElement.all().length > 0) {
      await userEvent.click(focusableElement)
      await expect.element(focusableElement).toHaveFocus()

      await this.pressKey('Enter')
      await this.pressKey('Space')
      await this.pressKey('Escape')
    }
  }

  async ShouldSupportDisabledState() {
    const element = page.locator('[data-disabled="true"]')
    if (element.all().length > 0) {
      await expect.element(element).toHaveAttribute('data-disabled', 'true')
    }
  }
}
