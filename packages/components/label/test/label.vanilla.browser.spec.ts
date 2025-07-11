import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './label.spec'
import { Label } from './fixtures/Label.ts'

describe('label vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Label({ root: document.body })
    await Tests.RendersCorrectly()
  })
})