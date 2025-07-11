import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './clipboard.spec'
import { Clipboard } from './fixtures/Clipboard.ts'

describe('clipboard vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Clipboard({ root: document.body })
    await Tests.RendersCorrectly()
  })
})