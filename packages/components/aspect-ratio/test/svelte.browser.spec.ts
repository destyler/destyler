import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import AspectRatio from '../examples/AspectRatio.svelte'
import { AspectRatioTestSuite } from './spec'

let Tests: AspectRatioTestSuite

describe('svelte browser tests', () => {
  beforeEach(async () => {
    render(AspectRatio)
    Tests = new AspectRatioTestSuite()
  })

  it('renders correctly', async () => {
    await Tests.RendersCorrectly()
  })
})
