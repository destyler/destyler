import { describe, it } from 'vitest'
import { Timer } from './fixtures/Timer.ts'
// Vanilla JS - no render import needed
import * as Tests from './timer.spec'

describe('timer vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Timer({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
