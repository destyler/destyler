import { describe, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import Tree from '~/vue/tree.vue'
import * as Tests from './tree.spec'

describe('tree vue browser tests', () => {
  it('renders correctly', async () => {
    render(Tree)
    await Tests.RendersCorrectly()
  })
})
