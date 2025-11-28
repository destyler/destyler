import { testHook } from '@destyler/shared-private/test'
import { beforeEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { render } from '../examples/vanilla/ColorPicker'

let el: HTMLElement

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

async function typeColor(color: string) {
  const hexInputEl = hexInput()
  await hexInputEl.fill(color)
}

async function typeInAlphaInput(alpha: string) {
  const alphaInputEl = alphaInput()
  await alphaInputEl.fill(alpha)
}

function channelSlider(channel: string) {
  return page.locatoring(`[data-part=channel-slider][data-channel=${channel}]`)
}

describe('color-picker browser tests', () => {
  beforeEach(async () => {
    if (el) {
      document.body.removeChild(el)
    }
    el = document.createElement('div')
    document.body.appendChild(el)
    render(el)
  })

  it('typing the same native css colors switch show hex', async () => {
    await typeColor('red')
    await testHook.pressKey('Enter')
    await testHook.clickOutside()

    await expect.element(hexInput()).toHaveValue(INITIAL_VALUE)
  })

  it('typing different native css colors should update color', async () => {
    await typeColor('pink')

    await testHook.pressKey('Enter')
    await testHook.clickOutside()

    await expect.element(hexInput()).toHaveValue(PINK_VALUE)
  })

  it('typing in alpha should update color', async () => {
    await typeInAlphaInput('0.3')

    await testHook.pressKey('Enter')
    await testHook.clickOutside()

    await expect.element(page.getByTestId('value-text').first()).toHaveTextContent('hsla(0, 100%, 50%, 0.3)')
  })

  it('click on trigger should open picker', async () => {
    await testHook.getTrigger('colorpicker').click()

    await expect.element(testHook.getControlEl()).toBeVisible()
  })

  it('should re-focus trigger on outside click', async () => {
    const trigger = testHook.getTrigger('colorpicker')
    await trigger.click()

    await expect.element(testHook.getControlEl()).toBeVisible()

    await testHook.clickOutside()

    await expect.element(trigger).toHaveFocus()
  })
  it('opening the picker should focus area', async () => {
    const trigger = testHook.getTrigger('colorpicker')
    await trigger.click()

    await expect.element(testHook.getControlEl()).toBeVisible()

    await expect.element(page.getByArticle(testHook.part('area-thumb'))).toBeVisible()
  })

  it('keyboard focus movement', async () => {
    const trigger = testHook.getTrigger('colorpicker')
    await trigger.click()

    await userEvent.tab()
    await expect.element(channelThumb('hue')).toHaveFocus()

    await userEvent.tab()
    await expect.element(channelThumb('alpha')).toHaveFocus()
  })

  it('should change hue when clicking the hue bar', async () => {
    const trigger = testHook.getTrigger('colorpicker')
    await trigger.click()

    const channelSliderEl = channelSlider('hue')
    await channelSliderEl.click()

    await expect.element(page.getByTestId('value-text').first()).toHaveTextContent('hsla(180, 100%, 50%, 1)')
  })

  it('should change alpha when clicking the alpha bar', async () => {
    const trigger = testHook.getTrigger('colorpicker')
    await trigger.click()

    const channelSliderEl = channelSlider('alpha')
    await channelSliderEl.click()

    await expect.element(page.getByTestId('value-text').first()).toHaveTextContent('hsla(0, 100%, 50%, 0.5)')
  })
})
