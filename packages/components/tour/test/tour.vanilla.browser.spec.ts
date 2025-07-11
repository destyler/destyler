import { describe, it } from 'vitest'
import { Tour } from './fixtures/Tour.ts'
// Vanilla JS - no render import needed
import * as Tests from './tour.spec'

describe('tour vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Tour({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
