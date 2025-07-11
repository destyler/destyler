import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './aspect-ratio.spec'
import AspectRatio from './fixtures/AspectRatio.svelte'

describe('aspect-ratio svelte browser tests', () => {
  it('renders correctly', async () => {
    render(AspectRatio)
    await Tests.RendersCorrectly()
  })
})
