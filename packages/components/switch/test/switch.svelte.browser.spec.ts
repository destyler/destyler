import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './switch.spec'
import Switch from './fixtures/Switch.svelte'

describe('switch svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Switch)
    await Tests.RendersCorrectly()
  })
})