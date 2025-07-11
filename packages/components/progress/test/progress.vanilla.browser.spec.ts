import { describe, it } from 'vitest'
import { Progress } from './fixtures/Progress.ts'
// Vanilla JS - no render import needed
import * as Tests from './progress.spec'

describe('progress vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Progress({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
