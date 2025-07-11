import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './carousel.spec'
import { Carousel } from './fixtures/Carousel.ts'

describe('carousel vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Carousel({ root: document.body })
    await Tests.RendersCorrectly()
  })
})