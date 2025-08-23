import { beforeEach, describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Image from '~/svelte/image.svelte'
import { ImageTestSuite } from './spec'

let Tests: ImageTestSuite

describe('image svelte browser tests', () => {
  beforeEach(async () => {
    render(Image)
    Tests = new ImageTestSuite()
  })

  it('should render correctly', async () => {
    await Tests.ShouldRenderCorrectly()
  })
})
