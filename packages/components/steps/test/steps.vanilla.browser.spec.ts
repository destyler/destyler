import { describe, it } from 'vitest'
import { Steps } from './fixtures/Steps.ts'
// Vanilla JS - no render import needed
import * as Tests from './steps.spec'

describe('steps vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Steps({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
