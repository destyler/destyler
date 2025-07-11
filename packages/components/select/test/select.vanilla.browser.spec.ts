import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './select.spec'
import { Select } from './fixtures/Select.ts'

describe('select vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Select({ root: document.body })
    await Tests.RendersCorrectly()
  })
})