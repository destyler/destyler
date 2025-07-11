import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './pagination.spec'
import { Pagination } from './fixtures/Pagination.ts'

describe('pagination vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Pagination({ root: document.body })
    await Tests.RendersCorrectly()
  })
})