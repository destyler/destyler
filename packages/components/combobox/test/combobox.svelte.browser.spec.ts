import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './combobox.spec'
import Combobox from './fixtures/Combobox.svelte'

describe('combobox svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Combobox)
    await Tests.RendersCorrectly()
  })
})