import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './clipboard.spec'
import Clipboard from './fixtures/Clipboard.svelte'

describe('clipboard svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Clipboard)
    await Tests.RendersCorrectly()
  })
})