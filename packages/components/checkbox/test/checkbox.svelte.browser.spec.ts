import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './checkbox.spec'
import Checkbox from './fixtures/Checkbox.svelte'

describe('checkbox svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Checkbox)
    await Tests.RendersCorrectly()
  })
})
