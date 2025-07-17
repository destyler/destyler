import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import AspectRatio from '~/svelte/aspect-ratio.svelte'
import * as Tests from './spec'

describe('aspect-ratio svelte browser tests', () => {
  it('renders correctly', async () => {
    render(AspectRatio)
    await Tests.RendersCorrectly()
  })
})
