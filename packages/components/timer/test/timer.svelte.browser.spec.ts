import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './timer.spec'
import Timer from './fixtures/Timer.svelte'

describe('timer svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Timer)
    await Tests.RendersCorrectly()
  })
})