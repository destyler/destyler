import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Timer from './fixtures/Timer.svelte'
import * as Tests from './timer.spec'

describe('timer svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Timer)
    await Tests.RendersCorrectly()
  })
})
