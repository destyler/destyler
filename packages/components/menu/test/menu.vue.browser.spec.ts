import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Menu from '~/vue/menu.vue'
import * as Tests from './menu.spec'

describe('menu vue browser tests', () => {
  it('renders correctly', async () => {
    render(Menu)
    await Tests.RendersCorrectly()
  })
})
