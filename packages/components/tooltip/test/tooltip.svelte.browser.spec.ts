import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './tooltip.spec'
import Tooltip from './fixtures/Tooltip.svelte'

describe('tooltip svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Tooltip)
    await Tests.RendersCorrectly()
  })
})