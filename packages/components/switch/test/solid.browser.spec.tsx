/** @jsxImportSource solid-js */
import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import Switch from '~/solid/switch'
import { SwitchTestSuite } from './spec'

let Tests: SwitchTestSuite

describe('switch solid browser tests', () => {
  beforeEach(async () => {
    render(() => <Switch />)
    Tests = new SwitchTestSuite()
  })

  it('should be checked when clicked', async () => {
    await Tests.ShouldBeCheckedWhenClicked()
  })

  it('should be focused when page is tabbed', async () => {
    await Tests.ShouldBeFOcusedWhenPageIsTabbed()
  })

  it('should be checked when spacebar is pressed while focused', async () => {
    await Tests.ShouldBeCheckedWhenSpacebarIsPressedWhileFocused()
  })

  it('should have disabled attributes when disabled', async () => {
    await Tests.ShouldHaveDisabledAttributesWhenDisabled()
  })
})
