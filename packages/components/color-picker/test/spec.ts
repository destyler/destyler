import { part } from '@destyler/shared-private/test'
import { page, userEvent } from '@vitest/browser/context'
import { expect } from 'vitest'

const INITIAL_VALUE = '#FF0000'
const PINK_VALUE = '#FFC0CB'

function hexInput() {
  return page.locatoring(`[data-part=control] [data-channel=hex]`)
}

function alphaInput() {
  return page.locatoring(`[data-part=control] [data-channel=alpha]`)
}

function channelThumb(channel: string) {
  return page.locatoring(`[data-part=channel-slider-thumb][data-channel=${channel}]`)
}

function channelSlider(channel: string) {
  return page.locatoring(`[data-part=channel-slider][data-channel=${channel}]`)
}

async function typeColor(color: string) {
  const hexInputEl = hexInput()
  await hexInputEl.fill(color)
}

async function typeInAlphaInput(alpha: string) {
  const alphaInputEl = alphaInput()
  await alphaInputEl.fill(alpha)
}

export async function TypeingTheSameNativeCssColorsSwitchShowHex() {
  typeColor('red')
  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')
  await userEvent.click(document.body)
  await expect.element(hexInput()).toHaveValue(INITIAL_VALUE)
}

export async function TypeingDifferentNativeCssColorsShouldUpdateColor() {
  typeColor('pink')
  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')
  await userEvent.click(document.body)
  await expect.element(hexInput()).toHaveValue(PINK_VALUE)
}

export async function TypingInAlphaShouldUpdateColor() {
  typeInAlphaInput('0.3')

  await userEvent.keyboard('{Enter}')
  await userEvent.keyboard('{/Enter}')
  await userEvent.click(document.body)

  await expect.element(page.getByTestId('value-text').first()).toHaveTextContent('hsla(0, 100%, 50%, 0.3)')
}

export async function ClickOnTriggerShouldOpenPicker() {
  const trigger = page.getByArticle(part('trigger'))
  await trigger.click()

  await expect.element(page.getByArticle(part('content'))).toBeVisible()
}

export async function ShouldReFocusTriggerOnOutsideClick() {
  const trigger = page.getByArticle(part('trigger'))
  await trigger.click()

  await expect.element(page.getByArticle(part('content'))).toBeVisible()

  await userEvent.click(document.body)
  await expect.element(trigger).toHaveFocus()
}

export async function OpeningThePickerShouldFocusArea() {
  const trigger = page.getByArticle(part('trigger'))
  await trigger.click()

  await expect.element(page.getByArticle(part('content'))).toBeVisible()

  await expect.element(page.getByArticle(part('area-thumb'))).toBeVisible()
}

export async function KeyboardFocusMovement() {
  const trigger = page.getByArticle(part('trigger'))
  await trigger.click()

  await userEvent.tab()
  await expect.element(channelThumb('hue')).toHaveFocus()

  await userEvent.tab()
  await expect.element(channelThumb('alpha')).toHaveFocus()
}

export async function ShouldChangehueWhenClickingTheHueBar() {
  const trigger = page.getByArticle(part('trigger'))
  await trigger.click()

  const channelSliderEl = channelSlider('hue')
  await channelSliderEl.click()

  await expect.element(page.getByTestId('value-text').first()).toHaveTextContent('hsla(180, 100%, 50%, 1)')
}

export async function ShouldChangehueWhenClickingTheAlphaBar() {
  const trigger = page.getByArticle(part('trigger'))
  await trigger.click()

  const channelSliderEl = channelSlider('alpha')
  await channelSliderEl.click()

  await expect.element(page.getByTestId('value-text').first()).toHaveTextContent('hsla(0, 100%, 50%, 0.5)')
}
