import { TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from 'vitest/browser'
import { expect } from 'vitest'

export class ComponentTestSuite extends TestSuite {
  getTrigger(id: string) {
    return page.getByTestId(`${id}-trigger`)
  }

  getContent(id: string) {
    return page.getByTestId(`${id}-tooltip`)
  }

  async hoverTrigger(id: string) {
    await userEvent.hover(this.getTrigger(id))
  }

  async unhoverTrigger(id: string) {
    await userEvent.unhover(this.getTrigger(id))
  }

  async seeContent(id: string) {
    await expect.element(this.getContent(id)).toBeVisible()
  }

  async seeTriggerIsFocused(id: string) {
    await expect.element(this.getTrigger(id)).toHaveFocus()
  }

  async dontSeeContent(id: string) {
    await expect.element(this.getContent(id)).not.toBeVisible()
  }

  async focusPage() {
    await userEvent.click(page.getByTestId('focus'))
  }

  async ShouldOpenTooltipOnHoverInteraction() {
    await this.hoverTrigger('tip-1')
    await this.seeContent('tip-1')
    await this.unhoverTrigger('tip-1')
    await this.dontSeeContent('tip-1')
  }

  async ShouldShowOnlyOneTooltipAtATime() {
    await this.hoverTrigger('tip-1')
    await this.hoverTrigger('tip-2')
    await this.dontSeeContent('tip-1')
    await this.seeContent('tip-2')
  }

  async ShouldWorkWithFocusBlur() {
    await this.focusPage()
    await this.pressKey('Tab')

    await this.seeContent('tip-1')

    await this.clickOutside()
    await this.dontSeeContent('tip-1')
  }

  async ShouldWorkWithFocusBlurForMultipleTooltips() {
    await this.focusPage()
    await this.pressKey('Tab')

    await this.seeContent('tip-1')

    await this.pressKey('Tab')
    await this.seeTriggerIsFocused('tip-2')

    await this.dontSeeContent('tip-1')
    await this.seeContent('tip-2')
  }

  async ClosesOnEscPress() {
    await this.focusPage()
    await this.pressKey('Tab')

    await this.seeContent('tip-1')

    await this.pressKey('Escape')
    await this.dontSeeContent('tip-1')
  }
}
