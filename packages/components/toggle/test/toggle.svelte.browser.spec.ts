import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Toggle from './fixtures/Toggle.svelte'
import * as Tests from './toggle.spec'

describe('toggle svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Toggle)
    await Tests.RendersCorrectly()
  })
})
