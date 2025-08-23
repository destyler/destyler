import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import NumberInput from '~/react/number-input'
import { NumberInputTestSuite } from './spec'

let Tests: NumberInputTestSuite

describe('react browser tests', () => {
  beforeEach(() => {
    render(<NumberInput />)
    Tests = new NumberInputTestSuite()
  })

  it('should allow typing empty string value', async () => {
    await Tests.ShouldAllowTypingEmptyStringValue()
  })

  it('should clamp value when blurred', async () => {
    await Tests.ShouldClampValueWhenBlurred()
  })

  it('should clamp value when input is empty', async () => {
    await Tests.ShouldClampValueWhenInputIsEmpty()
  })

  it('should increment with arrow up', async () => {
    await Tests.ShouldIncrementWithArrowUp()
  })

  it('clicking increment', async () => {
    await Tests.ClickingIncrement()
  })

  it('should decrement the value', async () => {
    await Tests.ShouldDecrementTheValue()
  })

  it('clicking decrement', async () => {
    await Tests.ClickingDecrement()
  })

  it('pressing enter should make up/down still work', async () => {
    await Tests.PressingEnterShouldMakeUpDownStillWork()
  })

  it('should set value to min/max on home/end keys', async () => {
    await Tests.ShouldSetValueToMinOrMaxOnHomeOrEndKeys()
  })

  it('shift+arrowup: should change 10 steps', async () => {
    await Tests.ShiftAndArrowUpShouldChange10Steps()
  })

  it('ctrl+arrowup: should change for 0.1 steps', async () => {
    await Tests.CtrlAndArrowUpShouldChangeFor0_1Steps()
  })

  it('inc click: should increment value', async () => {
    await Tests.IncClickShouldIncrementValue()
  })

  it('dec click: should increment value', async () => {
    await Tests.DecClickShouldIncrementValue()
  })
})
