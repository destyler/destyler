import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './edit.spec'
import { Edit } from './fixtures/Edit.ts'

describe('edit vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Edit({ root: document.body })
    await Tests.RendersCorrectly()
  })
})