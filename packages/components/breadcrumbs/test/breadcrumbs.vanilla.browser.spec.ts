import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './breadcrumbs.spec'
import { Breadcrumbs } from './fixtures/Breadcrumbs.ts'

describe('breadcrumbs vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Breadcrumbs({ root: document.body })
    await Tests.RendersCorrectly()
  })
})