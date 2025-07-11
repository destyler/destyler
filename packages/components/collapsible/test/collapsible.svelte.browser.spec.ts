import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './collapsible.spec'
import Collapsible from './fixtures/Collapsible.svelte'

describe('collapsible svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Collapsible)
    await Tests.RendersCorrectly()
  })
})