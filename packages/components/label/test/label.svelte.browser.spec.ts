import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Label from './fixtures/Label.svelte'
import * as Tests from './label.spec'

describe('label svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Label)
    await Tests.RendersCorrectly()
  })
})
