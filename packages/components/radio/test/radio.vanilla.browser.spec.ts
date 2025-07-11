import { describe, it } from 'vitest'
import { Radio } from './fixtures/Radio.ts'
// Vanilla JS - no render import needed
import * as Tests from './radio.spec'

describe('radio vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Radio({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
