import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './dynamic.spec'
import { Dynamic } from './fixtures/Dynamic.ts'

describe('dynamic vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Dynamic({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
