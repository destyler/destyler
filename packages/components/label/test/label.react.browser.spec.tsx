import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Label from './fixtures/Label.react'
import { RendersCorrectly, ShouldHaveCorrectAccessibilityAttributes, ShouldRemoveHoverStateOnMouseLeave, ShouldShowHoverStateOnMouseEnter } from './label.spec'

describe('label react browser tests', () => {
  it('renders correctly', async () => {
    render(<Label />)
    await RendersCorrectly()
  })

  it('should show hover state on mouse enter', async () => {
    render(<Label />)
    await ShouldShowHoverStateOnMouseEnter()
  })

  it('should remove hover state on mouse leave', async () => {
    render(<Label />)
    await ShouldRemoveHoverStateOnMouseLeave()
  })

  it('should have correct accessibility attributes', async () => {
    render(<Label />)
    await ShouldHaveCorrectAccessibilityAttributes()
  })
})
