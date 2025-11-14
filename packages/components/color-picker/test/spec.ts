import { part, TestSuite } from '@destyler/shared-private/test'
import { page, userEvent } from 'vitest/browser'
import { expect } from 'vitest'

export class ColorPickerTestSuite extends TestSuite {
  INITIAL_VALUE = '#FF0000'
  PINK_VALUE = '#FFC0CB'

  hexInput() {
    return page.locatoring(`[data-part=control] [data-channel=hex]`)
  }

  alphaInput() {
    return page.locatoring(`[data-part=control] [data-channel=alpha]`)
  }

  channelThumb(channel: string) {
    return page.locatoring(`[data-part=channel-slider-thumb][data-channel=${channel}]`)
  }

  channelSlider(channel: string) {
    return page.locatoring(`[data-part=channel-slider][data-channel=${channel}]`)
  }

  async typeColor(color: string) {
    const hexInputEl = this.hexInput()
    await hexInputEl.fill(color)
  }

  async typeInAlphaInput(alpha: string) {
    const alphaInputEl = this.alphaInput()
    await alphaInputEl.fill(alpha)
  }

  async TypeingTheSameNativeCssColorsSwitchShowHex() {
    this.typeColor('red')

    await this.pressKey('Enter')
    await this.clickOutside()

    await expect.element(this.hexInput()).toHaveValue(this.INITIAL_VALUE)
  }

  async TypeingDifferentNativeCssColorsShouldUpdateColor() {
    this.typeColor('pink')

    await this.pressKey('Enter')
    await this.clickOutside()

    await expect.element(this.hexInput()).toHaveValue(this.PINK_VALUE)
  }

  async TypingInAlphaShouldUpdateColor() {
    this.typeInAlphaInput('0.3')

    await this.pressKey('Enter')
    await this.clickOutside()

    await expect.element(page.getByTestId('value-text').first()).toHaveTextContent('hsla(0, 100%, 50%, 0.3)')
  }

  async ClickOnTriggerShouldOpenPicker() {
    const trigger = this.triggerEl()
    await trigger.click()

    await expect.element(this.contentEl()).toBeVisible()
  }

  async ShouldReFocusTriggerOnOutsideClick() {
    const trigger = this.triggerEl()
    await trigger.click()

    await expect.element(this.contentEl()).toBeVisible()

    await this.clickOutside()

    await expect.element(trigger).toHaveFocus()
  }

  async OpeningThePickerShouldFocusArea() {
    const trigger = this.triggerEl()
    await trigger.click()

    await expect.element(this.contentEl()).toBeVisible()

    await expect.element(page.getByArticle(part('area-thumb'))).toBeVisible()
  }

  async KeyboardFocusMovement() {
    const trigger = this.triggerEl()
    await trigger.click()

    await userEvent.tab()
    await expect.element(this.channelThumb('hue')).toHaveFocus()

    await userEvent.tab()
    await expect.element(this.channelThumb('alpha')).toHaveFocus()
  }

  async ShouldChangehueWhenClickingTheHueBar() {
    const trigger = this.triggerEl()
    await trigger.click()

    const channelSliderEl = this.channelSlider('hue')
    await channelSliderEl.click()

    await expect.element(page.getByTestId('value-text').first()).toHaveTextContent('hsla(180, 100%, 50%, 1)')
  }

  async ShouldChangehueWhenClickingTheAlphaBar() {
    const trigger = this.triggerEl()
    await trigger.click()

    const channelSliderEl = this.channelSlider('alpha')
    await channelSliderEl.click()

    await expect.element(page.getByTestId('value-text').first()).toHaveTextContent('hsla(0, 100%, 50%, 0.5)')
  }
}
