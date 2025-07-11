import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './dynamic.spec'
import Dynamic from './fixtures/Dynamic.svelte'

describe('dynamic svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Dynamic)
    await Tests.RendersCorrectly()
  })
})