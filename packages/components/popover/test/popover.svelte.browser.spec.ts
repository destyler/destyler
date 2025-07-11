import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Popover from './fixtures/Popover.svelte'
import * as Tests from './popover.spec'

describe('popover svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Popover)
    await Tests.RendersCorrectly()
  })
})
