import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './tree.spec'
import { Tree } from './fixtures/Tree.ts'

describe('tree vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Tree({ root: document.body })
    await Tests.RendersCorrectly()
  })
})