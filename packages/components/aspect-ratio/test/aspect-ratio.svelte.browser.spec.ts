import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { RendersCorrectly } from './aspect-ratio.spec'
import AspectRatio from './fixtures/AspectRatio.svelte'

describe('aspect-ratio vue browser tests', () => {
  it('renders correctly', async () => {
    render(AspectRatio)
    await RendersCorrectly()
  })
})
