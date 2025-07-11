import { describe, it } from 'vitest'
import { Select } from './fixtures/Select.ts'
// Vanilla JS - no render import needed
import * as Tests from './select.spec'

describe('select vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Select({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
