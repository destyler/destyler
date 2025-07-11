import { describe, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import * as Tests from './presence.spec'
import Presence from './fixtures/Presence.svelte'

describe('presence svelte browser tests', () => {
  it('renders correctly', async () => {
    render(Presence)
    await Tests.RendersCorrectly()
  })
})