import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './presence.spec'
import { Presence } from './fixtures/Presence.ts'

describe('presence vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Presence({ root: document.body })
    await Tests.RendersCorrectly()
  })
})