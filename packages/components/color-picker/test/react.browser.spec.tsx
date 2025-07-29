import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import ColorPicker from '~/react/color-picker'
import { ColorPickerTestSuite } from './spec'

let Tests: ColorPickerTestSuite

describe('color-picker react browser tests', () => {
  beforeEach(async () => {
    render(<ColorPicker />)
    Tests = new ColorPickerTestSuite()
  })

  it('typing the same native css colors switch show hex', async () => {
    await Tests.TypeingTheSameNativeCssColorsSwitchShowHex()
  })

  it('typing different native css colors should update color', async () => {
    await Tests.TypeingDifferentNativeCssColorsShouldUpdateColor()
  })

  it('typing in alpha should update color', async () => {
    await Tests.TypingInAlphaShouldUpdateColor()
  })

  it('click on trigger should open picker', async () => {
    await Tests.ClickOnTriggerShouldOpenPicker()
  })

  it('should re-focus trigger on outside click', async () => {
    await Tests.ShouldReFocusTriggerOnOutsideClick()
  })

  it('opening the picker should focus area', async () => {
    await Tests.OpeningThePickerShouldFocusArea()
  })

  it('keyboard focus movement', async () => {
    await Tests.KeyboardFocusMovement()
  })

  it('should change hue when clicking the hue bar', async () => {
    await Tests.ShouldChangehueWhenClickingTheHueBar()
  })

  it('should change alpha when clicking the alpha bar', async () => {
    await Tests.ShouldChangehueWhenClickingTheAlphaBar()
  })
})
