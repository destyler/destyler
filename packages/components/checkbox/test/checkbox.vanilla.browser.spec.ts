import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './checkbox.spec'
import { Checkbox } from './fixtures/Checkbox.ts'

describe('checkbox vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Checkbox({ root: document.body })
    await Tests.RendersCorrectly()
  })
})