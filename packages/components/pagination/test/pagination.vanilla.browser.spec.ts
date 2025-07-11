import { describe, it } from 'vitest'
import { Pagination } from './fixtures/Pagination.ts'
// Vanilla JS - no render import needed
import * as Tests from './pagination.spec'

describe('pagination vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Pagination({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
