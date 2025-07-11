import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './steps.spec'
import Steps from './fixtures/Steps.svelte'

describe('steps svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Steps)
    await Tests.RendersCorrectly()
  })
})