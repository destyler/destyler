import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './tour.spec'
import { Tour } from './fixtures/Tour.ts'

describe('tour vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Tour({ root: document.body })
    await Tests.RendersCorrectly()
  })
})