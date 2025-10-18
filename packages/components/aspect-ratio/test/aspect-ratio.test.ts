import { beforeEach, describe, it } from 'vitest'
import { render } from '../examples/vanilla/AspectRatio'
import { AspectRatioTestSuite } from './spec'

let Tests: AspectRatioTestSuite

describe('vanilla browser tests', () => {
  beforeEach(async () => {
    render()
    Tests = new AspectRatioTestSuite()
  })

  it('renders correctly', async () => {
    await Tests.RendersCorrectly()
  })
})
