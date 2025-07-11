import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './steps.spec'
import { Steps } from './fixtures/Steps.ts'

describe('steps vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Steps({ root: document.body })
    await Tests.RendersCorrectly()
  })
})