import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Separator from './fixtures/Separator.react'
import { RendersCorrectly, ShouldHaveCorrectAccessibilityAttributes, ShouldHaveHorizontalOrientationByDefault, ShouldHaveVerticalOrientationWhenSpecified, ShouldSupportDirectionAttribute } from './separator.spec'

describe('separator react browser tests', () => {
  it('renders correctly', async () => {
    render(<Separator />)
    await RendersCorrectly()
  })

  it('should have horizontal orientation by default', async () => {
    render(<Separator />)
    await ShouldHaveHorizontalOrientationByDefault()
  })

  it('should have vertical orientation when specified', async () => {
    render(<Separator />)
    await ShouldHaveVerticalOrientationWhenSpecified()
  })

  it('should have correct accessibility attributes', async () => {
    render(<Separator />)
    await ShouldHaveCorrectAccessibilityAttributes()
  })

  it('should support direction attribute', async () => {
    render(<Separator />)
    await ShouldSupportDirectionAttribute()
  })
})
