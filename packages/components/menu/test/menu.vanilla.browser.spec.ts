import { describe, it } from 'vitest'
import { Menu } from './fixtures/Menu.ts'
// Vanilla JS - no render import needed
import * as Tests from './menu.spec'

describe('menu vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Menu({ root: document.body })
    await Tests.RendersCorrectly()
  })
})
