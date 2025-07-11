import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './carousel.spec'
import Carousel from './fixtures/Carousel.svelte'

describe('carousel svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Carousel)
    await Tests.RendersCorrectly()
  })
})
