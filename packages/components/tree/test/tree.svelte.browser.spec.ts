import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Tree from './fixtures/Tree.svelte'
import * as Tests from './tree.spec'

describe('tree svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Tree)
    await Tests.RendersCorrectly()
  })
})
