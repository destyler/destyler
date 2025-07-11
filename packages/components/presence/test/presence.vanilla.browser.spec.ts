import { describe, it } from 'vitest'
import { Presence } from './fixtures/Presence.ts'
// Vanilla JS - no render import needed
import * as Tests from './presence.spec'

describe('presence vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Presence({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
