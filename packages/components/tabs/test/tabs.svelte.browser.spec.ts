import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './tabs.spec'
import Tabs from './fixtures/Tabs.svelte'

describe('tabs svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Tabs)
    await Tests.RendersCorrectly()
  })
})