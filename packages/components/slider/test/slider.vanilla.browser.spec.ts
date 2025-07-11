import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './slider.spec'
import { Slider } from './fixtures/Slider.ts'

describe('slider vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Slider({ root: document.body })
    await Tests.RendersCorrectly()
  })
})