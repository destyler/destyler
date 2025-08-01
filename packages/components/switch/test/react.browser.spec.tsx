import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Switch from '~/react/switch'
import { SwitchTestSuite } from './spec'

let Tests: SwitchTestSuite

describe('switch react browser tests', () => {
  beforeEach(async () => {
    render(<Switch />)
    Tests = new SwitchTestSuite()
  })

  it('should toggle when clicked', async () => {
    await Tests.ShouldToggleWhenClicked()
  })

  it('should toggle with space key', async () => {
    await Tests.ShouldToggleWithSpaceKey()
  })

  it('should toggle with enter key', async () => {
    await Tests.ShouldToggleWithEnterKey()
  })

  it('should be focusable with tab', async () => {
    await Tests.ShouldBeFocusableWithTab()
  })

  it('should have correct aria attributes', async () => {
    await Tests.ShouldHaveCorrectAriaAttributes()
  })

  it('should not toggle when disabled', async () => {
    await Tests.ShouldNotToggleWhenDisabled()
  })

  it('should have visual state indicators', async () => {
    await Tests.ShouldHaveVisualStateIndicators()
  })

  it('should have focus visual indicator', async () => {
    await Tests.ShouldHaveFocusVisualIndicator()
  })

  it('should handle form integration', async () => {
    await Tests.ShouldHandleFormIntegration()
  })

  it('should prevent default key handling', async () => {
    await Tests.ShouldPreventDefaultKeyHandling()
  })

  it('should support label association', async () => {
    await Tests.ShouldSupportLabelAssociation()
  })
})