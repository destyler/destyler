import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './radio.spec'
import { Radio } from './fixtures/Radio.ts'

describe('radio vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Radio({ root: document.body })
    await Tests.RendersCorrectly()
  })
})