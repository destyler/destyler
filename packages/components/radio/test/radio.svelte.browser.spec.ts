import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Radio from './fixtures/Radio.svelte'
import * as Tests from './radio.spec'

describe('radio svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Radio)
    await Tests.RendersCorrectly()
  })
})
