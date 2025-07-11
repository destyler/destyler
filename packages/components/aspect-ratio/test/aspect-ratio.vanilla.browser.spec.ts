import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './aspect-ratio.spec'
import { AspectRatio } from './fixtures/AspectRatio.ts'

describe('aspect-ratio vanilla browser tests', () => {
  it('renders correctly', async () => {
    new AspectRatio({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
