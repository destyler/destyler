import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Switch from './fixtures/Switch.react'
import { RendersCorrectly, ShouldBeFocusedWhenPageIsTabbed, ShouldHaveCorrectAccessibilityAttributes, ShouldHaveDisabledAttributesWhenDisabled, ShouldNotBeFocusableWhenDisabled, ShouldToggleWhenClicked, ShouldToggleWhenSpacebarIsPressed } from './switch.spec'

describe('switch react browser tests', () => {
  it('renders correctly', async () => {
    render(<Switch />)
    await RendersCorrectly()
  })

  it('should toggle when clicked', async () => {
    render(<Switch />)
    await ShouldToggleWhenClicked()
  })

  it('should be focused when page is tabbed', async () => {
    render(<Switch />)
    await ShouldBeFocusedWhenPageIsTabbed()
  })

  it('should toggle when spacebar is pressed', async () => {
    render(<Switch />)
    await ShouldToggleWhenSpacebarIsPressed()
  })

  it('should have disabled attributes when disabled', async () => {
    render(<Switch />)
    await ShouldHaveDisabledAttributesWhenDisabled()
  })

  it('should not be focusable when disabled', async () => {
    render(<Switch />)
    await ShouldNotBeFocusableWhenDisabled()
  })

  it('should have correct accessibility attributes', async () => {
    render(<Switch />)
    await ShouldHaveCorrectAccessibilityAttributes()
  })
})
