import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './tabs.spec'
import { Tabs } from './fixtures/Tabs.ts'

describe('tabs vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Tabs({ root: document.body })
    await Tests.RendersCorrectly()
  })
})