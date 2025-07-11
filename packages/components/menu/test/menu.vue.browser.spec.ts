import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './menu.spec'
import Menu from './fixtures/Menu.vue'

describe('menu vue browser tests', () => {
  it('renders correctly', async () => {
    render(Menu)
    await Tests.RendersCorrectly()
  })
})