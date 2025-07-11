import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './progress.spec'
import Progress from './fixtures/Progress.svelte'

describe('progress svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Progress)
    await Tests.RendersCorrectly()
  })
})