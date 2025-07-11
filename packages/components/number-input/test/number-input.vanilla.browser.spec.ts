import { describe, it } from 'vitest'
import { NumberInput } from './fixtures/NumberInput.ts'
// Vanilla JS - no render import needed
import * as Tests from './number-input.spec'

describe('number-input vanilla browser tests', () => {
  it('renders correctly', async () => {
    new NumberInput({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
