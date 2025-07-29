import { TestSuite } from '@destyler/shared-private/test'
import { expect } from 'vitest'

export class ComboboxTestSuite extends TestSuite {
  async seeCloseIsFocused() {
    const closeButton = this.closeEl()
    await expect.element(closeButton).toHaveFocus()
  }

  async seeTriggerIsFocused() {
    const triggerEl = this.triggerEl()
    await expect.element(triggerEl).toHaveFocus()
  }

  async dontSeeContent() {
    const contentEl = this.contentEl()
    await expect.element(contentEl).not.toBeVisible()
  }

  async ShouldFocusonCloseButtonWhenDialogIsOpen() {
    await this.clickTrigger()
    await this.seeCloseIsFocused()
  }

  async ShouldCloseOnEscape() {
    await this.clickTrigger()

    await this.pressKey('Escape')

    await this.dontSeeContent()
    await this.seeTriggerIsFocused()
  }
}
