import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './tree.spec'
import Tree from './fixtures/Tree.svelte'

describe('tree svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Tree)
    await Tests.RendersCorrectly()
  })
})