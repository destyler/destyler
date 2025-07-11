import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Image from './fixtures/Image.svelte'
import * as Tests from './image.spec'

describe('image svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Image)
    await Tests.RendersCorrectly()
  })
})
