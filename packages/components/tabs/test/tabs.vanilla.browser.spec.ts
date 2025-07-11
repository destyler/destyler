import { describe, it } from 'vitest'
import { Tabs } from './fixtures/Tabs.ts'
// Vanilla JS - no render import needed
import * as Tests from './tabs.spec'

describe('tabs vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Tabs({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
