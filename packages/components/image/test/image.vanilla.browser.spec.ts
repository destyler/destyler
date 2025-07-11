import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './image.spec'
import { Image } from './fixtures/Image.ts'

describe('image vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Image({ root: document.body })
    await Tests.RendersCorrectly()
  })
})