import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './slider.spec'
import Slider from './fixtures/Slider.svelte'

describe('slider svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Slider)
    await Tests.RendersCorrectly()
  })
})