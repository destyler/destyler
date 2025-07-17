import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import ColorPicker from '~/svelte/color-picker.svelte'
import * as Tests from './spec'

describe('color-picker svelte browser tests', () => {
  it('typing the same native css colors switch show hex', async () => {
    render(ColorPicker)
    await Tests.TypeingTheSameNativeCssColorsSwitchShowHex()
  })

  it('typing different native css colors should update color', async () => {
    render(ColorPicker)
    await Tests.TypeingDifferentNativeCssColorsShouldUpdateColor()
  })

  it('typing in alpha should update color', async () => {
    render(ColorPicker)
    await Tests.TypingInAlphaShouldUpdateColor()
  })

  it('click on trigger should open picker', async () => {
    render(ColorPicker)
    await Tests.ClickOnTriggerShouldOpenPicker()
  })

  it('should re-focus trigger on outside click', async () => {
    render(ColorPicker)
    await Tests.ShouldReFocusTriggerOnOutsideClick()
  })

  it('opening the picker should focus area', async () => {
    render(ColorPicker)
    await Tests.OpeningThePickerShouldFocusArea()
  })

  it('keyboard focus movement', async () => {
    render(ColorPicker)
    await Tests.KeyboardFocusMovement()
  })

  it('should change hue when clicking the hue bar', async () => {
    render(ColorPicker)
    await Tests.ShouldChangehueWhenClickingTheHueBar()
  })

  it('should change alpha when clicking the alpha bar', async () => {
    render(ColorPicker)
    await Tests.ShouldChangehueWhenClickingTheAlphaBar()
  })
})
