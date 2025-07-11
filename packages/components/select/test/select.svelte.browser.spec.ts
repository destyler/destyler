import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './select.spec'
import Select from './fixtures/Select.svelte'

describe('select svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Select)
    await Tests.RendersCorrectly()
  })
})