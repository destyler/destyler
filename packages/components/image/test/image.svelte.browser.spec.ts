import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './image.spec'
import Image from './fixtures/Image.svelte'

describe('image svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Image)
    await Tests.RendersCorrectly()
  })
})