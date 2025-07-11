import { describe, it } from 'vitest'
import { Switch } from './fixtures/Switch.ts'
// Vanilla JS - no render import needed
import * as Tests from './switch.spec'

describe('switch vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Switch({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
