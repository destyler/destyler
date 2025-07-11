import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Steps from './fixtures/Steps.svelte'
import * as Tests from './steps.spec'

describe('steps svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Steps)
    await Tests.RendersCorrectly()
  })
})
