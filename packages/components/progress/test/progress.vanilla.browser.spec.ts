import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './progress.spec'
import { Progress } from './fixtures/Progress.ts'

describe('progress vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Progress({ root: document.body })
    await Tests.RendersCorrectly()
  })
})