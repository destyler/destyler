import { describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import Progress from './fixtures/Progress.react'
import { RendersCorrectly, ShouldHaveCorrectLabelAndValueText, ShouldHaveCorrectProgressBarAttributes, ShouldHaveIndeterminateStateWhenValueIsNull, ShouldSetToMaxWhenSetMaxIsClicked, ShouldSetToMinWhenSetMinIsClicked, ShouldUpdateValueWhenSetValueIsClicked } from './progress.spec'

describe('progress react browser tests', () => {
  it('renders correctly', async () => {
    render(<Progress />)
    await RendersCorrectly()
  })

  it('should have correct progress bar attributes', async () => {
    render(<Progress />)
    await ShouldHaveCorrectProgressBarAttributes()
  })

  it('should update value when set value is clicked', async () => {
    render(<Progress />)
    await ShouldUpdateValueWhenSetValueIsClicked()
  })

  it('should set to max when set max is clicked', async () => {
    render(<Progress />)
    await ShouldSetToMaxWhenSetMaxIsClicked()
  })

  it('should set to min when set min is clicked', async () => {
    render(<Progress />)
    await ShouldSetToMinWhenSetMinIsClicked()
  })

  it('should have indeterminate state when value is null', async () => {
    render(<Progress />)
    await ShouldHaveIndeterminateStateWhenValueIsNull()
  })

  it('should have correct label and value text', async () => {
    render(<Progress />)
    await ShouldHaveCorrectLabelAndValueText()
  })
})
