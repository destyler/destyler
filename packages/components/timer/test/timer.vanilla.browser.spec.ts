import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './timer.spec'
import { Timer } from './fixtures/Timer.ts'

describe('timer vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Timer({ root: document.body })
    await Tests.RendersCorrectly()
  })
})