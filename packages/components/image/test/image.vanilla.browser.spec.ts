import { describe, it } from 'vitest'
import { Image } from './fixtures/Image.ts'
// Vanilla JS - no render import needed
import * as Tests from './image.spec'

describe('image vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Image({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
