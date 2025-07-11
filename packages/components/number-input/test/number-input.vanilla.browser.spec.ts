import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './number-input.spec'
import { NumberInput } from './fixtures/NumberInput.ts'

describe('number-input vanilla browser tests', () => {
  it('renders correctly', async () => {
    new NumberInput({ root: document.body })
    await Tests.RendersCorrectly()
  })
})