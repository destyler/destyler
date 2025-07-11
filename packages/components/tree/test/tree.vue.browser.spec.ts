import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import * as Tests from './tree.spec'
import Tree from './fixtures/Tree.vue'

describe('tree vue browser tests', () => {
  it('renders correctly', async () => {
    render(Tree)
    await Tests.RendersCorrectly()
  })
})