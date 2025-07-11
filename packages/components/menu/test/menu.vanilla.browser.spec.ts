import { describe, it } from 'vitest'
// Vanilla JS - no render import needed
import * as Tests from './menu.spec'
import { Menu } from './fixtures/Menu.ts'

describe('menu vanilla browser tests', () => {
  it('renders correctly', async () => {
    new Menu({ root: document.body })
    await Tests.RendersCorrectly()
  })
})