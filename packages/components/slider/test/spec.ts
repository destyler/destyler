import { testid, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

export class SliderTestSuite extends TestSuite {
  positioner = testid('positioner')

  async ShouldChangeValueOnDrag() {
    const thumb = page.getByRole('slider')
    const track = page.locator('[data-part="track"]')

    // Get initial value
    const initialValue = await thumb.getAttribute('aria-valuenow')

    // Drag thumb to change value
    const trackBox = await track.boundingBox()
    if (trackBox) {
      await userEvent.hover(thumb)
      await page.mouse.down()
      await page.mouse.move(trackBox.x + trackBox.width * 0.7, trackBox.y + trackBox.height / 2)
      await page.mouse.up()

      // Value should have changed
      const newValue = await thumb.getAttribute('aria-valuenow')
      expect(newValue).not.toBe(initialValue)
    }
  }

  async ShouldChangeValueWithArrowKeys() {
    const thumb = page.getByRole('slider')

    // Focus the slider
    await userEvent.click(thumb)
    await expect.element(thumb).toHaveFocus()

    // Get initial value
    const initialValue = parseInt(await thumb.getAttribute('aria-valuenow') || '0')

    // Press arrow right to increase value
    await this.pressKey('ArrowRight')
    const newValue = parseInt(await thumb.getAttribute('aria-valuenow') || '0')
    expect(newValue).toBeGreaterThan(initialValue)

    // Press arrow left to decrease value
    await this.pressKey('ArrowLeft')
    const decreasedValue = parseInt(await thumb.getAttribute('aria-valuenow') || '0')
    expect(decreasedValue).toBeLessThan(newValue)
  }

  async ShouldJumpToMinWithHome() {
    const thumb = page.getByRole('slider')

    // Focus the slider
    await userEvent.click(thumb)
    await expect.element(thumb).toHaveFocus()

    // Press Home to go to minimum value
    await this.pressKey('Home')
    const minValue = await thumb.getAttribute('aria-valuemin')
    const currentValue = await thumb.getAttribute('aria-valuenow')
    expect(currentValue).toBe(minValue)
  }

  async ShouldJumpToMaxWithEnd() {
    const thumb = page.getByRole('slider')

    // Focus the slider
    await userEvent.click(thumb)
    await expect.element(thumb).toHaveFocus()

    // Press End to go to maximum value
    await this.pressKey('End')
    const maxValue = await thumb.getAttribute('aria-valuemax')
    const currentValue = await thumb.getAttribute('aria-valuenow')
    expect(currentValue).toBe(maxValue)
  }

  async ShouldChangeValueWithPageKeys() {
    const thumb = page.getByRole('slider')

    // Focus the slider
    await userEvent.click(thumb)
    await expect.element(thumb).toHaveFocus()

    // Get initial value
    const initialValue = parseInt(await thumb.getAttribute('aria-valuenow') || '0')

    // Press Page Up for larger increment
    await this.pressKey('PageUp')
    const increasedValue = parseInt(await thumb.getAttribute('aria-valuenow') || '0')
    expect(increasedValue).toBeGreaterThan(initialValue)

    // Press Page Down for larger decrement
    await this.pressKey('PageDown')
    const decreasedValue = parseInt(await thumb.getAttribute('aria-valuenow') || '0')
    expect(decreasedValue).toBeLessThan(increasedValue)
  }

  async ShouldBeFocusableWithTab() {
    await userEvent.tab()
    const thumb = page.getByRole('slider')
    await expect.element(thumb).toHaveFocus()
  }

  async ShouldHaveCorrectAriaAttributes() {
    const thumb = page.getByRole('slider')

    // Check required ARIA attributes
    await expect.element(thumb).toHaveAttribute('aria-valuenow')
    await expect.element(thumb).toHaveAttribute('aria-valuemin')
    await expect.element(thumb).toHaveAttribute('aria-valuemax')
    await expect.element(thumb).toHaveAttribute('tabindex', '0')
  }

  async ShouldRespectMinMaxConstraints() {
    const thumb = page.getByRole('slider')

    // Focus the slider
    await userEvent.click(thumb)

    // Go to minimum
    await this.pressKey('Home')
    const minValue = parseInt(await thumb.getAttribute('aria-valuemin') || '0')
    let currentValue = parseInt(await thumb.getAttribute('aria-valuenow') || '0')
    expect(currentValue).toBe(minValue)

    // Try to go below minimum
    await this.pressKey('ArrowLeft')
    currentValue = parseInt(await thumb.getAttribute('aria-valuenow') || '0')
    expect(currentValue).toBe(minValue) // Should not go below min

    // Go to maximum
    await this.pressKey('End')
    const maxValue = parseInt(await thumb.getAttribute('aria-valuemax') || '0')
    currentValue = parseInt(await thumb.getAttribute('aria-valuenow') || '0')
    expect(currentValue).toBe(maxValue)

    // Try to go above maximum
    await this.pressKey('ArrowRight')
    currentValue = parseInt(await thumb.getAttribute('aria-valuenow') || '0')
    expect(currentValue).toBe(maxValue) // Should not go above max
  }

  async ShouldBeDisabledWhenRequired() {
    const thumb = page.getByRole('slider')

    // Check if slider is disabled
    const isDisabled = await thumb.getAttribute('aria-disabled')
    if (isDisabled === 'true') {
      // Should not be focusable when disabled
      await userEvent.tab()
      await expect.element(thumb).not.toHaveFocus()
    }
  }

  async ShouldClickOnTrackToSetValue() {
    const track = page.locator('[data-part="track"]')
    const thumb = page.getByRole('slider')

    const trackBox = await track.boundingBox()
    if (trackBox) {
      // Click at 75% of track width
      const clickX = trackBox.x + trackBox.width * 0.75
      const clickY = trackBox.y + trackBox.height / 2

      await userEvent.click(track, { position: { x: clickX - trackBox.x, y: clickY - trackBox.y } })

      // Value should reflect the clicked position
      const value = parseInt(await thumb.getAttribute('aria-valuenow') || '0')
      const min = parseInt(await thumb.getAttribute('aria-valuemin') || '0')
      const max = parseInt(await thumb.getAttribute('aria-valuemax') || '0')

      // Should be closer to max than min (since we clicked at 75%)
      const normalizedValue = (value - min) / (max - min)
      expect(normalizedValue).toBeGreaterThan(0.5)
    }
  }

  async ShouldHandleMultipleThumbsInRange() {
    const thumbs = page.getByRole('slider')
    const thumbCount = thumbs.all().length

    if (thumbCount > 1) {
      // Test range slider with multiple thumbs
      const firstThumb = thumbs.first()
      const secondThumb = thumbs.nth(1)

      // Focus first thumb
      await userEvent.click(firstThumb)
      await expect.element(firstThumb).toHaveFocus()

      const firstValue = parseInt(await firstThumb.getAttribute('aria-valuenow') || '0')

      // Move to next thumb with Tab
      await userEvent.tab()
      await expect.element(secondThumb).toHaveFocus()

      const secondValue = parseInt(await secondThumb.getAttribute('aria-valuenow') || '0')

      // Second thumb value should be >= first thumb value in a range slider
      expect(secondValue).toBeGreaterThanOrEqual(firstValue)
    }
  }
}
