import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './label.spec'
import Label from './fixtures/Label.svelte'

describe('label svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Label)
    await Tests.RendersCorrectly()
  })
})