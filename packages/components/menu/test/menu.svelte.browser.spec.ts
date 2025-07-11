import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Menu from './fixtures/Menu.svelte'
import * as Tests from './menu.spec'

describe('menu svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Menu)
    await Tests.RendersCorrectly()
  })
})
