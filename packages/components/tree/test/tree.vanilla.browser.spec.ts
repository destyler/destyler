import { describe, it } from 'vitest'
import { Tree } from './fixtures/Tree.ts'
// Vanilla JS - no render import needed
import * as Tests from './tree.spec'

describe('tree vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Tree({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
