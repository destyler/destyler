import { describe, it } from 'vitest'
import { Label } from './fixtures/Label.ts'
// Vanilla JS - no render import needed
import * as Tests from './label.spec'

describe('label vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Label({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
