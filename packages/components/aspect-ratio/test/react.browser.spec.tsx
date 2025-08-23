import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-react'
import AspectRatio from '~/react/aspect-ratio'
import { AspectRatioTestSuite } from './spec'

let Tests: AspectRatioTestSuite

describe('react browser tests', () => {
  beforeEach(async () => {
    render(<AspectRatio />)
    Tests = new AspectRatioTestSuite()
  })

  it('renders correctly', async () => {
    await Tests.RendersCorrectly()
  })
})
