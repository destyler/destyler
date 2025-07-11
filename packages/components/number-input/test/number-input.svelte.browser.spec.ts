import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import NumberInput from './fixtures/NumberInput.svelte'
import * as Tests from './number-input.spec'

describe('number-input svelte browser tests', () => {
  it('renders correctly', async () => {
    render(NumberInput)
    await Tests.RendersCorrectly()
  })
})
