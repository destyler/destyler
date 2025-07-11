import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Signature from './fixtures/Signature.svelte'
import * as Tests from './signature.spec'

describe('signature svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Signature)
    await Tests.RendersCorrectly()
  })
})
