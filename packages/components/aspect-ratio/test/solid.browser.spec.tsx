/** @jsxImportSource solid-js */
import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-solid'
import AspectRatio from '~/solid/aspect-ratio'
import { AspectRatioTestSuite } from './spec'

let Tests: AspectRatioTestSuite

describe('solid browser tests', () => {
  beforeEach(async () => {
    render(AspectRatio)
    Tests = new AspectRatioTestSuite()
  })

  it('renders correctly', async () => {
    await Tests.RendersCorrectly()
  })
})
