import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Splitter from './fixtures/Splitter.svelte'
import * as Tests from './splitter.spec'

describe('splitter svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Splitter)
    await Tests.RendersCorrectly()
  })
})
