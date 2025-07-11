import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './switch.spec'
import { Switch } from './fixtures/Switch.ts'

describe('switch vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Switch({ root: document.body })
    await Tests.RendersCorrectly()
  })
})