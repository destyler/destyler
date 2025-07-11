import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Separator from './fixtures/Separator.svelte'
import * as Tests from './separator.spec'

describe('separator svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Separator)
    await Tests.RendersCorrectly()
  })
})
