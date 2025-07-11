import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './edit.spec'
import Edit from './fixtures/Edit.svelte'

describe('edit svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Edit)
    await Tests.RendersCorrectly()
  })
})
