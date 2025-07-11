import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Tour from './fixtures/Tour.svelte'
import * as Tests from './tour.spec'

describe('tour svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Tour)
    await Tests.RendersCorrectly()
  })
})
