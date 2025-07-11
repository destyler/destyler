import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Progress from './fixtures/Progress.svelte'
import * as Tests from './progress.spec'

describe('progress svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Progress)
    await Tests.RendersCorrectly()
  })
})
