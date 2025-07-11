import { describe, it } from 'vitest'
import { Slider } from './fixtures/Slider.ts'
// Vanilla JS - no render import needed
import * as Tests from './slider.spec'

describe('slider vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Slider({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
