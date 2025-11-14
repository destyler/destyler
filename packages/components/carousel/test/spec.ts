import { TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class CarouselTestSuite extends TestSuite {
  async RendersCorrectly() {
    const items = this.itemEls()
    expect(items.all().length).toBe(2)
    await expect.element(this.indicatorEl().nth(0)).toHaveAttribute('data-current', '')
    await expect.element(items.nth(0)).toHaveAttribute('data-inview', 'true')
    await expect.element(items.nth(1)).toHaveAttribute('data-inview', 'false')
  }

  async NextAndPrevButtonsNavigateCarousel() {
    const prevTrigger = this.prevEl()
    await expect.element(prevTrigger).toBeDisabled()
    const nextTrigger = this.nextEl()
    await expect.element(nextTrigger).toBeEnabled()
    await nextTrigger.click()
    await expect.element(this.indicatorEl().nth(1)).toHaveAttribute('data-current', '')
    await expect.element(prevTrigger).toBeEnabled()
  }

  async AutoplayStartAndStop() {
    const autoplayTrigger = this.autoPlayEl()
    await autoplayTrigger.click()
    await expect.element(autoplayTrigger).toHaveTextContent('Stop')
    await this.waitFor()
    await expect.element(this.indicatorEl().nth(1)).toHaveAttribute('data-current', '')
    await autoplayTrigger.click()
    await expect.element(autoplayTrigger).toHaveTextContent('Play')
    await this.waitFor()
    await expect.element(this.indicatorEl().nth(1)).toHaveAttribute('data-current', '')
  }

  async ClickingIndicatorScrollsToCorrectSlide() {
    const indicator = this.indicatorEl()
    await indicator.nth(1).click()
    await expect.element(indicator.nth(1)).toHaveAttribute('data-current', '')

    await expect.element(this.itemEls().nth(1)).toHaveAttribute('data-inview', 'true')
  }

  async ScrollToSpecificIndexViaButton() {
    await page.getByRole('button', { name: 'Scroll to 1' }).click()
    await expect.element(this.itemEls().nth(1)).toHaveAttribute('data-inview', 'true')
  }

  async IndicatorKeyboardNavigation() {
    const indicator = this.indicatorEl()
    await userEvent.type(indicator.nth(0), '{arrowright}')
    await expect.element(this.itemEls().nth(1)).toHaveAttribute('data-inview', 'true')
  }

  async LoopShouldLoopSlides() {
    await page.getByTestId('loop').click()
    const prevTrigger = this.prevEl()
    await expect.element(prevTrigger).toBeEnabled()

    const nextTrigger = this.nextEl()
    await nextTrigger.click()
    await nextTrigger.click()
    await expect.element(this.itemEls().nth(0)).toHaveAttribute('data-inview', 'true')

    await nextTrigger.click()
    await expect.element(this.itemEls().nth(1)).toHaveAttribute('data-inview', 'true')
  }
}
