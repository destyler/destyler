import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './collapse.spec'
import Collapse from './fixtures/Collapse.svelte'

describe('collapse svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Collapse)
    await Tests.RendersCorrectly()
  })
})
